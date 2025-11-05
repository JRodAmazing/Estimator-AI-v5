// commands/generateprojects.js
import { generateMockProjects } from "../utils/mockProjects.js";

export default {
  name: "generateprojects",
  description: "Generate random sample projects for testing.",
  async execute(message, args) {
    const count = Number(args[0]) || 10;
    const projects = await generateMockProjects(count);
    await message.reply(`✅ Created ${projects.length} mock projects in data/projects.json`);
  },
};
