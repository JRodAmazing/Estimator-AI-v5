// modules/summaryExporter.js
import fs from "fs-extra";
import { Parser } from "json2csv";

const PROJECTS_FILE = "./data/projects.json";
const OUTPUT_FILE = "./data/projects_summary.csv";

/**
 * Build a single CSV of all projects with key metrics.
 */
export async function exportProjectSummary() {
  const data = await fs.readJson(PROJECTS_FILE).catch(() => ({ projects: [] }));
  const projects = Array.isArray(data.projects) ? data.projects : [];

  const rows = projects.map((p) => ({
    id: p.id,
    location: p.location || "",
    buildingType: p.buildingType || "",
    stories: p.stories || "",
    estimatedCost: p.estimatedCost || "",
    revisionCount: Array.isArray(p.modifications) ? p.modifications.length : 0,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));

  const parser = new Parser({
    fields: [
      "id",
      "location",
      "buildingType",
      "stories",
      "estimatedCost",
      "revisionCount",
      "createdAt",
      "updatedAt",
    ],
  });

  const csv = parser.parse(rows);
  await fs.writeFile(OUTPUT_FILE, csv);
  console.log(`[SUMMARY] Exported ${rows.length} projects → ${OUTPUT_FILE}`);
  return OUTPUT_FILE;
}
