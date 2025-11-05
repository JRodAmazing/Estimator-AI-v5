import { syncSupplierPrices } from "./supplierSync.js";

export function scheduleAutoSync() {
  setInterval(async () => {
    console.log("⏰ Running daily supplier sync...");
    await syncSupplierPrices("TX");
  }, 24 * 60 * 60 * 1000); // every 24 h
}
