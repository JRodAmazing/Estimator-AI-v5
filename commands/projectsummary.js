// commands/projectsummary.js
import { exportProjectSummary } from "../modules/summaryExporter.js";

export default {
  name: "projectsummary",
  description: "Export all projects to a single CSV summary file.",
  async execute(message) {
    try {
      const csvPath = await exportProjectSummary();
      await message.reply({
        content: `📊 Global project summary generated.`,
        files: [csvPath],
      });
    } catch (err) {
      console.error("[PROJECT SUMMARY ERROR]", err);
      message.reply("❌ Failed to export project summary.");
    }
  },
};
