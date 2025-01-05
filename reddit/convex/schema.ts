import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    username: v.string(),
    externalId: v.string(), // will be pointing to ID of the user within the clerk. Allows us to connect to the users from the convex database to the clerk database. 
  })
    .index("byExternalId", ["externalId"])
    .index("byUsername", ["username"]),
});
