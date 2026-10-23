# AGENTS.md

Marzellus (marzellusco.com): a headless Shopify storefront built with Astro, deployed to Cloudflare Workers. Built on a custom theme by Cobalt Web Technologies. Product, collection, cart and customer data come from the Shopify Storefront GraphQL API.

## Stack

- **Framework:** Astro 7 with `output: "server"` (SSR) and the `@astrojs/cloudflare` v14 adapter (dev/preview run in `workerd` via the Cloudflare Vite plugin)
- **UI:** Astro components plus React 19 islands (`@astrojs/react`), MDX content (`@astrojs/mdx`)
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite`, not PostCSS), `tailwind-variants`, `tailwind-merge`, `tw-animate-css`, and Starwind UI components in `src/components/starwind`
- **Commerce:** Shopify Storefront API over GraphQL (hand-written query strings, no codegen)
- **State:** `nanostores` with `@nanostores/react` (cart store in `src/cartStore.ts`)
- **Database:** Cloudflare D1 (`DB_MARKETING` binding) accessed through `drizzle-orm`, with migrations from `drizzle-kit`
- **Integrations:** Klaviyo (`klaviyo-api`), Cloudflare Turnstile, Umami analytics
- **Tooling:** pnpm, Biome (format and lint), TypeScript 7 strict (`@astrojs/check` officially supports only TS 5/6), Wrangler

## Commands

Use **pnpm** only. Do not use npm or yarn. `.npmrc` sets `node-linker=hoisted`.

| Command | Purpose |
| --- | --- |
| `pnpm dev` | Astro dev server (runs in `workerd`; CommonJS-only server deps must be pre-bundled in `astro.config.mjs`) |
| `pnpm build` | Production build (`dist/client` static assets, `dist/server` worker + generated `wrangler.json`) |
| `pnpm preview` | Preview the build |
| `pnpm check` | `astro check` type checking (run after TS or Astro changes) |
| `pnpm lint` | `biome lint` |
| `pnpm format` | `biome format --write` |
| `pnpm up:astro` | Upgrade Astro and its integrations (`@astrojs/upgrade`) |
| `pnpm up:biome` | Update Biome and run `biome migrate --write` |
| `pnpm upforce` | Bump all deps to latest. Risky, so don't run it unless asked. |
| `pnpm clean` | Deletes `dist`, `.astro`, `node_modules` and lockfiles. Destructive, so don't run it unless asked. |

There is no test suite. Verify changes with `pnpm check`, `pnpm lint` and `pnpm build`.

Database migrations (no package script exists):

```sh
pnpm drizzle-kit generate --config drizzle/drizzle.marketing.config.ts
```

Schema is in `src/db/marketing-schema.ts`, and generated SQL goes to `drizzle/marketing/`. Apply migrations with Wrangler (`pnpm wrangler d1 migrations apply marzellus-marketing`).

## Project Layout

```
src/
  actions/          Astro Actions (e.g. marketing/Klaviyo signup, writes to D1)
  cartStore.ts      Nanostores cart + layout-view state
  components/       Starwind UI components (generated, see starwind.config.json)
  config/           config.json, menu.json, social.json (site settings, nav)
  content/          Content collections (about, policies, sections)
  db/               Drizzle schemas
  layouts/
    Base.astro      Root layout
    components/     .astro presentational components
    functional-components/   React (.tsx) islands (cart, filters, grids, search...)
    partials/       Header, Footer, PageHeader, CTA
    shortcodes/     MDX shortcodes (auto-imported, see astro.config.mjs)
    helpers/
  lib/
    shopify/        Shopify GraphQL client (see below)
    utils/          cartActions, text, date and sort helpers
    constants.ts, typeGuards.ts, utils.ts
  pages/            Routes: index, products/, policies/, contact, api/ (login, sign-up, products.json)
  styles/           Global CSS (Tailwind v4 entry is global.css)
  types/
