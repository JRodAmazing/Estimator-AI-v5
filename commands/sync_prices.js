import { syncSupplierPrices } from "../utils/supplierSync.js";

export const name = "sync_prices";
export async function execute(message, args) {
  const region = args[0] || "TX";
  message.reply(`🔄 Syncing supplier prices for region ${region.toUpperCase()}...`);
  const updated = await syncSupplierPrices(region);
  message.reply(
    `✅ Prices updated (${Object.keys(updated).length} materials):\n` +
    Object.entries(updated)
      .slice(0, 8)
      .map(([k, v]) => `• ${k}: $${v.toFixed(2)}`)
      .join("\n") +
    (Object.keys(updated).length > 8 ? "\n..." : "")
  );
}
