
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const costFile = path.join(__dirname, "../data/unit_costs.json");
const supplierFile = path.join(__dirname, "../data/suppliers.json");

function loadUnitCosts() {
  if (!fs.existsSync(costFile)) return {};
  return JSON.parse(fs.readFileSync(costFile, "utf8"));
}

function saveUnitCosts(costs) {
  fs.writeFileSync(costFile, JSON.stringify(costs, null, 2), "utf8");
}

// Apply regional price factors
function regionalAdjustment(costs, region = "TX") {
  const regionFactors = { TX: 1.0, CA: 1.25, OR: 1.1, WA: 1.15, NY: 1.3 };
  const factor = regionFactors[region.toUpperCase()] || 1.0;
  const adjusted = {};
  for (const [k, v] of Object.entries(costs)) adjusted[k] = v * factor;
  return adjusted;
}

// Merge supplier feed with existing costs
export async function syncSupplierPrices(region = "TX") {
  const base = loadUnitCosts();
  let supplierCosts = {};

  if (fs.existsSync(supplierFile)) {
    supplierCosts = JSON.parse(fs.readFileSync(supplierFile, "utf8"));
  } else {
    try {
      // Example public-demo endpoint (replace later with live API)
      const resp = await fetch("https://raw.githubusercontent.com/openai-sample/ai-pricing/main/demo-prices.json");
      if (resp.ok) supplierCosts = await resp.json();
    } catch (err) {
      console.warn("⚠️  Could not reach supplier API. Using local costs only.");
    }
  }

  const merged = { ...base, ...supplierCosts };
  const adjusted = regionalAdjustment(merged, region);
  saveUnitCosts(adjusted);
  return adjusted;
}
