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
import type * as actions_analyzeDocument from "../actions/analyzeDocument.js";
import type * as actions_chat from "../actions/chat.js";
import type * as actions_checkLegalDocument from "../actions/checkLegalDocument.js";
import type * as actions_extractParties from "../actions/extractParties.js";
import type * as actions_pdfGeneration from "../actions/pdfGeneration.js";
import type * as actions_processDocument from "../actions/processDocument.js";
import type * as analyses from "../analyses.js";
import type * as analytics from "../analytics.js";
import type * as clause_library from "../clause_library.js";
import type * as contract_approvals from "../contract_approvals.js";
import type * as contract_attachments from "../contract_attachments.js";
import type * as contract_notifications from "../contract_notifications.js";
import type * as contract_parties from "../contract_parties.js";
import type * as contract_revisions from "../contract_revisions.js";
import type * as contract_templates from "../contract_templates.js";
import type * as contracts from "../contracts.js";
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
  "actions/checkLegalDocument": typeof actions_checkLegalDocument;
  "actions/extractParties": typeof actions_extractParties;
  "actions/pdfGeneration": typeof actions_pdfGeneration;
  "actions/processDocument": typeof actions_processDocument;
  analyses: typeof analyses;
  analytics: typeof analytics;
  clause_library: typeof clause_library;
  contract_approvals: typeof contract_approvals;
  contract_attachments: typeof contract_attachments;
  contract_notifications: typeof contract_notifications;
  contract_parties: typeof contract_parties;
  contract_revisions: typeof contract_revisions;
  contract_templates: typeof contract_templates;
  contracts: typeof contracts;
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
