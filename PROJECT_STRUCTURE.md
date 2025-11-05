# 📁 Project Structure

```
estimator-ai-v5/
│
├── 📂 commands/                 # Discord command handlers (35+ commands)
│   ├── sync.js                  # Supplier price synchronization
│   ├── submittal.js             # PDF submittal generation
│   ├── drawing.js               # DXF/SVG export
│   ├── session.js               # Session start/end management
│   ├── estimate.js              # Cost estimation
│   ├── breakdown.js             # Detailed cost breakdown
│   ├── projects.js              # Project listing
│   ├── generateprojects.js      # Mock data generator
│   ├── revise.js                # Revision tracking
│   ├── revisionreport.js        # Revision history PDF
│   ├── sessionreport.js         # Session action log
│   ├── sessionpdf.js            # Session summary PDF
│   ├── exportsession.js         # Session archiving
│   ├── projectsummary.js        # CSV export
│   ├── bundleportfolio.js       # Portfolio folder creation
│   ├── packageportfolio.js      # ZIP packaging with README
│   ├── checkcommands.js         # Command integrity audit
│   └── ...                      # (20+ more commands)
│
├── 📂 modules/                  # Core business logic
│   ├── supplierSync.js          # API integration engine
│   ├── learning.js              # Machine learning model
│   ├── sessionManager.js        # Session state management
│   ├── sessionLogger.js         # Action logging
│   ├── sessionReportGenerator.js # Session PDF creator
│   ├── submittalGenerator.js    # PDF document engine
│   ├── drawingGenerator.js      # DXF/SVG generator
│   ├── revisionReportGenerator.js # Revision PDF creator
│   ├── archiveManager.js        # Session archival
│   ├── portfolioBundler.js      # Output aggregation
│   ├── readmeGenerator.js       # Dynamic README creation
│   ├── zipPackager.js           # ZIP compression
│   ├── summaryExporter.js       # CSV export logic
│   ├── scheduler.js             # Automated sync scheduler
│   ├── modeManager.js           # Operation mode control
│   └── roleRouter.js            # Permission management
│
├── 📂 data/                     # Persistent storage (JSON-based)
│   ├── projects.json            # Project database
│   ├── suppliers.json           # Supplier information
│   ├── sessions.json            # Active sessions
│   ├── model_weights.json       # ML model parameters
│   ├── history.json             # Historical cost data
│   ├── preferences.json         # User preferences
│   ├── unit_costs.json          # Material unit prices
│   ├── mode.json                # Current operation mode
│   │
│   ├── 📂 archive/              # Session exports
│   │   └── session_[timestamp]/ # Timestamped session folders
│   │       ├── project_[id]_session.json
│   │       ├── project_[id]_session.csv
│   │       ├── project_[id]_submittal.pdf
│   │       └── session.json
│   │
│   └── 📂 submittals/           # Generated documents
│       ├── project_[id]_submittal.pdf
│       ├── project_[id]_layout.dxf
│       ├── project_[id]_layout.svg
│       └── project_[id]_revision_report.pdf
│
├── 📂 mock-api/                 # Supplier API simulator
│   ├── server.js                # Express server
│   └── mockData.json            # Sample price data
│
├── 📂 utils/                    # Utility functions
│   └── mockProjects.js          # Project data generator
│
├── 📄 index.js                  # Bot entry point & command loader
├── 📄 package.json              # Dependencies & scripts
├── 📄 .env.example              # Environment template
├── 📄 .gitignore                # Git exclusions
│
├── 📄 README.md                 # Project overview
├── 📄 CONTRIBUTING.md           # Contribution guide
├── 📄 LICENSE                   # MIT License
├── 📄 GITHUB_SETUP.md           # Publishing instructions
├── 📄 DEMO_GUIDE.md             # Interview prep
├── 📄 INSTALL_GUIDE.md          # Setup instructions
└── 📄 PHASE1_COMPLETE.md        # Optimization summary
```

---

## 🔍 Key Directories Explained

### **`/commands`**
Each file is a self-contained Discord command handler. When a user types `!submittal`, the bot loads and executes `commands/submittal.js`. This modular approach makes it easy to add, remove, or modify commands without touching core logic.

### **`/modules`**
Shared business logic that multiple commands use. For example, both `!submittal` and `!revisionreport` use `submittalGenerator.js` to create PDFs. This DRY (Don't Repeat Yourself) architecture keeps code maintainable.

### **`/data`**
JSON-based persistence layer. Acts like a simple database:
- **projects.json**: All project records
- **suppliers.json**: Supplier info and price history
- **sessions.json**: Active session tracking
- **archive/**: Completed session exports
- **submittals/**: Generated PDF/DXF/SVG files

### **`/mock-api`**
Simulates real supplier APIs for demo and testing. Runs on `localhost:5055` and returns mock price data. In production, this would be replaced with actual API integrations.

---

## 📊 File Count Summary

| Category | Count | Purpose |
|----------|-------|---------|
| Commands | 35+ | User-facing Discord interactions |
| Modules | 17 | Core business logic |
| Data Files | 10+ | JSON persistence layer |
| Documentation | 7 | Guides and references |
| Config | 4 | Setup and environment |

**Total Lines of Code**: ~3,500  
**Documentation Lines**: ~2,000

---

## 🔄 Data Flow Example

**Scenario**: User generates a submittal

```
1. User types: !submittal project_123
   └─> Discord event captured

2. index.js routes to commands/submittal.js
   └─> Command handler executes

3. submittal.js calls:
   ├─> modules/submittalGenerator.js (create PDF)
   ├─> data/projects.json (load project data)
   └─> modules/sessionLogger.js (log action)

4. PDF saved to data/submittals/
   └─> User receives download link

5. If session active:
   └─> modules/sessionManager.js updates state
```

---

## 🎨 Design Philosophy

**Modular**: Each command and module has a single responsibility  
**Extensible**: Easy to add new commands or document types  
**Transparent**: Complete audit trail via session logging  
**Portable**: JSON storage makes it easy to demo and deploy  
**Scalable**: Clear migration path to databases and microservices

---

This structure demonstrates production-level organization and makes it easy for other developers (or interviewers) to understand the codebase quickly.
