# Vercel: two projects, one repo

## Create projects

1. **Desktop:** Import the GitHub repo → Settings → General → **Root Directory** → `apps/desktop`.
2. **Mobile:** New project → same repo → Root Directory → `apps/mobile`.

Framework: Next.js (auto-detected). Do not set the root to the monorepo root for either project.

Each app includes [`vercel.json`](../apps/desktop/vercel.json):

- **`installCommand`:** `cd ../.. && npm ci` — installs from the **monorepo root** using root [`package-lock.json`](../package-lock.json) (required; commit it).
- **`buildCommand`:** `cd ../.. && npx turbo run build --filter=@lark-sso/desktop` (or `@lark-sso/mobile`) — builds from the repo root like local `turbo build`.

Root [`.npmrc`](../.npmrc) sets `maxsockets=1` to reduce flaky npm errors on CI. Leave **Output Directory** empty (default `.next`).

### If `npm ci` or install fails on Vercel

- **Git deploys** clone the full repo — `package-lock.json` at the root must be **committed and pushed**.
- **CLI deploy** from `apps/desktop` only uploads a **subset** of files; `npm ci` can fail if the lockfile never reaches the builder. **Prefer:** push to Git and let Vercel build from Git, **or** run the CLI from the **repository root** after `vercel link` there so the whole repo uploads:
  ```bash
  cd /path/to/lark-sso-app
  npx vercel link   # once
  npx vercel --prod
  ```

### If you see “routes-manifest.json couldn’t be found”

That happens when the project **Root Directory** is still the repo root (old single-app setup). Fix:

1. Vercel → Project → **Settings** → **General** → **Root Directory** → set to `apps/desktop` or `apps/mobile` (not empty / `.`).
2. **Settings** → **General** → clear a custom **Output Directory** if one was set; Next’s default is `.next` relative to the app.
3. Redeploy.

CLI: run `npx vercel --prod` from the **monorepo root** (not only `apps/desktop`) so the upload includes `package-lock.json` and `packages/*`. The linked project’s **Root Directory** in the dashboard should still be `apps/desktop` or `apps/mobile`.

## Production environment variables

Use each project’s **production** URL (e.g. `https://<project>.vercel.app`, no trailing slash).

### Desktop project

| Variable | Example |
|----------|---------|
| `LARK_APP_ID` | Same Lark app in both projects |
| `LARK_APP_SECRET` | Same |
| `NEXT_PUBLIC_LARK_APP_ID` | Same |
| `NEXT_PUBLIC_APP_URL` | `https://lark-sso-desktop.vercel.app` |
| `REDIRECT_URI` | `https://lark-sso-desktop.vercel.app/api/auth/callback` |
| `MOBILE_APP_URL` | `https://lark-sso-mobile.vercel.app` |

### Mobile project

| Variable | Example |
|----------|---------|
| `LARK_*` / `NEXT_PUBLIC_LARK_APP_ID` | Same as desktop |
| `NEXT_PUBLIC_APP_URL` | `https://lark-sso-mobile.vercel.app` |
| `REDIRECT_URI` | `https://lark-sso-mobile.vercel.app/api/auth/callback` |
| `DESKTOP_APP_URL` | `https://lark-sso-desktop.vercel.app` |

## Lark Developer Console

Under the app → redirect / security → **Redirect URLs**, add **both** (exact match):

- `https://<desktop-host>/api/auth/callback`
- `https://<mobile-host>/api/auth/callback`

## After deploy — production checks (no localhost)

1. Open the **mobile** production URL on a phone → complete OAuth → `/welcome` on mobile origin.
2. Open the **mobile** URL on a desktop browser → should redirect to **desktop** origin (User-Agent); sign in there.
3. Open the **desktop** URL on a phone → should redirect to **mobile** origin.

**Note:** `/api/auth/callback` is never redirected by middleware; OAuth must finish on the same host that issued `redirect_uri`.

**Preview deployments** use different hostnames; add those callback URLs in Lark only if you need branch previews.

## Free tier

Two Hobby projects are fine; each gets its own `*.vercel.app` hostname.

## Production deployment checklist (manual)

Complete these on Vercel and in Lark after pushing this repo:

1. Create two projects (desktop + mobile root directories), set production env vars from the tables above using each project’s real `https://…vercel.app` URL.
2. Redeploy both projects; confirm builds succeed.
3. In Lark, add both `/api/auth/callback` URLs for production origins.
4. Run the **After deploy — production checks** steps (phone + desktop; no localhost).

Until you deploy, production-only validation cannot run—the code and env layout above are ready for it.
