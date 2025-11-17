// Generate unique session ID
const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);

// DOM elements
const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const messagesContainer = document.getElementById('messages');
const typingIndicator = document.getElementById('typing-indicator');
const actionButtons = document.getElementById('actionButtons');
const generateEstimateBtn = document.getElementById('generateEstimateBtn');
const checkInventoryBtn = document.getElementById('checkInventoryBtn');
const estimatePanel = document.getElementById('estimatePanel');
const estimateContent = document.getElementById('estimateContent');
const closeEstimateBtn = document.getElementById('closeEstimateBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const chatContainer = document.getElementById('chatContainer');

// State
let currentEstimate = null;
let currentProjectData = null;
let canGenerateEstimate = false;

// Event listeners
chatForm.addEventListener('submit', handleSubmit);
generateEstimateBtn.addEventListener('click', generateEstimate);
checkInventoryBtn.addEventListener('click', checkInventory);
closeEstimateBtn.addEventListener('click', closeEstimatePanel);
downloadPdfBtn.addEventListener('click', downloadPdf);

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();

  const message = messageInput.value.trim();
  if (!message) return;

  // Add user message to chat
  addMessage(message, 'user');
  messageInput.value = '';

  // Show typing indicator
  showTyping();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        sessionId
      })
    });

    const data = await response.json();

    // Hide typing indicator
    hideTyping();

    // Add bot response
    addMessage(data.response, 'bot');

    // Show action buttons if enough information gathered
    if (data.canGenerateEstimate) {
      canGenerateEstimate = true;
      showActionButtons();
    }

  } catch (error) {
    console.error('Error:', error);
    hideTyping();
    addMessage('Sorry, I encountered an error. Please try again.', 'bot');
  }
}

