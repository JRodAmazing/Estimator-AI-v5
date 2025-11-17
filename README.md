# 🏗️ Construction Estimator Web App

> A professional, AI-powered construction estimation tool with mobile-friendly chat interface and comprehensive PDF report generation.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)

## ✨ Features

- 🤖 **AI-Powered Chat Interface** - Natural conversation using Claude 3.5 Sonnet
- 📊 **Comprehensive Estimates** - Labor, materials, equipment, permits, and timeline
- 📄 **Professional PDF Reports** - Detailed breakdowns with supplier information
- 📦 **Inventory Management** - Real-time material availability checking
- 🚜 **Equipment Suggestions** - Automated equipment rental recommendations
- 📱 **Mobile Responsive** - Perfect for demos on phones and tablets
- ⚡ **Demo Mode** - Works without API key for testing and demonstrations
- 🎨 **Modern UI** - Clean, professional interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Anthropic API key (optional - demo mode available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/estimator-web-app.git
   cd estimator-web-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Anthropic API key (or skip for demo mode):
   ```env
   ANTHROPIC_API_KEY=sk-ant-your-api-key-here
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Access the application**
   - **Local:** http://localhost:3000
   - **Network:** http://YOUR_IP_ADDRESS:3000

## 📖 Usage

### Basic Example

1. Open the application in your browser
2. Type: *"I need an estimate for building a 600 sqft pool"*
3. Answer the AI's questions about your project details
4. Click **"Generate Full Estimate"** to see comprehensive breakdown
5. Download professional PDF report
6. Check inventory availability

### Demo Mode

The app automatically runs in **Demo Mode** if no API key is provided. This mode:
- ✅ Provides structured conversation flow
- ✅ Generates full estimates with calculations
- ✅ Creates PDF reports
- ✅ Perfect for demonstrations and testing

To enable AI features, add your Anthropic API key to `.env`

## 🏗️ Project Structure

```
estimator-web-app/
├── public/
│   ├── index.html          # Main chat interface
│   ├── styles.css          # Responsive styling
│   ├── app.js              # Frontend JavaScript
│   └── test.html           # Connection test page
├── server.js               # Express server & API endpoints
├── package.json            # Dependencies
├── .env                    # Environment variables
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── README.md               # This file
├── QUICK_START.md          # Quick setup guide
├── TROUBLESHOOTING.md      # Common issues & solutions
└── ALLOW_FIREWALL.bat      # Windows firewall helper

```

## 📊 Estimate Breakdown

Each estimate includes:

### 💼 Labor Costs
- Excavation work
- Concrete/structural work
- Plumbing installation
- Electrical systems
- Finishing work

### 🧱 Materials
- Quantities and unit prices
- Supplier recommendations
- Total material costs
- Delivery considerations

### 🚜 Equipment Rental
- Required equipment list
- Daily rental rates
- Duration estimates
- Supplier contacts

### 📜 Permits & Compliance
- Building permits
- Electrical permits
- Plumbing permits
- Pool-specific permits
- Processing timelines

### 📅 Project Timeline
- Total project duration
- Phase-by-phase breakdown
- Critical milestones
- Inspection schedules

### 📦 Inventory Requirements
- Complete materials list
- Quantities needed
- Stock availability
- Lead times

## 🎨 Screenshots

### Chat Interface
Beautiful, mobile-responsive chat interface for natural project discussions.

### Estimate View
Comprehensive cost breakdown with all project details.

### PDF Report
Professional PDF reports ready for client presentation.

## 🔧 Configuration

### Updating Pricing Data

Edit `server.js` and modify the `constructionData` object:

```javascript
const constructionData = {
  labor: {
    excavation: { rate: 45, unit: 'hour' },
    // Add more labor types...
  },
  materials: {
    concrete: {
      price: 150,
      unit: 'cubic yard',
      supplier: 'Your Supplier'
    },
    // Add more materials...
  },
  equipment: {
    excavator: {
      price: 350,
      unit: 'day',
      supplier: 'Equipment Co'
    },
    // Add more equipment...
  }
};
```

### Custom Project Types

The calculation engine in `calculateEstimate()` can be extended to support:
- Residential construction
- Commercial projects
- Renovations & remodeling
- Foundation work
- Deck construction
- And more!

## 📱 Mobile Access

### Setup for Phone Demos

1. **Find your computer's IP address:**
   ```bash
   # Windows
   ipconfig

   # Mac/Linux
   ifconfig
   ```

2. **Allow firewall connections (Windows):**
   - Right-click `ALLOW_FIREWALL.bat`
   - Select "Run as Administrator"

   Or manually:
   ```bash
   netsh advfirewall firewall add rule name="Estimator App" dir=in action=allow protocol=TCP localport=3000
   ```

3. **Access from phone:**
   - Connect phone to same WiFi network
   - Open browser and go to: `http://YOUR_IP:3000`

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **AI:** Anthropic Claude 3.5 Sonnet
- **PDF Generation:** PDFKit
- **Frontend:** Vanilla JavaScript, CSS3, HTML5
- **Architecture:** RESTful API, Session-based state

## 🔐 Security Notes

- API keys stored in `.env` (never committed)
- CORS enabled for development
- Session-based architecture (no persistent storage)
- Input validation on all endpoints

## 📦 API Endpoints

### `POST /api/chat`
Handle conversational messages and gather project details.

**Request:**
```json
{
  "message": "I need an estimate for a pool",
  "sessionId": "session_123"
}
```

**Response:**
```json
{
  "response": "I'd be happy to help! What's the size...",
  "canGenerateEstimate": false
}
```

### `POST /api/generate-estimate`
Generate comprehensive project estimate.

**Request:**
```json
{
  "sessionId": "session_123"
}
```

**Response:**
```json
{
  "estimate": { /* full estimate data */ },
  "projectData": { /* extracted project details */ }
}
```

### `POST /api/generate-pdf`
Create downloadable PDF report.

**Request:**
```json
{
  "estimate": { /* estimate data */ },
  "projectData": { /* project details */ }
}
```

**Response:** PDF file download

### `POST /api/check-inventory`
Check material availability.

**Request:**
```json
{
  "items": [{ "name": "Concrete", "quantity": 10 }]
}
```

**Response:**
```json
{
  "inventory": [
    {
      "name": "Concrete",
      "inStock": true,
      "availableQuantity": 500,
      "leadTime": "In stock"
    }
  ]
}
```

## 🐛 Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for detailed solutions to common issues.

**Quick fixes:**
- Can't connect from phone? Run `ALLOW_FIREWALL.bat` as Administrator
- API errors? Check `.env` file for valid API key (or use demo mode)
- Server won't start? Make sure port 3000 is available

## 🚀 Deployment

### Production Deployment

For production use:

1. Set `NODE_ENV=production`
2. Use a process manager (PM2, Forever)
3. Set up SSL/HTTPS
4. Use Redis for session storage
5. Implement rate limiting
6. Add authentication for multi-user access

### Docker Deployment (Coming Soon)

```dockerfile
# Dockerfile example
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] User authentication and project history
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Email PDF reports to clients
- [ ] Real inventory system integration
- [ ] Multi-language support
- [ ] Advanced project templates
- [ ] Cost comparison tools
- [ ] Client portal with project tracking
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**JRodAmazing**
- Heavy Iron Consults
- Built with ❤️ for construction professionals

## 🙏 Acknowledgments

- Built with [Anthropic Claude](https://www.anthropic.com/) for AI capabilities
- [Express.js](https://expressjs.com/) for the backend framework
- [PDFKit](https://pdfkit.org/) for PDF generation
- Font icons and inspiration from modern web design trends

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Review [QUICK_START.md](QUICK_START.md)

---

**⭐ Star this repo if you find it helpful!**

Made with 🔨 by JRodAmazing | © 2025 Heavy Iron Consults
