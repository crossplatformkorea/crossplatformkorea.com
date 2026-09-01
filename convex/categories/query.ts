import { query } from "../_generated/server";
import { v } from "convex/values";
import { CATEGORIES, getCategoryByKey, getCategoryBySlug } from "../constants";

export const getCategories = query({
  handler: async () => {
    return CATEGORIES.sort((a, b) => a.order - b.order);
  },
});

export const getCategoryByKeyQuery = query({
  args: { key: v.string() },
  handler: async (_, { key }) => {
    return getCategoryByKey(key);
  },
});

export const getCategoryBySlugQuery = query({
  args: { slug: v.string() },
  handler: async (_, { slug }) => {
    return getCategoryBySlug(slug);
  },
});
