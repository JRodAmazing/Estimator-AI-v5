
import fs from "fs-extra";
import { EmbedBuilder } from "discord.js";

export default {
  name: "status",
  description: "Show current Estimator AI system status",
  async execute(message) {
    try {
      // --- Load key data files ---
      const suppliers = await fs.readJson("./data/suppliers.json").catch(() => []);
      const model = await fs.readJson("./data/model_weights.json").catch(() => ({}));

      // Count materials
      const materialsCount = Object.keys(model).length || suppliers.length || 0;

      // Find latest submittal PDF
      let lastSubmittal = "None";
      try {
        const files = await fs.readdir("./data/submittals");
        const pdfs = files.filter(f => f.endsWith(".pdf"));
        if (pdfs.length) {
          const last = pdfs
            .map(f => ({
              name: f,
              time: fs.statSync(`./data/submittals/${f}`).mtimeMs,
            }))
            .sort((a, b) => b.time - a.time)[0];
          lastSubmittal = last.name;
        }
      } catch {}

      const syncInterval = process.env.SYNC_INTERVAL || 12;
      const lastSyncTime = new Date().toLocaleString();

      // --- Build embed ---
      const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle("📊 Estimator AI V5 – System Status")
        .addFields(
          { name: "🕒 Last Sync", value: lastSyncTime, inline: false },
          { name: "📦 Materials Loaded", value: String(materialsCount), inline: true },
          { name: "📁 Last Submittal", value: lastSubmittal, inline: true },
          { name: "⚙️ Sync Interval", value: `${syncInterval} h`, inline: true }
        )
        .setTimestamp()
        .setFooter({ text: "Estimator AI V5 Status Monitor" });

      await message.reply({ embeds: [embed] });
    } catch (err) {
      console.error("[STATUS ERROR]", err);
      message.reply("❌ Failed to fetch status.");
    }
  },
};
