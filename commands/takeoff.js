import { listProjects } from "../utils/store.js";
import { generateTakeoff } from "../utils/takeoff.js";

export const name = "takeoff";
export async function execute(message, args) {
  if (!args.length) return message.reply("Usage: `!takeoff <project_id>`");
  const [id] = args;
  const projects = listProjects(100);
  const project = projects.find((p) => p.id === id);
  if (!project) return message.reply(`❌ Project not found: ${id}`);

  const takeoff = generateTakeoff(project);
  message.reply(
    `📦 **Material Takeoff for ${id}**\n` +
      `• Lumber: ${takeoff.quantities.lumberQty.toFixed(0)} lf\n` +
      `• Plywood: ${takeoff.quantities.plywoodQty.toFixed(0)} sf\n` +
      `• Connectors: ${takeoff.quantities.connectorsQty.toFixed(0)} ea\n` +
      `• Labor hrs: ${takeoff.quantities.laborHrs.toFixed(0)}\n` +
      `💰 **Estimated Total** $${takeoff.total.toLocaleString()}`
  );
}
