import { refreshPrices } from "../utils/optimizer.js";

export const name = "refresh_prices";
export async function execute(message, args) {
  if (args.length < 2)
    return message.reply("Usage: `!refresh_prices material=value material=value ...`");

  const newPrices = {};
  args.forEach((pair) => {
    const [k, v] = pair.split("=");
    newPrices[k] = parseFloat(v);
  });

  const updated = refreshPrices(newPrices);
  message.reply(`🔄 Unit prices updated:\n${Object.entries(updated)
    .map(([k, v]) => `• ${k}: $${v}`)
    .join("\n")}`);
}
