# Developer Knowledge Base

A personal technical knowledge base built to organize and review software development concepts, notes, examples, and practical references in a simple web interface.

The content is separated into JSON files, allowing the knowledge base to grow without having to place all the content directly inside the application code.

🌐 Live site: https://marcospelizari.github.io

## ✨ Overview

This project was created as a personal study and reference tool, mainly focused on software development and backend technologies.

Instead of keeping notes scattered across different files or applications, the project provides a single interface where technical topics can be selected and reviewed.

Each topic is maintained independently, making it easier to:

- Add new subjects
- Update existing content
- Organize study material
- Review concepts quickly
- Keep the interface separated from the content

## ✅ Features

- **Dashboard home page** with real totals (modules, sections, code snippets, interview questions) and study progress per topic.
- **Three levels per topic**: Essentials (intern), Intermediate (junior) and Advanced (mid-level). Each section is a short lesson — problem, concept, how it works — followed by a common-mistake card and an interview question, with a one-line summary per topic for daily review.
- **Progress tracking**: mark any section as studied. Progress is saved in the browser's `localStorage`, so it is per browser and not synced between devices.
- **Section filters** (Concepts, Practice, Best Practices, Tools) and an in-page **search** that ignores case and accents.
- **Light/dark theme**, following the system preference on the first visit and remembered afterwards.
- **Responsive layout**: fixed sidebar on desktop, hamburger menu on mobile.
- **Syntax highlighting** (Java, YAML, Bash, SQL, Dockerfile, XML, JSON) with a copy button.

## 🗂️ Project Structure

```text
.
├── public/
│   ├── data/
│   │   ├── essencial/      # Essentials level, one JSON per topic
│   │   ├── intermediario/  # Intermediate level, one JSON per topic
│   │   └── avancado/       # Advanced level, one JSON per topic
│   └── favicon.svg
├── src/
│   ├── index.html          # applies the theme before the first paint
│   ├── styles.css          # Tailwind + design tokens (theme colors, layout sizes)
│   └── app/
│       ├── core/           # config, topic list, models, services, utils
│       ├── layout/         # header, sidebar, main layout
│       └── features/       # home page and topic page
├── angular.json
├── package.json
└── README.md
```

### `public/data/`

Contains the knowledge base itself.

Each JSON file represents a major topic at one level and contains the content displayed by the application.

This separation allows the content to be updated without having to rewrite the page structure.

### `src/app/core/`

Shared pieces: the topic list (`data/topics.ts`), filter categories (`data/categories.ts`), site settings (`config/site.config.ts`), the content interfaces (`models/`) and the services for theme, search, mobile menu and study progress.

### `src/app/layout/`

The application shell: header (logo, search, theme switch), sidebar (topics) and the main layout.

### `src/app/features/`

The pages: the dashboard home page and the topic page (with its code block and rich-text components).

## 📚 Topics

The sidebar lists every topic, grouped by area. Each topic has up to three levels: Essentials, Intermediate and Advanced. The content is in English; URLs keep their original slugs.

| Area | Topics |
|---|---|
| Backend | Java Fundamentals, Object-Oriented Programming, Data Structures & Algorithms, Build Tools (Maven & Gradle), Databases, Spring Boot, APIs & Web Services, Messaging (Kafka & RabbitMQ) |
| DevOps & Infra | Linux & the Terminal, Networking, Version Control (Git), Docker & DevOps, Kubernetes & kubectl, CI/CD, Observability |
| Architecture | System Architecture (including system design interviews), Performance & Optimization |
| Quality | Automated Testing, Debugging, Application Security, Best Practices & Clean Code |

> The topic list evolves as new study material is added to the project.

## 🛠️ Technologies

The project currently uses:

