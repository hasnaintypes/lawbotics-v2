# LawBotics Web

**AI-powered legal document analysis and management for legal professionals and individuals.**

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup & Installation](#setup--installation)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [FAQ](#faq)
- [Testimonials](#testimonials)
- [Contract Templates](#contract-templates)
- [Error Handling](#error-handling)
- [License](#license)

---

## Overview

LawBotics is a modern web application that leverages AI to analyze, manage, and draft legal documents. It is designed for law firms, legal teams, and solo practitioners to streamline contract review, risk analysis, and document management.

---

## Features

- **AI Document Analysis:** Automated risk scoring, clause recommendations, and plain-language summaries.
- **Chat with Documents:** Ask questions about contracts and get instant, accurate answers.
- **Legal Search Engine:** Search legal databases with citations and references.
- **Contract Drafting:** AI-assisted drafting, template library, version control, and collaborative editing.
- **Legal Analytics:** Advanced analytics and reporting on your document portfolio.
- **Clause Recommendations:** Context-aware clause suggestions and compliance checks.

See `src/constants/features_section.ts` for more details.

---

## Technologies Used

- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS, tw-animate-css
- **Authentication:** Clerk
- **Database:** Convex (real-time, serverless)
- **AI & NLP:** Google Generative AI, LangChain
- **Rich Text Editor:** Tiptap
- **State Management:** Zustand
- **Forms:** React Hook Form
- **PDF & Document Tools:** pdf-parse, react-pdf, jspdf
- **Charts & Analytics:** Recharts
- **Other:** Radix UI, Sonner (notifications), Lucide React (icons)

See `package.json` for a full list of dependencies.

---

## Project Structure

```
apps/web/
  src/
    app/                # Next.js app directory (layouts, pages, manifests)
    components/         # UI components, providers, layout, shared
    constants/          # Feature, FAQ, contract templates, etc.
    hooks/              # Custom React hooks
    lib/                # Utility functions
    store/              # Zustand stores
    types/              # TypeScript types
  convex/               # Convex backend functions and schema
  public/               # Static assets
  ...
```

---

## Setup & Installation

1. **Clone the repository:**

   ```sh
   git clone <repo-url>
   cd lawbotics-v2/apps/web
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.local` and set your keys:
     ```
     NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
     CLERK_SECRET_KEY=...
     CONVEX_DEPLOYMENT=...
     NEXT_PUBLIC_CONVEX_URL=...
     CLERK_WEBHOOK_SECRET=...
     NEXT_PUBLIC_GOOGLE_API_KEY=...
     ```

4. **Run the development server:**

   ```sh
   npm run dev
   ```

5. **Build for production:**
   ```sh
   npm run build
   npm start
   ```

---

## Environment Variables

See `.env.local` for required variables:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CONVEX_DEPLOYMENT`
- `NEXT_PUBLIC_CONVEX_URL`
- `CLERK_WEBHOOK_SECRET`
- `NEXT_PUBLIC_GOOGLE_API_KEY`
- ...and Clerk sign-in/up URLs

---

## Usage

- Access the dashboard, upload and analyze documents, chat with contracts, draft new agreements, and view analytics.
- Authentication is handled via Clerk.
- Real-time updates and collaboration are powered by Convex.

---

## FAQ

See `src/constants/faq-section.ts` for common questions, including:

- Supported document types
- AI accuracy
- Data security
- Customization options
- Integration capabilities
- Document limits and analysis speed
- Support and training

---

## Testimonials

LawBotics is trusted by law firms, general counsels, and solo practitioners. See `src/constants/testimonials-section.ts` for real-world feedback and case studies.

---

## Contract Templates

Pre-built templates for NDAs, Service Agreements, Employment Contracts, and more. Each template includes customizable fields and standard clauses. See `src/constants/contract-templates.ts`.

---

## Error Handling

Centralized error messages and patterns for document analysis are defined in `src/constants/analysis-errors.ts`. Includes user-friendly messages for service outages, rate limits, connection issues, and more.

---

## License

Copyright © 2025 [Your Name]

This project is licensed under a custom Attribution License.

You are free to use, modify, and distribute this software for any purpose, provided that you give clear and visible credit to the original creator: **[Your Name]**.

### Attribution Requirements

- Any public use, distribution, or derivative work must include a visible notice:
  > “Based on LawBotics by [Your Name]”
- If used in a website or application, the attribution must appear in the documentation, about page, or footer.
- You may not remove or obscure the original author's credit in any form of redistribution.

### Commercial Use

For commercial use, please contact the author for explicit permission.

### Disclaimer

This software is provided "as is", without warranty of any kind. The author is not liable for any damages arising from the use of this software.

---

---

**For more information, see the source code and documentation in the respective folders.**

---
