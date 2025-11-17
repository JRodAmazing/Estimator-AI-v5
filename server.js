import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import Anthropic from '@anthropic-ai/sdk';
import PDFDocument from 'pdfkit';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Anthropic client (optional - will use demo mode if not set)
const DEMO_MODE = !process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === 'sk-ant-your-api-key-here';
const anthropic = DEMO_MODE ? null : new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

if (DEMO_MODE) {
  console.log('⚠️  Running in DEMO MODE - AI features disabled');
  console.log('💡 Add your Anthropic API key to .env to enable AI features');
}

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// In-memory storage for sessions (in production, use Redis or database)
const sessions = new Map();

// Construction cost database (simplified - expand as needed)
const constructionData = {
  labor: {
    excavation: { rate: 45, unit: 'hour' },
    concrete_work: { rate: 55, unit: 'hour' },
    plumbing: { rate: 65, unit: 'hour' },
    electrical: { rate: 70, unit: 'hour' },
    finishing: { rate: 50, unit: 'hour' },
    general_labor: { rate: 35, unit: 'hour' }
  },
  materials: {
    concrete: { price: 150, unit: 'cubic yard', supplier: 'Local Ready-Mix' },
    rebar: { price: 0.85, unit: 'pound', supplier: 'Steel Supply Co' },
    pool_liner: { price: 4.50, unit: 'sqft', supplier: 'Pool Supplies Inc' },
    pool_pump: { price: 1200, unit: 'unit', supplier: 'Aqua Equipment' },
    filter_system: { price: 800, unit: 'unit', supplier: 'Aqua Equipment' },
    plumbing_fixtures: { price: 25, unit: 'unit', supplier: 'Plumbing Depot' },
    pool_tile: { price: 12, unit: 'sqft', supplier: 'Tile World' },
    coping: { price: 18, unit: 'linear foot', supplier: 'Stone & Tile' },
    deck_material: { price: 8, unit: 'sqft', supplier: 'Deck Supply' }
  },
  equipment: {
    excavator: { price: 350, unit: 'day', supplier: 'Equipment Rental Co' },
    concrete_mixer: { price: 150, unit: 'day', supplier: 'Equipment Rental Co' },
    compactor: { price: 80, unit: 'day', supplier: 'Equipment Rental Co' },
    concrete_pump: { price: 400, unit: 'day', supplier: 'Specialty Pumps' }
  },
  permits: {
    building_permit: { price: 500, timeline: '2-4 weeks' },
    electrical_permit: { price: 150, timeline: '1 week' },
    plumbing_permit: { price: 125, timeline: '1 week' },
    pool_permit: { price: 300, timeline: '2-3 weeks' }
  }
};

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are a professional construction estimator assistant specializing in pool construction and general contracting.

Your role is to:
1. Gather necessary information about the project through natural conversation
2. Ask clarifying questions about project specifications
3. Provide detailed cost estimates with breakdowns

For pool projects, you typically need to know:
- Pool size (length, width, depth or total square footage)
- Pool type (in-ground concrete, fiberglass, vinyl liner)
- Location/region (affects permit costs and labor rates)
- Additional features (heating, lighting, decking, landscaping)
- Timeline requirements
- Any special requirements or site conditions

When you have enough information, summarize the project details in a structured format.

