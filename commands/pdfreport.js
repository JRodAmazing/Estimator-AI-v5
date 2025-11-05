// commands/pdfreport.js
import fs from 'fs-extra';
import path from 'path';
import PDFDocument from 'pdfkit';

export default {
  name: 'pdfreport',
  description: 'Generate a professional PDF report of the last project',
  async execute(message, args) {
    await message.reply('📄 Generating professional PDF report...');

    try {
      // Ensure data directory exists
      const dataDir = './data';
      await fs.ensureDir(dataDir);

      // Load projects
      const projectsPath = path.join(dataDir, 'projects.json');
      
      if (!await fs.pathExists(projectsPath)) {
        return message.reply('❌ No projects found. Create a project first using !design or !estimate');
      }

      const projectsData = await fs.readJson(projectsPath);
      
      if (!projectsData.projects || projectsData.projects.length === 0) {
        return message.reply('❌ No projects found. Create a project first using !design or !estimate');
      }

      // Get the last project
      const lastProject = projectsData.projects[projectsData.projects.length - 1];

      // Ensure cost field exists (check both cost and estimatedCost)
      if (!lastProject.cost && lastProject.estimatedCost) {
        lastProject.cost = lastProject.estimatedCost;
      }

      // Generate PDF
      const reportPath = path.join(dataDir, `${lastProject.id}_report.pdf`);
      await generateProfessionalPDF(lastProject, reportPath);

      // Send the report as attachment
      await message.reply({
        content: `✅ **Professional PDF Report Generated**\n📊 Project: ${lastProject.id}\n💰 Total Cost: ${(lastProject.cost || lastProject.estimatedCost)?.toLocaleString() || 'N/A'}`,
        files: [{
          attachment: reportPath,
          name: `${lastProject.id}_EstimateReport.pdf`
        }]
      });

    } catch (error) {
      console.error('Error generating PDF report:', error);
      await message.reply('❌ Error generating PDF report. Check console logs.');
    }
  }
};

