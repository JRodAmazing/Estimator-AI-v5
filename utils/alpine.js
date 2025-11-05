import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function exportAlpine(project) {
  const filePath = path.join(__dirname, `../data/${project.id}_alpine.json`);
  const data = {
    project_id: project.id,
    type: project.buildingType,
    stories: project.stories,
    location: project.location,
    estimate: project.estimatedCost,
    actual: project.actualCost || null,
    generated_at: new Date().toISOString()
  };
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  return filePath;
}