drizzle/            Drizzle config + D1 migrations
.agents/skills/     Agent skills (including a Shopify skill)
```

## Shopify / GraphQL

All Shopify access goes through `src/lib/shopify/index.ts`, which exports `shopifyFetch` and the typed helpers built on it (`getCart`, `getProduct`, `getCollections`, etc.).

- GraphQL documents live in `queries/`, `mutations/` and `fragments/` as template-string exports. Add new operations there and wire them up in `index.ts`.
- Shared fragments (`cart`, `product`, `image`, `seo`) are composed into queries. Reuse them instead of duplicating fields.
- Types are in `src/lib/shopify/types.ts`. Each operation has a `Shopify*Operation` type (with `data` and `variables`) passed to `shopifyFetch<T>`. Raw Shopify shapes (`ShopifyProduct`, `ShopifyCart`) are normalized to the app's `Product` and `Cart` types by the `reshape*` helpers in `index.ts`.
- The endpoint is `PUBLIC_SHOPIFY_STORE_DOMAIN` plus `SHOPIFY_GRAPHQL_API_ENDPOINT` (from `src/lib/constants.ts`). It authenticates with the `X-Shopify-Storefront-Access-Token` header.
- Products tagged `HIDDEN_PRODUCT_TAG` are filtered out. Keep that behavior when adding product queries.
- Checkout happens on Shopify via the cart's `checkoutUrl`. There is no custom checkout.
- Cart state is client-side: `src/cartStore.ts` plus `src/lib/utils/cartActions.ts`, with the cart ID kept in a cookie (`js-cookie`).

## Environment & Cloudflare

- Public vars (`PUBLIC_SHOPIFY_STORE_DOMAIN`, `PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN`, `PUBLIC_TURNSTILE_SITE_KEY`, `UMAMI_ID`) are in `wrangler.jsonc` `vars`.
- Secrets are in local `.env` (gitignored) and Cloudflare secrets: `KLAVIYO_API_KEY`, `TURNSTILE_SECRET_KEY`. Never commit or print secret values.
- Bindings (D1 `DB_MARKETING`) and secrets are read with `import { env } from "cloudflare:workers"`, not `Astro.locals.runtime` (removed) or `process.env`. Never read secrets via `import.meta.env`: Astro 6+ inlines it at build time. Runtime types come from `src/env.d.ts`, which references `worker-configuration.d.ts` (generate with `pnpm wrangler types` if it's missing).
- Code runs on Workers (`nodejs_compat`), so avoid Node-only APIs that Workers don't support (e.g. `fs` at request time).

## Code Style

- **Biome is the formatter and linter**, not Prettier or ESLint. It uses **tabs** and **double quotes**, and organizes imports automatically. Run `pnpm format` and `pnpm lint` before finishing.
- Biome only covers `src/**`, `*.astro`, `.vscode/*` and `astro.config.mjs`.
- TypeScript is strict. Use `import type` for type-only imports in `.ts` and `.tsx` files.
- Path aliases (tsconfig):
  - `@/components/*` maps to `src/layouts/components/*`. This is **not** `src/components`.
  - `@/functional-components/*`, `@/shortcodes/*`, `@/helpers/*` and `@/partials/*` map to the matching `src/layouts/*` folders.
  - `@/styles/*` maps to `src/styles/*`.
  - `@/*` maps to `src/*`.
- Use `.astro` for static or server-rendered UI and `.tsx` only for interactive islands. Choose the lightest `client:*` directive that works.
- Style with Tailwind v4 utilities. Merge conditional classes with `tailwind-merge` and `tailwind-variants`. Tailwind is configured in CSS (`src/styles/global.css`), so don't add a `tailwind.config.js`.
- Site-wide settings (title, base path, trailing slash, etc.) come from `src/config/config.json`. Nav comes from `menu.json`.
- Starwind components in `src/components/starwind` are generated. Prefer `pnpm dlx starwind@latest add <name>` over hand-editing, and tweak sparingly.
- MDX shortcodes (`Button`, `Accordion`, `Notice`, `Video`, `Youtube`, `Tabs`, `Tab`) are auto-imported through `astro-auto-import`. Add new ones in `astro.config.mjs`.

## Gotchas

- `pnpm-lock.yaml` is committed, so use `pnpm add` and don't hand-edit it.
- `worker-configuration.d.ts` is generated by the Wrangler CLI for Cloudflare types so regenerate it with `pnpm wrangler types`
- Dependabot is configured in `.github/dependabot.yml`. Astro integrations are pinned to exact versions in `package.json`, so upgrade them together with `pnpm up:astro`.
- Server routes (`src/pages/api/*`, `src/actions`) run on Workers. Validate input with `astro/zod` (Zod 4) and verify Turnstile tokens server-side for public forms.
- Astro docs are available through the configured MCP server in `opencode.json`. Prefer it over memory for Astro documentation.
