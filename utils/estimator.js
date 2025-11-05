import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { suggestAdjustment } from "./learning.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storePath = path.join(__dirname, "../data/projects.json");

// simple average-based learning
export function learn() {
  if (!fs.existsSync(storePath)) return {};
  const { projects } = JSON.parse(fs.readFileSync(storePath, "utf8"));
  const grouped = {};
  for (const p of projects) {
    const key = `${p.buildingType}_${p.location}`.toLowerCase();
    if (!grouped[key]) grouped[key] = { total: 0, count: 0 };
    grouped[key].total += Number(p.estimatedCost || 0);
    grouped[key].count++;
  }
  const model = {};
  for (const [k, v] of Object.entries(grouped)) {
    model[k] = v.total / Math.max(1, v.count);
  }
  return model;
}

export function predict(buildingType, location) {
  const model = learn();
  const key = `${buildingType}_${location}`.toLowerCase();
  const base = model[key] || 250000;
  const variance = (Math.random() - 0.5) * 0.25;
  let est = Math.round(base * (1 + variance));

  // apply learned adjustment if any
  const adj = suggestAdjustment(buildingType, location, est);
  return Math.round(adj.adjusted);
}
