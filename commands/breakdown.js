import { listProjects } from "../utils/store.js";
import { generateTakeoff } from "../utils/takeoff.js";

export default {
  name: "breakdown",
  description: "Show a cost breakdown for a given project",
  async execute(message, args) {
    if (!args.length)
      return message.reply("Usage: `!breakdown <project_id>`");

    const [id] = args;
    const projects = listProjects(100);
    const project = projects.find((p) => p.id === id);

    if (!project)
      return message.reply(`❌ Project not found: ${id}`);

    const takeoff = generateTakeoff(project);
    const c = takeoff.costs;

    // Calculate total from all cost entries
    const total = Object.values(c).reduce(
      (sum, val) => sum + (val || 0),
      0
    );

    const lines = Object.entries(c)
      .map(
        ([k, v]) =>
          `• ${k}: $${(v || 0).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`
      )
      .join("\n");

    await message.reply(
      `📊 **Cost Breakdown for ${id}**\n${lines}\n\n**Total: $${total.toLocaleString()}**`
    );
  },
};
