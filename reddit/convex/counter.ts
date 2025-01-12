import { components } from "./_generated/api";
import { ShardedCounter } from "@convex-dev/sharded-counter";
import { Id } from "./_generated/dataModel";

export const counts = new ShardedCounter(components.shardedCounter, {
  defaultShards: 1,
});

export function commentCountKey(postId: Id<"post">) {
  return `comments:${postId}`;
}

export function postCountKey(userId: Id<"users">) {
  return `post:${userId}`;
}

export function upvoteKey(postId: Id<"post">) {
  return `upvotes:${postId}`;
}

export function downvoteKey(postId: Id<"post">) {
  return `downvotes:${postId}`;
}
