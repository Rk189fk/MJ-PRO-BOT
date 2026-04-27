import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const {
  PORT = 3000,
  VERIFY_TOKEN,
  WHATSAPP_TOKEN,
  PHONE_NUMBER_ID,
  GRAPH_API_VERSION = "v20.0",
} = process.env;

function assertEnv() {
  const missing = [];
  if (!VERIFY_TOKEN) missing.push("VERIFY_TOKEN");
  if (!WHATSAPP_TOKEN) missing.push("WHATSAPP_TOKEN");
  if (!PHONE_NUMBER_ID) missing.push("PHONE_NUMBER_ID");
  if (missing.length) {
    console.error("Missing env vars:", missing.join(", "));
    process.exit(1);
  }
}
assertEnv();

// Health check
app.get("/", (req, res) => res.send("WhatsApp Cloud Bot is running ✅"));

// Meta webhook verification (GET)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// Receive messages (POST)
app.post("/webhook", async (req, res) => {
  try {
    const body = req.body;

    // Meta sends events in this structure
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    // Acknowledge quickly
    res.sendStatus(200);

    const messages = value?.messages;
    if (!messages || !messages.length) return;

    const msg = messages[0];
    const from = msg.from; // user's WhatsApp number
    const text = msg?.text?.body;

    if (!text) return;

    // Simple logic: echo + help
    let reply = `Aapne likha: "${text}"`;
    if (text.toLowerCase().includes("hi") || text.toLowerCase().includes("hello")) {
      reply = "Hi! Main WhatsApp bot hoon. Aap 'help' likho commands ke liye.";
    } else if (text.toLowerCase() === "help") {
      reply = "Commands:\n1) hi/hello\n2) help\n3) time";
    } else if (text.toLowerCase() === "time") {
      reply = `Server time: ${new Date().toISOString()}`;
    }

    await sendTextMessage(from, reply);
  } catch (err) {
    // If already responded 200, just log
    console.error("Webhook error:", err?.response?.data || err.message);
  }
});

async function sendTextMessage(to, message) {
  const url = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  await axios.post(
    url,
    {
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: { body: message }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