Be conversational but professional. Ask one or two questions at a time to avoid overwhelming the user.`;

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: 'Session ID required' });
    }

    // Get or create session
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, {
        messages: [],
        projectData: {}
      });
    }

    const session = sessions.get(sessionId);

    // Add user message to history
    session.messages.push({
      role: 'user',
      content: message
    });

    // Call Claude API or use demo responses
    let assistantMessage;

    if (DEMO_MODE) {
      // Demo mode - provide helpful responses without AI
      if (session.messages.length === 1) {
        assistantMessage = "I'd be happy to help with your estimate! To give you the most accurate quote, I'll need a few details:\n\n1. What's the size of your pool? (You mentioned 600 sqft - is that correct?)\n2. What type of pool are you looking for? (Concrete, fiberglass, or vinyl liner)\n3. What's your location?\n4. Any special features? (Heating, lighting, spa, waterfalls, etc.)\n\nJust share these details and I'll generate a comprehensive estimate for you!";
      } else if (session.messages.length === 3) {
        assistantMessage = "Perfect! Based on what you've told me, I have enough information to create a detailed estimate. Click the 'Generate Full Estimate' button below to see:\n\n• Complete labor breakdown\n• Materials list with suppliers\n• Equipment rental needs\n• Required permits\n• Project timeline\n• And more!\n\n*Note: Currently running in demo mode. Add your Anthropic API key for AI-powered conversations.*";
      } else {
        assistantMessage = "Got it! Feel free to share more details or click 'Generate Full Estimate' when you're ready to see the full breakdown.";
      }
    } else {
      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: session.messages
      });

      assistantMessage = response.content[0].text;
    }

    // Add assistant response to history
    session.messages.push({
      role: 'assistant',
      content: assistantMessage
    });

    res.json({
      response: assistantMessage,
      canGenerateEstimate: session.messages.length > 4 // Allow estimate after some conversation
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// Generate estimate endpoint
app.post('/api/generate-estimate', async (req, res) => {
  try {
    const { sessionId, projectDetails } = req.body;

    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(400).json({ error: 'Invalid session' });
    }

    const session = sessions.get(sessionId);

    // Use AI to extract structured data from conversation, or use defaults in demo mode
    let projectData;

    if (DEMO_MODE) {
      // In demo mode, extract basic info from messages or use defaults
      const conversationText = session.messages.map(m => m.content).join(' ').toLowerCase();

      const sizeMatch = conversationText.match(/(\d+)\s*(?:sq\s*ft|sqft|square\s*feet)/i);
      const sqft = sizeMatch ? parseInt(sizeMatch[1]) : 600;

      let poolType = 'concrete';
      if (conversationText.includes('fiberglass')) poolType = 'fiberglass';
      else if (conversationText.includes('vinyl')) poolType = 'vinyl';

      let location = 'Dallas';
      const cities = ['dallas', 'houston', 'austin', 'miami', 'phoenix', 'los angeles', 'atlanta'];
      for (const city of cities) {
        if (conversationText.includes(city)) {
          location = city.charAt(0).toUpperCase() + city.slice(1);
          break;
        }
      }

      const features = [];
      if (conversationText.includes('heat')) features.push('heating');
      if (conversationText.includes('light')) features.push('lighting');
      if (conversationText.includes('spa')) features.push('spa');

      projectData = {
        projectType: 'Pool Construction',
        size: { sqft, length: Math.sqrt(sqft * 2), width: Math.sqrt(sqft / 2), depth: 6 },
        poolType,
        location,
        features,
        timeline: '8-12 weeks',
        specialRequirements: []
      };
    } else {
      const extractionPrompt = `Based on the conversation history, extract the following project details in JSON format:
{
  "projectType": "pool construction",
  "size": { "sqft": number, "length": number, "width": number, "depth": number },
  "poolType": "concrete/fiberglass/vinyl",
  "location": "city/region",
  "features": ["feature1", "feature2"],
  "timeline": "weeks or months",
  "specialRequirements": []
}

