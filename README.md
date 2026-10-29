# StudyBuddy418Y

A team-built course platform: instructors create courses, share materials, publish assignments, and return feedback; students enroll, submit work, and track their own progress.

The Next.js starter and Supabase libraries are installed. Application pages, authentication, database migrations, and feature APIs are not implemented yet. Empty folders are placeholders, not working routes.

Start with [the current audit and first team assignments](docs/TEAM_START.md). The [architecture proposal](docs/ARCHITECTURE.md), [backlog](docs/BACKLOG.md), and [leadership guide](docs/LEADERSHIP.md) describe the broader plan. Confirm proposed owners with the team.

## Getting Started

Use Node.js 22 LTS and npm for a consistent team environment. The baseline was checked with Node.js 22.20.0 and npm 10.9.3. Run commands from the repository root:

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Fill `.env.local` with the development Supabase URL and publishable key supplied privately by the lead. These variables are setup inputs; the application does not consume them until the clients are implemented. The current starter displays without a Supabase connection. Do not overwrite an already configured `.env.local` when repeating setup.

Edit `src/app/page.tsx` to change the home page. The page updates as you save.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Checks and teamwork

```bash
npx tsc --noEmit
npm run lint
npm run build
```

The starter downloads Geist fonts from Google during a production build, which requires network access. No automated test suite or test command is configured yet; add relevant tests as connected features are implemented.

Audit on October 29, 2026: TypeScript and lint passed. Production build verification was blocked here: the first attempt could not download Google Fonts, and a retry reached a local-process port permission error during CSS processing. A successful production build has not been confirmed. Run the build in the team's normal development environment before marking the baseline fully verified.

Everyone should branch from the same committed baseline, use the committed lockfile, and open small pull requests with demo steps. One teammate reviews each change. Feature owners implement their own pages, endpoints, migrations, permissions, and tests; coordinate changes to shared contracts and layout.

Keep sample-data interface completion separate from connected-feature completion. Keep credentials and real student data out of Git: `.env.example` contains names only and `.env.local` is ignored.

This starter was generated with create-next-app. The product is inspired by Ahmed's prior StudyBuddy concept; record implementation contributions according to class requirements.

## Framework references

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
