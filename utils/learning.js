import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const learnFile = path.join(__dirname, "../data/learning.json");

// Load or initialize
function load() {
  if (!fs.existsSync(learnFile))
    return { adjustments: {} };
  return JSON.parse(fs.readFileSync(learnFile, "utf8"));
}

function save(data) {
  fs.writeFileSync(learnFile, JSON.stringify(data, null, 2), "utf8");
}

// Update adjustment factor
export function updateLearning(buildingType, location, est, actual) {
  const data = load();
  const key = `${buildingType}_${location}`.toLowerCase();
  const rec = data.adjustments[key] || { factor: 1, samples: 0 };

  if (est > 0) {
    const observed = actual / est;
    const alpha = 0.2;                     // learning rate
    rec.factor = (1 - alpha) * rec.factor + alpha * observed;
    rec.samples += 1;
    data.adjustments[key] = rec;
    save(data);
  }
  return rec;
}

export function suggestAdjustment(buildingType, location, est) {
  const data = load();
  const key = `${buildingType}_${location}`.toLowerCase();
  const rec = data.adjustments[key];
  if (!rec) return { adjusted: est, factor: 1, samples: 0 };
  return { adjusted: est * rec.factor, factor: rec.factor, samples: rec.samples };
}
