import { query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";

// Get feature requests with pagination
export const getAll = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    // Use a simple query with filter to exclude soft-deleted items
    const results = await ctx.db
      .query("featureRequests")
      .filter((q) => q.eq(q.field("deletedAt"), undefined)) // Filter out soft-deleted requests
      .paginate(args.paginationOpts);

    // Sort the results after fetching (for now)
    // Note: this isn't ideal for large datasets but will work for development
    return {
      ...results,
      page: results.page.sort((a, b) => b.votes - a.votes),
    };
  },
});
