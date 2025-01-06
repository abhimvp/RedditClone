import { mutation, query, QueryCtx } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getCurrentUserOrThrow } from "./users";

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
