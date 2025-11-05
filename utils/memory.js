import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const memFile = path.join(__dirname, "../data/preferences.json");

export function loadMemory() {
  if (!fs.existsSync(memFile)) return { userDefaults: {} };
  return JSON.parse(fs.readFileSync(memFile, "utf8"));
}

export function saveMemory(memory) {
  fs.writeFileSync(memFile, JSON.stringify(memory, null, 2), "utf8");
}

// remember key=value
export function remember(userId, key, value) {
  const mem = loadMemory();
  mem.userDefaults[userId] = mem.userDefaults[userId] || {};
  mem.userDefaults[userId][key] = value;
  saveMemory(mem);
}

// recall key
export function recall(userId, key, fallback = null) {
  const mem = loadMemory();
  return mem.userDefaults[userId]?.[key] ?? fallback;
}
