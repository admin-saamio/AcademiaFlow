# AcademiaFlow

Master Your Academic Journey & Student Productivity. AcademiaFlow is a highly optimized, fully static, offline-first Progressive Web App (PWA) designed to help high-performers track their academic trajectory across all educational levels while simultaneously managing their productivity.

## Project Overview & Architecture

AcademiaFlow is built natively on Next.js 14 (App Router) and Tailwind CSS. It is architected as a **Zero-Backend Application**:
- **Offline-First Storage:** State is persisted entirely in the browser's `localStorage`. No databases, no cloud authentication, no tracking. Total privacy.
- **PWA Capabilities:** Complete Service Worker integration allows the application to be installed on any device (iOS, Android, Desktop) like a native app.
- **Data Portability:** Extensive, detailed JSON and CSV export/import functionality allows users to seamlessly backup and migrate their data across devices manually.
- **Mobile-App UI:** Features a bottom navigation bar layout for mobile devices, maximizing usability and mimicking a true native mobile experience.

### Core Features
- **School (Grades 1-12):** Manage multiple exam instances (e.g. Mid-Terms, Finals) per grade, with infinite subjects and automated percentage calculators.
- **Undergraduate & Postgraduate:** Create multiple degrees simultaneously. Dynamically unlocks 6, 8, 10, or 12 semesters based on duration. Calculates current and estimated final percentage dynamically.
- **Doctorate (Ph.D.):** Log coursework CGPA, defense status, and track unlimited publications, conferences, and journal papers with DOI links.
- **Productivity Suite:** Two-pane productivity dashboard. An interactive To-Do list with priorities/deadlines, and a separate "Quick Notes" section for drafting ideas.

---

## Detailed Customization & Editing Guide

AcademiaFlow is structured intuitively so any developer can extend or modify it safely without causing merge conflicts.

### 1. Folder Structure Breakdown
```
├── public/
│   ├── assets/icons/       # Source SVG logos and sharp generated icons
│   ├── sw.js               # Service Worker for PWA functionality
│   └── site.webmanifest    # Web app manifest defining standalone UI behavior
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout, ThemeProvider, and ServiceWorker registration
│   │   ├── page.tsx        # Main entry point; manages the Bottom Navigation state and tab rendering
│   │   └── globals.css     # Global Tailwind CSS and custom keyframe animations
│   ├── components/         # Reusable UI Modules
│   │   ├── Navbar.tsx      # Header with PWA install prompts and Dark mode toggle
│   │   ├── BottomNav.tsx   # Mobile-app style navigation controller
│   │   ├── Preloader.tsx   # Intro animation (shown once per session)
│   │   ├── ProductivitySuite.tsx # Tasks and Quick notes implementation
│   │   ├── SaveControl.tsx # The entire Data tab logic (JSON/CSV Export, Import)
│   │   └── *Calculator.tsx # The 4 independent academic calculators
│   ├── lib/
│   │   └── utils.ts        # Helper functions (cn) and INITIAL_ACADEMIC_STATE
│   └── types/
│       └── academic.ts     # Core TypeScript schema definitions.
```

### 2. How to Add a New Field to a Calculator
If you want to add a new field (e.g. "Teacher Name") to the School component:
1. **Update the Type**: Go to `src/types/academic.ts` and add `teacherName: string;` to the `SchoolExam` interface.
2. **Update Initial State**: Go to `src/lib/utils.ts` and add `teacherName: ""` inside the `SchoolExam` objects within `INITIAL_ACADEMIC_STATE`.
3. **Update UI**: Go to `src/components/SchoolCalculator.tsx`, locate the `grid` where inputs are rendered, and add a new input. Hook it up using `onChange={(e) => handleUpdateExam(exam.id, "teacherName", e.target.value)}`.
4. **Update CSV Export**: Go to `src/components/SaveControl.tsx`, locate the `handleExportCSV` function, and append the new `teacherName` to the School CSV headers and data rows.

### 3. How to Modify the Design/Theme
- The app uses standard **Tailwind CSS**. Open `src/app/globals.css` to modify core variables.
- We rely extensively on Tailwind's dark mode via the `dark:` prefix.
- Primary theme color is `emerald-500` to `teal-700`. To change this, perform a global find-and-replace for `emerald` and `teal` to your desired Tailwind color palettes (e.g., `blue`, `indigo`).

---

## Data Schema & Portability

Because AcademiaFlow has no database, users maintain ownership of their data. The application uses a complex nested JSON structure defined by `AcademiaFlowState` in `src/types/academic.ts`.

The `SaveControl.tsx` file handles parsing this massive object. When a user clicks "Export CSV", the application safely flattens these arrays into standard comma-separated values so students can visualize their trajectory in Excel or Google Sheets.

---

## Universal Deployment Guide (Cloudflare Pages & Vercel)

AcademiaFlow is heavily optimized to be deployed instantly without any build configuration errors on modern edge platforms. It uses the `output: 'export'` feature in `next.config.ts` to compile into entirely HTML/CSS/JS static files, making it incredibly fast and completely serverless.

### Option A: Cloudflare Pages (Recommended)
1. Push your customized repository to your GitHub account.
2. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
3. Click **Create application** -> **Pages** -> **Connect to Git**.
4. Select your repository.
5. **Build Settings:**
    - **Framework preset:** `Next.js (Static HTML Export)`
    - **Build command:** `npm run build`
    - **Build output directory:** `out`
6. Click **Save and Deploy**.

### Option B: Vercel
1. Log in to [Vercel](https://vercel.com/) and click **Add New...** -> **Project**.
2. Import your GitHub repository.
3. Vercel will automatically detect it as a Next.js project.
4. Leave the default build command (`next build`) and output directory (`.next`). Vercel natively understands the `output: 'export'` configuration.
5. Click **Deploy**.

> **Troubleshooting Builds:** If you ever face any build issues regarding "Unterminated regexp literal" or parsing errors on deployment platforms, rest assured it has been completely resolved. All Service Worker registrations are handled natively via pure static JavaScript files (`public/register-sw.js`), ensuring zero build-time conflicts with Next.js parsers.

---
*Powered by [Saamio](https://saamio.com)*
