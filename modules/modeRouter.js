
// modules/modeRouter.js
import { getMode } from "./modeManager.js";

/**
 * Route commands differently based on active mode.
 * Each command that needs dual behavior can call this helper.
 */
export async function routeByMode(estimatorFn, designerFn) {
  const mode = await getMode();
  if (mode === "designer") return await designerFn();
  return await estimatorFn();
}

/**
 * Convenience wrapper for commands that should run only in a given mode.
 */
export async function requireMode(required, message, runFn) {
  const mode = await getMode();
  if (mode !== required) {
    await message.reply(`⚠️  This command is available only in **${required.toUpperCase()}** mode (currently ${mode}).`);
    return false;
  }
  await runFn();
  return true;
}
