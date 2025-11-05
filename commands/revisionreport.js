// commands/revisionreport.js
import fs from "fs-extra";
import { generateRevisionReport } from "../modules/revisionReportGenerator.js";

export default {
  name: "revisionreport",
  description: "Generate a PDF listing all revisions for a project.",
  async execute(message, args) {
    try {
      if (!args.length)
        return message.reply("Usage: `!revisionreport <project_id>`");

      const projectId = args[0].trim();
      const data = await fs.readJson("./data/projects.json").catch(() => ({}));
      const projects = Array.isArray(data.projects) ? data.projects : [];
      const project = projects.find((p) => p.id === projectId);

      if (!project) return message.reply(`❌ Project not found: ${projectId}`);

      const pdfPath = await generateRevisionReport(project);
      await message.reply({
        content: "📄 Revision report generated.",
        files: [pdfPath],
      });
    } catch (err) {
      console.error("[REVISION REPORT ERROR]", err);
      message.reply("❌ Failed to generate revision report.");
    }
  },
};
