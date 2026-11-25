# Duess

A small, mobile-first app that helps students keep track of what's due: homework, projects, exams, and more.

> **Status:** early development. The core app is being built; nothing is deployed yet.

## Why

Deadlines are easy to forget and hard to organize across subjects. Duess lets a student add a task in seconds, right from their phone, and see everything sorted by due date.

## Features

Each task has a subject, a title (e.g. "Chemistry homework"), a due date, a type, and a completion status.

**Planned**

- [ ] Add, edit, delete, and complete tasks
- [ ] Sort by due date, group by subject, hide completed
- [ ] Overdue highlighting
- [ ] Installable PWA that works offline
- [ ] Smart quick entry (type a short phrase, get a structured task)
- [ ] JSON export/import
- [ ] Optional sync across devices (FastAPI backend)

## Design: local-first, sync later

Your data lives on your device, in the browser's IndexedDB. There are no accounts, no server, and no cost, and the app works without a connection. Optional multi-device sync is planned as a later phase, and the data model is designed with that in mind.

## Tech stack

- [Vue 3](https://vuejs.org/) + TypeScript + [Vite](https://vite.dev/)
- [Dexie](https://dexie.org/) for IndexedDB storage (planned)
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) for the manifest and service worker (planned)
- [Vitest](https://vitest.dev/) for tests, ESLint and Prettier for code quality
- FastAPI + SQL for the sync backend (planned)

## Getting started

Requirements: Node.js `^22.18.0` or `>=24.12.0` (v23 is unsupported) and [pnpm](https://pnpm.io/).

```sh
git clone https://github.com/NicoCodesCode/duess.git
cd duess
pnpm install
pnpm dev
```

Other scripts are listed in `package.json`.

## Roadmap

1. Repo foundations and tooling
2. Task data model and validation
3. Storage layer
4. Core logic (sorting, grouping, overdue)
5. Mobile UI
6. PWA layer and deployment
7. Smart quick-entry parser
8. Export/import
9. Sync backend

## Contributing

Contributions and ideas are welcome. Please open an issue first for larger changes. Commits follow [Conventional Commits](https://www.conventionalcommits.org/).

## License

[MIT](LICENSE)
