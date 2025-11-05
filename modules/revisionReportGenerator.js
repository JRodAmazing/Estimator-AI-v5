// modules/revisionReportGenerator.js
import fs from "fs-extra";
import path from "path";
import PDFDocument from "pdfkit";

/**
 * Create a plain, unbranded PDF listing all revisions for a project.
 */
export async function generateRevisionReport(project) {
  await fs.ensureDir("./data/submittals");
  const outPath = path.join(
    "./data/submittals",
    `${project.id}_revision_report.pdf`
  );

  const doc = new PDFDocument({ margin: 40 });
  const stream = fs.createWriteStream(outPath);
  doc.pipe(stream);

  doc.fontSize(16).text("Revision History", { align: "left" });
  doc.moveDown(0.5);
  doc.fontSize(10);

  doc.text(`Project ID: ${project.id}`);
  if (project.location) doc.text(`Location: ${project.location}`);
  if (project.buildingType) doc.text(`Building Type: ${project.buildingType}`);
  if (project.stories) doc.text(`Stories: ${project.stories}`);
  if (project.estimatedCost)
    doc.text(
      `Estimated Cost: $${Number(project.estimatedCost).toLocaleString()}`
    );
  doc.text(`Created: ${new Date(project.createdAt).toLocaleString()}`);
  doc.text(`Updated: ${new Date(project.updatedAt).toLocaleString()}`);
  doc.moveDown(1);

  const revisions = Array.isArray(project.modifications)
    ? project.modifications
    : [];
  doc.fontSize(12).text("Revisions:");
  doc.moveDown(0.4);
  doc.fontSize(10);

  if (!revisions.length) {
    doc.text("No revisions recorded.");
  } else {
    revisions.forEach((rev, i) => {
      const when = rev.timestamp
        ? new Date(rev.timestamp).toLocaleString()
        : "Unknown time";
      const desc = rev.description || "No description";
      doc.text(`${i + 1}. ${when} — ${desc}`);
      doc.moveDown(0.2);
    });
  }

  doc.end();
  await new Promise((r) => stream.on("finish", r));
  console.log(`[REVISION REPORT] Created ${outPath}`);
  return outPath;
}
