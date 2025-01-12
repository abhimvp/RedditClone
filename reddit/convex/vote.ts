// to handle upvote & downvote toggles
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow, getCurrentUser } from "./users";
import { counts } from "./counter";

type VoteType = "upvote" | "downvote";

function voteKey(postId: string, voteType: VoteType): string {
  return `${voteType}:${postId}`;
}
// return a mutatioon not create a mutation
export function createToggleVoteMutation(voteType: VoteType) {
  return mutation({
    args: { postId: v.id("post") },
    handler: async (ctx, args) => {
      const user = await getCurrentUserOrThrow(ctx);
      const oppositeVoteType: VoteType =
        voteType === "upvote" ? "downvote" : "upvote";
      const exisitngVote = await ctx.db
        .query(voteType)
        .withIndex("byPost", (q) => q.eq("postId", args.postId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .unique();
      if (exisitngVote) {
        await ctx.db.delete(exisitngVote._id);
        await counts.dec(ctx, voteKey(args.postId, voteType));
        return;
      }

      const existingOppositeVote = await ctx.db
        .query(oppositeVoteType)
        .withIndex("byPost", (q) => q.eq("postId", args.postId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .unique();
      if (existingOppositeVote) {
        await ctx.db.delete(existingOppositeVote._id);
        await counts.dec(ctx, voteKey(args.postId, oppositeVoteType));
      }
      await ctx.db.insert(voteType, {
        postId: args.postId,
        userId: user._id,
      });
      await counts.inc(ctx, voteKey(args.postId, voteType));
    },
  });
}

// now we can use the above function to give us two new functions
export const toggleUpvote = createToggleVoteMutation("upvote");
export const toggleDownvote = createToggleVoteMutation("downvote");

export function createHasVotedQuery(voteType: VoteType) {
  return query({
    args: { postId: v.id("post") },
    handler: async (ctx, args) => {
      const user = await getCurrentUser(ctx);
      if (!user) return false;
      const vote = await ctx.db
        .query(voteType)
        .withIndex("byPost", (q) => q.eq("postId", args.postId))
        .filter((q) => q.eq(q.field("userId"), user._id))
        .unique();
      return !!vote;
    },
  });
}

export const hasUpvoted = createHasVotedQuery("upvote");
export const hasDownvoted = createHasVotedQuery("downvote");

export const getVoteCount = query({
  args: { postId: v.id("post") },
  handler: async (ctx, args) => {
    const upvotes = await counts.count(ctx, voteKey(args.postId, "upvote"));
    const downvotes = await counts.count(ctx, voteKey(args.postId, "downvote"));    
    return {
      upvotes,
      downvotes ,
      total: upvotes - downvotes
    };
  },
});