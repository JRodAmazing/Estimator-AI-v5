// modules/scheduler.js
import { fetchSupplierData } from "./supplierSync.js";
import { updateModelFromSuppliers } from "./learning.js";

export async function startAutoSync(intervalHours = 12) {
  console.log(`[AUTO-SYNC] Running every ${intervalHours}h`);

  const runOnce = async () => {
    const data = await fetchSupplierData();
    if (data) await updateModelFromSuppliers(data);
  };

  await runOnce(); // run immediately on startup
  setInterval(runOnce, intervalHours * 3600 * 1000);
}