async function generateProfessionalPDF(project, outputPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ 
      size: 'LETTER',
      margins: { top: 50, bottom: 50, left: 50, right: 50 }
    });

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Header with company branding
    doc.fontSize(24)
       .fillColor('#1a365d')
       .text('ESTIMATOR AI', { align: 'center' });
    
    doc.fontSize(12)
       .fillColor('#4a5568')
       .text('Professional Construction Estimate Report', { align: 'center' });
    
    doc.moveDown(0.5);
    drawHorizontalLine(doc);
    doc.moveDown(1);

    // Project Information Box
    doc.fontSize(16)
       .fillColor('#2d3748')
       .text('PROJECT INFORMATION', { underline: true });
    doc.moveDown(0.5);

    const projectDate = new Date(parseInt(project.id.split('_')[1]));
    
    doc.fontSize(11)
       .fillColor('#000000');
    
    addKeyValue(doc, 'Project ID:', project.id);
    addKeyValue(doc, 'Date Generated:', projectDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
    addKeyValue(doc, 'Building Type:', capitalizeWords(project.type || 'N/A'));
    addKeyValue(doc, 'Stories:', project.stories || 'N/A');
    addKeyValue(doc, 'Location:', capitalizeWords(project.location || 'N/A'));
    
    doc.moveDown(1);
    drawHorizontalLine(doc);
    doc.moveDown(1);

    // Cost Summary Section
    doc.fontSize(16)
       .fillColor('#2d3748')
       .text('COST SUMMARY', { underline: true });
    doc.moveDown(0.5);

    // Total Cost Highlight Box
    doc.rect(doc.x - 10, doc.y, 500, 40)
       .fillAndStroke('#e6f3ff', '#3182ce');
    
    doc.fontSize(14)
       .fillColor('#1a365d')
       .text('TOTAL ESTIMATED COST:', doc.x, doc.y + 12);
    
    doc.fontSize(18)
       .fillColor('#2c5282')
       .text(`${(project.cost || project.estimatedCost)?.toLocaleString() || 'N/A'}`, 350, doc.y - 18, { align: 'right' });
    
    doc.moveDown(2);

    // Detailed Cost Breakdown
    if (project.breakdown) {
      doc.fontSize(14)
         .fillColor('#2d3748')
         .text('Detailed Cost Breakdown', { underline: true });
      doc.moveDown(0.5);

      // Table header
      const tableTop = doc.y;
      doc.fontSize(10)
         .fillColor('#ffffff');
      
      doc.rect(50, tableTop, 250, 20).fill('#4a5568');
      doc.rect(300, tableTop, 250, 20).fill('#4a5568');
      
      doc.text('Category', 60, tableTop + 6);
      doc.text('Cost', 310, tableTop + 6);

      let currentY = tableTop + 25;
      doc.fillColor('#000000');

      // Table rows
      let rowIndex = 0;
      for (const [category, cost] of Object.entries(project.breakdown)) {
        const bgColor = rowIndex % 2 === 0 ? '#f7fafc' : '#ffffff';
        
        doc.rect(50, currentY, 250, 20).fill(bgColor);
        doc.rect(300, currentY, 250, 20).fill(bgColor);
        
        doc.fillColor('#000000')
           .text(capitalizeWords(category), 60, currentY + 6);
        doc.text(`$${cost.toLocaleString()}`, 310, currentY + 6);
        
        currentY += 20;
        rowIndex++;
      }

      doc.moveDown(2);
    }

    // Materials Summary
    if (project.materials) {
      doc.addPage();
      
      doc.fontSize(16)
         .fillColor('#2d3748')
         .text('MATERIALS TAKEOFF', { underline: true });
      doc.moveDown(0.5);

      const tableTop = doc.y;
      doc.fontSize(10)
         .fillColor('#ffffff');
      
      doc.rect(50, tableTop, 300, 20).fill('#4a5568');
      doc.rect(350, tableTop, 200, 20).fill('#4a5568');
      
      doc.text('Material', 60, tableTop + 6);
      doc.text('Quantity', 360, tableTop + 6);

      let currentY = tableTop + 25;
      doc.fillColor('#000000');

      let rowIndex = 0;
      for (const [material, quantity] of Object.entries(project.materials)) {
        const bgColor = rowIndex % 2 === 0 ? '#f7fafc' : '#ffffff';
        
        doc.rect(50, currentY, 300, 20).fill(bgColor);
        doc.rect(350, currentY, 200, 20).fill(bgColor);
        
        doc.fillColor('#000000')
           .text(capitalizeWords(material), 60, currentY + 6);
        doc.text(quantity.toString(), 360, currentY + 6);
        
        currentY += 20;
        rowIndex++;

        // Add new page if we're running out of space
        if (currentY > 700) {
          doc.addPage();
          currentY = 50;
        }
      }
    }

    // Footer
    const pageCount = doc.bufferedPageRange().count;
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i);
      
      doc.fontSize(8)
         .fillColor('#718096')
         .text(
           `Generated by Estimator AI V5 | Page ${i + 1} of ${pageCount} | ${new Date().toLocaleString()}`,
           50,
           doc.page.height - 40,
           { align: 'center', width: doc.page.width - 100 }
         );
    }

    doc.end();
    
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

function drawHorizontalLine(doc) {
  doc.strokeColor('#cbd5e0')
     .lineWidth(1)
     .moveTo(50, doc.y)
     .lineTo(550, doc.y)
     .stroke();
}

function addKeyValue(doc, key, value) {
  const startY = doc.y;
  doc.fontSize(11)
     .fillColor('#4a5568')
     .text(key, { continued: true })
     .fillColor('#000000')
     .text(` ${value}`);
  doc.moveDown(0.3);
}

function capitalizeWords(str) {
  if (!str) return 'N/A';
  return str.toString()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}