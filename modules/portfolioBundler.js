// modules/portfolioBundler.js
import fs from "fs-extra";
import path from "path";

/**
 * Bundle all project artifacts into one Portfolio_<timestamp> folder.
 */
export async function bundlePortfolio() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dest = `./Portfolio_${timestamp}`;
  await fs.ensureDir(dest);

  const archiveDir = "./data/archive";
  const submittalDir = "./data/submittals";
  const summaryFile = "./data/projects_summary.csv";

  // Copy archives
  if (await fs.pathExists(archiveDir)) {
    await fs.copy(archiveDir, path.join(dest, "archive"));
  }

  // Copy submittals (PDFs, DXFs, SVGs)
  if (await fs.pathExists(submittalDir)) {
    await fs.copy(submittalDir, path.join(dest, "submittals"));
  }

  // Copy summary file if it exists
  if (await fs.pathExists(summaryFile)) {
    await fs.copy(summaryFile, path.join(dest, "projects_summary.csv"));
  }

  // Copy project data for reference
  if (await fs.pathExists("./data/projects.json")) {
    await fs.copy("./data/projects.json", path.join(dest, "projects.json"));
  }

  console.log(`[PORTFOLIO] Bundle created at ${dest}`);
  return dest;
}
