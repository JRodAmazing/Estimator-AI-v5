// modules/roleRouter.js
import { setMode, getMode } from "./modeManager.js";

/**
 *  Automatically align bot mode with the user's highest relevant role.
 *  Example: user with "Designer" role sets bot to designer mode automatically.
 */
export async function autoSetModeFromRoles(message) {
  try {
    const roles = message.member?.roles?.cache.map(r => r.name.toLowerCase()) || [];
    if (roles.includes("designer")) {
      await setMode("designer");
      return "designer";
    }
    if (roles.includes("estimator")) {
      await setMode("estimator");
      return "estimator";
    }
    return await getMode(); // default (no change)
  } catch (err) {
    console.error("[ROLE ROUTER ERROR]", err);
    return await getMode();
  }
}

/**
 *  Enforce that a command can only be used by users with a matching role.
 *  Returns true if allowed, false if blocked.
 */
export async function requireRole(message, requiredRole) {
  const roles = message.member?.roles?.cache.map(r => r.name.toLowerCase()) || [];
  if (!roles.includes(requiredRole.toLowerCase())) {
    await message.reply(`🚫 You need the **${requiredRole}** role to use this command.`);
    return false;
  }
  return true;
}
