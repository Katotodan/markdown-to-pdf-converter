# Markdown to PDF Converter

A small Express app that converts Markdown into a downloadable PDF.

**Contents**
- `server.js` — Express server and routes (Converter logic)
- `public/` — static assets (client JS, CSS)
- `views/` — EJS templates


**Prerequisites**
- Node.js (v16+ recommended)
- npm
- Internet access to install dependencies (Puppeteer will download a Chromium build)
- Optional: Docker (see `README.Docker.md`)

**Install**

1. Install dependencies:

```bash
npm install
```

**Run (development)**

```bash
npm run dev
# then open http://localhost:3000
```

**Run (production)**

```bash
npm start
```

**Tests**

No test suite is included in this repository. Jest (or any other test runner) is not used currently, in other to make this repo simple for reviewer.

**How the app serves static files**

The server uses `express.static('public')` to expose files inside `public/` at the site root. Example:

- `public/script.js` is available as `/script.js` in the browser. The app's EJS template should reference it like:

```html
<script src="/script.js"></script>
```

If you see a blank page or client JS not executing, check DevTools → Network to ensure `/script.js` is served (HTTP 200) and DevTools → Console for syntax/module errors.

**Puppeteer / Chromium notes**

- Puppeteer automatically downloads a compatible Chromium binary at `npm install` time. If you want to use an installed Chrome instead, set the `PUPPETEER_EXECUTABLE_PATH` env var or modify `lib/convert.js` accordingly.
- Running Puppeteer in CI often requires `--no-sandbox` and `--disable-setuid-sandbox` flags (already used in this project).

**Docker (Recommended)**

This project is commonly deployed inside Docker so the Chromium runtime and necessary libraries are consistent across environments. See `README.Docker.md` for a full Dockerfile and notes.

Quick commands to build and run the container locally:

```bash
`docker compose up --build`

# then open http://localhost:3000
```

Notes for Docker:
- The container must include the Chromium binary and required system libraries. The project's `README.Docker.md` contains a recommended Dockerfile and tips for headless Chromium.
- Puppeteer inside Docker still benefits from the `--no-sandbox` and `--disable-setuid-sandbox` flags.

**Troubleshooting**

- Script not loading / not found: ensure `app.use(express.static('public'))` is present in `server.js` and your `<script>` tag uses the correct path (see above).
- CSS not applied / caching: do a hard refresh (Cmd+Shift+R) or clear cache in DevTools.
- Tests fail with ESM/Jest errors: ensure your Node/Jest versions support ESM. See `jest.config.cjs` for current project settings.

**Contributing / Next steps**

- Add more tests .
- Add a small CI workflow (GitHub Actions) to run tests on push.

**Auther**

APIPAWE KATOTO Daniel


**License**

MIT
