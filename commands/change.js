import { applyChange, getHistory } from "../utils/changeManager.js";
import fs from 'fs-extra';

export const name = "change";
export async function execute(message, args) {
  if (args.length < 2)
    return message.reply("Usage: `!change <project_id> field=value` OR `!change <project_id> [description]`");
  
  const [id, ...rest] = args;
  
  // Check if this is a key=value format or a text description
  const hasKeyValue = rest.some(arg => arg.includes('='));
  
  if (hasKeyValue) {
    // Original key=value format
    const updates = {};
    rest.forEach(f => {
      if (f.includes('=')) {
        const [k, v] = f.split("=");
        updates[k] = isNaN(v) ? v : Number(v);
      }
    });
    
    const result = applyChange(id, updates);
    if (!result) return message.reply(`❌ Project not found: ${id}`);
    
    message.reply(
      `🔧 **Change Order Applied to ${id}**\n` +
      Object.entries(updates).map(([k, v]) => `• ${k} → ${v}`).join("\n") +
      `\n💰 New estimated total: $${result.estimatedCost.toLocaleString()}`
    );
  } else {
    // Text description format - add as modification
    const description = rest.join(" ");
    
    try {
      const projectsPath = './data/projects.json';
      const projectsData = await fs.readJson(projectsPath);
      
      const project = projectsData.projects.find(p => p.id === id);
      if (!project) return message.reply(`❌ Project not found: ${id}`);
      
      if (!project.modifications) {
        project.modifications = [];
      }
      
      project.modifications.push({
        description: description,
        timestamp: new Date().toISOString()
      });
      
      await fs.writeJson(projectsPath, projectsData, { spaces: 2 });
      
      message.reply(
        `✅ **Change Order Added to ${id}**\n` +
        `📝 "${description}"\n\n` +
        `💰 Current total: $${project.estimatedCost?.toLocaleString() || 'N/A'}`
      );
    } catch (error) {
      console.error('Error applying change:', error);
      message.reply('❌ Error applying change order.');
    }
  }
}