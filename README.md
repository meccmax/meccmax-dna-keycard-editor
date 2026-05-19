# DNA Keycards Config Editor

A full GUI editor for all 14 configuration files in the [DNA Keycards DayZ mod](https://github.com/KamS04/DNA_Keycards).

**Features:**
- Import your existing JSON configs (auto-detects file type)
- Edit all sections: Weapons, Clothing, General Loot, Smol Crates, Main System, Container Quantities, Mobs, Reset Timers, Smol System, Door Alarms
- Import `types.xml` for classname autocomplete
- Built-in validator checks for schema errors before export
- Export all 14 files with exact schema matching for drop-in server deployment

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploying to GitHub Pages

### Option A — Automatic (GitHub Actions, recommended)

1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **GitHub Actions**
4. Push to `main` — it builds and deploys automatically

Your site will be at: `https://<your-username>.github.io/dna-keycards-editor/`

### Option B — Manual

```bash
npm run deploy
```

This builds and pushes to the `gh-pages` branch.

## After deploying

If your repo is named something other than `dna-keycards-editor`, update the `base` field in `vite.config.js`:

```js
base: '/your-repo-name/',
```

If you use a custom domain, set `base: '/'` and add a `CNAME` file to the `public/` folder.
