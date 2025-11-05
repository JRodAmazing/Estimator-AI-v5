// commands/projects.js
import fs from "fs-extra";

export default {
  name: "projects",
  description: "List all stored projects with basic info.",
  async execute(message) {
    try {
      const data = await fs.readJson("./data/projects.json").catch(() => ({ projects: [] }));
      const projects = Array.isArray(data.projects) ? data.projects : [];

      if (!projects.length) {
        return message.reply("No projects found.");
      }

      const list = projects
        .slice(-10)
        .map((p) => {
          const id = p.id || "Unknown ID";
          const loc = p.location || "N/A";
          const type = p.buildingType || "N/A";
          const cost = p.estimatedCost
            ? `$${Number(p.estimatedCost).toLocaleString()}`
            : "N/A";
          return `• **${id}** — ${loc}, ${type}, ${cost}`;
        })
        .join("\n");

      await message.reply(`📋 **Recent Projects:**\n${list}`);
    } catch (err) {
      console.error("[PROJECTS CMD ERROR]", err);
      await message.reply("❌ Failed to load project list.");
    }
  },
};
