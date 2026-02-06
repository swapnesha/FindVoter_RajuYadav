# Voter Search System - Setup Guide

## 📋 Files Included
- `index.html` - Main UI
- `script.js` - Search logic & functionality
- `styles.css` - Styling
- `votersJSON.json` - Voter database (30,709 records)
- `run-server.sh` - Local server startup script

## ⚠️ IMPORTANT: Must Use HTTP Server

**The app WILL NOT WORK if you open `index.html` directly in the browser (file:///)** 

The browser blocks loading JSON files locally due to CORS (security restrictions). You **MUST** serve the files over HTTP.

## ✅ Setup Instructions

### Option 1: Using Python (Recommended - No Installation Needed)

#### On Linux/Mac:
```bash
cd /path/to/FindVoter_RajuYadav
python3 -m http.server 8000
```

#### On Windows (PowerShell):
```powershell
cd C:\path\to\FindVoter_RajuYadav
python -m http.server 8000
```

Then open: **http://localhost:8000**

---

### Option 2: Using the Provided Script

```bash
cd /path/to/FindVoter_RajuYadav
chmod +x run-server.sh
./run-server.sh
```

---

### Option 3: Using Node.js

```bash
cd /path/to/FindVoter_RajuYadav
npx http-server -p 8000
```

Then open: **http://localhost:8000**

---

### Option 4: Deploy to GitHub Pages

1. Push files to GitHub repository
2. Go to **Settings → Pages**
3. Select **Deploy from a branch**
4. Choose `main` branch and `root` directory
5. Access at: `https://username.github.io/repo-name/`

---

## 🔍 How to Use

### Search Methods:

1. **By Voter ID**
   - Select "Voter ID" radio button
   - Enter: `2207300100001`

2. **By English Name**
   - Select "Name" radio button
   - Enter: `Nilesh` or `Malavekar`

3. **By Marathi Name**
   - Select "Name" radio button
   - Enter: `शिवराज` or `यादव`

4. **By Any Field** (Default)
   - Leave "All Fields" selected
   - Enter ID or name in any language

### Tips:
- Partial matches work (e.g., "Mal" finds "Malavekar")
- Case-insensitive (e.g., "nilesh" or "NILESH")
- Supports both English and Marathi/Hindi scripts
- Results show both English and local script names

---

## 🐛 Debugging

### If search doesn't work:

1. **Check browser console** (F12 or Ctrl+Shift+I)
   - Look for `✓ Data loaded successfully` message
   - Check for error messages

2. **Verify server is running**
   - Open http://localhost:8000 in browser
   - You should see the Voter Search page

3. **Clear browser cache**
   - Press Ctrl+Shift+Delete
   - Clear cached data and reload

4. **Check file paths**
   - Ensure all these files are in the same folder:
     - index.html
     - script.js
     - styles.css
     - votersJSON.json

---

## 📊 Database Info

- **Total Voters**: 30,709
- **Fields**: Name, ID, Age, Address, Booth, Assembly, Village, Family ID, etc.
- **Name Fields**: English (e_first_name, e_last_name) and Local script (l_first_name, l_last_name)

---

## 🚀 Local Development

```bash
# Start server
python3 -m http.server 8000

# Server runs at http://localhost:8000
# Files auto-reload - just refresh browser

# Stop server
# Press Ctrl+C in terminal
```

---

## ❓ Common Issues

| Issue | Solution |
|-------|----------|
| "Data not loaded yet" | Wait 2-3 seconds, then refresh page |
| CORS errors | Make sure you're using http://, not file:// |
| Search returns no results | Try partial name (e.g., "Yadav") |
| Marathi search doesn't work | Browser support for Unicode depends on font |
| JSON file not found | Ensure votersJSON.json is in same folder |

---

## 📱 Access from Other Devices

Once server is running on your machine:

```
Your computer IP: 192.168.x.x (check with `ipconfig` or `ifconfig`)
Access from phone: http://192.168.x.x:8000
```

---

**Made with ❤️ for Voter Information System**
