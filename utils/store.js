import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, "../data/projects.json");

function load() {
  if (!fs.existsSync(filePath)) return { projects: [] };
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function save(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export function addProject(project) {
  const data = load();
  data.projects.push(project);
  save(data);
}

export function listProjects(limit = 5) {
  const data = load();
  return data.projects.slice(-limit);
}

export function updateProject(id, patch) {
  const data = load();
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  data.projects[idx] = { ...data.projects[idx], ...patch };
  save(data);
  return data.projects[idx];
}
