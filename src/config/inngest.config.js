import { Inngest } from "inngest";
import { connectDB } from "./db.config.js";
import { User } from "../models/user.model.js";

// Create Inngest client
export const inngest = new Inngest({ id: "slack-clone" });

/**
 * Sync Clerk User → MongoDB
 * Triggered when a new user is created in Clerk
 */
const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    name: "Sync User",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    try {
      console.log("🔄 Syncing user:", event?.data);

      // 1️⃣ Ensure DB connection is established
      await connectDB();

      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = event?.data || {};

      if (!id) {
        throw new Error("Missing Clerk user ID");
      }

      const newUser = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url || "",
      };

      // 2️⃣ Use UPSERT (important for idempotency)
      await User.updateOne(
        { clerkId: id },
        newUser,
        { upsert: true }
      );

      console.log("✅ User synced successfully");

    } catch (error) {
      console.error("❌ Error syncing user:", error);
      throw error; // Required so Inngest knows it failed
    }
  }
);

/**
 * Delete Clerk User → MongoDB
 * Triggered when Clerk user is deleted
 */
const deleteUserFromDB = inngest.createFunction(
  {
    id: "delete-user-from-db",
    name: "Delete User From DB",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    try {
      console.log("🗑 Deleting user:", event?.data);

      await connectDB();

      const { id } = event?.data || {};

      if (!id) {
        throw new Error("Missing Clerk user ID for deletion");
      }

      await User.deleteOne({ clerkId: id });

      console.log("✅ User deleted successfully");

    } catch (error) {
      console.error("❌ Error deleting user:", error);
      throw error;
    }
  }
);

// Export all functions for Inngest
export const functions = [syncUser, deleteUserFromDB];
