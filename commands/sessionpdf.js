// commands/sessionpdf.js
import { generateSessionReport } from "../modules/sessionReportGenerator.js";

export default {
  name: "sessionpdf",
  description: "Generate a clean PDF summary of your session",
  async execute(message) {
    try {
      const pdfPath = await generateSessionReport(message.author.id);
      await message.reply({
        content: "📄 Session summary generated.",
        files: [pdfPath],
      });
    } catch (err) {
      console.error("[SESSION PDF ERROR]", err);
      message.reply("❌ Unable to generate session summary (no active session?).");
    }
  },
};
