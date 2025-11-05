// commands/exportsession.js
import fs from "fs-extra";
import path from "path";
import { Parser } from "json2csv";
import { getSession } from "../modules/sessionManager.js";
import { getSessionLogs } from "../modules/sessionLogger.js";
import { archiveSession } from "../modules/archiveManager.js";

export default {
  name: "exportsession",
  description: "Export your current session to JSON and CSV, and archive it.",
  async execute(message) {
    try {
      const session = await getSession(message.author.id);
      if (!session)
        return message.reply("⚠️ No active session found to export.");

      const logs = await getSessionLogs(message.author.id);
      session.logs = logs;

      // ensure export dir
      const exportDir = await archiveSession(session);
      const jsonPath = path.join(exportDir, `${session.projectId}_session.json`);
      const csvPath = path.join(exportDir, `${session.projectId}_session.csv`);

      // JSON
      await fs.writeJson(jsonPath, session, { spaces: 2 });

      // CSV
      if (logs.length) {
        const parser = new Parser({ fields: ["timestamp", "action"] });
        const csv = parser.parse(logs);
        await fs.writeFile(csvPath, csv);
      }

      await message.reply({
        content: `✅ Session exported:\n📄 ${jsonPath}\n📊 ${csvPath}`,
      });
    } catch (err) {
      console.error("[EXPORT SESSION ERROR]", err);
      message.reply("❌ Failed to export session.");
    }
  },
};
