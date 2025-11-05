// modules/sessionReportGenerator.js
import fs from "fs-extra";
import path from "path";
import PDFDocument from "pdfkit";
import { getSessionLogs } from "./sessionLogger.js";
import { getSession } from "./sessionManager.js";

const OUTPUT_DIR = "./data/submittals";

/**
 * Create a minimal PDF session summary.
 * @param {string} userId
 * @returns {Promise<string>} path to PDF
 */
export async function generateSessionReport(userId) {
  await fs.ensureDir(OUTPUT_DIR);
  const session = await getSession(userId);
  const logs = await getSessionLogs(userId);

  if (!session) throw new Error("No active session found");

  const filename = `${session.projectId}_session_report.pdf`;
  const pdfPath = path.join(OUTPUT_DIR, filename);

  const doc = new PDFDocument({ margin: 40 });
  const writeStream = fs.createWriteStream(pdfPath);
  doc.pipe(writeStream);

  // --- Header ---
  doc.fontSize(16).text("Session Summary", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(10);
  doc.text(`Project ID: ${session.projectId}`);
  doc.text(`Mode: ${session.mode}`);
  doc.text(`Started: ${new Date(session.startedAt).toLocaleString()}`);
  if (session.endedAt)
    doc.text(`Ended: ${new Date(session.endedAt).toLocaleString()}`);
  doc.moveDown(1);

  // --- Log Table ---
  doc.fontSize(12).text("Recent Actions:");
  doc.moveDown(0.4);
  doc.fontSize(10);

  if (!logs.length) {
    doc.text("No activity recorded.");
  } else {
    logs.forEach((log) => {
      doc.text(
        `${new Date(log.timestamp).toLocaleString()}  |  ${log.action}`,
        { continued: false }
      );
      if (log.details) {
        const info = Object.entries(log.details)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        if (info) doc.text(`   → ${info}`, { indent: 10 });
      }
      doc.moveDown(0.2);
    });
  }

  doc.end();
  await new Promise((res) => writeStream.on("finish", res));

  console.log(`[SESSION REPORT] Created ${filename}`);
  return pdfPath;
}
