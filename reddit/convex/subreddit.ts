import { mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { v , ConvexError} from "convex/values";

// for the mutation what we do is we pass an object & in the mutation we specify the arguments that we want to be passed to this mutation in order to create a new subreddit as well as the handler which is the function which will then go and be excuted when we call this mutation. This way we will be able to call function directly from our frontend, which will handle creatiung a new subreddit for us.
export const create = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
    },
    handler: async (ctx, args) => { //ctx is context
        const currentUser = await getCurrentUserOrThrow(ctx);
        const subreddit = await ctx.db.query("subreddit").collect() // collecting all of the subreddit that exists to make sure we're not creating existing
        if(subreddit.some((sub) => sub.name === args.name)){
            throw new ConvexError({message:"Subreddit already exists"});
        }

        await ctx.db.insert("subreddit", {
            name: args.name,
            description: args.description,
            authorId: currentUser._id,
        });
    }
})