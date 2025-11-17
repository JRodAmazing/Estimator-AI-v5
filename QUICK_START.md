# Quick Start Guide

## 1. Get Your API Key

1. Visit: https://console.anthropic.com/
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create Key"
5. Copy the key (starts with `sk-ant-...`)

## 2. Add API Key to .env File

Open the `.env` file in this directory and replace the placeholder:

```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

## 3. Start the Server

Run this command in the terminal:

```bash
npm start
```

You should see:
```
🚀 Estimator Web App running on http://localhost:3000
```

## 4. Open in Browser

**On Your Computer:**
- Open your browser
- Go to: http://localhost:3000

**On Your Phone (Same WiFi Network):**
1. Find your computer's IP address:
   - Windows: Open Command Prompt and type `ipconfig`
   - Look for "IPv4 Address" under your WiFi adapter
   - It usually looks like: 192.168.1.100

2. On your phone's browser, go to:
   ```
   http://YOUR_IP_ADDRESS:3000
   ```
   Example: `http://192.168.1.100:3000`

## 5. Start Using It!

Try typing:
- "I need an estimate for building a 600 sqft pool"
- "Give me a quote for a concrete pool in Dallas"
- "Estimate cost for pool construction"

The AI will ask you questions and then you can:
- Click "Generate Full Estimate" to see detailed breakdown
- Click "Download PDF Report" to get a professional PDF
- Click "Check Inventory" to see material availability

## Troubleshooting

**Can't connect from phone?**
- Make sure both devices are on the same WiFi
- Check Windows Firewall isn't blocking port 3000
- Try disabling firewall temporarily to test

**API Errors?**
- Double-check your API key in the `.env` file
- Make sure there are no extra spaces
- Verify you have API credits at console.anthropic.com

**Need Help?**
- Read the full README.md for detailed documentation
- Check that all npm packages installed correctly
- Try running `npm install` again if you see errors

## Example Usage Flow

1. User: "I need an estimate for building a pool"
2. AI: "I'd be happy to help! Could you tell me the approximate size of the pool you're planning?"
3. User: "600 square feet, concrete, in Dallas"
4. AI: "Great! A 600 sq ft concrete pool in Dallas. Are you planning any special features like heating, lighting, or a spa?"
5. User: "Just basic pool with lighting"
6. AI: [Provides summary and you can now click "Generate Full Estimate"]
7. View complete breakdown with costs, timeline, permits, inventory
8. Download professional PDF report
9. Check inventory availability

Enjoy your new Construction Estimator Web App! 🎉
