import { mutation, query, QueryCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { Doc, Id } from "./_generated/dataModel";
// Omit - Construct a type with the properties of T except for those in type K.
// Taking all of the properties from post and removing the ones that are from subreddit, then adding in the specific ones that i want
type EnrichedPost = Omit<Doc<"post">, "subreddit"> & {
  author: { username: string } | undefined;
  subreddit:
    | {
        _id: Id<"subreddit">;
        name: string;
      }
    | undefined;
  imageUrl?: string;
}; // here we're defining a new type that's going to containg information abouut my post

const ERROR_MESSAGES = {
  POST_NOT_FOUND: "Post not found",
  SUBREDDIT_NOT_FOUND: "Subreddit not found",
  UNAUTHORIZED_DELETE: "You can't delete this post",
} as const;

export const create = mutation({
  args: {
    subject: v.string(),
    body: v.string(),
    subreddit: v.id("subreddit"),
    storageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const { subject, body, subreddit, storageId } = args;
    const user = await getCurrentUserOrThrow(ctx);
    const postId = await ctx.db.insert("post", {
      subject,
      body,
      authorId: user._id,
      subreddit,
      image: storageId || undefined,
    });
    return postId;
  },
});

// write a helper function that's going to take a post and it's going to add the information about the post author and the subreddit that post is inside of.

async function getEnrichedPost(
  ctx: QueryCtx,
  post: Doc<"post">
): Promise<EnrichedPost> {
  // grab the information about author and subreddit of the post
  const [author, subreddit] = await Promise.all([
    ctx.db.get(post.authorId), // gets the id directly from our database , get's the id of the author
    ctx.db.get(post.subreddit), // get's the id of the subreddit from the object which contains all the information about the subreddit and all the information about the author and i can add that to my post.
  ]);
  const image = post.image && (await ctx.storage.getUrl(post.image));
  return {
    ...post,
    author: author ? { username: author.username } : undefined,
    subreddit: { _id: subreddit!._id, name: subreddit!.name }, // we use a bang ! as we know it's going to exist
    imageUrl: image ?? undefined,
  };
}

// multiple posts
async function getEnrichedPosts(
  ctx: QueryCtx,
  posts: Doc<"post">[]
): Promise<EnrichedPost[]> {
  return Promise.all(posts.map((post) => getEnrichedPost(ctx, post)));
}

// queries - single post
export const getPost = query({
  args: { id: v.id("post") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (!post) return null;
    return getEnrichedPost(ctx, post);
  },
});

// now we have indexes in schema and let's see how we can use them
export const getSubredditPosts = query({
  args: { subRedditName: v.string() },
  handler: async (ctx, args): Promise<EnrichedPost[]> => {
    const subreddit = await ctx.db
      .query("subreddit")
      .filter((q) => q.eq(q.field("name"), args.subRedditName))
      .unique();
    if (!subreddit) return [];
    const posts = await ctx.db
      .query("post")
      .withIndex("bySubreddit", (q) => q.eq("subreddit", subreddit._id))
      .collect();
    return getEnrichedPosts(ctx, posts);
  },
});

// get all of the posts for a specific user
export const userPosts = query({
  args: { authorUsername: v.string() },
  handler: async (ctx, args): Promise<EnrichedPost[]> => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("username"), args.authorUsername))
      .unique();
    if (!user) return [];
    const posts = await ctx.db
      .query("post")
      .withIndex("byAuthor", (q) => q.eq("authorId", user._id))
      .collect();
    return getEnrichedPosts(ctx, posts);
  },
});

// delete post
export const deletePost = mutation({
  args: { postId: v.id("post") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new ConvexError(ERROR_MESSAGES.POST_NOT_FOUND);
    }
    const user = await getCurrentUserOrThrow(ctx);
    if (post.authorId !== user._id) {
      throw new ConvexError(ERROR_MESSAGES.UNAUTHORIZED_DELETE);
    }
    await ctx.db.delete(args.postId);
  },
});
