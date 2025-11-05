// commands/sessionreport.js
import { getSessionLogs } from "../modules/sessionLogger.js";
import { EmbedBuilder } from "discord.js";

export default {
  name: "sessionreport",
  description: "Show recent activity for your current session",
  async execute(message) {
    const logs = await getSessionLogs(message.author.id);
    if (!logs.length)
      return message.reply("📝 No logs found for your session.");

    const recent = logs
      .slice(-10)
      .map(
        (l) =>
          `• **${l.action}**  (${new Date(l.timestamp).toLocaleTimeString()})`
      )
      .join("\n");

    const embed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setTitle("📊 Session Activity Report")
      .setDescription(recent)
      .setTimestamp()
      .setFooter({ text: "Showing last 10 events" });

    await message.reply({ embeds: [embed] });
  },
};
