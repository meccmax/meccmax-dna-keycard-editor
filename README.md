# DNA Keycards Config Editor

A full-featured browser-based GUI for editing all 14 configuration files used by the [DNA Keycards mod](https://steamcommunity.com/sharedfiles/filedetails/?id=2910902839) for DayZ. Import your existing configs, make changes visually, validate for errors, and export drop-in ready JSON files.

---

## Features

- **Import** — Load any or all of your existing JSON config files at once. The editor auto-detects which file is which based on its structure.
- **Full editor coverage** — All 14 config files across both `Loot/` and `System/` folders are supported.
- **Classname autocomplete** — Import your `types.xml` to get autocomplete on all weapon, clothing, and item classname fields.
- **Validator** — Built-in schema checker catches empty classnames, out-of-range mob counts, missing tiers, loot set count mismatches, and more before you export.
- **Export** — Download individual files or all 14 at once, formatted and ready to drop into your server.
- **No install, no account** — Runs entirely in your browser. Nothing is sent to any server.

---

## Supported Config Files

### Loot Folder
| File | Description |
|---|---|
| `KeyCard_Weapons_Config.json` | Per-tier weapon loadouts with full attachment slots |
| `KeyCard_Clothing_Config.json` | Per-tier outfit pools with 12 equipment slots each |
| `KeyCard_General_Config.json` | General loot item pools by category and tier |
| `@Config_Description_and_Activation.json` | Global smol crate config toggle |
| `Smol_Yellow_Config.json` | Yellow tier smol crate weapons and 4 loot sets |
| `Smol_Green_Config.json` | Green tier smol crate weapons and 4 loot sets |
| `Smol_Blue_Config.json` | Blue tier smol crate weapons and 4 loot sets |
| `Smol_Purple_Config.json` | Purple tier smol crate weapons and 4 loot sets |
| `Smol_Red_Config.json` | Red tier smol crate weapons and 4 loot sets |

### System Folder
| File | Description |
|---|---|
| `KeyCard_Main_System_Config.json` | Spawn modes, crate/strongroom counts, card uses, loot separation, mob spawns, alarm ranges |
| `KeyCard_LootContainers_System_Config.json` | Min/max quantity settings for all 10 loot categories across 5 tiers (225 entries) |
| `KeyCard_Mob_System_Config.json` | Mob classname pools for wolves, bears, infected, and 5 boss tiers |
| `ResetTimer_Config.json` | Reset timers for crates, strongrooms, lockouts, one-way doors, and warp doors |
| `SmolCrates_Config.json` | Smol crate spawn locations, reset settings, and per-tier reset times |
| `DoorAlarmAndNotifications_Config.json` | Per-tier alarm toggles and notification ranges for all door types |

---

## Using the Editor

### Importing Your Existing Configs

1. Open the editor and go to **📂 Import Configs** (the default landing page)
2. Click **SELECT JSON FILES** and pick any or all of your DNA Keycards JSON files
   - You can select files from both `Loot/` and `System/` folders at the same time
   - Use `Ctrl+A` / `Cmd+A` in the file picker to select all at once
3. The editor will show an import log confirming what was loaded and into which section
4. Optionally load your `types.xml` for classname autocomplete

> **Tip:** The editor detects file type automatically from the JSON structure, so it does not matter what folder the files are in when you select them.

### Editing

Use the sidebar to navigate between sections. Each section matches one or more config files:

| Sidebar Section | Config File(s) |
|---|---|
| 🔫 Weapons | `KeyCard_Weapons_Config.json` |
| 🪖 Clothing | `KeyCard_Clothing_Config.json` |
| 🎒 General Loot | `KeyCard_General_Config.json` |
| 📦 Smol Crates | `@Config_Description_and_Activation.json` + all 5 `Smol_*_Config.json` |
| ⚙️ Main System | `KeyCard_Main_System_Config.json` |
| 📊 Quantities | `KeyCard_LootContainers_System_Config.json` |
| 🐺 Mobs | `KeyCard_Mob_System_Config.json` |
| ⏱️ Reset Timers | `ResetTimer_Config.json` |
| 🗃️ Smol System | `SmolCrates_Config.json` |
| 🚪 Door Alarms | `DoorAlarmAndNotifications_Config.json` |

Each section has colour-coded tier tabs (Yellow / Green / Blue / Purple / Red) where applicable.

### Validating

Click **🔍 Validate** in the header or sidebar before exporting. The validator checks:

- Empty classnames in weapons, clothing, and general loot
- Missing `dna_Tier` fields
- Strongroom mob counts exceeding mod limits (wolves >10, bears >6, infected >40)
- Container settings entry count (must be exactly 225)
- Card usage allotment set to 0 (minimum is 1)
- Smol loot set randomize count greater than available items
- Empty item entries in loot sets

Issues are shown as **Errors** (will break server loading) or **Warnings** (worth reviewing).

### Exporting

1. Click **📤 Export All** in the header or sidebar
2. In the Export view you can:
   - Browse a file tree and preview any file as formatted JSON
   - **Copy Selected** — copies the selected file to clipboard
   - **Download Selected** — downloads just the selected file
   - **Download All** — downloads all 14 files with their original names
3. Place downloaded files back into your server's `DNA_Keycards/` folder, preserving the `Loot/` and `System/` subfolder structure

---

## Running Locally

Requires [Node.js](https://nodejs.org/) v18 or later.

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/dna-keycards-editor.git
cd dna-keycards-editor

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deploying to GitHub Pages

### Step 1 — Create the repository

1. Create a new repository on GitHub (public or private)
2. Name it `dna-keycards-editor` — or anything you want (see Step 2)
3. Push this project to it:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2 — Update the base path

Open `vite.config.js` and set `base` to match your repository name exactly:

```js
// If your repo is named "dna-keycards-editor":
base: '/dna-keycards-editor/',

// If your repo is named "dayz-tools":
base: '/dayz-tools/',

// If using a custom domain (e.g. editor.yoursite.com):
base: '/',
```

Also update the favicon link in `index.html` to match — replace `/dna-keycards-editor/favicon.svg` with `/{your-repo-name}/favicon.svg`, or just use `./favicon.svg` if on a custom domain.

Commit and push this change before enabling Pages.

### Step 3 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar under Code and automation)
3. Under **Source**, select **GitHub Actions**
4. That is it — the workflow in `.github/workflows/deploy.yml` handles everything automatically

### Step 4 — Trigger the first deploy

The workflow runs automatically on every push to `main`. If you want to trigger it manually:

1. Go to your repo → **Actions** tab
2. Click **Deploy to GitHub Pages** in the left list
3. Click **Run workflow** → **Run workflow**

Your site will be live at:

```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

The first deploy takes about 2 minutes. Subsequent deploys on push are faster.

---

### Using a Custom Domain (optional)

1. Set `base: '/'` in `vite.config.js`
2. Create `public/CNAME` containing just your domain name:
   ```
   editor.yoursite.com
   ```
3. In GitHub → Settings → Pages, enter your custom domain and click Save
4. At your DNS provider, add a CNAME record pointing your subdomain to `YOUR_USERNAME.github.io`

---

## Project Structure

```
dna-keycards-editor/
├── .github/
│   └── workflows/
│       └── deploy.yml        # Auto-deploys to GitHub Pages on push to main
├── public/
│   └── favicon.svg           # Browser tab icon (5-tier colour bars)
├── src/
│   ├── App.jsx               # Complete editor — all sections, import, validator, export
│   └── main.jsx              # React DOM entry point
├── .gitignore                # Excludes node_modules and dist
├── index.html                # HTML shell with meta tags and React mount point
├── package.json              # Dependencies and npm scripts
├── README.md                 # This file
└── vite.config.js            # Vite config — set base path here for GitHub Pages
```

### Key files explained

**`src/App.jsx`** — The entire application in one file. It contains:
- Constants and style helpers at the top
- JSON import/detection functions (one per config file type)
- JSON validator (`validateFiles`)
- Individual section editor components (`WeaponSec`, `ClothingSec`, etc.)
- `buildFiles()` — reconstructs all 14 JSON files with exact schema from editor state
- `App` — the root component with sidebar navigation, file import handling, and export logic

**`vite.config.js`** — The only file you need to edit before deploying. Change `base` to match your repo name.

**`.github/workflows/deploy.yml`** — GitHub Actions workflow. On every push to `main` it installs dependencies, runs `vite build`, and deploys the `dist/` output to GitHub Pages using the official Actions. No secrets or tokens needed.

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Inline styles + CSS variables (no stylesheet dependency) |
| Fonts | Orbitron via Google Fonts (CSS import, no JS) |
| Deployment | GitHub Actions + GitHub Pages |
| Runtime dependencies | React, React-DOM only |
| Dev dependencies | Vite, @vitejs/plugin-react, gh-pages |

Zero third-party UI libraries. No state management library. No router.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server at localhost:5173 with hot reload |
| `npm run build` | Build production bundle to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run deploy` | Build and push to `gh-pages` branch (alternative to GitHub Actions) |

---

## FAQ

**Does this send my config data anywhere?**
No. Everything runs in your browser tab. Files are read locally via the File API, edited in memory as React state, and downloaded back to your machine via Blob URLs. No data leaves your computer.

**My import log says "Could not detect file type" for a file.**
The editor detects file type by looking for specific top-level JSON keys. If a file has been heavily modified or uses a different mod version's schema, it may not match. You can still populate that section manually using the editor.

**The Download All button downloads files with underscores in the name instead of folders.**
This is intentional — browsers cannot create folders on download. The filenames use underscores to indicate path, e.g. `Loot_Weapons_KeyCard_Weapons_Config.json`. Place them back in the correct folders on your server manually.

**Some number fields let me type values outside the allowed range.**
The editor clamps values to the allowed min/max when you change the field. The validator will also flag out-of-range values as errors if any slip through.

**I changed my repo name after deploying and now it shows a blank page.**
Update the `base` field in `vite.config.js` to the new repo name, commit, and push. The Actions workflow will redeploy automatically within a minute or two.

**Can I run this without internet access?**
Yes — after the page loads once, the editor works fully offline. The only external resource is the Orbitron font from Google Fonts, which falls back gracefully to system sans-serif if unavailable.

**The GitHub Actions deploy fails with a permissions error.**
Make sure Pages is set to use **GitHub Actions** as the source (not the legacy branch method). Go to Settings → Pages → Source → GitHub Actions.

---

## License

MIT — use it, fork it, modify it freely. Not affiliated with the DNA Keycards mod or its authors.
