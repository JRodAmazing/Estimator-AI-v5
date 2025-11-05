// modules/sessionManager.js
import fs from "fs-extra";

const SESSION_FILE = "./data/sessions.json";

/**
 *  Load all sessions (persisted between restarts)
 */
async function loadSessions() {
  return (await fs.readJson(SESSION_FILE).catch(() => ({}))) || {};
}

/**
 *  Save sessions
 */
async function saveSessions(sessions) {
  await fs.writeJson(SESSION_FILE, sessions, { spaces: 2 });
}

/**
 *  Create a new session
 */
export async function createSession(userId, projectId, mode) {
  const sessions = await loadSessions();

  const session = {
    id: `session_${Date.now()}`,
    userId,
    projectId,
    mode,
    startedAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    active: true,
  };

  sessions[userId] = session;
  await saveSessions(sessions);
  console.log(`[SESSION] Created for ${userId} → ${projectId} (${mode})`);
  return session;
}

/**
 *  End a user's current session
 */
export async function endSession(userId) {
  const sessions = await loadSessions();
  if (!sessions[userId]) return null;

  sessions[userId].active = false;
  sessions[userId].endedAt = new Date().toISOString();
  await saveSessions(sessions);

  console.log(`[SESSION] Ended for ${userId}`);
  return sessions[userId];
}

/**
 *  Get a user's current session
 */
export async function getSession(userId) {
  const sessions = await loadSessions();
  return sessions[userId] && sessions[userId].active ? sessions[userId] : null;
}

/**
 *  Resume an inactive session
 */
export async function resumeSession(userId) {
  const sessions = await loadSessions();
  if (!sessions[userId]) return null;

  sessions[userId].active = true;
  sessions[userId].lastActive = new Date().toISOString();
  await saveSessions(sessions);

  console.log(`[SESSION] Resumed for ${userId}`);
  return sessions[userId];
}
