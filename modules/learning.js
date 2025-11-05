import fs from "fs-extra";
const MODEL_PATH = "./data/model_weights.json";

export async function updateModelFromSuppliers(suppliers) {
  const current = await fs.readJson(MODEL_PATH).catch(() => ({}));

  for (const item of suppliers) {
    const { material, avgPrice } = item;
    if (typeof avgPrice !== "number") continue;
    current[material] = current[material]
      ? (current[material] * 0.8 + avgPrice * 0.2)
      : avgPrice;
  }

  await fs.writeJson(MODEL_PATH, current, { spaces: 2 });
  console.log("[LEARNING] Model weights updated from suppliers.");
}
