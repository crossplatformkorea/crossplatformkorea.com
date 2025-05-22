/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ResendOTP from "../ResendOTP.js";
import type * as auth from "../auth.js";
import type * as categories from "../categories.js";
import type * as constants from "../constants.js";
import type * as featureRequests from "../featureRequests.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as posts_likes from "../posts/likes.js";
import type * as posts_mutation from "../posts/mutation.js";
import type * as posts_query from "../posts/query.js";
import type * as posts from "../posts.js";
import type * as serviceStatus from "../serviceStatus.js";
import type * as users_stats from "../users/stats.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  auth: typeof auth;
  categories: typeof categories;
  constants: typeof constants;
  featureRequests: typeof featureRequests;
  files: typeof files;
  http: typeof http;
  "posts/likes": typeof posts_likes;
  "posts/mutation": typeof posts_mutation;
  "posts/query": typeof posts_query;
  posts: typeof posts;
  serviceStatus: typeof serviceStatus;
  "users/stats": typeof users_stats;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
