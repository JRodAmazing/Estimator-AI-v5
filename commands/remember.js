import { remember } from "../utils/memory.js";

export const name = "remember";
export async function execute(message, args) {
  if (args.length < 2)
    return message.reply("Usage: `!remember key value`");
  const [key, ...rest] = args;
  const value = rest.join(" ");
  remember(message.author.id, key, value);
  message.reply(`💾 Remembered: **${key} = ${value}**`);
}
