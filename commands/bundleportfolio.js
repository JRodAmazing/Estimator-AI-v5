// commands/bundleportfolio.js
import { bundlePortfolio } from "../modules/portfolioBundler.js";

export default {
  name: "bundleportfolio",
  description: "Bundle all project files, archives, and reports into a Portfolio folder.",
  async execute(message) {
    try {
      const folderPath = await bundlePortfolio();
      await message.reply(`📦 Portfolio bundle created at: ${folderPath}`);
    } catch (err) {
      console.error("[PORTFOLIO BUNDLE ERROR]", err);
      message.reply("❌ Failed to create portfolio bundle.");
    }
  },
};
