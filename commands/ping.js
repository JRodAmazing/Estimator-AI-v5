export default {
  name: "ping",
  description: "Check if the bot is alive",
  async execute(message) {
    await message.reply("Pong 🏓");
  },
};
