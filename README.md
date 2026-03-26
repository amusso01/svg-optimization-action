# SVG Optimize Finder Quick Action

Tiny macOS utility to optimize SVGs from Finder using a Quick Action + Node + SVGO.

---

## What it does

- Right-click SVG files in Finder
- Runs optimization
- Converts inline styles → SVG attributes

**Example:**

**Before:**

```svg
<path style="fill:#000;stroke:#fff;stroke-width:2" />
```

**After:**

```svg
<path fill="#000" stroke="#fff" stroke-width="2" />
```

## Project location

`~/Code/svg-optimization-action`

⚠️ **If you move this folder**, update this line inside `finder-quick-action.sh`:

```bash
SCRIPT_PATH="$HOME/Code/svg-optimization-action/optimize-svg.js"
```

---

## Setup (new machine)

1. **Clone the repo**

   ```bash
   git clone <REPO_URL> ~/Code/svg-optimization-action
   cd ~/Code/svg-optimization-action
   ```

2. **Install NVM (if needed)**

   Follow official NVM installation instructions.

   Verify:

   ```bash
   nvm --version
   ```

3. **Install Node (pinned version)**

   ```bash
   nvm install 22
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Make scripts executable**

   ```bash
   chmod +x optimize-svg.js
   chmod +x finder-quick-action.sh
   ```

6. **Test manually (IMPORTANT)**

   ```bash
   export NVM_DIR="$HOME/.nvm"
   source "$NVM_DIR/nvm.sh"
   nvm use 22

   node "$HOME/Code/svg-optimization-action/optimize-svg.js" "$HOME/Downloads/test.svg"
   ```

   If this does **not** work, do not proceed.

---

## Create Finder Quick Action (Automator)

### Step-by-step

1. Open **Automator** → **New Document** → **Quick Action**.

2. **Configure the workflow** (top of the window):

   - **Workflow receives current:** files or folders  
   - **in:** Finder

3. Add **Run Shell Script**:

   - Search for **Run Shell Script**, drag it into the workflow.

4. **Configure it:**

   - **Shell:** `/bin/bash`  
   - **Pass input:** as arguments  
   - Replace **all** code with:

     ```bash
     "$HOME/Code/svg-optimization-action/finder-quick-action.sh" "$@"
     ```

   ⚠️ Delete any default code Automator inserted.

5. **Save** as **SVG Optimize**.

---

## How to use

1. Open **Finder**.
2. Select one or more `.svg` files **or** a folder.
3. Right-click → **Quick Actions** → **SVG Optimize**.

---

## How it works

1. Finder passes selected files → Automator  
2. Automator passes them → shell script (`"$@"`)  
3. Shell script loads NVM  
4. Runs Node script  
5. Node script processes SVGs  

---

## Change Node version later

Inside `finder-quick-action.sh`:

```bash
nvm use 22
```

To upgrade:

```bash
nvm install 24
```

Then update to:

```bash
nvm use 24
```

Then test manually again.

⚠️ Do **not** remove version pinning.

---

## Known limitations

- Overwrites original SVG files  
- Folder processing is **not** recursive  
- Some CSS properties cannot be converted (SVG limitation)  
- macOS may block Desktop/Documents files (permissions)  

---

## Troubleshooting

### "No SVG files or folders provided"

You ran it from Automator instead of Finder.  
→ Must run from Finder on selected files.

### "Cannot read: ..."

Wrong path **or** file does not exist.  
Use drag-and-drop into Terminal to confirm path.

### "EPERM: operation not permitted"

macOS permissions issue.

**Fix:** Avoid Desktop for testing, or give Terminal/Automator access to files.

### "optimize-svg.js not found"

Wrong path inside `finder-quick-action.sh`.

### "Node not installed"

Run:

```bash
nvm install 22
```

---

## Future improvements

- Recursive folder processing  
- Output `_optimized.svg` instead of overwrite  
- Native macOS app version  

---

This version is:

- Complete  
- Consistent with your actual path  
- Rebuildable in a few minutes  
- Readable even if you forget everything later  

A natural next step is upgrading to **recursive folder processing**.
