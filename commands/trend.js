import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ChartJS from "chart.js/auto";
import { createCanvas } from "canvas";
import { listProjects } from "../utils/store.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const chartPath = path.join(__dirname, "../data/trend.png");

export const name = "trend";
export async function execute(message) {
  const projects = listProjects(100);
  const dated = projects.filter(p => p.createdAt && p.estimatedCost);
  if (!dated.length) return message.reply("📉 No project data to chart yet.");

  const canvas = createCanvas(800, 400);
  const ctx = canvas.getContext("2d");
  const labels = dated.map(p => new Date(p.createdAt).toLocaleDateString());
  const costs = dated.map(p => p.estimatedCost);
  const actuals = dated.map(p => p.actualCost || null);

  new ChartJS(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "Estimated", data: costs, borderColor: "blue", fill: false },
        { label: "Actual", data: actuals, borderColor: "green", fill: false },
      ],
    },
    options: { responsive: false, plugins: { title: { display: true, text: "Cost Trend Over Time" } } }
  });

  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(chartPath, buffer);
  await message.reply({ content: "📈 Project Trend Report:", files: [chartPath] });
}
