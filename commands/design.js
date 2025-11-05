import { addProject } from "../utils/store.js";
import { predict } from "../utils/estimator.js";

export const name = "design";
export async function execute(message, args) {
  if (args.length < 3)
    return message.reply("Usage: `!design [stories] [building_type] [location]`");

  const [stories, buildingType, location] = args;
  const estimatedCost = predict(buildingType, location);
  const id = `project_${Date.now()}`;
  const project = {
    id,
    stories,
    buildingType,
    location,
    estimatedCost,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  addProject(project);
  message.reply(
    `🏗️ Designed ${stories}-story ${buildingType} in ${location}.\n💰 Estimated cost: **$${estimatedCost.toLocaleString()}**\nSaved as **${id}**`
  );
}
