import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    externalId: v.string(), // will be pointing to ID of the user within the clerk. Allows us to connect to the users from the convex database to the clerk database.
  })
    .index("byExternalId", ["externalId"])
    .index("byUsername", ["username"]),
  subreddit: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    authorId: v.id("users"),
  }),
  post: defineTable({
    subject: v.string(),
    body: v.string(),
    authorId: v.id("users"),
    subreddit: v.id("subreddit"),
    image: v.optional(v.id("_storage")),
  })
    .index("bySubreddit", ["subreddit"])
    .index("byAuthor", ["authorId"]),
  comments: defineTable({
    content: v.string(),
    postId: v.id("post"),
    authorId: v.id("users"),
  }).index("byPost", ["postId"]),
  downvote: defineTable({
    postId: v.id("post"),
    userId: v.id("users"),
  })
    .index("byPost", ["postId"])
    .index("byUser", ["userId"]),
  upvote: defineTable({
    postId: v.id("post"),
    userId: v.id("users"),
  })
    .index("byPost", ["postId"])
    .index("byUser", ["userId"]),
});
