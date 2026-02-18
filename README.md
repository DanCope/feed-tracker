# 🍼 Feed Tracker

A progressive web app for tracking baby feeds and nappy changes — built for two parents, designed for 3am one-handed use.

## What it does

- **Breast feed** — log left/right side and duration with a timer
- **Bottle feed** — log amount before, duration, and amount remaining after
- **Nappy change** — log poop and pee on a quick scale
- All logs go straight into a shared Google Sheet

## Tech stack

| Layer     | Choice                             |
| --------- | ---------------------------------- |
| Framework | SvelteKit (Svelte 5, TypeScript)   |
| Styling   | Tailwind CSS v4                    |
| PWA       | vite-plugin-pwa                    |
| Hosting   | GitHub Pages (static)              |
| Backend   | Google Apps Script → Google Sheets |

## Development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
pnpm preview
```

## Deploy

Push to `main`. GitHub Actions builds the site and deploys to GitHub Pages automatically.

Before the first deploy, set **Settings → Pages → Source** to **GitHub Actions** in your repository.

## Backend setup

The app uses a Google Sheet as its database and a Google Apps Script web app as the write endpoint.

### 1. Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet named **Feed Tracker**
2. Rename the default tab (e.g. `Sheet1`) to **Logs**
3. Add the following headers in row 1:

   | A         | B    | C    | D    | E                  | F                  | G                 | H    | I   | J     |
   | --------- | ---- | ---- | ---- | ------------------ | ------------------ | ----------------- | ---- | --- | ----- |
   | Timestamp | User | Type | Side | Duration (seconds) | Amount Before (ml) | Amount After (ml) | Poop | Pee | Notes |

4. Freeze row 1: **View → Freeze → 1 row**
5. Share the sheet with any co-parent Google accounts (Editor access); keep link sharing **off**

### 2. Create the Apps Script

1. Go to [script.google.com](https://script.google.com) and click **New project**
2. Replace the contents of `Code.gs` with the following:

```javascript
const SPREADSHEET_ID = "YOUR_SPREADSHEET_ID"; // from the sheet URL
const SHEET_NAME = "Logs";
const SECRET = "YOUR_SECRET_HERE";

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);

    if (payload.secret !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Unauthorized" })).setMimeType(
        ContentService.MimeType.JSON,
      );
    }

    var sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

    sheet.appendRow([
      new Date(),
      payload.user || "",
      payload.type || "",
      payload.side || "",
      payload.duration || "",
      payload.amount_before || "",
      payload.amount_after || "",
      payload.poop || "",
      payload.pee || "",
      payload.notes || "",
    ]);

    return ContentService.createTextOutput(JSON.stringify({ status: "ok" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message })).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
}
```

3. Set `SPREADSHEET_ID` to the ID from your sheet's URL:
   `https://docs.google.com/spreadsheets/d/`**`SPREADSHEET_ID`**`/edit`
4. Set `SECRET` to a hard-to-guess passphrase (e.g. a few random words)

### 3. Deploy as a web app

1. Click **Deploy → New deployment**
2. Click the gear icon next to **Type** and select **Web app**
3. Set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** and copy the web app URL

### 4. Add the URL and secret to the app

Create a `.env` file at the project root:

```env
PUBLIC_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
PUBLIC_API_SECRET=YOUR_SECRET_HERE
```

### 5. Verify the endpoint

```bash
curl -L -X POST "YOUR_WEB_APP_URL" \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET_HERE","user":"Mum","type":"nappy","poop":"Small","pee":"Medium"}'
```

Expected response: `{"status":"ok"}` and a new row in the sheet.

---

## Project docs

- [Project brief](PROJECT.md)
- [Backlog](BACKLOG.md)
