// modules/modeManager.js
import fs from "fs-extra";

const MODE_FILE = "./data/mode.json";

/**
 * Get the current operating mode.
 */
export async function getMode() {
  const data = await fs.readJson(MODE_FILE).catch(() => ({ mode: "estimator" }));
  return data.mode || "estimator";
}

/**
 * Set a new mode ("estimator" or "designer")
 */
export async function setMode(newMode) {
  const mode = newMode.toLowerCase();
  if (!["estimator", "designer"].includes(mode))
    throw new Error("Invalid mode");
  await fs.writeJson(MODE_FILE, { mode }, { spaces: 2 });
  console.log(`[MODE] Switched to ${mode.toUpperCase()} mode`);
  return mode;
}
