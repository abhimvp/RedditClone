import { mutation, query } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { v, ConvexError } from "convex/values";
import { getEnrichedPosts } from "./post";

// for the mutation what we do is we pass an object & in the mutation we specify the arguments that we want to be passed to this mutation in order to create a new subreddit as well as the handler which is the function which will then go and be excuted when we call this mutation. This way we will be able to call function directly from our frontend, which will handle creatiung a new subreddit for us.
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    //ctx is context
    const currentUser = await getCurrentUserOrThrow(ctx);
    const subreddit = await ctx.db.query("subreddit").collect(); // collecting all of the subreddit that exists to make sure we're not creating existing
    if (subreddit.some((sub) => sub.name === args.name)) {
      throw new ConvexError({ message: "Subreddit already exists" });
    }

    await ctx.db.insert("subreddit", {
      name: args.name,
      description: args.description,
      authorId: currentUser._id,
    });
  },
});

export const getSubreddit = query({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const subreddit = await ctx.db
      .query("subreddit")
      .filter((q) => q.eq(q.field("name"), args.name))
      .unique();
    if (!subreddit) {
      return null;
    }
    const posts = await ctx.db
      .query("post")
      .withIndex("bySubreddit", (q) => q.eq("subreddit", subreddit._id))
      .collect();

    const enrichedPosts = await getEnrichedPosts(ctx, posts);
    return { ...subreddit, posts: enrichedPosts };
  },
});

export const search = query({
  args: { queryStr: v.string() },
  handler: async (ctx, args) => {
    if (!args.queryStr) return [];

    const subreddits = await ctx.db
      .query("subreddit")
      .withSearchIndex("search_body", (q) => q.search("name", args.queryStr))
      .take(10);

    return subreddits.map((sub) => {
      return { ...sub, type: "community", title: sub.name };
    });
  },
});
