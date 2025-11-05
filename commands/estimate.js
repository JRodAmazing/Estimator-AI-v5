export const name = "estimate";
export async function execute(message, args) {
  const [span = 60, location = "Dallas"] = args;
  const est = 10000 + Math.floor(Math.random() * 200000);
  message.reply(`📏 Estimated cost for ${span}ft span in ${location}: $${est.toLocaleString()}.`);
}
