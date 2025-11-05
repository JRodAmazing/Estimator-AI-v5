import { getMode, setMode } from "../modules/modeManager.js";
import { EmbedBuilder } from "discord.js";

export default {
  name: "mode",
  description: "View or switch between Estimator and Designer modes",
  async execute(message, args) {
    try {
      let current = await getMode();

      // No argument → show current mode
      if (!args.length) {
        const embed = new EmbedBuilder()
          .setColor(current === "designer" ? 0xffa500 : 0x00ff88)
          .setTitle("🧭 Current Mode")
          .setDescription(`Bot is currently in **${current.toUpperCase()}** mode.`)
          .setTimestamp();
        return message.reply({ embeds: [embed] });
      }

      // Switch mode
      const target = args[0].toLowerCase();
      const newMode = await setMode(target);

      const embed = new EmbedBuilder()
        .setColor(newMode === "designer" ? 0xffa500 : 0x00ff88)
        .setTitle("🔄 Mode Changed")
        .setDescription(`Switched to **${newMode.toUpperCase()}** mode.`)
        .setTimestamp();

      await message.reply({ embeds: [embed] });
    } catch (err) {
      console.error("[MODE ERROR]", err);
      message.reply("❌ Usage: `!mode` or `!mode estimator/designer`");
    }
  },
};
