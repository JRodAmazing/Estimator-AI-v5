// modules/zipPackager.js
import fs from "fs-extra";
import archiver from "archiver";
import path from "path";

export async function zipPortfolio(folderPath) {
  const zipName = path.basename(folderPath) + ".zip";
  const zipPath = path.join(".", zipName);

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", resolve);
    archive.on("error", reject);

    archive.pipe(output);
    archive.directory(folderPath, false);
    archive.finalize();
  });

  console.log(`[ZIP] Portfolio compressed → ${zipPath}`);
  return zipPath;
}
