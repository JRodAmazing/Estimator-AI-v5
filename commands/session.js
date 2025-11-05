// commands/session.js
import { EmbedBuilder } from "discord.js";
import { createSession, endSession, getSession, resumeSession } from "../modules/sessionManager.js";
import { getMode } from "../modules/modeManager.js";

export default {
  name: "session",
  description: "Manage your job session (start, end, resume, view)",
  async execute(message, args) {
    const sub = args[0]?.toLowerCase();
    const userId = message.author.id;

    // --- View current session ---
    if (!sub) {
      const sess = await getSession(userId);
      if (!sess)
        return message.reply("ℹ️  You have no active session. Use `!session start <project_id>`.");
      const embed = new EmbedBuilder()
        .setColor(0x00b0f4)
        .setTitle("📂 Active Session")
        .addFields(
          { name: "Project ID", value: sess.projectId, inline: true },
          { name: "Mode", value: sess.mode.toUpperCase(), inline: true },
          { name: "Started", value: new Date(sess.startedAt).toLocaleString(), inline: false }
        )
        .setFooter({ text: sess.id })
        .setTimestamp();
      return message.reply({ embeds: [embed] });
    }

    // --- Start ---
    if (sub === "start") {
      const projectId = args[1];
      if (!projectId)
        return message.reply("❌  Usage: `!session start <project_id>`");
      const mode = await getMode();
      const sess = await createSession(userId, projectId, mode);
      return message.reply(`✅ Session started for **${projectId}** in **${mode.toUpperCase()}** mode.`);
    }

    // --- End ---
    if (sub === "end") {
      const ended = await endSession(userId);
      if (!ended) return message.reply("⚠️  You have no active session.");
      return message.reply(`🛑 Session for **${ended.projectId}** closed.`);
    }

    // --- Resume ---
    if (sub === "resume") {
      const resumed = await resumeSession(userId);
      if (!resumed) return message.reply("⚠️  No previous session found to resume.");
      return message.reply(`▶️  Resumed session for **${resumed.projectId}** (${resumed.mode}).`);
    }

    return message.reply("❌ Usage: `!session [start|end|resume] <project_id>`");
  },
};
