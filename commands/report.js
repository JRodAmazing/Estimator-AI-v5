import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const learningPath = path.join(__dirname, "../data/learning.json");
const projectPath = path.join(__dirname, "../data/projects.json");

export const name = "report";
export async function execute(message) {
  if (!fs.existsSync(projectPath))
    return message.reply("📂 No project data found yet.");

  const projects = JSON.parse(fs.readFileSync(projectPath, "utf8")).projects || [];
  const learning = fs.existsSync(learningPath)
    ? JSON.parse(fs.readFileSync(learningPath, "utf8"))
    : { adjustments: {} };

  const total = projects.length;
  const withActual = projects.filter((p) => p.actualCost).length;

  let summary = `📊 **Estimator Learning Report**\n\n`;
  summary += `🧱 Projects stored: **${total}**\n`;
  summary += `✅ Projects with actual costs: **${withActual}**\n\n`;

  if (Object.keys(learning.adjustments).length) {
    summary += `📈 **Adjustment Factors (Learned)**:\n`;
    for (const [key, value] of Object.entries(learning.adjustments)) {
      summary += `• ${key}: factor=${value.factor.toFixed(2)}, samples=${value.samples}\n`;
    }
  } else {
    summary += `🤖 No learning adjustments yet. Run \`!actual\` on projects to teach the model.\n`;
  }

  // Optional: accuracy report if both estimated and actual exist
  const diffs = projects
    .filter((p) => p.actualCost && p.estimatedCost)
    .map((p) => Math.abs(p.actualCost - p.estimatedCost) / p.actualCost);
  if (diffs.length) {
    const avgError = (diffs.reduce((a, b) => a + b, 0) / diffs.length) * 100;
    summary += `\n🎯 **Average Estimation Error:** ${avgError.toFixed(1)}%\n`;
  }

  message.reply(summary);
}
