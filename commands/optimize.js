import { listProjects } from "../utils/store.js";
import { optimizeProject } from "../utils/optimizer.js";

export const name = "optimize";
export async function execute(message, args) {
  if (!args.length) return message.reply("Usage: `!optimize <project_id>`");
  const [id] = args;
  const projects = listProjects(100);
  const project = projects.find((p) => p.id === id);
  if (!project) return message.reply(`❌ Project not found: ${id}`);

  const opt = optimizeProject(project);

  message.reply(
    `🧠 **Optimization Results for ${id}**\n` +
      `• Base total: $${opt.baseTotal.toLocaleString()}\n` +
      `• Optimized total: $${opt.optimizedTotal.toLocaleString()}\n` +
      `• 💸 Savings: $${opt.savings.toLocaleString()} (${((opt.savings / opt.baseTotal) * 100).toFixed(1)}%)\n` +
      `• Suppliers: ${opt.suppliersUsed.join(", ")}`
  );
}
