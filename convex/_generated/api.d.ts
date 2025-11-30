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
import type * as http from "../http.js";
import type * as notifications_action from "../notifications/action.js";
import type * as notifications_mutation from "../notifications/mutation.js";
import type * as notifications_query from "../notifications/query.js";
import type * as posts_mutation from "../posts/mutation.js";
import type * as posts_query from "../posts/query.js";
import type * as showcases_mutation from "../showcases/mutation.js";
import type * as showcases_query from "../showcases/query.js";
import type * as sitemap from "../sitemap.js";
import type * as users_mutation from "../users/mutation.js";
import type * as users_query from "../users/query.js";
import type * as utils_mentions from "../utils/mentions.js";
import type * as utils from "../utils.js";
import type * as validators from "../validators.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

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
  "categories/query": typeof categories_query;
  "chats/action": typeof chats_action;
  "chats/mutation": typeof chats_mutation;
  "chats/query": typeof chats_query;
  "comments/mutation": typeof comments_mutation;
  "comments/query": typeof comments_query;
  constants: typeof constants;
  "featureRequests/mutation": typeof featureRequests_mutation;
  "featureRequests/query": typeof featureRequests_query;
  "files/action": typeof files_action;
  "files/mutation": typeof files_mutation;
  "files/query": typeof files_query;
  http: typeof http;
  "notifications/action": typeof notifications_action;
  "notifications/mutation": typeof notifications_mutation;
  "notifications/query": typeof notifications_query;
  "posts/mutation": typeof posts_mutation;
  "posts/query": typeof posts_query;
  "showcases/mutation": typeof showcases_mutation;
  "showcases/query": typeof showcases_query;
  sitemap: typeof sitemap;
  "users/mutation": typeof users_mutation;
  "users/query": typeof users_query;
  "utils/mentions": typeof utils_mentions;
  utils: typeof utils;
  validators: typeof validators;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {
  persistentTextStreaming: {
    lib: {
      addChunk: FunctionReference<
        "mutation",
        "internal",
        { final: boolean; streamId: string; text: string },
        any
      >;
      createStream: FunctionReference<"mutation", "internal", {}, any>;
      getStreamStatus: FunctionReference<
        "query",
        "internal",
        { streamId: string },
        "pending" | "streaming" | "done" | "error" | "timeout"
      >;
      getStreamText: FunctionReference<
        "query",
        "internal",
        { streamId: string },
        {
          status: "pending" | "streaming" | "done" | "error" | "timeout";
          text: string;
        }
      >;
      setStreamStatus: FunctionReference<
        "mutation",
        "internal",
        {
          status: "pending" | "streaming" | "done" | "error" | "timeout";
          streamId: string;
        },
        any
      >;
    };
  };
};
