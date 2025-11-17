# Troubleshooting Guide

## ✅ Server is Running Successfully!

The server is currently running in **DEMO MODE** - you can use it right now without an API key!

## 🔗 How to Access

### On Your Computer:
1. Open any web browser (Chrome, Firefox, Edge, etc.)
2. Go to: **http://localhost:3000**

### Test Connection First:
- Go to: **http://localhost:3000/test.html**
- If you see a green checkmark, the server is working!

### On Your Phone:
1. Make sure your phone is on the **same WiFi network** as your computer
2. On your phone's browser, go to: **http://192.168.4.27:3000**

## 🛡️ Fix Firewall Issues (Most Common Problem)

If you can't connect from your phone, the Windows Firewall is likely blocking it.

### Quick Fix - Run Firewall Script:
1. Right-click on **ALLOW_FIREWALL.bat** in the app folder
2. Select "Run as Administrator"
3. Click "Yes" when prompted
4. Done! Try accessing from your phone again

### Manual Fix:
1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port: **3000**
6. Select "Allow the connection"
7. Check all profiles (Domain, Private, Public)
8. Name it "Estimator App"
9. Finish

## 📱 Phone Can't Connect?

### Checklist:
- [ ] Is your phone on the **same WiFi** as your computer?
- [ ] Is the server running? (Check terminal for "Server running" message)
- [ ] Did you run the firewall script as Administrator?
- [ ] Are you using the correct IP address? (Run `ipconfig` to verify)
- [ ] Try http://localhost:3000 on your computer first

### Find Your Current IP Address:
```bash
ipconfig
```
Look for "IPv4 Address" under your WiFi adapter (starts with 192.168...)

## 🤖 Demo Mode vs AI Mode

### Current Status: DEMO MODE
- ✅ Works without API key
- ✅ Basic conversation flow
- ✅ Full estimate generation
- ✅ PDF reports
- ✅ Inventory checking
- ❌ No AI-powered conversations

### To Enable AI Mode:
1. Get API key from https://console.anthropic.com/
2. Open `.env` file
3. Replace `sk-ant-your-api-key-here` with your real key
4. Restart the server (Ctrl+C, then `npm start`)

## 🔧 Common Issues

### "Cannot GET /"
**Problem:** Server not running
**Solution:** Run `npm start` in the app folder

### "This site can't be reached"
**Problem:** Firewall blocking or wrong IP
**Solution:**
1. Run ALLOW_FIREWALL.bat as Administrator
2. Verify IP with `ipconfig`
3. Make sure both devices on same WiFi

### Server crashes on startup
**Problem:** Port 3000 already in use
**Solution:**
1. Close other apps using port 3000
2. Or change PORT in .env file to 3001

### "API Error" when chatting
**Problem:** API key invalid or not set
**Solution:**
- Demo mode should work without API key
- If you added an API key, verify it's correct in .env

### PDF won't download
**Problem:** Browser blocking download
**Solution:**
- Check browser download settings
- Allow downloads from localhost
- Try a different browser

## 📊 Test the App

### Quick Test Flow:
1. Open http://localhost:3000
2. Type: "I need an estimate for a 600 sqft pool"
3. You should see a response
4. Type: "Concrete pool in Dallas"
5. Click "Generate Full Estimate"
6. View the detailed breakdown
7. Click "Download PDF Report"

## 🆘 Still Having Issues?

1. **Restart Everything:**
   - Close terminal (Ctrl+C to stop server)
   - Run `npm start` again
   - Clear browser cache (Ctrl+Shift+Delete)
   - Try in incognito/private mode

2. **Check Server Logs:**
   - Look at the terminal where server is running
   - Any error messages? Share them for help

3. **Verify Installation:**
   ```bash
   cd "C:\Users\jcrod\Documents\business\HeavyIron Consults\Estimator_Web_App"
   npm install
   npm start
   ```

## 📞 Server Info

- **Port:** 3000
- **Local URL:** http://localhost:3000
- **Network URL:** http://192.168.4.27:3000
- **Test Page:** http://localhost:3000/test.html
- **Mode:** Demo (no API key needed)

## ✨ Success Indicators

You'll know it's working when:
- Terminal shows "🚀 Estimator Web App running..."
- Test page shows green checkmark
- Chat interface loads on localhost:3000
- You can type messages and get responses
- "Generate Full Estimate" button appears after chatting

---

**Everything should be working now!** The server is running in demo mode at http://localhost:3000

Try it on your computer first, then access from your phone using http://192.168.4.27:3000
