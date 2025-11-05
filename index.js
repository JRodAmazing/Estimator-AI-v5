// ==========================================================
//  Estimator AI V5 - Discord Bot Main Entry
//  Includes: Mode-Aware Routing, Auto Role Detection,
//  Supplier Sync Scheduler, and Command Loader
// ==========================================================

// --- Core Imports ---
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
dotenv.config();

// --- Internal Modules ---
import { startAutoSync } from "./modules/scheduler.js";
import { autoSetModeFromRoles } from "./modules/roleRouter.js";

// --- Path Setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Initialize Discord Client ---
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// --- Command Collection ---
client.commands = new Collection();

// --- Load Commands Dynamically ---
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  try {
    const command = await import(`./commands/${file}`);
    if (command.default && command.default.name) {
      client.commands.set(command.default.name, command.default);
    } else {
      console.warn(`⚠️  Skipped invalid command: ${file}`);
    }
  } catch (err) {
    console.error(`❌ Failed to load command: ${file}`, err);
  }
}
console.log(`✅ Loaded ${client.commands.size} commands.`);

// --- Client Ready Event ---
client.once("clientReady", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  // Start scheduled supplier sync loop
  startAutoSync(process.env.SYNC_INTERVAL || 12);
});

// --- Message Command Handler ---
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const prefix = "!";
  if (!message.content.startsWith(prefix)) return;

  // --- Auto-detect mode from roles ---
  await autoSetModeFromRoles(message);

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(`[ERROR] Command failed: ${commandName}`, error);
    await message.reply("❌ There was an error executing that command.");
  }
});

// --- Login ---
client.login(process.env.DISCORD_TOKEN);
