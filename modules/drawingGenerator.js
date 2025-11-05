
// modules/drawingGenerator.js
import fs from "fs-extra";
import path from "path";

/**
 * Generate a simple DXF + SVG layout from project geometry data.
 * @param {object} project - Project with geometry array [{x,y},...]
 * @returns {Promise<{dxfPath:string,svgPath:string}>}
 */
export async function generateDrawings(project) {
  const outDir = "./data/submittals";
  await fs.ensureDir(outDir);

  const baseName = `${project.id}_layout`;
  const dxfPath = path.join(outDir, `${baseName}.dxf`);
  const svgPath = path.join(outDir, `${baseName}.svg`);

  const geometry = project.geometry || [
    { x: 0, y: 0 },
    { x: 50, y: 0 },
    { x: 50, y: 30 },
    { x: 0, y: 30 },
    { x: 0, y: 0 },
  ];

  // --- DXF ---
  const dxfHeader =
    "0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n";
  const dxfFooter = "0\nENDSEC\n0\nEOF";
  const dxfLines = geometry
    .slice(1)
    .map(
      (p, i) =>
        `0\nLINE\n8\n0\n10\n${geometry[i].x}\n20\n${geometry[i].y}\n11\n${p.x}\n21\n${p.y}\n`
    )
    .join("");
  const dxfContent = dxfHeader + dxfLines + dxfFooter;
  await fs.writeFile(dxfPath, dxfContent);

  // --- SVG ---
  const pathData = geometry.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 60" stroke="black" fill="none">
  <path d="${pathData}" />
</svg>`;
  await fs.writeFile(svgPath, svgContent);

  console.log(`[DRAWING] Created ${baseName}.dxf and .svg`);
  return { dxfPath, svgPath };
}
