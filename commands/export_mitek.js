import { exportMitek } from "../utils/mitek.js";
import { listProjects } from "../utils/store.js";
import path from "path";

export const name = "export_mitek";
export async function execute(message, args) {
  if (!args.length) return message.reply("Usage: `!export_mitek <project_id>`");
  const [id] = args;
  const projects = listProjects(100);
  const project = projects.find(p => p.id === id);
  if (!project) return message.reply(`❌ Project not found: ${id}`);

  const filePath = await exportMitek(project);
  await message.reply({
    content: `📤 Exported MiTek file for **${id}**`,
    files: [filePath]
  });
}
