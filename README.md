# AcademiaFlow

Master Your Academic Journey & Student Productivity. AcademiaFlow is a comprehensive, static, offline-first web application designed to help students track their academic progress across various educational levels and manage their daily productivity.

## Project Overview & Architecture

AcademiaFlow is a Next.js application built with the App Router. It is designed as a zero-backend, fully static web app that operates entirely in the browser.

**Key Features:**
- **Multi-Level Grade Tracking:** Calculate and track grades for School (Grades 1-12), Undergraduate (Bachelor's), Postgraduate (Master's), and Doctorate (Ph.D.).
- **Productivity Suite:** Manage daily tasks with a prioritized To-Do list and track exam revision progress with a custom study checklist.
- **Offline-First & Local Storage:** All data is saved automatically and instantly to your browser's local storage. No accounts, no backend databases.
- **Import / Export System:** Easily backup your entire academic and productivity record to a local JSON file, and restore it on any device.
- **PWA Ready:** Install AcademiaFlow directly to your device's home screen for a native app-like experience.

## Folder Structure Guide

```
├── public/                 # Static assets (icons, manifest, service worker)
├── src/
│   ├── app/                # Next.js App Router pages and layout
│   │   ├── layout.tsx      # Root layout, theme provider, service worker registration
│   │   ├── page.tsx        # Main application dashboard
│   │   └── globals.css     # Global Tailwind CSS styles
│   ├── components/         # Reusable React UI components
│   │   ├── Navbar.tsx      # Header, Theme Toggle, PWA Install logic
│   │   ├── SaveControl.tsx # Import/Export JSON data management
│   │   ├── ...             # Various calculator and productivity components
│   ├── lib/                # Utility functions
│   │   └── utils.ts        # Helper methods and initial state definitions
│   └── types/              # TypeScript type definitions
│       └── academic.ts     # Core data interfaces for the application state
```

## Customization Guide

AcademiaFlow is built to be easily customizable:

1.  **Editing Theme Colors:** Modify the Tailwind CSS utility classes in your components or adjust the root variables in `src/app/globals.css`.
2.  **Adjusting Grading Schemes:** The logic for SGPA/CGPA calculations is contained within the respective calculator components (e.g., `src/components/UGCalculator.tsx`). You can edit the math or grading scales directly in these files.
3.  **Adding New Academic Levels:**
    - Add a new level to the `AcademicLevel` type in `src/types/academic.ts`.
    - Create a new component for it in `src/components/`.
    - Update `src/app/page.tsx` to render your new component when the level is selected.

## Data Schema

When you export your data, AcademiaFlow generates a JSON file. The root structure follows the `AcademiaFlowState` interface found in `src/types/academic.ts`:

```json
{
  "academicLevel": "undergraduate",
  "school": { ... },
  "undergraduate": {
    "degreeName": "B.Tech",
    "collegeName": "University",
    "durationYears": 4,
    "semesters": [ ... ]
  },
  "postgraduate": { ... },
  "doctorate": { ... },
  "todos": [
    {
      "id": "t-12345",
      "title": "Finish Assignment",
      "deadline": "2026-05-10",
      "completed": false,
      "priority": "high"
    }
  ],
  "revisions": [ ... ]
}
```

## Cloudflare Pages Deployment Guide

AcademiaFlow is optimized for direct static deployment on Cloudflare Pages.

1.  Push this repository to your GitHub account.
2.  Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3.  Select your GitHub repository.
4.  Configure the build settings:
    - **Framework preset:** Next.js (Static HTML Export)
    - **Build command:** `npm run build`
    - **Build output directory:** `out`
5.  Click **Save and Deploy**. Cloudflare will automatically build and deploy your static application globally.

---
*Powered by [Saamio](https://saamio.com)*
