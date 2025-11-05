// commands/chat.js
import fs from 'fs-extra';
import path from 'path';

export const name = "chat";

export async function execute(message, args) {
  const userInput = args.join(" ");
  
  if (!userInput) {
    return message.reply("💬 Please provide a message. Example: `!chat optimize my last project`");
  }

  try {
    // Load projects
    const projectsPath = './data/projects.json';
    let projectsData = { projects: [] };
    
    if (await fs.pathExists(projectsPath)) {
      projectsData = await fs.readJson(projectsPath);
    }

    // Load unit costs
    const costsPath = './data/unit_costs.json';
    let unitCosts = {};
    
    if (await fs.pathExists(costsPath)) {
      unitCosts = await fs.readJson(costsPath);
    }

    // Load preferences
    const prefsPath = './data/preferences.json';
    let prefs = {};
    
    if (await fs.pathExists(prefsPath)) {
      prefs = await fs.readJson(prefsPath);
    }

    const region = prefs.region || "TX";
    
    // Get last project
    const lastProject = projectsData.projects && projectsData.projects.length > 0
      ? projectsData.projects[projectsData.projects.length - 1]
      : null;

    // Handle different chat intents
    if (userInput.toLowerCase().includes("optimize")) {
      if (!lastProject) {
        return message.reply("❌ No project found to optimize. Create a project first with `!design` or `!estimate`");
      }

      // Calculate optimization
      const baseCost = lastProject.cost || 0;
      
      if (baseCost === 0 || isNaN(baseCost)) {
        return message.reply("❌ Project has invalid cost data. Please recreate the project.");
      }

      const regionalMultiplier = unitCosts.regional_multipliers?.[region] || 1.0;
      const optimizationSavings = baseCost * 0.08; // 8% optimization savings
      const optimizedCost = baseCost - optimizationSavings;

      // Update project with optimized cost
      lastProject.optimized_cost = optimizedCost;
      lastProject.savings = optimizationSavings;
      
      await fs.writeJson(projectsPath, projectsData, { spaces: 2 });

      return message.reply(
        `✅ **Optimization Analysis** for project in ${region}:\n` +
        `• Base cost: $${baseCost.toLocaleString()}\n` +
        `• Optimized: $${optimizedCost.toLocaleString()}\n` +
        `• Savings: $${optimizationSavings.toLocaleString()} (8%)\n` +
        `• Regional multiplier: ${regionalMultiplier}x`
      );
    }
    
    if (userInput.toLowerCase().includes("add") || userInput.toLowerCase().includes("include")) {
      if (!lastProject) {
        return message.reply("❌ No project found. Create a project first with `!design` or `!estimate`");
      }

      // Add feature/modification to project notes
      if (!lastProject.modifications) {
        lastProject.modifications = [];
      }
      
      lastProject.modifications.push({
        description: userInput,
        timestamp: new Date().toISOString()
      });

      await fs.writeJson(projectsPath, projectsData, { spaces: 2 });

      return message.reply(
        `✅ **Modification Added** to ${lastProject.id}:\n` +
        `📝 "${userInput}"\n\n` +
        `Use \`!breakdown ${lastProject.id}\` to see updated costs.`
      );
    }

    if (userInput.toLowerCase().includes("compare")) {
      if (projectsData.projects.length < 2) {
        return message.reply("❌ Need at least 2 projects to compare. Create more projects first.");
      }

      const recentProjects = projectsData.projects.slice(-3);
      let comparison = "📊 **Project Comparison:**\n\n";
      
      recentProjects.forEach((proj, idx) => {
        const cost = proj.cost || 0;
        comparison += `${idx + 1}. ${proj.id}\n`;
        comparison += `   Type: ${proj.type || 'N/A'} | Cost: $${cost.toLocaleString()}\n`;
        comparison += `   Location: ${proj.location || 'N/A'}\n\n`;
      });

      return message.reply(comparison);
    }

    // Default AI response
    return message.reply(
      `🤖 **AI Assistant Response:**\n\n` +
      `I understand you want to: "${userInput}"\n\n` +
      `**Available AI commands:**\n` +
      `• \`!chat optimize\` - Optimize your last project\n` +
      `• \`!chat add [feature]\` - Add modifications\n` +
      `• \`!chat compare\` - Compare recent projects\n\n` +
      `For general help, use \`!help\``
    );

  } catch (error) {
    console.error("Error in chat command:", error);
    return message.reply("❌ Error processing chat request. Check console logs.");
  }
}