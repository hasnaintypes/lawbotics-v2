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
import type * as actions_analyzeDocument from "../actions/analyze_document.action.js";
import type * as actions_chat from "../actions/chat.actions.js";
import type * as actions_extractParties from "../actions/extract_parties.actions.js";
import type * as actions_processDocument from "../actions/process_document.action.js";
import type * as analyses from "../analyses.js";
import type * as documents from "../documents.js";
import type * as extractedParties from "../extractedParties.js";
import type * as http from "../http.js";
import type * as internal_ from "../internal.js";
import type * as prompts from "../prompts.js";
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
  "actions/analyzeDocument": typeof actions_analyzeDocument;
  "actions/chat": typeof actions_chat;
  "actions/extractParties": typeof actions_extractParties;
  "actions/processDocument": typeof actions_processDocument;
  analyses: typeof analyses;
  documents: typeof documents;
  extractedParties: typeof extractedParties;
  http: typeof http;
  internal: typeof internal_;
  prompts: typeof prompts;
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
