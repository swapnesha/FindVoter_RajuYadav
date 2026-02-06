# ✅ How to Run Voter Search App

## The Problem
Opening `index.html` directly in the browser (like double-clicking it) **will NOT work** because browsers block loading JSON files from `file://` paths for security reasons.

## The Solution
Run a **local HTTP server** to serve the files properly.

---

## 🎯 Steps to Get It Working

### Step 1: Open Terminal/Command Prompt
- **Windows**: Press `Win + R`, type `cmd`, press Enter
- **Mac**: Press `Cmd + Space`, type `terminal`, press Enter
- **Linux**: Open Terminal application

### Step 2: Navigate to the Project Folder
```bash
cd /path/to/FindVoter_RajuYadav
```

Or simply right-click in the folder and select "Open Terminal Here"

### Step 3: Choose Your Method

#### Method A: Python (Recommended - Built-in, No Setup)
```bash
python3 -m http.server 8000
```
You should see: `Serving HTTP on 0.0.0.0 port 8000`

#### Method B: Node.js / npm
```bash
npx http-server -p 8000
```

#### Method C: Using the Script (Linux/Mac only)
```bash
chmod +x run-server.sh
./run-server.sh
```

### Step 4: Open in Browser
Click: **http://localhost:8000**

Or manually type in address bar: `http://localhost:8000`

### Step 5: Test the Search
- Open Browser Console: Press **F12**
- Wait for: `✓ Data loaded successfully. Total voters: 30709`
- In the search box, type: `Nilesh`
- Click Search or press Enter
- You should see 67 results!

### Step 6: Stop the Server
Press **Ctrl+C** in the terminal

---

## 🔍 Testing the Search

Try these searches:

| What | Search For | Expected Results |
|------|-----------|------------------|
| By Voter ID | `2207300100001` | 1 result |
| By Name | `Nilesh` | 67 results |
| By Last Name | `Yadav` | Many results |
| By Marathi | `शिवराज` | 16 results |

---

## ✅ Checklist

- [ ] All files are in the same folder (index.html, script.js, styles.css, votersJSON.json)
- [ ] Terminal shows server is running
- [ ] Browser shows Voter Search page at http://localhost:8000
- [ ] Browser console (F12) shows "Data loaded successfully"
- [ ] Search finds voters when you try it

---

## ❌ If Search Still Doesn't Work

1. **Check Browser Console** (F12)
   - Look for red error messages
   - Look for green "✓ Data loaded successfully" message

2. **Common Errors & Fixes**:
   
   ```
   "Failed to fetch votersJSON.json"
   → Make sure votersJSON.json is in the same folder
   
   "net::ERR_FILE_NOT_FOUND"
   → You opened file:// instead of http://localhost:8000
   
   "Data not loaded yet"
   → Wait 2-3 seconds and try searching again
   ```

3. **Try Different Port**:
   ```bash
   python3 -m http.server 9000
   # Then visit http://localhost:9000
   ```

---

## 📞 Still Need Help?

1. Open **Browser DevTools** (F12)
2. Check the **Console** tab for errors
3. Check the **Network** tab to see if files load
4. Make sure your file structure matches:
   ```
   FindVoter_RajuYadav/
   ├── index.html
   ├── script.js
   ├── styles.css
   └── votersJSON.json
   ```

---

**The app is working perfectly - you just need to serve it over HTTP!** 🚀