// Add message to chat
function addMessage(text, sender) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${sender}-message`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';

  // Convert markdown-style formatting to HTML
  const formattedText = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');

  contentDiv.innerHTML = `<p>${formattedText}</p>`;
  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);

  // Scroll to bottom
  scrollToBottom();
}

// Show/hide typing indicator
function showTyping() {
  typingIndicator.style.display = 'block';
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.style.display = 'none';
}

// Show action buttons
function showActionButtons() {
  actionButtons.style.display = 'flex';
}

// Scroll chat to bottom
function scrollToBottom() {
  setTimeout(() => {
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 100);
}

// Generate estimate
async function generateEstimate() {
  if (!canGenerateEstimate) {
    alert('Please provide more information about your project first.');
    return;
  }

  generateEstimateBtn.textContent = '⏳ Generating...';
  generateEstimateBtn.disabled = true;

  try {
    const response = await fetch('/api/generate-estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId
      })
    });

    const data = await response.json();
    currentEstimate = data.estimate;
    currentProjectData = data.projectData;

    displayEstimate(data.estimate, data.projectData);
    estimatePanel.style.display = 'block';

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate estimate. Please try again.');
  } finally {
    generateEstimateBtn.textContent = '📊 Generate Full Estimate';
    generateEstimateBtn.disabled = false;
  }
}

// Display estimate
function displayEstimate(estimate, projectData) {
  let html = `
    <div class="estimate-section">
      <h3>📋 Project Details</h3>
      <div class="estimate-item">
        <span class="estimate-item-name">Project Type</span>
        <span class="estimate-item-cost">${projectData.projectType || 'Pool Construction'}</span>
      </div>
      <div class="estimate-item">
        <span class="estimate-item-name">Size</span>
        <span class="estimate-item-cost">${projectData.size?.sqft || 'N/A'} sq ft</span>
      </div>
      <div class="estimate-item">
        <span class="estimate-item-name">Type</span>
        <span class="estimate-item-cost">${projectData.poolType || 'Concrete'}</span>
      </div>
      <div class="estimate-item">
        <span class="estimate-item-name">Location</span>
        <span class="estimate-item-cost">${projectData.location || 'N/A'}</span>
      </div>
    </div>

    <div class="estimate-section">
      <h3>👷 Labor Breakdown</h3>
  `;

  Object.entries(estimate.labor).forEach(([task, details]) => {
    html += `
      <div class="estimate-item">
        <div>
          <div class="estimate-item-name">${task.replace(/_/g, ' ').toUpperCase()}</div>
          <div class="estimate-item-details">${details.hours} hours @ $${details.rate}/hr</div>
        </div>
        <span class="estimate-item-cost">$${details.cost.toLocaleString()}</span>
      </div>
    `;
  });

  html += `
      <div class="estimate-item" style="border-top: 2px solid var(--border-color); margin-top: 0.5rem; padding-top: 0.5rem;">
        <strong>Labor Subtotal</strong>
        <strong class="estimate-item-cost">$${estimate.laborTotal.toLocaleString()}</strong>
      </div>
    </div>

    <div class="estimate-section">
      <h3>🧱 Materials Breakdown</h3>
  `;

  Object.entries(estimate.materials).forEach(([item, details]) => {
    html += `
      <div class="estimate-item">
        <div>
          <div class="estimate-item-name">${item.replace(/_/g, ' ').toUpperCase()}</div>
          <div class="estimate-item-details">${details.quantity} ${details.unit} @ $${details.unitPrice} • ${details.supplier}</div>
        </div>
        <span class="estimate-item-cost">$${details.cost.toLocaleString()}</span>
      </div>
    `;
  });

  html += `
      <div class="estimate-item" style="border-top: 2px solid var(--border-color); margin-top: 0.5rem; padding-top: 0.5rem;">
        <strong>Materials Subtotal</strong>
        <strong class="estimate-item-cost">$${estimate.materialsTotal.toLocaleString()}</strong>
      </div>
    </div>

    <div class="estimate-section">
      <h3>🚜 Equipment Rental</h3>
  `;

  Object.entries(estimate.equipment).forEach(([item, details]) => {
    html += `
      <div class="estimate-item">
        <div>
          <div class="estimate-item-name">${item.replace(/_/g, ' ').toUpperCase()}</div>
          <div class="estimate-item-details">${details.days} days @ $${details.dailyRate}/day • ${details.supplier}</div>
        </div>
        <span class="estimate-item-cost">$${details.cost.toLocaleString()}</span>
      </div>
    `;
  });

  html += `
      <div class="estimate-item" style="border-top: 2px solid var(--border-color); margin-top: 0.5rem; padding-top: 0.5rem;">
        <strong>Equipment Subtotal</strong>
        <strong class="estimate-item-cost">$${estimate.equipmentTotal.toLocaleString()}</strong>
      </div>
    </div>

    <div class="estimate-section">
      <h3>📜 Permits & Compliance</h3>
  `;

  Object.entries(estimate.permits).forEach(([permit, details]) => {
    html += `
      <div class="estimate-item">
        <div>
          <div class="estimate-item-name">${permit.replace(/_/g, ' ').toUpperCase()}</div>
          <div class="estimate-item-details">Timeline: ${details.timeline}</div>
        </div>
        <span class="estimate-item-cost">$${details.cost.toLocaleString()}</span>
      </div>
    `;
  });

  html += `
      <div class="estimate-item" style="border-top: 2px solid var(--border-color); margin-top: 0.5rem; padding-top: 0.5rem;">
        <strong>Permits Subtotal</strong>
        <strong class="estimate-item-cost">$${estimate.permitsTotal.toLocaleString()}</strong>
      </div>
    </div>

    <div class="estimate-section">
      <h3>📅 Project Timeline</h3>
      <div class="estimate-item">
        <strong>Estimated Duration</strong>
        <strong class="estimate-item-cost">${estimate.timeline.total}</strong>
      </div>
  `;

  estimate.timeline.phases.forEach(phase => {
    html += `
      <div class="estimate-item">
        <span class="estimate-item-name">${phase.name}</span>
        <span class="estimate-item-details">${phase.duration}</span>
      </div>
    `;
  });

  html += `
    </div>

    <div class="estimate-section">
      <h3>📦 Inventory Requirements</h3>
  `;

  estimate.inventory.forEach(item => {
    html += `
      <div class="estimate-item">
        <span class="estimate-item-name">${item.name}</span>
        <span class="estimate-item-details">${item.quantity} ${item.unit}</span>
      </div>
    `;
  });

  html += `
    </div>

    <div class="estimate-section">
      <div class="estimate-item">
        <strong>Overhead (15%)</strong>
        <strong class="estimate-item-cost">$${Math.round(estimate.overhead).toLocaleString()}</strong>
      </div>
    </div>

    <div class="estimate-total">
      <h3>Total Estimate: $${estimate.total.toLocaleString()}</h3>
      <p>Valid for 30 days • Subject to site conditions</p>
    </div>
  `;

  estimateContent.innerHTML = html;
}

// Close estimate panel
function closeEstimatePanel() {
  estimatePanel.style.display = 'none';
}

// Download PDF
async function downloadPdf() {
  if (!currentEstimate || !currentProjectData) {
    alert('No estimate available to download.');
    return;
  }

  downloadPdfBtn.textContent = '⏳ Generating PDF...';
  downloadPdfBtn.disabled = true;

  try {
    const response = await fetch('/api/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        estimate: currentEstimate,
        projectData: currentProjectData
      })
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `construction_estimate_${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to generate PDF. Please try again.');
  } finally {
    downloadPdfBtn.textContent = '📄 Download PDF Report';
    downloadPdfBtn.disabled = false;
  }
}

// Check inventory
async function checkInventory() {
  if (!currentEstimate) {
    alert('Please generate an estimate first.');
    return;
  }

  checkInventoryBtn.textContent = '⏳ Checking...';
  checkInventoryBtn.disabled = true;

  try {
    const response = await fetch('/api/check-inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: currentEstimate.inventory
      })
    });

    const data = await response.json();

    let message = '📦 Inventory Status:\n\n';
    data.inventory.forEach(item => {
      const status = item.inStock ? '✅ In Stock' : '⚠️ Limited Stock';
      message += `${item.name}: ${status} (${item.availableQuantity} ${item.unit}) - ${item.leadTime}\n`;
    });

    alert(message);

  } catch (error) {
    console.error('Error:', error);
    alert('Failed to check inventory. Please try again.');
  } finally {
    checkInventoryBtn.textContent = '📦 Check Inventory';
    checkInventoryBtn.disabled = false;
  }
}

// Auto-focus input on load
window.addEventListener('load', () => {
  messageInput.focus();
});
