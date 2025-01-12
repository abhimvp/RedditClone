import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { commentCountKey,counts } from "./counter";

export const create = mutation({
  args: {
    content: v.string(),
    postId: v.id("post"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUserOrThrow(ctx);
    await ctx.db.insert("comments", {
      content: args.content,
      postId: args.postId,
      authorId: user._id,
    });
    await counts.inc(ctx,commentCountKey(args.postId));
  },
});

// get the comments for particular post

export const getComments = query({
  args: { postId: v.id("post") },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("byPost", (q) => q.eq("postId", args.postId))
      .collect();

    // also here we want to return the user of the comment not just id
    const authorIds = [...new Set(comments.map((comment) => comment.authorId))]; // we want to get unique users irrespective of how many times a user might have left the comment
    const authors = await Promise.all(
      authorIds.map((authorId) => ctx.db.get(authorId))
    ); // we want to get the user from the database
    const authorMap = new Map(
      authors.map((author) => [author!._id.toString(), author!.username])
    ); // we want to create a map of the user id to the user object
    return comments.map((comment) => ({
      ...comment,
      author: {
        username: authorMap.get(comment.authorId),
      },
    }));
  },
});

export const getCommentCount = query({
  args: { postId: v.id("post") },
  handler: async (ctx, args) => {
    return await counts.count(ctx, commentCountKey(args.postId));
  },
});