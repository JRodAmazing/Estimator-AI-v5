// commands/revise.js
import fs from "fs-extra";

export default {
  name: "revise",
  description: "Add a revision note to a project record.",
  async execute(message, args) {
    if (args.length < 2)
      return message.reply("Usage: `!revise <project_id> <note>`");

    const [projectId, ...noteParts] = args;
    const note = noteParts.join(" ");
    const data = await fs.readJson("./data/projects.json").catch(() => ({ projects: [] }));
    const project = data.projects.find((p) => p.id === projectId);
    if (!project) return message.reply(`❌ Project not found: ${projectId}`);

    if (!Array.isArray(project.modifications)) project.modifications = [];
    project.modifications.push({
      description: note,
      timestamp: new Date().toISOString(),
    });

    await fs.writeJson("./data/projects.json", data, { spaces: 2 });
    await message.reply(`📝 Revision added to ${projectId}: "${note}"`);
  },
};
