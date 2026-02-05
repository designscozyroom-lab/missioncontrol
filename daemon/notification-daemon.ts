import { ConvexHttpClient } from "convex/browser";
import { execSync } from "child_process";

// Configuration
const CONVEX_URL = process.env.CONVEX_URL || "";
const POLL_INTERVAL = 2000; // 2 seconds

if (!CONVEX_URL) {
  console.error("❌ CONVEX_URL environment variable is required");
  console.error("   Set it in daemon/.env or export it before running");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

console.log("🚀 Mission Control Notification Daemon starting...");
console.log(`📡 Connected to: ${CONVEX_URL}`);
console.log(`⏰ Polling every ${POLL_INTERVAL}ms`);

async function pollNotifications() {
  try {
    // Fetch undelivered notifications
    const notifications = await client.query("notifications:getUndeliveredNotifications" as any, {});

    if (notifications.length > 0) {
      console.log(`📬 Found ${notifications.length} undelivered notification(s)`);
    }

    for (const notification of notifications) {
      try {
        // Build the message
        const message = `[Mission Control] ${notification.content}`;

        // Send to agent via OpenClaw session
        const sessionKey = `agent:${notification.mentionedAgentId}:main`;

        console.log(`📤 Sending to ${notification.mentionedAgentId}: ${notification.content.substring(0, 50)}...`);

        try {
          execSync(
            `openclaw sessions send --session "${sessionKey}" --message "${message.replace(/"/g, '\\"')}"`,
            {
              stdio: 'pipe',
              timeout: 10000
            }
          );
          console.log(`✅ Delivered to @${notification.mentionedAgentId}`);
        } catch (sendError) {
          // If session doesn't exist, log but still mark as delivered
          console.log(`⚠️  Could not send to @${notification.mentionedAgentId} (session may not exist)`);
        }

        // Mark as delivered
        await client.mutation("notifications:markNotificationDelivered" as any, {
          id: notification._id,
        });

      } catch (error) {
        console.error(`❌ Failed to process notification ${notification._id}:`, error);
      }
    }
  } catch (error) {
    console.error("❌ Failed to poll notifications:", error);
  }
}

// Start polling loop
async function main() {
  console.log("✅ Daemon started successfully");

  while (true) {
    await pollNotifications();
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n👋 Shutting down daemon...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n👋 Shutting down daemon...");
  process.exit(0);
});

main().catch((error) => {
  console.error("💥 Fatal error:", error);
  process.exit(1);
});
