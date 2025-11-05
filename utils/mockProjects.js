// utils/mockProjects.js
import fs from "fs-extra";
import path from "path";

const PROJECTS_FILE = "./data/projects.json";

const locations = ["Dallas", "Houston", "Denver", "Portland", "Des Moines"];
const types = ["office", "warehouse", "retail", "shop", "truss"];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function generateMockProjects(count = 10) {
  const data = await fs.readJson(PROJECTS_FILE).catch(() => ({ projects: [] }));
  const projects = data.projects || [];

  for (let i = 0; i < count; i++) {
    const id = `project_${Date.now()}_${i}`;
    projects.push({
      id,
      stories: rand(1, 5).toString(),
      buildingType: types[rand(0, types.length - 1)],
      location: locations[rand(0, locations.length - 1)],
      estimatedCost: rand(50000, 300000),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  await fs.writeJson(PROJECTS_FILE, { projects }, { spaces: 2 });
  console.log(`[MOCK DATA] Added ${count} sample projects.`);
  return projects;
}