If any information is missing or unclear, use reasonable assumptions for a standard project.`;

      const extraction = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          ...session.messages,
          { role: 'user', content: extractionPrompt }
        ]
      });

      try {
        const extractedText = extraction.content[0].text;
        const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
        projectData = jsonMatch ? JSON.parse(jsonMatch[0]) : projectDetails;
      } catch (e) {
        projectData = projectDetails || { size: { sqft: 600 }, poolType: 'concrete', location: 'Dallas' };
      }
    }

    // Calculate estimate
    const estimate = calculateEstimate(projectData);

    res.json({
      estimate,
      projectData
    });

  } catch (error) {
    console.error('Estimate generation error:', error);
    res.status(500).json({ error: 'Failed to generate estimate' });
  }
});

// Generate PDF endpoint
app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { estimate, projectData } = req.body;

    const pdfPath = path.join(__dirname, 'reports', `estimate_${Date.now()}.pdf`);

    // Ensure reports directory exists
    if (!fs.existsSync(path.join(__dirname, 'reports'))) {
      fs.mkdirSync(path.join(__dirname, 'reports'));
    }

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(pdfPath);

    doc.pipe(stream);

    // Header
    doc.fontSize(24).text('Construction Estimate Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Project Details
    doc.fontSize(16).text('Project Details', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Project Type: ${projectData.projectType || 'Pool Construction'}`);
    doc.text(`Size: ${projectData.size?.sqft || 'N/A'} sq ft`);
    doc.text(`Type: ${projectData.poolType || 'N/A'}`);
    doc.text(`Location: ${projectData.location || 'N/A'}`);
    doc.moveDown(2);

    // Cost Summary
    doc.fontSize(16).text('Cost Summary', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(14);
    doc.text(`Total Estimate: $${estimate.total.toLocaleString()}`, { bold: true });
    doc.moveDown(1);

    // Labor Breakdown
    doc.fontSize(14).text('Labor Breakdown', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    Object.entries(estimate.labor).forEach(([task, details]) => {
      doc.text(`${task.replace(/_/g, ' ').toUpperCase()}: ${details.hours} hrs @ $${details.rate}/hr = $${details.cost.toLocaleString()}`);
    });
    doc.text(`Subtotal: $${estimate.laborTotal.toLocaleString()}`, { bold: true });
    doc.moveDown(1);

    // Materials Breakdown
    doc.fontSize(14).text('Materials Breakdown', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    Object.entries(estimate.materials).forEach(([item, details]) => {
      doc.text(`${item.replace(/_/g, ' ').toUpperCase()}: ${details.quantity} ${details.unit} @ $${details.unitPrice} = $${details.cost.toLocaleString()}`);
      doc.fontSize(9).fillColor('#666').text(`  Supplier: ${details.supplier}`, { indent: 20 });
      doc.fillColor('#000').fontSize(11);
    });
    doc.text(`Subtotal: $${estimate.materialsTotal.toLocaleString()}`, { bold: true });
    doc.moveDown(1);

    // Equipment Rental
    if (estimate.equipment && Object.keys(estimate.equipment).length > 0) {
      doc.fontSize(14).text('Equipment Rental', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(11);
      Object.entries(estimate.equipment).forEach(([item, details]) => {
        doc.text(`${item.replace(/_/g, ' ').toUpperCase()}: ${details.days} days @ $${details.dailyRate} = $${details.cost.toLocaleString()}`);
        doc.fontSize(9).fillColor('#666').text(`  Supplier: ${details.supplier}`, { indent: 20 });
        doc.fillColor('#000').fontSize(11);
      });
      doc.text(`Subtotal: $${estimate.equipmentTotal.toLocaleString()}`, { bold: true });
      doc.moveDown(1);
    }

    // Permits & Compliance
    doc.fontSize(14).text('Permits & Compliance', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    Object.entries(estimate.permits).forEach(([permit, details]) => {
      doc.text(`${permit.replace(/_/g, ' ').toUpperCase()}: $${details.cost.toLocaleString()} (Timeline: ${details.timeline})`);
    });
    doc.text(`Subtotal: $${estimate.permitsTotal.toLocaleString()}`, { bold: true });
    doc.moveDown(1);

    // Timeline
    doc.addPage();
    doc.fontSize(16).text('Project Timeline', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    doc.text(`Estimated Duration: ${estimate.timeline.total}`);
    doc.moveDown(0.5);
    estimate.timeline.phases.forEach(phase => {
      doc.text(`• ${phase.name}: ${phase.duration}`);
    });
    doc.moveDown(2);

    // Inventory Needed
    doc.fontSize(16).text('Inventory Requirements', { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11);
    estimate.inventory.forEach(item => {
      doc.text(`• ${item.name}: ${item.quantity} ${item.unit}`);
    });

    // Footer
    doc.fontSize(9).fillColor('#666');
    doc.text('This estimate is valid for 30 days and subject to change based on material costs and site conditions.',
      50, doc.page.height - 100, { align: 'center', width: doc.page.width - 100 });

    doc.end();

    stream.on('finish', () => {
      res.download(pdfPath, 'construction_estimate.pdf', (err) => {
        if (err) {
          console.error('Download error:', err);
        }
        // Clean up file after download
        setTimeout(() => {
          if (fs.existsSync(pdfPath)) {
            fs.unlinkSync(pdfPath);
          }
        }, 60000); // Delete after 1 minute
      });
    });

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Check inventory endpoint
app.post('/api/check-inventory', async (req, res) => {
  try {
    const { items } = req.body;

    // Simulate inventory check (in production, connect to actual inventory system)
    const inventoryStatus = items.map(item => ({
      ...item,
      inStock: Math.random() > 0.3, // 70% chance in stock
      availableQuantity: Math.floor(Math.random() * 1000),
      leadTime: Math.random() > 0.5 ? 'In stock' : '3-5 business days'
    }));

    res.json({ inventory: inventoryStatus });
  } catch (error) {
    console.error('Inventory check error:', error);
    res.status(500).json({ error: 'Failed to check inventory' });
  }
});

// Helper function to calculate estimate
function calculateEstimate(projectData) {
  const sqft = projectData.size?.sqft || 600;
  const poolType = projectData.poolType || 'concrete';

  // Labor calculations
  const labor = {
    excavation: {
      hours: Math.ceil(sqft / 50),
      rate: constructionData.labor.excavation.rate,
      cost: 0
    },
    concrete_work: {
      hours: Math.ceil(sqft / 30),
      rate: constructionData.labor.concrete_work.rate,
      cost: 0
    },
    plumbing: {
      hours: Math.ceil(sqft / 100) + 16,
      rate: constructionData.labor.plumbing.rate,
      cost: 0
    },
    electrical: {
      hours: 12,
      rate: constructionData.labor.electrical.rate,
      cost: 0
    },
    finishing: {
      hours: Math.ceil(sqft / 40),
      rate: constructionData.labor.finishing.rate,
      cost: 0
    }
  };

  let laborTotal = 0;
  Object.keys(labor).forEach(task => {
    labor[task].cost = labor[task].hours * labor[task].rate;
    laborTotal += labor[task].cost;
  });

  // Materials calculations
  const materials = {
    concrete: {
      quantity: Math.ceil(sqft / 80),
      unit: 'cubic yards',
      unitPrice: constructionData.materials.concrete.price,
      supplier: constructionData.materials.concrete.supplier,
      cost: 0
    },
    rebar: {
      quantity: Math.ceil(sqft * 2),
      unit: 'lbs',
      unitPrice: constructionData.materials.rebar.price,
      supplier: constructionData.materials.rebar.supplier,
      cost: 0
    },
    pool_liner: {
      quantity: sqft,
      unit: 'sqft',
      unitPrice: constructionData.materials.pool_liner.price,
      supplier: constructionData.materials.pool_liner.supplier,
      cost: 0
    },
    pool_pump: {
      quantity: 1,
      unit: 'unit',
      unitPrice: constructionData.materials.pool_pump.price,
      supplier: constructionData.materials.pool_pump.supplier,
      cost: 0
    },
    filter_system: {
      quantity: 1,
      unit: 'unit',
      unitPrice: constructionData.materials.filter_system.price,
      supplier: constructionData.materials.filter_system.supplier,
      cost: 0
    },
    pool_tile: {
      quantity: Math.ceil(sqft * 0.3),
      unit: 'sqft',
      unitPrice: constructionData.materials.pool_tile.price,
      supplier: constructionData.materials.pool_tile.supplier,
      cost: 0
    }
  };

  let materialsTotal = 0;
  Object.keys(materials).forEach(item => {
    materials[item].cost = materials[item].quantity * materials[item].unitPrice;
    materialsTotal += materials[item].cost;
  });

  // Equipment rental
  const equipment = {
    excavator: {
      days: Math.ceil(labor.excavation.hours / 8),
      dailyRate: constructionData.equipment.excavator.price,
      supplier: constructionData.equipment.excavator.supplier,
      cost: 0
    },
    concrete_pump: {
      days: Math.ceil(labor.concrete_work.hours / 8),
      dailyRate: constructionData.equipment.concrete_pump.price,
      supplier: constructionData.equipment.concrete_pump.supplier,
      cost: 0
    },
    compactor: {
      days: 3,
      dailyRate: constructionData.equipment.compactor.price,
      supplier: constructionData.equipment.compactor.supplier,
      cost: 0
    }
  };

  let equipmentTotal = 0;
  Object.keys(equipment).forEach(item => {
    equipment[item].cost = equipment[item].days * equipment[item].dailyRate;
    equipmentTotal += equipment[item].cost;
  });

  // Permits
  const permits = {
    building_permit: {
      cost: constructionData.permits.building_permit.price,
      timeline: constructionData.permits.building_permit.timeline
    },
    pool_permit: {
      cost: constructionData.permits.pool_permit.price,
      timeline: constructionData.permits.pool_permit.timeline
    },
    plumbing_permit: {
      cost: constructionData.permits.plumbing_permit.price,
      timeline: constructionData.permits.plumbing_permit.timeline
    },
    electrical_permit: {
      cost: constructionData.permits.electrical_permit.price,
      timeline: constructionData.permits.electrical_permit.timeline
    }
  };

  const permitsTotal = Object.values(permits).reduce((sum, permit) => sum + permit.cost, 0);

  // Timeline
  const totalWorkDays = Math.ceil(Object.values(labor).reduce((sum, l) => sum + l.hours, 0) / 8);
  const timeline = {
    total: `${Math.ceil(totalWorkDays / 5)} weeks`,
    phases: [
      { name: 'Permits & Planning', duration: '2-4 weeks' },
      { name: 'Excavation', duration: `${Math.ceil(labor.excavation.hours / 8)} days` },
      { name: 'Structural Work', duration: `${Math.ceil(labor.concrete_work.hours / 8)} days` },
      { name: 'Plumbing & Electrical', duration: `${Math.ceil((labor.plumbing.hours + labor.electrical.hours) / 8)} days` },
      { name: 'Finishing & Inspection', duration: `${Math.ceil(labor.finishing.hours / 8)} days` }
    ]
  };

  // Inventory list
  const inventory = Object.entries(materials).map(([name, details]) => ({
    name: name.replace(/_/g, ' ').toUpperCase(),
    quantity: details.quantity,
    unit: details.unit
  }));

  const total = laborTotal + materialsTotal + equipmentTotal + permitsTotal + (laborTotal * 0.15); // 15% overhead

  return {
    labor,
    laborTotal,
    materials,
    materialsTotal,
    equipment,
    equipmentTotal,
    permits,
    permitsTotal,
    timeline,
    inventory,
    overhead: laborTotal * 0.15,
    total: Math.round(total)
  };
}

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Estimator Web App running on http://localhost:${PORT}`);
  console.log(`📱 Access from your phone using your computer's IP address: http://[YOUR_IP]:${PORT}`);
  console.log(`\n💡 To find your IP address:`);
  console.log(`   Windows: Run 'ipconfig' in terminal`);
  console.log(`   Mac/Linux: Run 'ifconfig' or 'ip addr' in terminal`);
});
