# AcademiaFlow

Master Your Academic Journey & Student Productivity. AcademiaFlow is a zero-build, ultra-lightweight, offline-first Progressive Web App (PWA) designed to help high-performers track their academic trajectory and tasks.

## Why Plain HTML/JS?

AcademiaFlow has been fully converted from a Node/Next.js environment into **pure HTML, CSS, and Vanilla JavaScript (with Alpine.js)**.

### Why is this better?
1.  **Zero Build Errors:** There is no `npm install`, no `npm run build`, and no dependency conflicts.
2.  **Instant Deployments:** You can drag and drop this folder directly into Cloudflare Pages, Vercel, or Netlify and it will be live in 1 second.
3.  **Utterly Foolproof:** Anyone can edit the text, change colors, or modify the app by simply opening `index.html` in Notepad.
4.  **Offline-First & True PWA:** The Service Worker (`sw.js`) caches the CDNs natively. The app can be installed on iOS, Android, and Desktop via the integrated "Install App" button, saving all data strictly to `localStorage`.

---

## Folder Structure

```
├── index.html          # The entire User Interface, styling (Tailwind CDN), and Views.
├── app.js              # The application logic, state, and CSV/JSON Export handlers.
├── sw.js               # Service Worker caching for Offline PWA support.
├── site.webmanifest    # Configuration for standalone app installation.
└── *.png / *.ico       # Application logos and favicons.
```

---

## How to Edit Text & Content

Because there is no complex React routing or components, editing is incredibly simple:

1. Open `index.html` in any text editor (like VS Code, Sublime, or Notepad).
2. Use `Ctrl+F` (or `Cmd+F`) to find the text you want to change.
    - Example: Search for `"Engineer Your Success"` and change it to `"Master Your Grades"`.
3. Save the file.
4. Refresh your browser to instantly see the change. No compilation required.

---

## Deployment Guide (Cloudflare Pages)

Since this is a static site, deployment is instant and impossible to break.

1. Push this repository to GitHub.
2. Go to your **Cloudflare Dashboard** > **Workers & Pages**.
3. Click **Create application** > **Pages** > **Connect to Git**.
4. Select your repository.
5. In the Build Settings:
   - **Framework preset:** `None`
   - **Build command:** *(Leave completely blank)*
   - **Build output directory:** `/` (or leave blank)
6. Click **Save and Deploy**.

*The same process applies to Vercel, Netlify, or even basic GitHub Pages.*

---
*Powered by [Saamio](https://saamio.com)*
