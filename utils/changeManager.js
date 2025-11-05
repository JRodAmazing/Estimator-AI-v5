import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateTakeoff } from "./takeoff.js";
import { listProjects, updateProject } from "./store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const historyPath = path.join(__dirname, "../data/history.json");

function loadHistory() {
  if (!fs.existsSync(historyPath)) return { history: [] };
  return JSON.parse(fs.readFileSync(historyPath, "utf8"));
}
function saveHistory(data) {
  fs.writeFileSync(historyPath, JSON.stringify(data, null, 2), "utf8");
}

// Apply a change order and log history
export function applyChange(projectId, updates) {
  const projects = listProjects(500);
  const proj = projects.find(p => p.id === projectId);
  if (!proj) return null;

  const hist = loadHistory();
  hist.history.push({
    id: projectId,
    timestamp: new Date().toISOString(),
    previous: { ...proj },
    change: updates
  });
  saveHistory(hist);

  const newProj = { ...proj, ...updates };
  const newTakeoff = generateTakeoff(newProj);
  newProj.estimatedCost = newTakeoff.total;
  newProj.updatedAt = new Date().toISOString();

  updateProject(projectId, newProj);
  return newProj;
}

export function getHistory(projectId) {
  const hist = loadHistory();
  return hist.history.filter(h => h.id === projectId);
}
