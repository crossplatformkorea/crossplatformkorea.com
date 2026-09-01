/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as ResendOTP from "../ResendOTP.js";
import type * as auth from "../auth.js";
import type * as categories_query from "../categories/query.js";
import type * as chats_action from "../chats/action.js";
import type * as chats_mutation from "../chats/mutation.js";
import type * as chats_query from "../chats/query.js";
import type * as comments_mutation from "../comments/mutation.js";
import type * as comments_query from "../comments/query.js";
import type * as constants from "../constants.js";
import type * as featureRequests_mutation from "../featureRequests/mutation.js";
import type * as featureRequests_query from "../featureRequests/query.js";
import type * as files_action from "../files/action.js";
import type * as files_mutation from "../files/mutation.js";
import type * as files_query from "../files/query.js";
import type * as crons from "../crons.js";
import type * as http from "../http.js";
import type * as notifications_action from "../notifications/action.js";
import type * as notifications_mutation from "../notifications/mutation.js";
import type * as notifications_query from "../notifications/query.js";
import type * as posts_action from "../posts/action.js";
import type * as posts_admin from "../posts/admin.js";
import type * as posts_http from "../posts/http.js";
import type * as posts_mutation from "../posts/mutation.js";
import type * as posts_query from "../posts/query.js";
import type * as posts_visibility from "../posts/visibility.js";
import type * as showcases_mutation from "../showcases/mutation.js";
import type * as showcases_query from "../showcases/query.js";
import type * as sitemap from "../sitemap.js";
import type * as users_mutation from "../users/mutation.js";
import type * as users_query from "../users/query.js";
import type * as utils from "../utils.js";
import type * as utils_mentions from "../utils/mentions.js";
import type * as utils_slug from "../utils/slug.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  auth: typeof auth;
  "categories/query": typeof categories_query;
  "chats/action": typeof chats_action;
  "chats/mutation": typeof chats_mutation;
  "chats/query": typeof chats_query;
  "comments/mutation": typeof comments_mutation;
  "comments/query": typeof comments_query;
  constants: typeof constants;
  crons: typeof crons;
  "featureRequests/mutation": typeof featureRequests_mutation;
  "featureRequests/query": typeof featureRequests_query;
  "files/action": typeof files_action;
  "files/mutation": typeof files_mutation;
  "files/query": typeof files_query;
  http: typeof http;
  "notifications/action": typeof notifications_action;
  "notifications/mutation": typeof notifications_mutation;
  "notifications/query": typeof notifications_query;
  "posts/action": typeof posts_action;
  "posts/admin": typeof posts_admin;
  "posts/http": typeof posts_http;
  "posts/mutation": typeof posts_mutation;
  "posts/query": typeof posts_query;
  "posts/visibility": typeof posts_visibility;
  "showcases/mutation": typeof showcases_mutation;
  "showcases/query": typeof showcases_query;
  sitemap: typeof sitemap;
  "users/mutation": typeof users_mutation;
  "users/query": typeof users_query;
  utils: typeof utils;
  "utils/mentions": typeof utils_mentions;
  "utils/slug": typeof utils_slug;
  validators: typeof validators;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  persistentTextStreaming: import("@convex-dev/persistent-text-streaming/_generated/component.js").ComponentApi<"persistentTextStreaming">;
};
