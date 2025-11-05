// modules/sessionLogger.js
import fs from "fs-extra";

const SESSION_FILE = "./data/sessions.json";

/**
 * Append a log entry to a user's active session
 */
export async function logSessionEvent(userId, action, details = {}) {
  try {
    const sessions = await fs.readJson(SESSION_FILE).catch(() => ({}));
    const session = sessions[userId];
    if (!session || !session.active) return false;

    const entry = {
      timestamp: new Date().toISOString(),
      action,
      details,
    };

    if (!Array.isArray(session.logs)) session.logs = [];
    session.logs.push(entry);
    session.lastActive = entry.timestamp;

    await fs.writeJson(SESSION_FILE, sessions, { spaces: 2 });
    console.log(`[SESSION LOG] ${userId}: ${action}`);
    return true;
  } catch (err) {
    console.error("[SESSION LOG ERROR]", err);
    return false;
  }
}

/**
 * Get all log entries for a user's session
 */
export async function getSessionLogs(userId) {
  const sessions = await fs.readJson(SESSION_FILE).catch(() => ({}));
  return sessions[userId]?.logs || [];
}
