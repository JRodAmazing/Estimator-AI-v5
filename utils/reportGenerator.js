import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const learningPath = path.join(__dirname, "../data/learning.json");
const projectsPath = path.join(__dirname, "../data/projects.json");

export async function generateReportPDF() {
  const doc = new PDFDocument({ margin: 50 });
  const filePath = path.join(__dirname, "../data/report.pdf");
  doc.pipe(fs.createWriteStream(filePath));

  const learning = fs.existsSync(learningPath)
    ? JSON.parse(fs.readFileSync(learningPath, "utf8"))
    : { adjustments: {} };

  const projects = fs.existsSync(projectsPath)
    ? JSON.parse(fs.readFileSync(projectsPath, "utf8")).projects || []
    : [];

  // Title
  doc.fontSize(20).text("Estimator AI Learning Report", { align: "center" });
  doc.moveDown(1);

  // Summary
  doc.fontSize(12);
  doc.text(`Generated: ${new Date().toLocaleString()}`);
  doc.moveDown();
  doc.text(`Projects stored: ${projects.length}`);
  doc.text(
    `Projects with actual cost: ${
      projects.filter((p) => p.actualCost).length
    }`
  );
  doc.moveDown();

  // Adjustment factors
  doc.fontSize(14).text("Adjustment Factors", { underline: true });
  doc.moveDown(0.5);
  if (Object.keys(learning.adjustments).length) {
    for (const [key, val] of Object.entries(learning.adjustments)) {
      doc.fontSize(11).text(`${key}: factor=${val.factor.toFixed(2)}, samples=${val.samples}`);
    }
  } else {
    doc.fontSize(11).text("No learning data yet.");
  }
  doc.moveDown(1);

  // Table of projects
  doc.fontSize(14).text("Project Summary", { underline: true });
  doc.moveDown(0.5);
  projects.slice(-15).forEach((p, i) => {
    doc.fontSize(10).text(
      `${i + 1}. ${p.id} | ${p.stories}-story ${p.buildingType} | ${p.location} | Est: $${p.estimatedCost || "n/a"} | Act: $${p.actualCost || "?"}`
    );
  });

  doc.end();
  return filePath;
}
