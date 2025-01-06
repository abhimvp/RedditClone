import { mutation } from "./_generated/server";
export const generateUploadUrl = mutation(async (ctx) => {
    // Fetch a short-lived URL for uploading a file into storage.
  return await ctx.storage.generateUploadUrl();
});