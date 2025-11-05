import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { listProjects } from "../utils/store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const name = "export";
export async function execute(message, args) {
  const projects = listProjects(50);
  if (!projects.length) return message.reply("No projects to export.");

  const csvLines = [
    "ID,Stories,Type,Location,EstimatedCost,CreatedAt",
    ...projects.map(
      (p) =>
        `${p.id},${p.stories},${p.buildingType},${p.location},${p.estimatedCost},${p.createdAt}`
    ),
  ];
  const csvPath = path.join(__dirname, "../data/export.csv");
  fs.writeFileSync(csvPath, csvLines.join("\n"), "utf8");

  await message.reply({
    content: "📤 Exported latest projects (CSV)",
    files: [csvPath],
  });
}
