import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function exportMitek(project) {
  const filePath = path.join(__dirname, `../data/${project.id}.mxf`);
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<MXF version="1.0">
  <Project id="${project.id}">
    <CreatedAt>${project.createdAt}</CreatedAt>
    <BuildingType>${project.buildingType}</BuildingType>
    <Stories>${project.stories}</Stories>
    <Location>${project.location}</Location>
    <EstimatedCost>${project.estimatedCost}</EstimatedCost>
    <ActualCost>${project.actualCost || ""}</ActualCost>
  </Project>
</MXF>`;
  fs.writeFileSync(filePath, xml, "utf8");
  return filePath;
}
