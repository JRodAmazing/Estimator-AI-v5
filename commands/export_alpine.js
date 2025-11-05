import { exportAlpine } from "../utils/alpine.js";
import { listProjects } from "../utils/store.js";
import path from "path";

export const name = "export_alpine";
export async function execute(message, args) {
  if (!args.length) return message.reply("Usage: `!export_alpine <project_id>`");
  const [id] = args;
  const projects = listProjects(100);
  const project = projects.find(p => p.id === id);
  if (!project) return message.reply(`❌ Project not found: ${id}`);

  const filePath = await exportAlpine(project);
  await message.reply({
    content: `📤 Exported Alpine file for **${id}**`,
    files: [filePath]
  });
}
