// commands/checkcommands.js
import fs from "fs-extra";
import path from "path";

export default {
  name: "checkcommands",
  description: "List all command files and show which ones are active or invalid.",
  async execute(message) {
    try {
      const commandsDir = "./commands";
      const files = await fs.readdir(commandsDir);
      const results = [];

      for (const file of files) {
        if (!file.endsWith(".js")) continue;
        const filePath = path.join(commandsDir, file);

        try {
          const mod = await import(`../commands/${file}`);
          if (mod.default && mod.default.name && mod.default.execute) {
            results.push(`✅ ${file} → **${mod.default.name}**`);
          } else {
            results.push(`⚠️ ${file} → missing export default or execute()`);
          }
        } catch (err) {
          results.push(`❌ ${file} → ${err.message}`);
        }
      }

      const report = results.join("\n");
      const total = results.length;

      await message.reply({
        content: `🧩 **Command Check Report** (${total} files scanned)\n${report}`,
      });
    } catch (err) {
      console.error("[CHECK COMMANDS ERROR]", err);
      message.reply("❌ Failed to check commands.");
    }
  },
};
