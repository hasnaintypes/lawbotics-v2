import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/**
 * Synchronizes a user from Clerk authentication with the Convex database
 * Creates a new user record if one doesn't exist for the given userId
 * @param userId - The Clerk user ID
 * @param email - The user's email address
 * @param name - The user's display name
 * @param role - The user's role (admin or user)
 * @param avatar - The user's avatar URL
 * @return void
 */
export const syncUser = mutation({
  args: {
    userId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.union(v.literal("admin"), v.literal("user")),
    avatar: v.string(),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    if (!existingUser) {
      await ctx.db.insert("users", {
        userId: args.userId,
        email: args.email,
        name: args.name,
        role: args.role,
        avatar: args.avatar,
      });
    }
  },
});

/**
 * Retrieves a user by their Clerk user ID
 * @param userId - The Clerk user ID to look up
 * @return The user object or null if not found
 */
export const getUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    if (!args.userId) return null;

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();

    return user || null;
  },
});