- [Angular 22](https://angular.dev) (standalone components, signals, zoneless)
- TypeScript
- [Tailwind CSS 4](https://tailwindcss.com)
- [Prism](https://prismjs.com) for syntax highlighting
- [Vitest](https://vitest.dev) for unit tests
- JSON
- Git / GitHub

The application is intentionally lightweight and does not require a backend or database to operate.

## ▶️ Running Locally

Requirements: a recent Node.js LTS (tested with v24.21) and npm.

```bash
npm install
npm start        # development server at http://localhost:4200
```

| Command | What it does |
|---|---|
| `npm start` | Development server with live reload |
| `npm test` | Unit tests in watch mode (`npx ng test --watch=false` runs them once) |
| `npm run build` | Production build in `dist/estudos-dev/browser` |

URLs use a hash (`/#/ci-cd/essencial`) because GitHub Pages has no fallback for single-page-app routes.

## 🔄 How It Works

The application follows a simple content-driven structure:

```text
JSON files (public/data)
    ↓
Topic list (core/data/topics.ts)
    ↓
Topic selection (sidebar / home page)
    ↓
Angular components
    ↓
Rendered knowledge
```

When a topic is selected, the application loads the corresponding JSON file and renders its content in the interface.

This makes the content modular and easier to maintain.

## ➕ Adding a New Topic

To add a new topic:

1. Create a JSON file for each level the topic has, inside `public/data/essencial/`, `public/data/intermediario/` and/or `public/data/avancado/`.
2. Follow the existing JSON structure (see below).
3. Register the topic in `src/app/core/data/topics.ts`, inside the right group:

   ```ts
   {
     slug: 'kubernetes',
     label: 'Kubernetes',
     files: {
       essencial: 'essencial/kubernetes.json',
       intermediario: 'intermediario/kubernetes-intermediario.json',
       avancado: 'avancado/kubernetes-avancado.json',
     },
   },
   ```

4. Run `npm start` and verify that the content is loaded correctly.

The topic then appears automatically in the sidebar, on the home page and in the totals.

### JSON structure

```json
{
  "title": "Topic title",
  "description": "Short description shown under the title.",
  "version": "Java 21",
  "resumo": ["Summary paragraph 1.", "Summary paragraph 2."],
  "subsections": [
    {
      "subtitle": "Section title",
      "description": "Short section description.",
      "category": "conceitos",
      "examples": [
        {
          "title": "Explanation",
          "interview_question": "An interview question about this section?",
          "explanation": "**Problem:** ...\n\n**Concept:** ...\n\n**How it works:** ...",
          "code": "git init",
          "references": ["https://git-scm.com/doc"]
        }
      ]
    }
  ]
}
```

- `version`, `resumo`, `code`, `interview_question` and `references` are optional.
- `category` drives the filters. Allowed values: `conceitos`, `pratica`, `boas-praticas`, `ferramentas`.
- The language of `code` is detected automatically. Code is shown as plain text, so `<tag>` appears literally.
- In `explanation` and `resumo`, a blank line starts a new paragraph, `` `code` `` renders as inline code and `**bold**` as bold. No HTML is interpreted.
- An example titled `Explanation` shows no heading; any other title (such as `Common mistake`) is shown above its card.
- Saved progress is keyed by topic, level and `subtitle`. Reordering sections keeps progress. When you rename a section or move it to another level, add `formerSubtitle` and/or `formerLevel` with the old values, and existing marks move to the new key.

The goal is to keep each JSON focused on one major subject rather than creating a separate file for every small concept.

## 🚀 Deployment (GitHub Pages)

This is an Angular application, so GitHub Pages must serve the **build output** (`dist/estudos-dev/browser`), not the repository files. The workflow `.github/workflows/deploy.yml` does this on every push to `master` (or by hand from the Actions tab): it runs `npm ci`, the tests and `ng build`, then publishes `dist/estudos-dev/browser`.

One-time setup: in **Settings → Pages**, set **Source = GitHub Actions**. With "Deploy from a branch", Pages publishes the raw repository and the site shows only this README.

## 🚧 Roadmap

Possible future improvements include:

- [x] Expand the technical knowledge base
- [x] Add more Java and backend topics
- [x] Improve topic navigation
- [x] Add search functionality
- [x] Add progress tracking
- [x] Add responsive/mobile improvements
- [ ] Improve accessibility
- [x] Add additional practical examples and code snippets
- [ ] Add a GitHub Actions workflow to build and deploy to GitHub Pages
- [ ] Validate the JSON content automatically in the tests

## 🎯 Purpose

This project is primarily a personal study and reference tool.

Its structure also serves as a practical exercise in:

- Frontend development
- Angular and TypeScript
- Data-driven interfaces
- JSON data modeling
- UI organization
- Git and GitHub
- Software development documentation

## 👤 Author

**Marcos Pelizari**

Developer focused on software development, backend technologies, Java, and continuous learning.

---

Built as a living knowledge base — continuously updated as new concepts are learned and practiced.