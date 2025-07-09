import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { api } from "./_generated/api";

const http = httpRouter();

http.route({
  path: "/clerk-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Verify that the webhook secret is configured.
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("Missing CLERK_WEBHOOK_SECRET environment variable");
      throw new Error("Missing CLERK_WEBHOOK_SECRET");
    }

    // Ensure required Svix headers are provided.
    const svixId = request.headers.get("svix-id");
    const svixSignature = request.headers.get("svix-signature");
    const svixTimestamp = request.headers.get("svix-timestamp");

    if (!svixId || !svixSignature || !svixTimestamp) {
      console.error("Missing one or more required Svix headers");
      return new Response("Missing required headers", { status: 400 });
    }

    // Parse the incoming JSON payload.
    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      console.error("Failed to parse JSON payload", error);
      return new Response("Invalid JSON payload", { status: 400 });
    }

    const body = JSON.stringify(payload);
    let evt: WebhookEvent;
    try {
      const wh = new Webhook(webhookSecret);
      evt = wh.verify(body, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      }) as WebhookEvent;
    } catch (error) {
      console.error("Error verifying webhook:", error);
      return new Response("Webhook verification failed", { status: 400 });
    }

    // Only process the "user.created" event.
    if (evt.type === "user.created") {
      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
        public_metadata, // expecting public_metadata contains role and avatar
      } = evt.data;

      // Validate required fields.
      if (
        !id ||
        !email_addresses ||
        !Array.isArray(email_addresses) ||
        email_addresses.length === 0
      ) {
        console.error("Missing user ID or email addresses in payload");
        return new Response("Invalid user data", { status: 400 });
      }

      const email = email_addresses[0].email_address;
      if (!email) {
        console.error("Email address missing from payload");
        return new Response("Email address missing", { status: 400 });
      }

      // Construct the user's name.
      const name = `${first_name || ""} ${last_name || ""}`.trim() || "Unknown";

      // Extract role and avatar from public metadata.
      // Default role to "user" if not provided or if provided value is invalid.
      let role: "admin" | "user" = "user";
      // Set avatar to image_url if available; otherwise, default to an empty string
      const avatar = typeof image_url === "string" ? image_url : "";

      if (public_metadata) {
        if (
          public_metadata.role &&
          (public_metadata.role === "admin" || public_metadata.role === "user")
        ) {
          role = public_metadata.role;
        }
      }

      try {
        // Sync the user to the Convex DB using a mutation.
        await ctx.runMutation(api.users.syncUser, {
          userId: id,
          email,
          name,
          role,
          avatar,
        });
      } catch (error) {
        console.error("Error creating/syncing user:", error);
        return new Response("Error syncing user to database", { status: 500 });
      }
    } else {
      // Log unhandled events.
      console.log(`Unhandled event type: ${evt.type}`);
    }

    return new Response("Webhook processed successfully", { status: 200 });
  }),
});

export default http;
