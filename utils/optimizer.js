import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateTakeoff, loadUnitCosts } from "./takeoff.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const supplierPath = path.join(__dirname, "../data/suppliers.json");

// Load supplier data (manual or from API later)
function loadSuppliers() {
  if (!fs.existsSync(supplierPath)) return [];
  return JSON.parse(fs.readFileSync(supplierPath, "utf8"));
}

// Optimization: test alternative mixes for cost savings
export function optimizeProject(project) {
  const suppliers = loadSuppliers();
  const baseTakeoff = generateTakeoff(project);
  const materials = loadUnitCosts();

  // Example optimization: replace part of 2x4 lumber with 2x6 if cheaper
  const ratio = materials.lumber_2x6 < materials.lumber_2x4 ? 0.8 : 1.0;
  const optimizedCosts = {
    ...baseTakeoff.costs,
    lumber: baseTakeoff.costs.lumber * ratio,
    labor: baseTakeoff.costs.labor * 0.95, // assume 5% labor gain
  };

  const newTotal = Object.values(optimizedCosts).reduce((a, b) => a + b, 0);
  const savings = baseTakeoff.total - newTotal;

  return {
    baseTotal: baseTakeoff.total,
    optimizedTotal: newTotal,
    savings,
    optimizedCosts,
    suppliersUsed: suppliers.length ? suppliers.map((s) => s.name) : ["Default costs"],
  };
}

// Manual price refresh (can be automated)
export function refreshPrices(newPrices) {
  const filePath = path.join(__dirname, "../data/unit_costs.json");
  fs.writeFileSync(filePath, JSON.stringify(newPrices, null, 2), "utf8");
  return newPrices;
}
