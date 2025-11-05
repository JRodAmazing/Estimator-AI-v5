// modules/archiveManager.js
import fs from "fs-extra";
import path from "path";

const ARCHIVE_DIR = "./data/archive";

/**
 * Archive all artifacts from a session: logs, PDFs, DXFs, etc.
 */
export async function archiveSession(session) {
  const sessionId = session.id || `session_${Date.now()}`;
  const destDir = path.join(ARCHIVE_DIR, sessionId);
  await fs.ensureDir(destDir);

  // move session data
  const srcFiles = await fs.readdir("./data/submittals").catch(() => []);
  for (const f of srcFiles) {
    if (f.includes(session.projectId)) {
      await fs.copy(`./data/submittals/${f}`, path.join(destDir, f));
    }
  }

  // copy session JSON
  await fs.writeJson(path.join(destDir, "session.json"), session, { spaces: 2 });
  console.log(`[ARCHIVE] Session archived to ${destDir}`);
  return destDir;
}
