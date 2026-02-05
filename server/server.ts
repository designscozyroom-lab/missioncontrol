import express from "express";
import cors from "cors";
import { ConvexHttpClient } from "convex/browser";
import { execSync } from "child_process";

const app = express();
const PORT = process.env.PORT || 3001;
const CONVEX_URL = process.env.CONVEX_URL || "";

if (!CONVEX_URL) {
  console.error("❌ CONVEX_URL environment variable is required");
  process.exit(1);
}

const convex = new ConvexHttpClient(CONVEX_URL);

app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", convex: !!CONVEX_URL });
});

// Proxy Convex queries
app.post("/api/query", async (req, res) => {
  try {
    const { functionName, args } = req.body;
    const result = await convex.query(functionName as any, args || {});
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Proxy Convex mutations
app.post("/api/mutation", async (req, res) => {
  try {
    const { functionName, args } = req.body;
    const result = await convex.mutation(functionName as any, args || {});
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Send message to agent via OpenClaw
app.post("/api/openclaw/send", async (req, res) => {
  try {
    const { agentId, message } = req.body;

    if (!agentId || !message) {
      return res.status(400).json({ success: false, error: "agentId and message are required" });
    }

    const sessionKey = `agent:${agentId}:main`;
    const escapedMessage = message.replace(/"/g, '\\"');

    execSync(
      `openclaw sessions send --session "${sessionKey}" --message "${escapedMessage}"`,
      { stdio: "pipe", timeout: 10000 }
    );

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Broadcast to all agents
app.post("/api/openclaw/broadcast", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, error: "message is required" });
    }

    // Get all agents from Convex
    const agents = await convex.query("agents:getAllAgents" as any, {});
    const results: { agentId: string; success: boolean; error?: string }[] = [];

    for (const agent of agents) {
      try {
        const sessionKey = `agent:${agent.agentId}:main`;
        const escapedMessage = message.replace(/"/g, '\\"');

        execSync(
          `openclaw sessions send --session "${sessionKey}" --message "[Broadcast] ${escapedMessage}"`,
          { stdio: "pipe", timeout: 10000 }
        );

        results.push({ agentId: agent.agentId, success: true });
      } catch (error: any) {
        results.push({ agentId: agent.agentId, success: false, error: error.message });
      }
    }

    res.json({ success: true, results });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Mission Control API server running on port ${PORT}`);
  console.log(`📡 Connected to Convex: ${CONVEX_URL}`);
});
