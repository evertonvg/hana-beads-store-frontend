# Pixel Perfect Artesanato

Online store frontend (Next.js 16, App Router, Tailwind 4) with a mock data layer.
Spec and design references live in `docs/`; project rules in `CLAUDE.md`.

## Setup

```bash
npm install
cp .env.example .env.local   # then adjust values
npx playwright install chromium
```

## Commands

| Command                           | What it does                                                           |
| --------------------------------- | ---------------------------------------------------------------------- |
| `npm run dev`                     | Dev server on http://localhost:3000                                    |
| `npm run build` / `npm start`     | Production build / server                                              |
| `npm run lint`                    | ESLint (zero warnings allowed)                                         |
| `npm run lint:fix`                | ESLint with autofix                                                    |
| `npm run format` / `format:check` | Prettier write / check                                                 |
| `npm run typecheck`               | `tsc --noEmit`                                                         |
| `npm test`                        | Vitest unit tests                                                      |
| `npm run e2e`                     | Playwright (desktop + mobile projects); builds and serves on port 3100 |
| `npm run check`                   | lint + format:check + typecheck + unit tests                           |
| `npm run e2e:visual`              | Same Playwright suite inside Docker with `VISUAL=1` (screenshots)      |

`SESSION_SECRET` must have 32+ characters. Visual baselines (`VISUAL=1`) run only in Docker.

## Padrões de código

- **Formatar ao salvar:** o repositório traz `.vscode/settings.json` (Prettier como formatador e `eslint --fix` ao salvar). Aceite as extensões recomendadas em `.vscode/extensions.json` (ESLint, Prettier, Tailwind CSS IntelliSense, Playwright, Vitest, EditorConfig). O Prettier ordena as classes Tailwind (inclusive dentro de `cn()` e `cva()`).
- **Hooks (Husky):** `pre-commit` roda `lint-staged` (ESLint com zero avisos + Prettier nos arquivos em stage), `commit-msg` valida a mensagem com commitlint e `pre-push` roda `typecheck` e `test`. Nunca use `--no-verify`.
- **Commits (Conventional Commits, em inglês):** `tipo(escopo): descrição`. Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `build`, `ci`, `perf`, `revert`. Escopos sugeridos (aviso, não erro): `ui, layout, home, shop, product, cart, auth, checkout, payment, account, orders, custom-orders, legal, returns, lgpd, data, deps, tooling, e2e`.
  - `feat(cart): add undo for removed items`
  - `fix(checkout): keep coupon after address change`
  - `chore(deps): bump vitest`
- **Testes visuais:** `npm run e2e:visual -- smoke` roda a suíte Playwright dentro do container oficial (`docker/playwright.sh` faz `npm ci` num volume nomeado, para não misturar binários Linux e Windows). Para gerar/atualizar baselines: `npm run e2e:visual -- --update-snapshots -g "<nome>"`. Fora do Docker os `snap()` não comparam nada.
- **Docker travado:** se `docker info` não responder, rode `wsl --shutdown` e reinicie o Docker Desktop.
