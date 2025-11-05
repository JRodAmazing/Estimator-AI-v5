// commands/packageportfolio.js
import { bundlePortfolio } from "../modules/portfolioBundler.js";
import { generateReadme } from "../modules/readmeGenerator.js";
import { zipPortfolio } from "../modules/zipPackager.js";

export default {
  name: "packageportfolio",
  description: "Bundle, document, and zip your entire portfolio for delivery.",
  async execute(message) {
    try {
      const folder = await bundlePortfolio();
      await generateReadme(folder);
      const zip = await zipPortfolio(folder);
      await message.reply({
        content: `✅ Portfolio packaged successfully.\n📦 ${zip}`,
        files: [zip],
      });
    } catch (err) {
      console.error("[PACKAGE PORTFOLIO ERROR]", err);
      message.reply("❌ Failed to package portfolio.");
    }
  },
};

