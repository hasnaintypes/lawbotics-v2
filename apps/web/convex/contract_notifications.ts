import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Query to get notifications for a specific user
 * @param {Object} args - Query arguments
 * @param {string} args.userId - User ID
 * @param {boolean} args.unreadOnly - Filter for unread notifications only
 * @param {number} args.limit - Number of notifications to return
 * @returns {Promise<Array>} User notifications
 */
export const getUserNotifications = query({
  args: {
    userId: v.id("users"),
    unreadOnly: v.optional(v.boolean()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { userId, unreadOnly = false, limit = 50 } = args;

    let query = ctx.db
      .query("contract_notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId));

    if (unreadOnly) {
      query = query.filter((q) => q.eq(q.field("isRead"), false));
    }

    const notifications = await query.order("desc").take(limit);

    return notifications;
  },
});

/**
 * Mutation to create a new notification
 * @param {Object} args - Notification data
 * @returns {Promise<string>} Created notification ID
 */
export const createNotification = mutation({
  args: {
    contractId: v.optional(v.id("contracts")),
    userId: v.id("users"),
    type: v.union(
      v.literal("contract_created"),
      v.literal("contract_updated"),
      v.literal("approval_required"),
      v.literal("contract_approved"),
      v.literal("contract_rejected"),
      v.literal("contract_expiring"),
      v.literal("contract_expired"),
      v.literal("signature_required"),
      v.literal("contract_signed")
    ),
    title: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    const notificationId = await ctx.db.insert("contract_notifications", {
      ...args,
      isRead: false,
      createdAt: now,
    });

    return notificationId;
  },
});

/**
 * Mutation to mark a notification as read
 * @param {Object} args - Notification ID
 * @returns {Promise<string>} Updated notification ID
 */
export const markNotificationAsRead = mutation({
  args: { id: v.id("contract_notifications") },
  handler: async (ctx, args) => {
    const notification = await ctx.db.get(args.id);
    if (!notification) {
      throw new Error("Notification not found");
    }

    await ctx.db.patch(args.id, { isRead: true });
    return args.id;
  },
});

/**
 * Mutation to mark all notifications as read for a user
 * @param {Object} args - User ID
 * @returns {Promise<number>} Number of notifications marked as read
 */
export const markAllNotificationsAsRead = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const unreadNotifications = await ctx.db
      .query("contract_notifications")
      .withIndex("by_read_status", (q) =>
        q.eq("userId", args.userId).eq("isRead", false)
      )
      .collect();

    await Promise.all(
      unreadNotifications.map((notification) =>
        ctx.db.patch(notification._id, { isRead: true })
      )
    );

    return unreadNotifications.length;
  },
});
