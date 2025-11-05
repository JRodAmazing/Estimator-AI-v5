import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const costRefPath = path.join(__dirname, "../data/unit_costs.json");

// Basic cost library - UPDATED to match new unit_costs.json structure
const defaultCosts = {
  lumber_2x4: 3.50,
  lumber_2x6: 5.25,
  plywood: 32.00,
  connectors: 2.50,
  fasteners_lb: 2.80,
  labor_hr: 45.00,
};

export function loadUnitCosts() {
  try {
    if (!fs.existsSync(costRefPath)) {
      console.log('Unit costs file not found, using defaults');
      return defaultCosts;
    }
    
    const rawData = JSON.parse(fs.readFileSync(costRefPath, "utf8"));
    
    // Convert new structure to flat structure for compatibility
    const flatCosts = {
      lumber_2x4: rawData.lumber?.["2x4"] || defaultCosts.lumber_2x4,
      lumber_2x6: rawData.lumber?.["2x6"] || defaultCosts.lumber_2x6,
      plywood: rawData.plywood?.["1/2"] || defaultCosts.plywood,
      connectors: rawData.connectors?.["joist_hanger"] || defaultCosts.connectors,
      fasteners_lb: rawData.fasteners?.["16d_nails_lb"] || defaultCosts.fasteners_lb,
      labor_hr: rawData.labor?.["hourly_rate"] || defaultCosts.labor_hr,
    };
    
    return flatCosts;
  } catch (error) {
    console.error('Error loading unit costs:', error);
    return defaultCosts;
  }
}

// AI-like quantity generator
export function generateTakeoff(project) {
  try {
    const { stories = 1, buildingType = "office", estimatedCost = 0 } = project;
    const costBase = estimatedCost || 100000;
    
    // Parse stories - handle edge cases like "floor" or "truss"
    let floors = 1;
    if (typeof stories === 'number') {
      floors = stories;
    } else if (typeof stories === 'string') {
      const parsed = parseInt(stories);
      floors = isNaN(parsed) ? 1 : parsed;
    }
    
    const materials = loadUnitCosts();

    const totalSF = floors * 1500; // assume 1500 sf per story
    const lumberQty = totalSF * 1.2;
    const plywoodQty = totalSF * 0.3;
    const connectorsQty = totalSF * 0.15;
    const fastenersQty = totalSF * 0.05;
    const laborHrs = totalSF / 20;

    const costs = {
      lumber: Math.round(lumberQty * materials.lumber_2x4),
      plywood: Math.round(plywoodQty * materials.plywood),
      connectors: Math.round(connectorsQty * materials.connectors),
      fasteners: Math.round(fastenersQty * materials.fasteners_lb),
      labor: Math.round(laborHrs * materials.labor_hr),
    };

    const total = Object.values(costs).reduce((a, b) => a + b, 0);
    
    return { 
      projectId: project.id, 
      totalSF, 
      quantities: { 
        lumberQty: Math.round(lumberQty), 
        plywoodQty: Math.round(plywoodQty), 
        connectorsQty: Math.round(connectorsQty), 
        fastenersQty: Math.round(fastenersQty), 
        laborHrs: Math.round(laborHrs) 
      }, 
      costs, 
      total 
    };
  } catch (error) {
    console.error('Error in generateTakeoff:', error);
    
    // Return safe defaults on error
    return {
      projectId: project.id || 'unknown',
      totalSF: 0,
      quantities: {
        lumberQty: 0,
        plywoodQty: 0,
        connectorsQty: 0,
        fastenersQty: 0,
        laborHrs: 0
      },
      costs: {
        lumber: 0,
        plywood: 0,
        connectors: 0,
        fasteners: 0,
        labor: 0
      },
      total: 0
    };
  }
}