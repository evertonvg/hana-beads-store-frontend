# Pixel Perfect Artesanato — Frontend (Next.js + dados mock) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar todas as telas do MVP da loja (desktop e celular) em Next.js, fiéis ao design, com fluxos completos (catálogo → carrinho → checkout → pagamento → conta) funcionando contra uma camada de dados mock tipada, cobertos por Playwright (E2E + snapshots visuais + acessibilidade).

**Architecture:** App Router com Server Components por padrão; Client Components só onde há interação. Toda leitura/escrita de dados passa por *ports* (interfaces TypeScript em `lib/data/ports.ts`) resolvidos por `getData()` em `lib/data/index.ts`; neste plano só existe o adaptador `mock` (estado em memória no servidor + fixtures). Supabase, Mercado Pago, Melhor Envio, ViaCEP e Resend entram num plano futuro implementando os mesmos ports — nenhuma tela muda.

**Tech Stack:**
- **Base:** Next.js 16.4 (App Router, Turbopack) · React 19 · TypeScript (versão instalada pelo `create-next-app`) · Tailwind CSS 4.3 (tokens via `@theme`) · **npm 11** (o que vem com o Node 24) · Node 24.
- **UI:** Headless UI 2 (Dialog, Switch, Tab, RadioGroup, Disclosure, Checkbox, Field) · `class-variance-authority` + `clsx` + `tailwind-merge` (variantes/`cn`) · `lucide-react` (ícones) · `sonner` (toasts) · `qrcode.react` (QR do Pix) · GSAP 3.15 + `@gsap/react` (parallax).
- **Estado e dados no cliente:** TanStack Query 5 (cotação de frete, preço do carrinho, polling do Pix) · Zustand 5 + `persist` (carrinho no `localStorage`) · `nuqs` 2 (filtros da loja na URL).
- **Formulários:** React Hook Form 7 + `@hookform/resolvers` + Zod 4 · `react-imask` (máscaras CEP/CPF/celular/cartão) · `@brazilian-utils/brazilian-utils` (validação CPF/CEP/telefone) · `date-fns` 4 + `ptBR` · `react-dropzone` (fotos de troca).
- **Infra do app:** `@t3-oss/env-nextjs` (envs tipadas) · `iron-session` (sessão mock em cookie criptografado) · `vanilla-cookieconsent` 3 (consentimento LGPD) · `@next/mdx` (páginas legais).
- **Qualidade:** ESLint (flat config `eslint-config-next` + `typescript-eslint` + `eslint-plugin-playwright` + `@vitest/eslint-plugin` + `eslint-config-prettier`) · Prettier 3 + `prettier-plugin-tailwindcss` · Husky 9 + lint-staged + commitlint (`@commitlint/config-conventional`) · Storybook 10 (`@storybook/nextjs-vite` + `addon-a11y`).
- **Testes:** Vitest 5 + Testing Library · Playwright 1.64 + `@axe-core/playwright` · Docker: imagem oficial `mcr.microsoft.com/playwright:v1.64.1-noble` para snapshots visuais determinísticos.

**Spec:** `docs/briefing.md` (cópia idêntica de `briefing.md` da raiz) + `CLAUDE.md` + telas em `docs/design/**/*.dc.html`. Executores leem os três antes de qualquer task.

### Decisões tomadas com o dono (2026-10-28)

| Decisão | Escolha |
|---|---|
| Escopo deste plano | **Frontend com dados mock.** Integrações reais (Supabase, Mercado Pago, Melhor Envio, ViaCEP, Resend, Umami) = plano futuro. |
| Home final (decisão em aberto do briefing §2) | **Estrutura de `Main.dc.html` + seções de parallax de `Parallax.dc.html`.** |
| Verificação de telas | **E2E dos fluxos + `toHaveScreenshot` em 1280px e 390px + axe**, e revisão lado a lado com o `.dc.html` antes de aprovar cada baseline. |

### Desvios conscientes do briefing (listar ao dono)

1. **Tailwind v4**: tokens ficam em `app/globals.css` (`@theme`), não em `tailwind.config` (v4 não usa mais arquivo de config). Nomes de token idênticos aos do briefing §3.
2. **`proxy.ts`** no lugar de `middleware.ts` (renomeado no Next 16).
3. **E-mails transacionais (React Email) e `/admin`** ficam fora: dependem de backend. Apenas os *gatilhos* existem nos ports mock (ex.: `auth.requestPasswordReset` não envia nada, só registra).
4. **Recuperar senha** é um estado dentro de `/entrar` (como em `Entrar.dc.html`); `/recuperar-senha` redireciona para `/entrar?modo=recuperar`.
5. **Logo:** logotipo em texto + grade 3×3 dos cabeçalhos (nenhum dos 6 caminhos escolhido).
6. **Login com Apple** fica atrás de `NEXT_PUBLIC_AUTH_APPLE=false` (decisão em aberto).
7. **Galeria do UI kit em Storybook** (padrão de mercado) em vez de uma rota `/dev/ui`.

### Avaliação de bibliotecas (diretriz do dono: preferir ferramentas prontas de mercado)

| Necessidade | Escolha | Por quê | Descartadas |
|---|---|---|---|
| Componentes acessíveis sem estilo (modal, gaveta, switch, abas, acordeão, radio) | **Headless UI** | Da Tailwind Labs, sem estilo próprio (o visual pixel fica 100% nosso), cobre foco preso, `Escape`, ARIA e teclado. | Radix (ótimo, mas mais peças avulsas), React Aria (mais completo e mais verboso), shadcn/ui (traz estilo arredondado que teríamos que desfazer) |
| Dados do servidor no cliente | **TanStack Query** | Cache, `refetchInterval` (polling do Pix pausa sozinho com a aba oculta), `useMutation` para frete/cupom, devtools. Será o mesmo código quando o backend real entrar. | SWR (menos recursos de mutation), hooks próprios |
| Estado do carrinho | **Zustand + persist** | `persist` já faz `localStorage`, versão e migração; API mínima. | Redux Toolkit (pesado demais), Context + código próprio |
| Filtros na URL | **nuqs** | Parsers tipados, adapter oficial do Next App Router, leitura no servidor (`createLoader`), throttle de URL para a busca. | `URLSearchParams` na mão |
| Formulários | **React Hook Form + Zod** | Padrão de mercado; o mesmo schema Zod valida no cliente e na server action. | Formik (parado), Conform (menos adotado) |
| Máscaras e documentos BR | **react-imask** + **@brazilian-utils** | CPF/CEP/telefone validados por lib conhecida, sem regex caseira. | máscaras próprias |
| Datas | **date-fns** (`ptBR`) | Formatar datas e calcular prazo de 7 dias (CDC). | Day.js, Luxon |
| Ícones | **lucide-react** | SVG com `stroke` e `currentColor`; aceita `strokeLinecap="square"` como pede o briefing. | ícones SVG desenhados à mão |
| Toasts ("Item removido · DESFAZER") | **sonner** | Acessível, com ação no toast. | react-hot-toast |
| QR Code do Pix | **qrcode.react** | Gera QR real a partir do "copia e cola"; o Mercado Pago devolve esse texto. | desenhar o QR fake do design |
| Consentimento de cookies | **vanilla-cookieconsent** | Categorias, revisão de versão, bloqueio de scripts por categoria, botões de mesmo peso; tema via CSS. | banner próprio |
| Sessão (mock) | **iron-session** | Cookie criptografado e assinado, sem cripto caseira. No backend será trocado por Supabase Auth. | HMAC próprio |
| Envs | **@t3-oss/env-nextjs** | Valida envs com Zod no build e separa servidor de cliente. | parser próprio |
| Upload de fotos | **react-dropzone** | Arrastar e soltar, `accept`, `maxSize`, `maxFiles`. | input próprio |
| Galeria de componentes | **Storybook 10** | Documentação viva do UI kit e checagem de a11y por componente. | rota `/dev/ui` |

Para o plano de backend (não instalar agora): **MSW** (mock de APIs externas em testes), **@supabase/ssr**, **mercadopago** SDK, **@sentry/nextjs** (com revisão LGPD antes: replay de sessão grava dados pessoais).

### Avaliação de serviços Docker (projeto frontend)

| Serviço | Valor para este projeto | Decisão |
|---|---|---|
| **Playwright oficial** (`mcr.microsoft.com/playwright:v1.64.1-noble`) | Os screenshots variam com o SO e as fontes. Rodar os snapshots num Linux fixo deixa os baselines estáveis e idênticos aos de um CI futuro. | **Adotar agora** (Task 2 e Task 22) |
| **Umami + Postgres** (analytics sem cookies, previsto no briefing) | Testar de verdade que o script de métricas só carrega após o aceite de cookies. | **Opcional agora** (perfil `analytics` no compose, Task 9) |
| **Supabase local** (via `supabase start`, sobe Postgres, Auth, Storage, Studio e Mailpit) | Backend real de desenvolvimento. | Plano de backend |
| **Mailpit** | Ver e-mails transacionais (React Email) sem enviar. Já vem dentro do Supabase local. | Plano de backend |
| **WireMock/Mockoon** (Mercado Pago, Melhor Envio) | Simular webhooks e APIs externas. | Plano de backend (MSW deve bastar) |
| **Container de dev do Next** | Não compensa no Windows: hot reload mais lento e `node_modules` duplicado. O deploy é na Vercel. | Não adotar |

Observação: nesta máquina o Docker às vezes precisa de `wsl --shutdown` e reiniciar o Docker Desktop após o boot. Por isso os testes funcionais rodam fora do Docker e só os visuais rodam dentro.

## Global Constraints

- Interface 100% pt-BR; código, identificadores e commits em inglês. Commits seguem **Conventional Commits** (validados pelo commitlint no hook `commit-msg` a partir da Task 2). Nunca usar `--no-verify`.
- **Preferir biblioteca de mercado a código próprio.** Código próprio só para regra de domínio (catálogo, carrinho, status de pedido) e visuais específicos do design (pixel art). Cada lib nova fora do Tech Stack → perguntar antes.
- Gerenciador de pacotes: **npm** (nunca pnpm/yarn); lockfile `package-lock.json` commitado. `.npmrc` com `min-release-age=14` (só instala versões publicadas há 14+ dias, proteção de supply chain) e `save-exact=true`.
- **Nunca inventar** preço, prazo, dado da empresa, texto jurídico. Placeholders do design ficam como placeholder: preço ausente = `[PREÇO]`, valor/total ausente = `[VALOR]`, datas `[00/00/0000]`, rastreio `[AA000000000BR]`, usuário Instagram `[usuario]` quando env vazia.
- Fixtures mock: `priceCents: null` para todos os produtos (o design não tem preço real). Só testes de unidade usam números.
- Tokens de cor exatamente do briefing §3: `bg #14121F`, `surface #1E1B2E`, `surface-2 #2C2840`, `deep #191626`, `deep-2 #0B0A12`, `border #4A4566`, `border-soft #2C2840`, `text #EDE9FF`, `text-muted #C9C4E3`, `text-subtle #A9A3C9`, `accent #FF5FAE`, `link #FF8CC4`, `yellow #FFD23F`, `cyan #4FD1FF`, `green #7CFF6B`, `contact #D62976` (texto `#FFFFFF`), `whatsapp #3DDC84` (texto `#0B2E17`), `danger #FF6B6B`, `danger-text #FF8A8A`, `purple #9B5CFF`. Cores de produto extra do design: `bead-red #E8302A`, `bead-orange #FF9A3D`, `bead-green #2FBF71`, `bead-black #3A3650`, `phase-off-text #8D88AD`.
- Fontes via `next/font/google`: `Press_Start_2P` (400) → `--font-pixel` / classe `font-pixel`; `Space_Mono` (400, 700) → `--font-mono` / `font-mono`. `display: "swap"`.
- **Zero `border-radius`** (exceto continhas/círculos decorativos), **zero gradiente**, **zero sombra com blur**. Sombras utilitárias: `shadow-hard` = `6px 6px 0 var(--color-yellow)`, `shadow-hard-sm` = `4px 4px 0 var(--color-accent)`, `shadow-hard-lg` = `12px 12px 0 var(--color-accent)`, `shadow-bevel` = `inset 4px 4px 0 rgba(255,255,255,.38), inset -4px -4px 0 rgba(0,0,0,.32)`.
- Container `max-w-[1200px]`, gutter `px-6` (desktop) / `px-4` (celular). Breakpoint de layout celular↔desktop: `md` (768px).
- Acessibilidade: elementos reais `<button>`/`<a>`, `<label>` em todo campo, `aria-label` em botão só-ícone, contraste AA, alvos ≥ 44×44px, `font-size ≥ 16px` em inputs no celular, `prefers-reduced-motion` desliga parallax e animações. Nenhum emoji na UI; ícones SVG inline `stroke="currentColor"` `stroke-linecap="square"`.
- LGPD: consentimentos opcionais desmarcados por padrão; nada de script de analytics antes do aceite; cada usuário só vê os próprios dados (o adaptador mock aplica a regra de posse, simulando RLS).
- Segredos só em `.env.local`; nada de chave no código. Variáveis usadas neste plano: `DATA_SOURCE=mock`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_CONTACT_CHANNEL=instagram`, `NEXT_PUBLIC_INSTAGRAM_USER`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_FREE_SHIPPING_CENTS` (vazio = placeholder), `NEXT_PUBLIC_PARALLAX_INTENSITY` (default `1`, 0–2), `NEXT_PUBLIC_AUTH_APPLE` (default `false`), `NEXT_PUBLIC_ANALYTICS_SRC` (vazio = nada carrega).
- Rotas de teste (`/api/__mock__/*`) respondem **404** a menos que `DATA_SOURCE === "mock"`.
- Formulários: React Hook Form + `zodResolver` no cliente; a server action **revalida com o mesmo schema** (nunca confiar no cliente). Classes condicionais sempre via `cn()` (`lib/cn.ts` = `twMerge(clsx(...))`); variantes de componente via `cva`.
- Bibliotecas: só as do Tech Stack acima (aprovadas pelo dono junto com este plano, inclusive as que não estão no CLAUDE.md). Qualquer outra → perguntar antes.
- Microcopy do glossário (briefing §4) usada literalmente: `INSERT COIN ›`, `SELECIONE SEU ITEM`, `+ PEGAR ITEM`, `ITEM COLETADO!`, `INVENTÁRIO`, `INVENTÁRIO VAZIO`, `‹ CONTINUAR JOGANDO`, placeholder de cupom `↑↑↓↓←→←→BA`, `SAVE GAME`, `JOGO PAUSADO`, `CONTINUE?`, `STAGE CLEAR!`, `PLAYER LOGIN`, `NEW PLAYER`, `HISTÓRICO DE PARTIDAS`, `VOCÊ TAMBÉM PODE DESBLOQUEAR`, `SAVE DATA? (COOKIES)`, `FASE NÃO ENCONTRADA`, `REGRAS DO JOGO`.
- Textos de contato sempre via `lib/contact.ts` — proibido literal "Instagram"/"Direct"/"WhatsApp" fora dele e do MDX (`<Canal/>`). Checado por teste (Task 3).

## Review Focus

1. **Carrinho no `localStorage` corrompido ou de versão antiga** (JSON inválido, item de produto que saiu do catálogo, qty 0/negativa/999) → carrinho abre vazio ou sanitizado, sem tela branca. Teste em Task 11.
2. **Query string da loja inválida** (`?pagina=-3`, `?ordem=xpto`, `?cor=azul`, `?categoria=inexistente`, `q` com 500 chars) → cai nos defaults, nunca 500. Teste em Task 6 (unidade) e Task 10 (E2E).
3. **Pix expira com a aba em segundo plano / relógio do cliente adiantado** → contador derivado de `expiresAt` do servidor (não de `setInterval` acumulado); ao chegar em 0 mostra "GERAR NOVO PIX" e o carrinho continua intacto. Teste em Task 16.
4. **Acesso a pedido de outra pessoa** (`/pedido/<id-de-outro>/pagamento`, `/conta/pedidos` com sessão B) → 404, sem vazar dado. Pedido de visitante só abre na mesma sessão de navegador (cookie `pp_guest_orders`). Teste em Task 16 e Task 18.
5. **Duplo clique / reenvio em "SAVE GAME" e "+ PEGAR ITEM"** → um único pedido criado (idempotência por `checkoutToken`), uma única linha somada no carrinho por clique. Teste em Task 12 e Task 15.

---

## Estrutura de arquivos

```
app/
  layout.tsx                         # fontes, <Providers>, Header/Footer/TabBar, CookieConsent
  globals.css                        # @import "tailwindcss"; @theme tokens; utilitários pixel
  not-found.tsx                      # 404 (NaoEncontrada / Cel404)
  providers.tsx                      # QueryClientProvider, NuqsAdapter, Toaster (client)
  (loja)/page.tsx                    # home
  (loja)/loja/page.tsx
  (loja)/produto/[slug]/page.tsx
  (loja)/encomendas/page.tsx
  (loja)/carrinho/page.tsx
  (checkout)/checkout/page.tsx
  (checkout)/pedido/[id]/pagamento/page.tsx
  (checkout)/pedido/[id]/confirmado/page.tsx
  (conta)/entrar/page.tsx
  (conta)/cadastro/page.tsx
  (conta)/recuperar-senha/page.tsx   # redirect
  (conta)/conta/page.tsx
  (conta)/conta/pedidos/page.tsx
  trocas/page.tsx
  privacidade/page.tsx
  termos/page.tsx
  api/pedidos/[id]/status/route.ts   # polling do pagamento
  api/conta/exportar/route.ts        # download JSON (LGPD)
  api/__mock__/reset/route.ts        # zera estado mock (testes)
  api/__mock__/pedidos/[id]/route.ts # força status (testes)
components/
  ui/        Button, PillToggle, PillTabs, PillRadioGroup, Switch, Badge, OrderProgress, Field, MaskedInput,
             Checkbox, Accordion, Drawer, BottomSheet, QuantityStepper, CopyButton, Icon, PixQr, Container, SectionTitle
  layout/    Header, MobileHeader, MobileMenu, MobileTabBar, Footer, CookieConsent, ConsentScripts
  pixel/     PixelGrid, PixelBlock, BeadArt, PixelNumber404
  contact/   ContactButton, SuggestedMessage
  home/      Hero, ParallaxHero, Ticker, Featured, HowItWorks, BlocksSection, NewsletterForm, FinalCta
  loja/      ProductCard, ShopFilters, ShopToolbar, ShopPagination, StockAlertButton, FavoriteButton,
             ProductGallery, ProductAttributes, AddToCartForm, CartDrawer, StickyBuyBar
  cart/      CartView, CartLine, ShippingQuote, CouponForm, CartSummary, FreeShippingBar
  checkout/  CheckoutForm, PaymentPicker, PixPanel, BoletoPanel, DeclinedPanel
  conta/     LoginForm, SignupForm, PasswordRules, ProfileTabs, AddressBook, ConsentSwitches,
             ConnectedAccounts, DeleteAccount, OrderCard, OrdersFilter, AccountMenuMobile
  trocas/    ReturnForm
content/legal/ privacidade.mdx, termos.mdx, trocas.mdx
lib/
  env.ts            # createEnv (@t3-oss/env-nextjs)
  cn.ts             # twMerge(clsx())
  format.ts         # dinheiro, CEP, CPF, telefone, datas
  contact.ts        # canal de contato configurável
  consent.ts        # config do vanilla-cookieconsent + helpers
  shop-query.ts     # parsers nuqs dos filtros + filterProducts
  cart/             # types.ts, store.ts (zustand persist), merge.ts, totals.ts
  validation/       # schemas zod: auth, checkout, address, return
  session.ts        # iron-session
  data/
    types.ts        # tipos de domínio
    ports.ts        # interfaces
    index.ts        # getData(): Ports  (server-only)
    mock/           # fixtures.ts, store.ts, catalog.ts, auth.ts, account.ts, orders.ts,
                    # payments.ts, shipping.ts, coupons.ts, returns.ts, newsletter.ts
proxy.ts            # protege /conta/*, /trocas (form) → /entrar?next=
public/img/produtos/garota-pixel.webp, estrela-numero-13.webp, estrela-inicial-r.webp
tests/
  unit/**/*.test.ts(x)               # Vitest
  e2e/**/*.spec.ts                   # Playwright
  e2e/support/fixtures.ts            # test.extend: resetMock, login, axe, snap
  e2e/__screenshots__/               # baselines (commitados, gerados no Docker)
*.stories.tsx ao lado de cada componente de components/ui e components/pixel
.storybook/                          # main.ts, preview.tsx (globals.css + fontes)
.husky/                              # pre-commit, commit-msg, pre-push
.vscode/                             # settings.json, extensions.json
commitlint.config.mjs, eslint.config.mjs, .prettierrc.json, .prettierignore, .editorconfig, .gitattributes
.npmrc                               # min-release-age=14, save-exact=true
docker-compose.yml                   # playwright (visual), umami + umami-db (perfil analytics)
```

---

## Ferramentas de teste (definidas na Task 1, usadas por todas)

- `npm test` → Vitest (jsdom para `*.test.tsx`, node para `*.test.ts`).
- `npm run e2e` → Playwright local (funcional + a11y). `npm run e2e:visual` → `docker compose run --rm playwright` (mesma suíte com `VISUAL=1`; baselines nascem e são comparados só ali). `webServer`: `npm run build && npm run start -- -p 3100` com `DATA_SOURCE=mock`, `SESSION_SECRET=e2e-secret-e2e-secret-e2e-secret-00`, `NEXT_PUBLIC_INSTAGRAM_USER=pixelperfect.teste`, `NEXT_PUBLIC_ANALYTICS_SRC=/__analytics-test.js` (envs `NEXT_PUBLIC_*` são embutidas no build, por isso ficam fixas aqui). `reuseExistingServer: !process.env.CI`.
- Projetos Playwright: `desktop` (Chromium, 1280×800) e `mobile` (Chromium, 390×844, `isMobile`, `hasTouch`, `deviceScaleFactor: 3`). Spec com sufixo `.desktop.spec.ts` só roda no `desktop`; `.mobile.spec.ts` só no `mobile`; demais rodam nos dois.
- `tests/e2e/support/fixtures.ts` exporta `test` com:
  - `resetMock` (auto, antes de cada teste): `POST /api/__mock__/reset`, limpa `localStorage` e cookies.
  - `login(page, user?: "ana" | "bruno")`: cria sessão pelo formulário de `/entrar` (usuários da fixture).
  - `expectA11y(page)`: `new AxeBuilder({ page }).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()` → `expect(violations).toEqual([])`.
  - `snap(page, name)`: **só compara quando `process.env.VISUAL === "1"`** (dentro do container Playwright); fora dele vira no-op, para os testes funcionais rodarem no Windows sem diffs de fonte/SO. Faz `emulateMedia({ reducedMotion: "reduce" })`, `await page.evaluate(() => document.fonts.ready)`, fecha o banner de cookies clicando `REJEITAR OPCIONAIS` se estiver visível (para não poluir a imagem), `expect(page).toHaveScreenshot(`${name}.png`, { fullPage: true, animations: "disabled", maxDiffPixelRatio: 0.01 })`.
- Usuários da fixture: `ana@teste.dev` / `Senha@123` (tem pedidos #0001–#0005 do design, 1 endereço, Google conectado) e `bruno@teste.dev` / `Senha@123` (sem pedidos). Card de teste recusado: `4000 0000 0000 0002`; qualquer outro número válido em Luhn aprova.
- **Etapa "Revisão visual" (toda task com tela):** com o Playwright MCP, abrir a rota em 1280 e 390, tirar screenshot, abrir o `.dc.html` correspondente (`file:///…/docs/design/...`, as variáveis `{{…}}` aparecem cruas — comparar layout, espaçamentos, cores, tipografia e textos com o source do arquivo) e listar divergências. Só gerar/atualizar baseline (`npm run e2e:visual -- --update-snapshots -g "<nome>"`, roda no Docker) depois de corrigidas. Anotar no commit "visual: reviewed vs <Arquivo>.dc.html".

---

### Task 1: Fundação do projeto (scaffold, tokens, fontes, ferramentas de teste)

**Files:**
- Move: `pixel-perfect-briefing/pixel-perfect/CLAUDE.md` → `CLAUDE.md`; `pixel-perfect-briefing/pixel-perfect/docs/` → `docs/`; remover `pixel-perfect-briefing/` e `briefing.md` da raiz (idêntico a `docs/briefing.md`, conferido com `diff`).
- Copy: `docs/design/img/*.webp` → `public/img/produtos/`
- Create: scaffold `create-next-app` (TS, App Router, Tailwind, ESLint, sem `src/`, alias `@/*`), `app/globals.css`, `app/layout.tsx`, `app/page.tsx` (placeholder temporário), `lib/env.ts`, `.env.example`, `vitest.config.ts`, `playwright.config.ts`, `tests/e2e/support/fixtures.ts`, `tests/e2e/smoke.spec.ts`, `tests/unit/env.test.ts`, `.npmrc` (`min-release-age=14`, `save-exact=true`), `README.md` (comandos).
- Modify: `package.json` scripts: `dev`, `build`, `start`, `lint` (`eslint .`), `typecheck` (`tsc --noEmit`), `test` (`vitest run`), `e2e` (`playwright test`), `check` (`npm run lint && npm run typecheck && npm test`).

**Interfaces:**
- Produces: classes Tailwind de todos os tokens (`bg-bg`, `bg-surface`, `text-text-muted`, `bg-accent`, `shadow-hard`…), `font-pixel`, `font-mono`; `env` de `lib/env.ts`:
  `export const env = createEnv({ server: { DATA_SOURCE: z.enum(["mock"]).default("mock"), SESSION_SECRET: z.string().min(32) }, client: { NEXT_PUBLIC_* }, experimental__runtimeEnv: { ... } })` (`iron-session` exige segredo com 32+ caracteres; o E2E usa `e2e-secret-e2e-secret-e2e-secret-00`); `publicEnvSchema` exportado à parte para teste; derivado `export const publicEnv: { siteUrl: string; contactChannel: "instagram" | "whatsapp"; instagramUser: string | null; whatsappNumber: string | null; freeShippingCents: number | null; parallaxIntensity: number; authApple: boolean; analyticsSrc: string | null }` via `toPublicEnv(parsed)`.
- Produces: fixtures Playwright `test`, `expect`, `resetMock`, `login`, `expectA11y`, `snap` (contratos acima).

- [ ] **Step 1:** Reorganizar pastas (move/copy acima), `git add -A && git commit -m "chore: import briefing and design references"`.
- [ ] **Step 2:** `npx create-next-app@16.4.3 . --ts --app --tailwind --eslint --no-src-dir --import-alias "@/*" --use-npm` (aceitar diretório não vazio). Criar o `.npmrc` antes de qualquer `npm install`. Dev deps: `vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom @playwright/test @axe-core/playwright`; deps: `zod @t3-oss/env-nextjs`. `npx playwright install chromium`.
- [ ] **Step 3: Testes que falham.** `tests/unit/env.test.ts` (sobre `toPublicEnv(publicEnvSchema.parse(raw))`): `{}` → `contactChannel === "instagram"`, `parallaxIntensity === 1`, `freeShippingCents === null`, `authApple === false`; `{ NEXT_PUBLIC_PARALLAX_INTENSITY: "9" }` → `parallaxIntensity === 2` (clamp 0–2 no schema); `{ NEXT_PUBLIC_CONTACT_CHANNEL: "telegram" }` → `"instagram"` (`.catch("instagram")`). `tests/e2e/smoke.spec.ts`: `"home responde e aplica tokens"` → `page.goto("/")`, status 200, `getComputedStyle(document.body).backgroundColor === "rgb(20, 18, 31)"`, `html[lang="pt-BR"]`, fonte de `h1` contém `"Press Start 2P"` (via `__Press_Start_2P` ou var).
- [ ] **Step 4:** Rodar `npm test` e `npm run e2e -- smoke` → FAIL.
- [ ] **Step 5:** Implementar `lib/env.ts` (`createEnv`, `publicEnvSchema`, `toPublicEnv`, `publicEnv`); `globals.css` com `@theme` (todas as cores do Global Constraints como `--color-*`, `--font-pixel`, `--font-mono`, `--shadow-*`), `--radius-*: 0` e `body { background: var(--color-bg); color: var(--color-text); }`; `layout.tsx` com fontes e `lang="pt-BR"`; `app/page.tsx` com `<h1 className="font-pixel">PIXEL PERFECT</h1>` provisório.
- [ ] **Step 6:** `npm run typecheck && npm test && npm run e2e -- smoke` → PASS nos dois projetos.
- [ ] **Step 7:** Commit `chore: scaffold next 16 app with design tokens and test tooling`.

---

### Task 2: Padronização de código (ESLint, Prettier, Husky, commitlint, VS Code) + Docker para testes visuais

**Files:**
- Create: `eslint.config.mjs` (substitui o gerado), `.prettierrc.json`, `.prettierignore`, `.editorconfig`, `.gitattributes`, `commitlint.config.mjs`, `.husky/pre-commit`, `.husky/commit-msg`, `.husky/pre-push`, `.vscode/settings.json`, `.vscode/extensions.json`, `docker-compose.yml`, `docker/playwright.sh`, `tests/unit/tooling.test.ts`
- Modify: `package.json` (scripts `prepare`, `lint`, `lint:fix`, `format`, `format:check`, `check`, `e2e:visual` e bloco `lint-staged`), `README.md`

**Interfaces (regras que todas as tasks seguintes cumprem):**
- **Prettier** (`.prettierrc.json`): `{ "semi": true, "singleQuote": false, "trailingComma": "all", "printWidth": 100, "endOfLine": "lf", "plugins": ["prettier-plugin-tailwindcss"], "tailwindStylesheet": "./app/globals.css", "tailwindFunctions": ["cn", "cva"] }`. O plugin ordena as classes Tailwind. `.prettierignore`: `docs/design/`, `package-lock.json`, `tests/e2e/__screenshots__/`.
- **ESLint** (flat config): `eslint-config-next` (core-web-vitals + typescript; já inclui `jsx-a11y` e `react-hooks`), `typescript-eslint` `recommendedTypeChecked` em `**/*.{ts,tsx}`, `eslint-plugin-playwright` `flat/recommended` em `tests/e2e/**`, `@vitest/eslint-plugin` em `tests/unit/**`, e `eslint-config-prettier` **por último**. Regras extras: `no-console: ["warn", { allow: ["warn", "error"] }]`, `@typescript-eslint/consistent-type-imports: "error"`, `@typescript-eslint/no-floating-promises: "error"`. Ignorar `.next/`, `storybook-static/`, `playwright-report/`, `test-results/`, `docs/design/**`.
- **Husky:** `pre-commit` → `npx lint-staged`; `commit-msg` → `npx commitlint --edit "$1"`; `pre-push` → `npm run typecheck && npm test`.
- **lint-staged:** `"*.{ts,tsx,js,mjs}": ["eslint --fix --max-warnings=0", "prettier --write"]`, `"*.{css,json,md,mdx,yml,yaml}": "prettier --write"`.
- **commitlint:** `extends: ["@commitlint/config-conventional"]`; `scope-enum` como aviso (nível 1) com `ui, layout, home, shop, product, cart, auth, checkout, payment, account, orders, custom-orders, legal, returns, lgpd, data, deps, tooling, e2e`.
- **VS Code** (`.vscode/settings.json`): `editor.formatOnSave: true`, `editor.defaultFormatter: "esbenp.prettier-vscode"`, `editor.codeActionsOnSave: { "source.fixAll.eslint": "explicit" }`, `files.eol: "\n"`, `tailwindCSS.classFunctions: ["cn", "cva"]`, `typescript.tsdk: "node_modules/typescript/lib"`. `extensions.json` recomenda `dbaeumer.vscode-eslint`, `esbenp.prettier-vscode`, `bradlc.vscode-tailwindcss`, `ms-playwright.playwright`, `vitest.explorer`, `editorconfig.editorconfig`.
- **`.gitattributes`:** `* text=auto eol=lf` e `*.webp binary`, `*.png binary` (sem isso o Windows grava CRLF e o Prettier acusa o arquivo inteiro).
- **Docker** (`docker-compose.yml`):
  - serviço `playwright`: `image: mcr.microsoft.com/playwright:v1.64.1-noble`, `working_dir: /app`, volume do repo em `/app` + **volume nomeado** `pp_node_modules:/app/node_modules` (binários Linux separados dos do Windows), `ipc: host`, env `CI=1`, `VISUAL=1`; comando `docker/playwright.sh`, que roda `npm ci && npx playwright test "$@"`.
  - perfil `analytics` (opcional, usado na Task 9): `umami` (imagem oficial `ghcr.io/umami-software/umami`, tag de versão fixa escolhida na Task 9) + `umami-db` (`postgres:17-alpine`), porta `3001`; credenciais só em `.env.local`.
- **Scripts:** `"lint": "eslint . --max-warnings=0"`, `"lint:fix": "eslint . --fix"`, `"format": "prettier --write ."`, `"format:check": "prettier --check ."`, `"check": "npm run lint && npm run format:check && npm run typecheck && npm test"`, `"e2e:visual": "docker compose run --rm playwright"`.

- [ ] **Step 1:** `npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional prettier prettier-plugin-tailwindcss eslint-config-prettier eslint-plugin-playwright @vitest/eslint-plugin typescript-eslint` (manter `eslint` e `eslint-config-next` nas versões que o `create-next-app` instalou). Depois `npx husky init`.
- [ ] **Step 2: Teste que falha** (`tests/unit/tooling.test.ts`): (a) `@commitlint/lint` com a config do projeto rejeita `"ajustes"` e `"Feat: X"` e aceita `"feat(cart): add undo"`; (b) `prettier.check` de `<div className="p-4 flex" />` com a config do projeto retorna `false` (classes fora de ordem), e de `<div className="flex p-4" />` retorna `true`.
- [ ] **Step 3:** `npm test -- tooling` → FAIL. **Step 4:** Criar os arquivos de config acima. **Step 5:** `npm test -- tooling` → PASS.
- [ ] **Step 6:** `npm run format && npm run lint` com zero avisos. Conferir os hooks: `git commit --allow-empty -m "ajustes"` é **rejeitado** pelo commitlint; um `.tsx` em stage com classes fora de ordem e um `console.log` é formatado pelo commit, que então falha por causa do `no-console` (`--max-warnings=0`).
- [ ] **Step 7:** `npm run e2e:visual -- smoke` roda dentro do container → PASS. Se o Docker não responder, rodar `wsl --shutdown`, reiniciar o Docker Desktop e anotar o procedimento no README.
- [ ] **Step 8:** README, seção "Padrões de código": formatar ao salvar, extensões recomendadas, formato de commit com exemplos, como rodar os testes visuais. Commit `chore(tooling): add eslint, prettier, husky, commitlint and docker playwright`.

---

### Task 3: Formatação e canal de contato configurável

**Files:**
- Create: `lib/format.ts`, `lib/contact.ts`
- Test: `tests/unit/format.test.ts`, `tests/unit/contact.test.ts`, `tests/unit/no-hardcoded-channel.test.ts`

**Interfaces:**
- Produces (`lib/format.ts`):
  `formatPrice(cents: number | null): string` — `null` → `"[PREÇO]"`, `1990` → `"R$ 19,90"` (`Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"})`, espaço normal no lugar do NBSP);
  `formatTotal(cents: number | null): string` — igual, mas `null` → `"[VALOR]"`;
  `formatCep`, `formatCpf`, `formatPhone`, `isValidCpf`, `isValidCep`, `isValidPhone`, `onlyDigits`: **reexports finos de `@brazilian-utils/brazilian-utils`** (`formatCEP`, `formatCPF`, `isValidCPF`, `isValidCEP`, `isValidPhone`, `onlyNumbers`), para o resto do app depender de um único módulo; `formatDate(iso: string | null, pattern = "dd/MM/yyyy"): string` via `date-fns` `format` + `ptBR` (`null` → `"[00/00/0000]"`); `formatOrderNumber(n: string): string` (`"0005"` → `"#0005"`).
- Produces (`lib/contact.ts`):
  `type ContactChannel = { id: "instagram" | "whatsapp"; name: string; short: string; color: "contact" | "whatsapp"; icon: "send" | "chat"; href(msg?: string): string; acceptsPrefill: boolean }`;
  `getContact(env = publicEnv): ContactChannel`; `contactLabel(kind: "chamar" | "encomendar" | "falar" | "ver", c = getContact()): string` → instagram: `"CHAMAR NO DIRECT"`, `"ENCOMENDAR PELO DIRECT"`, `"FALAR NO DIRECT"`, `"VER NO DIRECT"`; whatsapp troca `DIRECT` por `WHATSAPP`.
  Instagram: `href()` = `https://ig.me/m/${user}`, `acceptsPrefill=false`; sem usuário → `https://ig.me/m/[usuario]`. WhatsApp: `https://wa.me/${numero}?text=${encodeURIComponent(msg ?? "")}`, `acceptsPrefill=true`.

- [ ] **Step 0:** `npm install @brazilian-utils/brazilian-utils date-fns`.
- [ ] **Step 1: Testes que falham** com os valores acima (`formatCep("01001000") === "01001-000"`, `formatPhone("11987654321") === "(11) 98765-4321"`, `formatDate("2026-10-28T12:00:00Z") === "28/10/2026"`), incluindo `isValidCpf("111.111.111-11") === false`, `isValidCpf("529.982.247-25") === true`, e `getContact({ ...env, contactChannel: "whatsapp", whatsappNumber: "5511999999999" }).href("Oi! Quero")` === `"https://wa.me/5511999999999?text=Oi!%20Quero"`. `no-hardcoded-channel.test.ts`: varre `app/**` e `components/**` (`.tsx`/`.ts`) e falha se encontrar `/Instagram|WhatsApp|\bDIRECT\b|Direct do/` fora de `lib/contact.ts`.
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implementar `lib/format.ts` e `lib/contact.ts` (os componentes de contato ficam na Task 4, pois dependem de `CopyButton`).
- [ ] **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Commit `feat: add formatters and configurable contact channel`.

---

### Task 4: UI kit pixel (Headless UI + cva) e Storybook

**Files:**
- Create: `lib/cn.ts`, `components/ui/*` (lista na estrutura) + `*.stories.tsx`, `components/ui/PixQr.tsx`, `components/pixel/PixelGrid.tsx`, `PixelBlock.tsx`, `BeadArt.tsx` (+ stories), `components/contact/ContactButton.tsx`, `components/contact/SuggestedMessage.tsx`, `.storybook/main.ts`, `.storybook/preview.tsx`
- Test: `tests/unit/ui/*.test.tsx`

**Interfaces (props exatas):**
- Base: comportamento e ARIA vêm do **Headless UI**; o visual é só nosso (classes Tailwind com tokens). Variantes com `cva`; classes condicionais com `cn()` (`lib/cn.ts`: `export function cn(...i: ClassValue[]) { return twMerge(clsx(i)) }`).
- `Button({ variant: "primary"|"secondary"|"yellow"|"danger"|"ghost", size?: "sm"|"md"|"lg", asChild?: never, href?: string, ...button/anchor props })` — variantes via `cva` (`buttonVariants` exportado para reuso em links); `href` renderiza `next/link`. Primário: `bg-accent text-bg font-pixel text-[11px] md:text-xs px-[22px] py-[18px] shadow-hard`; secundário: `border-[3px] border-text`; `min-h-11`. Estado `:active` desloca `translate(6px,6px)` e zera sombra (`motion-reduce:` sem transição).
- Pílulas, só visual sobre três primitivas: `PillToggle({ pressed, onPressedChange, children })` = `<button aria-pressed>` (filtros multi, ex. cores); `PillTabs({ label, tabs: { id, label }[], selected, onChange, panels? })` = Headless `TabGroup/TabList/Tab` (`aria-selected`, setas); `PillRadioGroup<T extends string>({ label, options: { value: T; label: string; note?: string }[], value: T, onChange })` = Headless `RadioGroup/Radio` (`role="radio"`, `aria-checked`, setas). Selecionada: `bg-text text-bg border-text`; normal: `border-[3px] border-border`.
- `Switch({ checked: boolean, onCheckedChange(v: boolean): void, label: string, description?: string })` = Headless `Field` + `Switch` + `Label`/`Description` → 64×36, `role="switch"`, `aria-checked`, ligado `bg-accent` com botão à direita.
- `Badge({ tone: "yellow"|"green"|"cyan"|"accent"|"muted"|"purple", children })` — `font-pixel text-[7px] md:text-[8px]`.
- `OrderProgress({ step: 0|1|2|3|4, color: string, labels?: [string,string,string,string] })` — 4 segmentos; default labels `Pago · Produção · Enviado · Entregue`; `role="progressbar" aria-valuemin=0 aria-valuemax=4 aria-valuenow={step}`.
- `Field({ label, error?, hint?, children })`, `TextInput`, `Select`, `Textarea`, `Checkbox({ label: ReactNode, ... })` = Headless `Field`/`Label`/`Description`/`Input`/`Select`/`Textarea`/`Checkbox` (ids e `aria-describedby` automáticos); todos aceitam `ref` (para React Hook Form `register`); input `text-base` (16px) no celular, `aria-invalid` quando há `error`. `MaskedInput({ mask: "cep"|"cpf"|"phone"|"card"|"cardExpiry", ... })` = `IMaskInput` do `react-imask` com `00000-000`, `000.000.000-00`, `(00) 00000-0000`, `0000 0000 0000 0000`, `00/00`, usado com o `Controller` do RHF.
- `Accordion({ items: { id: string; title: string; content: ReactNode }[], defaultOpen?: string })` = Headless `Disclosure`/`DisclosureButton`/`DisclosurePanel` (`aria-expanded`, `aria-controls`).
- `Drawer({ open, onClose, title, children, side?: "right" })` e `BottomSheet({ open, onClose, title, children })` — overlay `rgba(11,10,18,.72)`, painel `border-4 border-text shadow-hard-lg`, `role="dialog" aria-modal="true" aria-labelledby`, foco preso, `Escape` fecha, foco volta ao gatilho, `body` sem scroll enquanto aberto. Implementação: Headless `Dialog` + `DialogBackdrop` + `DialogPanel` + `DialogTitle` com `transition` (gaveta desliza da direita, folha sobe de baixo; `motion-reduce:transition-none`).
- `QuantityStepper({ value, min?: 1, max?: 99, onChange, label })` — botões `aria-label="Diminuir quantidade"` / `"Aumentar quantidade"`, input numérico; clamp.
- `CopyButton({ value: string, label?: "COPIAR", copiedLabel?: "COPIADO ✓", resetMs?: 2500 })` — `navigator.clipboard.writeText`, falha silenciosa ainda troca o rótulo (como no design), `aria-live="polite"`.
- Toasts: `<Toaster />` do **sonner** no `providers.tsx` (Task 5), com `toastOptions.unstyled` + classes pixel (`border-4 border-text bg-surface font-mono`, sem `border-radius`). Usar `toast()` direto do pacote.
- `Icon({ name, size?: number, title?: string })` = wrapper de **lucide-react** com padrão do briefing (`strokeLinecap="square"`, `strokeLinejoin="miter"`, `strokeWidth={2.5}`, `color=currentColor`, `aria-hidden` quando não há `title`). Mapa `name → ícone`: `cart→ShoppingCart, menu→Menu, close→X, heart→Heart, search→Search, send→Send, chat→MessageCircle, user→User, home→House, shop→Store, brush→Brush, chevron-left→ChevronLeft, chevron-right→ChevronRight, plus→Plus, minus→Minus, trash→Trash2, copy→Copy, check→Check, truck→Truck, lock→Lock, upload→Upload`.
- `PixelGrid({ rows: string[], palette: Record<string,string>, cell: number, gap?: number, bevel?: boolean, label?: string })` — máscara estilo `".##..#"` (do design); `BeadArt` = PixelGrid com células `inset 0 0 0 Npx` (continhas, `rounded-full` permitido) para produtos sem foto; `PixelBlock({ color, size })` com `shadow-bevel`.
- `ContactButton({ kind: "chamar"|"encomendar"|"falar"|"ver", message?: string, size?: "md"|"lg" })` — link `target="_blank" rel="noopener"`, fundo `contact` (texto `#FFFFFF`) ou `whatsapp` (texto `#0B2E17`), ícone do canal, rótulo de `contactLabel(kind)`, `href` = `getContact().href(message)`. `SuggestedMessage({ text: string })` — mostra o texto sugerido + `CopyButton`, só quando `!getContact().acceptsPrefill`.
- `PixQr({ value: string, label: string, size?: number })` = `QRCodeSVG` do **qrcode.react** (`level="M"`, `marginSize={2}`, `bgColor="#FFFFFF"`, `fgColor="#14121F"`), dentro do quadro pixel do design; `role="img"` + `aria-label`. Gera QR real a partir do "copia e cola" (o mesmo que o Mercado Pago vai devolver).

- [ ] **Step 1: Testes de componente que falham:** `PillTabs` marca `aria-selected="true"` na aba ativa e `PillRadioGroup` muda com a seta → (`aria-checked`); `PillToggle` alterna `aria-pressed`; `PixQr` renderiza um `svg` com `aria-label`; `Switch` alterna `aria-checked` e chama `onCheckedChange(true)`; `QuantityStepper` não desce de 1 nem passa de 99; `CopyButton` mostra `"COPIADO ✓"` após clique e volta a `"COPIAR"` após 2500ms (fake timers); `Drawer` fecha com `Escape` e devolve foco ao botão que abriu; `OrderProgress step={2}` pinta 2 segmentos com a cor e 2 com `#2C2840`; `ContactButton kind="encomendar"` renderiza `ENCOMENDAR PELO DIRECT` com `href` `https://ig.me/m/<user>`; `SuggestedMessage` não renderiza quando o canal é whatsapp.
- [ ] **Step 2:** `npm install @headlessui/react class-variance-authority clsx tailwind-merge lucide-react sonner qrcode.react react-imask`; `npm test` → FAIL. **Step 3:** Implementar componentes. **Step 4:** `npm test` → PASS.
- [ ] **Step 5:** Storybook: `npx storybook@10 init --type nextjs-vite --no-dev` (com o `min-release-age` valendo), adicionar `@storybook/addon-a11y` com `parameters.a11y.test = "error"`; `.storybook/preview.tsx` importa `app/globals.css`, aplica as fontes e o fundo `bg`; viewports `desktop 1280` e `celular 390`. Uma story por componente e estado (selecionado, desabilitado, erro, aberto). Scripts `storybook` e `build-storybook`; `storybook-static/` no `.gitignore`.
- [ ] **Step 6:** `npm run build-storybook` sem erro; no painel de a11y, zero violações em todas as stories. Revisão visual das stories contra botões/pílulas/switch de `Loja.dc.html`, `Perfil.dc.html`, `Produto.dc.html` (Playwright MCP em `localhost:6006`).
- [ ] **Step 7:** Commit `feat(ui): add pixel UI kit on headless ui with storybook`.

---

### Task 5: Shell de layout (Header, menu celular, TabBar, Footer) + 404

**Files:**
- Create: `components/layout/Header.tsx`, `MobileHeader.tsx`, `MobileMenu.tsx`, `MobileTabBar.tsx`, `Footer.tsx`, `components/pixel/PixelNumber404.tsx`, `app/not-found.tsx`, `app/providers.tsx` (`QueryClientProvider` com `staleTime: 30_000`, `NuqsAdapter` de `nuqs/adapters/next/app`, `<Toaster />`; `npm install @tanstack/react-query nuqs` e `npm install -D @tanstack/react-query-devtools`, devtools só em dev)
- Modify: `app/layout.tsx`
- Test: `tests/e2e/layout.spec.ts`, `tests/e2e/layout.mobile.spec.ts`, `tests/e2e/not-found.spec.ts`

**Interfaces:**
- Consumes: UI kit (Task 4), `getContact` (Task 3).
- Produces: `Header({ session: SessionUser | null })` — Server Component; `SessionUser` vem da Task 14, até lá recebe `null`. Botão `CARRINHO [n]` é um client island que lê o contador do carrinho (0 até a Task 11, depois `useCartStore(s => s.count())`). `MobileTabBar({ variant: "nav" })` com Início/Loja/Encomenda/Conta (`aria-current="page"` na rota ativa); páginas de produto/carrinho/checkout escondem a TabBar e usam a própria barra fixa (`<body data-bar="buy">` via layout de segmento).
- Menu desktop: `LOJA · ENCOMENDAS · SOBRE · ENTRAR` (ou `MINHA CONTA` logado). `SOBRE` aponta para `/#sobre` (texto "Sobre" é placeholder do dono). Footer: links Loja, Encomendas, Trocas e devoluções, Privacidade, Termos, **Cookies** (botão que reabre preferências — Task 9; até lá `href="#"` desabilitado), canal de contato, `[razão social] · [00.000.000/0000-00]`.
- 404: `FASE NÃO ENCONTRADA`, `PixelNumber404` (máscaras Q/Z do design, cores accent/yellow/cyan por coluna, bloco tracejado que "cai" com `@keyframes` 1x; `motion-reduce:animate-none`), `CONTINUE? ▶ SIM` → `/`, `NÃO` → `/loja`, busca (form GET `/loja?q=`) e atalhos.

- [ ] **Step 1: Testes que falham:** desktop — nav `Principal` tem links LOJA→`/loja`, ENCOMENDAS→`/encomendas`, ENTRAR→`/entrar`, `CARRINHO [0]`→`/carrinho`; skip-link "Pular para o conteúdo" é o primeiro foco. mobile — botão `aria-label="Abrir menu"` abre `MobileMenu` (dialog), `Escape` fecha; TabBar tem 4 links e `aria-current` em "Início" na home; nenhum overflow horizontal (`document.documentElement.scrollWidth <= 390`). 404 — `/rota-que-nao-existe` retorna status 404, mostra `FASE NÃO ENCONTRADA`, `SIM` leva a `/`, `NÃO` a `/loja`, busca "estrela" leva a `/loja?q=estrela`; `expectA11y`; `snap("404")`.
- [ ] **Step 2:** `npm run e2e -- layout not-found` → FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual contra cabeçalhos de `Main.dc.html`/`CelHome.dc.html`, `CelMenu.dc.html`, `NaoEncontrada.dc.html`, `Cel404.dc.html`; baseline. **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(layout): add header, mobile menu, tab bar, footer and 404`.

---

### Task 6: Domínio, ports e catálogo mock

**Files:**
- Create: `lib/data/types.ts`, `lib/data/ports.ts`, `lib/data/index.ts`, `lib/data/mock/fixtures.ts`, `lib/data/mock/store.ts`, `lib/data/mock/catalog.ts`, `lib/shop-query.ts`, `app/api/__mock__/reset/route.ts`
- Test: `tests/unit/shop-query.test.ts`, `tests/unit/mock-catalog.test.ts`

**Interfaces:**
- Produces (`types.ts`, campos espelham briefing §7 em camelCase):
  ```ts
  type Rarity = "comum" | "raro" | "epico";
  type ColorId = "rosa" | "vermelho" | "roxo" | "laranja" | "verde" | "preto";
  type CategoryId = "personagens" | "estrelas" | "iniciais" | "bichinhos" | "icones";
  type RingOption = "mosquetao" | "estrela";
  type ProductImage = { url: string; alt: string };
  type BeadArtSpec = { rows: string[]; palette: Record<string, string>; letter?: string };
  type Product = { id: string; slug: string; name: string; description: string; priceCents: number | null;
    rarity: Rarity | null; isNew: boolean; stock: number; categories: CategoryId[]; categoryLabel: string;
    colors: ColorId[]; images: ProductImage[]; art: BeadArtSpec | null; illustrative: boolean;
    sizeCm: number | null; beadCount: number | null; cuteness: "MAX";
    options: { type: "argola"; value: RingOption; priceDeltaCents: number }[]; featuredRank: number | null };
  type OrderStatus = "aguardando_aprovacao" | "aguardando_pagamento" | "pago" | "em_producao" | "enviado" | "entregue" | "cancelado" | "reembolsado";
  type PaymentMethod = "pix" | "cartao" | "boleto";
  ```
  (Tipos de pedido, endereço, usuário e devolução são adicionados nas tasks que os usam, no mesmo arquivo.)
- Produces (`ports.ts`): `interface CatalogPort { list(q: ShopQuery): Promise<{ items: Product[]; total: number; page: number; pageCount: number }>; bySlug(slug: string): Promise<Product | null>; related(productId: string, limit: number): Promise<Product[]>; featured(limit: number): Promise<Product[]>; byIds(ids: string[]): Promise<Product[]> }` e `type Ports = { catalog: CatalogPort; /* demais adicionados por task */ }`.
- Produces (`index.ts`): `import "server-only"`; `export function getData(): Ports`.
- Produces (`shop-query.ts`, com **nuqs**; `npm install nuqs` se ainda não instalado):
  `type ShopQuery = { categoria: CategoryId | "todos"; q: string; cores: ColorId[]; disponivel: boolean; ordem: "destaque" | "novo" | "menor" | "maior"; pagina: number }`;
  `shopParsers` = `{ categoria: parseAsStringLiteral(["todos", ...CATEGORY_IDS]).withDefault("todos"), q: parseAsSearch.withDefault(""), cores: parseAsArrayOf(parseAsStringLiteral(COLOR_IDS), ",").withDefault([]), disponivel: parseAsBoolean.withDefault(false), ordem: parseAsStringLiteral(["destaque","novo","menor","maior"]).withDefault("destaque"), pagina: parseAsPage.withDefault(1) }` e `shopUrlKeys = { cores: "cor" }`. `parseAsSearch` e `parseAsPage` são `createParser` (apara e corta `q` em 80 chars; `pagina` inteiro ≥ 1, senão `null` → default). Valores inválidos viram o default (os parsers do nuqs retornam `null`);
  `loadShopQuery = createLoader(shopParsers, { urlKeys: shopUrlKeys })` (uso no servidor: `await loadShopQuery(props.searchParams)`), `serializeShopQuery = createSerializer(shopParsers, { urlKeys: shopUrlKeys })` (links; omite defaults);
  `filterProducts(all: Product[], q: ShopQuery): Product[]` — regras de `Loja.dc.html` (busca em `name` e `categoryLabel`, sem acento e case-insensitive; cor = interseção; `disponivel` remove `stock === 0`; `novo` = `isNew` primeiro; `menor`/`maior` com `priceCents null` sempre por último; `destaque` = `featuredRank` asc, nulos por último, depois nome);
  `PAGE_SIZE = 12`.
- Fixtures: os 9 produtos de `Loja.dc.html` (3 reais com foto em `/img/produtos/*.webp`, 6 `illustrative: true` com `art` = máscaras/paletas do design; `planeta` com `stock: 0`), textos/alt do design, `priceCents: null`, `sizeCm/beadCount: null`. Slugs: `garota-pixel`, `estrela-numero`, `estrela-inicial`, `sorvete-pixel`, `gatinho-pixel`, `coracao-pixel`, `planeta-pixel`, `cacto-pixel`, `coracao-inicial`.
- Mock store: `globalThis.__ppMock` com `reset()` que recarrega fixtures (sobrevive a HMR).

- [ ] **Step 1: Testes que falham** (`shop-query.test.ts`): `loadShopQuery("?pagina=-3&ordem=xpto&cor=azul&categoria=nada")` deep-equals os defaults; `loadShopQuery("?cor=rosa,roxo").cores` = `["rosa","roxo"]`; `q` com 500 chars vira 80; `new URLSearchParams(serializeShopQuery("/loja", { categoria: "estrelas", ordem: "menor" }).split("?")[1])` tem exatamente `categoria=estrelas` e `ordem=menor`; `filterProducts(fixtures, {...defaults, q: "coracao"})` retorna `coracao-pixel` e `coracao-inicial`; `{ cores: ["roxo"], disponivel: true }` retorna `[]`; com produtos de teste `[{priceCents:500},{priceCents:null},{priceCents:200}]` e `ordem:"menor"` → `[200,500,null]`. `mock-catalog.test.ts`: `list` pagina com `PAGE_SIZE`; `bySlug("inexistente")` → `null`; `related` exclui o próprio produto.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat(data): add domain types, ports and mock catalog`.

---

### Task 7: Home (estrutura de `Main.dc.html`)

**Files:**
- Delete: `app/page.tsx` (placeholder da Task 1; conflitaria com `(loja)/page.tsx`)
- Create: `app/(loja)/page.tsx`, `components/home/Hero.tsx`, `Ticker.tsx`, `Featured.tsx`, `HowItWorks.tsx`, `NewsletterForm.tsx`, `FinalCta.tsx`, `lib/data/mock/newsletter.ts`, `lib/validation/newsletter.ts`, `app/(loja)/actions.ts`
- Test: `tests/e2e/home.spec.ts`, `tests/unit/newsletter-schema.test.ts`

**Interfaces:**
- Consumes: `getData().catalog.featured(3)`, UI kit, `ContactButton`.
- Produces: `NewsletterPort { subscribe(input: { email: string; consent: true; consentVersion: string }): Promise<{ status: "ok" | "already" }> }` (adicionar em `Ports`); form em React Hook Form + `zodResolver(newsletterSchema)` (`npm install react-hook-form @hookform/resolvers`) que chama a server action `subscribeNewsletter(input: NewsletterInput): Promise<FormState>`, que revalida com o mesmo schema; com `type FormState = { status: "idle" | "ok" | "error"; message?: string; fieldErrors?: Record<string, string> }` (tipo compartilhado em `lib/validation/form-state.ts`, reusado por todas as actions).
- Conteúdo: hero `1 PLAYER · FEITO À MÃO`, título do design, CTAs `INSERT COIN ›` → `/loja` e `ENCOMENDAR` → `/encomendas`; ticker rosa; vitrine `SELECIONE SEU ITEM` com 3 destaques (barra de raridade 90%/60%/60% do design) e `VER TODOS` → `/loja` (carrossel horizontal com scroll-snap no celular, conforme `CelHome.dc.html`); "Como funciona a encomenda" com as 3 fases do `CelHome` (`01 CHAMA NO ${getContact().short.toUpperCase()}`, `02 CONTA POR CONTA`, `03 ITEM COLETADO!`, descrições do design), botão `contactLabel("encomendar")`; newsletter "CONTINUE? 9 … YES!" com e-mail + checkbox de consentimento **desmarcado e obrigatório para enviar**, só e-mail.
- `id="sobre"` numa seção curta com texto placeholder `[texto "Sobre"]`.

- [ ] **Step 1: Testes que falham:** `INSERT COIN` navega para `/loja`; 3 cards de destaque com `img` cujo `alt` é o do design; botão "ENCOMENDAR PELO DIRECT" tem `href="https://ig.me/m/pixelperfect.teste"`; newsletter: enviar sem marcar consentimento mostra erro e não chama o port; com e-mail válido + consentimento → "YES!" (mensagem de sucesso); e-mail inválido → erro no campo com `aria-invalid="true"`; `expectA11y`; `snap("home")` (com parallax ainda ausente). Unit: schema rejeita `consent` ausente.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Main.dc.html` (1280) e `CelHome.dc.html` (390). **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(home): add home sections and newsletter signup`.

---

### Task 8: Parallax da home (GSAP + ScrollTrigger)

**Files:**
- Create: `components/home/ParallaxHero.tsx`, `ParallaxTicker.tsx`, `BlocksSection.tsx` (quadro "Conta por conta" com peças girando), `ParallaxShowcase.tsx` (colunas em velocidades diferentes), `components/home/ParallaxCity.tsx` (nuvens + cidade no CTA final), `lib/motion.ts`
- Modify: `app/(loja)/page.tsx` (troca Hero/Ticker/Featured/FinalCta pelas versões parallax mantendo o mesmo conteúdo e DOM acessível)
- Test: `tests/unit/motion.test.ts`, `tests/e2e/parallax.desktop.spec.ts`

**Interfaces:**
- Produces (`lib/motion.ts`): `parallaxOffset(progress: number, speed: number, intensity: number, range = 260): number` (= `-clamp(progress,-1.5,1.5) * speed * range * intensity`, como em `Parallax.dc.html`); `seededRandom(seed: number): () => number` (LCG do design); `useReducedMotion(): boolean`.
- Camadas e velocidades exatamente como em `Parallax.dc.html` (`estrelas 0.15`, `lua 0.3`, `montanhaFundo 0.45`, `montanhaFrente 0.7`, `foto1 1.2 rot -6°`, `foto2 1.6 rot 5°`, `foto3 2.0 rot -3°`, `titulo -0.25`, faixas ±1 em X com range 400 e offset -200, colunas `0.6/-0.6/0.9`, `cidade 0.25`, `cta -0.2`; 40 estrelas com seed 7; 10 peças de `pecasDef`; 5 nuvens de `nuvensDef`). Intensidade = `publicEnv.parallaxIntensity`.
- Implementação: `useGSAP` + `ScrollTrigger` com `scrub: true`, transformando só `transform` (camadas `will-change: transform`, `aria-hidden="true"`). Com `prefers-reduced-motion: reduce` **nenhum** ScrollTrigger é criado e as camadas ficam em `transform: none`. `gsap.registerPlugin` só no cliente.

- [ ] **Step 1: Testes que falham:** unit `parallaxOffset(1, 0.7, 1) === -182`, `parallaxOffset(5, 1, 1) === -390` (clamp), `parallaxOffset(1, 1, 0) === 0`; `seededRandom(7)()` primeiro valor ≈ `0.4904` (`(7*9301+49297) % 233280 / 233280`, mesmo LCG). E2E desktop: com `reducedMotion: "no-preference"`, rolar 600px muda o `transform` de `[data-layer="montanha-frente"]`; com `reducedMotion: "reduce"`, após rolar continua `none`; nenhum erro no console; conteúdo textual do hero continua visível e lido pelo axe (`expectA11y`).
- [ ] **Step 2:** FAIL. **Step 3:** `npm install gsap@3.15.0 @gsap/react@2.1.2`; implementar. **Step 4:** Revisão visual vs `Parallax.dc.html` (rolar e capturar 4 pontos). Atualizar `snap("home")` (reduced motion = estático). **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(home): add GSAP parallax sections with reduced-motion fallback`.

---

### Task 9: Consentimento de cookies (vanilla-cookieconsent)

**Files:**
- Create: `lib/consent.ts` (config), `components/layout/CookieConsent.tsx` (client, roda `CookieConsent.run`), `app/cookieconsent.css` (tema pixel), `components/layout/ConsentScripts.tsx`
- Modify: `app/layout.tsx`, `components/layout/Footer.tsx` (link "Cookies"), `docker-compose.yml` (fixar a tag do Umami)
- Test: `tests/unit/consent-config.test.ts`, `tests/e2e/cookies.spec.ts`

**Interfaces:**
- Consumes: `publicEnv.analyticsSrc` (Task 1).
- Produces (`lib/consent.ts`): `consentConfig: CookieConsentConfig` com:
  - `cookie: { name: "pp_consent", expiresAfterDays: 180, sameSite: "Lax" }`, `revision: 1` (subir a revisão invalida consentimentos antigos e reabre o banner);
  - `categories: { necessary: { enabled: true, readOnly: true }, performance: {}, marketing: {} }` (opcionais desligados por padrão);
  - `guiOptions: { consentModal: { layout: "bar", position: "bottom", equalWeightButtons: true }, preferencesModal: { layout: "box", equalWeightButtons: true } }`;
  - textos pt-BR copiados de `Main.dc.html`: título `SAVE DATA? (COOKIES)`, `acceptAllBtn: "ACEITAR TODOS"`, `acceptNecessaryBtn: "REJEITAR OPCIONAIS"`, `showPreferencesBtn: "PERSONALIZAR"`, `savePreferencesBtn: "SALVAR ESCOLHAS"`, seções `Necessários` (rótulo `SEMPRE ATIVOS`), `Desempenho` ("Entender quais páginas são mais visitadas."), `Marketing` ("Anúncios relevantes em outras plataformas."), link para `/privacidade`.
- Produces: `hasConsent(category: "performance" | "marketing"): boolean` = `CookieConsent.acceptedCategory(category)`; `openCookiePreferences()` = `CookieConsent.showPreferences()`. O link "Cookies" do rodapé é um `<button type="button" data-cc="show-preferencesModal">`.
- `ConsentScripts`: o script de métricas (`publicEnv.analyticsSrc`) entra como `<script type="text/plain" data-category="performance" src=…>`. A própria lib ativa o script só após o aceite e o remove se o consentimento for revogado. Sem `analyticsSrc`, nada é renderizado.
- Tema (`app/cookieconsent.css`, importado depois de `vanilla-cookieconsent/dist/cookieconsent.css`): mapear `--cc-bg`, `--cc-primary-color`, `--cc-secondary-color`, `--cc-btn-primary-bg`, `--cc-btn-primary-color`, `--cc-btn-secondary-bg`, `--cc-toggle-on-bg`, `--cc-separator-border-color`… para os tokens; `--cc-btn-border-radius: 0`, `--cc-modal-border-radius: 0`, `--cc-pm-toggle-border-radius: 0`, fontes `font-pixel` em títulos/botões e `font-mono` no texto; borda `4px solid var(--color-text)` e sombra dura `12px 12px 0 var(--color-accent)` no painel. **Se a revisão visual mostrar que o tema não chega ao design, parar e reportar ao dono antes de qualquer banner próprio.**

- [ ] **Step 1:** `npm install vanilla-cookieconsent`.
- [ ] **Step 2: Testes que falham.** Unit (`consent-config.test.ts`): `consentConfig.categories.performance.enabled` não é `true`; `necessary.readOnly === true`; `guiOptions.consentModal.equalWeightButtons === true`; textos dos botões são os do design. E2E (`cookies.spec.ts`):
  - na primeira visita o banner aparece;
  - `REJEITAR OPCIONAIS` e `ACEITAR TODOS` têm a mesma altura (`boundingBox().height`), a mesma `background-color` e o mesmo `font-size`;
  - rejeitar e recarregar: o banner some e o cookie `pp_consent` lista só `necessary`;
  - o botão "Cookies" do rodapé reabre as preferências com o estado salvo;
  - com `NEXT_PUBLIC_ANALYTICS_SRC=/__analytics-test.js` (requisição observada com `page.on("request")`): nenhuma requisição antes do aceite e uma depois de `ACEITAR TODOS`;
  - no mobile, o banner não cobre a TabBar (os `boundingBox` não se cruzam) e dá para rolar;
  - `expectA11y` com o banner aberto e com as preferências abertas.
- [ ] **Step 3:** `npm test -- consent && npm run e2e -- cookies` → FAIL. **Step 4:** Implementar. **Step 5:** Revisão visual contra o bloco de cookies no final de `Main.dc.html` (banner e preferências, 1280 e 390). **Step 6:** PASS.
- [ ] **Step 7 (opcional, Umami real):** `docker compose --profile analytics up -d`; criar o site no painel do Umami (`localhost:3001`); apontar `NEXT_PUBLIC_ANALYTICS_SRC` para `http://localhost:3001/script.js` + `data-website-id` num `.env.local`; conferir manualmente no painel que nenhuma visita é registrada antes do aceite e que ela aparece depois.
- [ ] **Step 8:** Commit `feat(lgpd): add cookie consent with vanilla-cookieconsent and gated analytics`.

---

### Task 10: Loja / catálogo

**Files:**
- Create: `app/(loja)/loja/page.tsx`, `components/loja/ProductCard.tsx`, `ShopFilters.tsx` (client), `ShopToolbar.tsx`, `ShopPagination.tsx`, `FavoriteButton.tsx`, `StockAlertButton.tsx`, `lib/data/mock/engagement.ts`
- Test: `tests/e2e/loja.spec.ts`, `tests/e2e/loja.mobile.spec.ts`

**Interfaces:**
- Consumes: `shopParsers`, `shopUrlKeys`, `loadShopQuery`, `serializeShopQuery`, `catalog.list` (Task 6), `formatPrice`, UI kit, `BeadArt`.
- Produces: `EngagementPort { toggleFavorite(userId: string, productId: string): Promise<boolean>; favorites(userId: string): Promise<string[]>; requestStockAlert(i: { userId: string | null; email: string; productId: string; consentedAt: string }): Promise<void> }` (adicionar em `Ports`); server actions `toggleFavoriteAction(productId)` e `stockAlertAction(prev, fd)` — sem sessão, `toggleFavoriteAction` retorna `{ status: "auth_required" }` e o cliente navega para `/entrar?next=/loja?...`.
- Página Server Component: `const q = await loadShopQuery(props.searchParams)`, chama `catalog.list(q)`, renderiza a grade. `ShopFilters` (client) usa `useQueryStates(shopParsers, { urlKeys: shopUrlKeys, shallow: false, history: "replace", scroll: false })`; `shallow: false` refaz o Server Component a cada mudança. Busca com `limitUrlUpdates: debounce(300)` do nuqs; mudar qualquer filtro grava `pagina: null` (volta a 1). Categorias (rótulos desktop `TODOS · PERSONAGENS · ESTRELAS · INICIAIS E NÚMEROS · BICHINHOS · MINI ÍCONES`; celular abrevia `INICIAIS`), cores (6 swatches circulares, multi, `aria-pressed`), "Só disponíveis" (Switch), ordenação (`Destaques, Novidades, Menor preço, Maior preço`), faixa de preço **omitida enquanto todos os preços forem `null`** (renderizar só se houver ≥ 2 preços distintos) — registrar como pendência. Contador `N ITENS`.
- Card: foto ou `BeadArt` (+ letra), selos (`★★★ ÉPICO` yellow, `★★ RARO` yellow, `NOVO` green, `ESGOTADO` muted), favoritar ♥, nome, `formatPrice`, `VER ITEM` → `/produto/[slug]`. Esgotado: `opacity-75`, `AVISE-ME` → logado: confirma direto; deslogado: mini-form e-mail + consentimento (desmarcado) → `AVISAREMOS ✓`.
- Vazio: "Nenhum item…" + `LIMPAR FILTROS` (→ `/loja`) + `ContactButton kind="encomendar"`.
- Celular (`CelLoja.dc.html`): botões `FILTRAR` e `ORDENAR` abrem `BottomSheet` (`FILTRAR`/`ORDENAR`), com "Aplicar".

- [ ] **Step 1: Testes que falham:** `/loja` lista 9 itens e `9 ITENS`; clicar `ESTRELAS` → URL `?categoria=estrelas`, 3 itens; recarregar mantém o filtro (link compartilhável); digitar "gat" → após debounce URL `?q=gat`, 1 item; cores Rosa+Roxo → `cor=rosa,roxo`; "Só disponíveis" remove `PLANETA PIXEL`; combinação sem resultado mostra estado vazio e `LIMPAR FILTROS` volta a 9; `/loja?pagina=-3&ordem=xpto&cor=azul` responde 200 com 9 itens; ♥ deslogado leva a `/entrar?next=%2Floja`; `AVISE-ME` deslogado exige consentimento antes de enviar e vira `AVISAREMOS ✓`; mobile: `FILTRAR` abre a folha, aplicar `BICHINHOS` mostra 1 item; `expectA11y` (com folha aberta no mobile); `snap("loja")`, `snap("loja-vazia")`.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Loja.dc.html` / `CelLoja.dc.html` (também com `mostrarFiltros`). **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(shop): add catalog page with URL-synced filters`.

---

### Task 11: Núcleo do carrinho (Zustand + persist)

**Files:**
- Create: `lib/cart/types.ts`, `lib/cart/store.ts`, `lib/cart/merge.ts`, `lib/cart/totals.ts`, `components/cart/CartCount.tsx`
- Modify: `components/layout/Header.tsx`/`MobileHeader.tsx` (contador real via `CartCount`)
- Test: `tests/unit/cart-store.test.ts`, `tests/unit/cart-merge.test.ts`, `tests/unit/cart-totals.test.ts`, `tests/e2e/cart-persist.spec.ts`

**Interfaces:**
- Produces (funções puras; regra de domínio, por isso código próprio):
  ```ts
  type CartLine = { productId: string; ring: RingOption; qty: number };        // chave = `${productId}:${ring}`
  type CartData = { lines: CartLine[] };
  const MAX_QTY = 99;
  sanitizeCart(raw: unknown): CartData          // formato inválido → vazio; qty fora de 1..99 → clamp; linhas repetidas → somadas
  mergeCarts(guest: CartData, saved: CartData): CartData   // soma por chave, clamp 99; linhas salvas primeiro
  type PricedLine = CartLine & { product: Product; unitCents: number | null; lineCents: number | null };
  computeTotals(lines: PricedLine[], shippingCents: number | null, discountCents: number): { subtotalCents: number | null; totalCents: number | null; itemCount: number }   // qualquer null → null
  freeShippingRemaining(subtotal: number | null, threshold: number | null): number | null
  ```
- Produces (`lib/cart/store.ts`): `useCartStore` = `create<CartStore>()(persist(..., { name: "pp_cart_v1", version: 1, storage: createJSONStorage(() => localStorage), partialize: (s) => ({ lines: s.lines }), migrate: (old) => sanitizeCart(old), merge: (persisted, current) => ({ ...current, ...sanitizeCart(persisted) }), skipHydration: true }))`, em que `CartStore = CartData & { lastRemoved: { line: CartLine; index: number } | null; count(): number; add(line: CartLine): void; setQty(key: string, qty: number): void; remove(key: string): void; undo(): void; clear(): void; replace(d: CartData): void; pruneUnknown(ids: string[]): void }`.
  - `CartCount` (client) chama `useCartStore.persist.rehydrate()` no primeiro `useEffect` (evita divergência de hidratação no SSR) e escuta o evento `storage` da janela para rehidratar quando outra aba mudar o carrinho.
  - JSON corrompido no `localStorage`: o `createJSONStorage` falha no parse → o store começa vazio, sem tela branca (coberto por teste).

- [ ] **Step 1:** `npm install zustand`.
- [ ] **Step 2: Testes que falham.**
  - `sanitizeCart("lixo")` → `{ lines: [] }`; `qty: 0` → 1; `qty: 999` → 99.
  - `mergeCarts` de `{garota,mosquetao,2}` com `{garota,mosquetao,98}` → 99.
  - `computeTotals` com `[1000×2, 500×1]`, frete 1500 e desconto 300 → subtotal 2500, total 3700; com uma linha `null` → `null`.
  - `freeShippingRemaining(3000, 5000) === 2000`, `(6000, 5000) === 0`, `(null, 5000) === null`.
  - store: `add` duas vezes na mesma chave soma; `remove` seguido de `undo` devolve a linha na mesma posição.
  - E2E `cart-persist`:
    - `localStorage.pp_cart_v1 = "{lixo"` → abrir `/` sem erro no console e com `CARRINHO [0]`;
    - estado persistido válido com `{garota,1}` + `{estrela-inicial,2}` → `CARRINHO [3]` (soma das quantidades);
    - mudar o storage numa segunda página do mesmo contexto atualiza o contador na primeira.
- [ ] **Step 3:** FAIL. **Step 4:** Implementar. **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(cart): add persisted cart store with merge and totals`.

---

### Task 12: Página de produto + gaveta "ITEM COLETADO!"

**Files:**
- Create: `app/(loja)/produto/[slug]/page.tsx`, `components/loja/ProductGallery.tsx`, `ProductAttributes.tsx`, `AddToCartForm.tsx`, `CartDrawer.tsx`, `StickyBuyBar.tsx`, `components/cart/FreeShippingBar.tsx`
- Test: `tests/e2e/produto.spec.ts`, `tests/e2e/produto.mobile.spec.ts`

**Interfaces:**
- Consumes: `catalog.bySlug/related`, `useCartStore`, `computeTotals`, `freeShippingRemaining`, `Drawer`/`BottomSheet`, `Accordion`, `PillRadioGroup`, `QuantityStepper`.
- Produces: `CartDrawer({ open, onClose, lastAdded: { product: Product; ring: RingOption; qty: number } })` (usado só no produto). `FreeShippingBar({ subtotalCents: number | null })` — reutilizado na Task 13: threshold `null` → texto `[Faltam R$ X para frete grátis]`.
- Página: `generateMetadata` (título `NOME — Pixel Perfect`), `notFound()` para slug inexistente. Galeria até 4 fotos (miniaturas como botões `aria-label="Ver foto N"`; produtos sem foto usam `BeadArt` grande; `[FOTO 2..4]` placeholders do design só se o produto tiver só 1 foto — não renderizar placeholders vazios em produção: **renderizar só fotos existentes**). Selo de raridade, nome, `formatPrice`, descrição. Atributos RPG: `TAMANHO` 55% `[X] cm` (ou valor real), `CONTAS` 85% `[000]`, `FOFURA` 100% `MAX`. Argola `MOSQUETÃO`/`ESTRELA` (`PillRadioGroup`), quantidade, `+ PEGAR ITEM`. Acordeões `DETALHES`, `CUIDADOS`, `ENVIO E TROCAS` (link `/trocas`). `VOCÊ TAMBÉM PODE DESBLOQUEAR` (3 relacionados) + card "Quer outro modelo? Encomende o seu" (`ContactButton`).
- Ao adicionar: `Drawer` (desktop) / `BottomSheet` (celular) `ITEM COLETADO!` com item, argola, qty, resumo do carrinho, `FreeShippingBar`, `FINALIZAR COMPRA` → `/checkout`, `VER CARRINHO` → `/carrinho`, `‹ CONTINUAR JOGANDO` fecha. O botão fica `disabled` + `aria-busy` durante a adição (anti duplo clique). Esgotado: botão vira `AVISE-ME` (`StockAlertButton`).
- Celular: `StickyBuyBar` fixa com preço + `+ PEGAR ITEM`, `padding-bottom: env(safe-area-inset-bottom)`; TabBar oculta.

- [ ] **Step 1: Testes que falham:** `/produto/garota-pixel` mostra `GAROTA PIXEL`, `★★★ ÉPICO`, `[PREÇO]`; escolher `ESTRELA`, qty 2, `+ PEGAR ITEM` → diálogo `ITEM COLETADO!` com "Argola: estrela" e "×2"; header `CARRINHO [2]`; **duplo clique rápido** adiciona exatamente 1 vez a quantidade (count 2, não 4); `Escape` fecha e o foco volta ao botão; `VER CARRINHO` → `/carrinho`; `/produto/nao-existe` → 404; `/produto/planeta-pixel` mostra `ESGOTADO` e `AVISE-ME`; acordeão `CUIDADOS` alterna `aria-expanded`; mobile: barra fixa visível no fim da rolagem e não cobre o conteúdo final (último elemento visível acima da barra); `expectA11y` com gaveta aberta; `snap("produto")`, `snap("produto-gaveta")`.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Produto.dc.html` (com e sem `mostrarCarrinho`) e `CelProduto.dc.html`. **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(product): add product page and item-collected drawer`.

---

### Task 13: Carrinho (`/carrinho`) com frete e cupom

**Files:**
- Create: `app/(loja)/carrinho/page.tsx`, `components/cart/CartView.tsx`, `CartLine.tsx`, `ShippingQuote.tsx`, `CouponForm.tsx`, `CartSummary.tsx`, `lib/data/mock/shipping.ts`, `lib/data/mock/coupons.ts`, `app/(loja)/carrinho/actions.ts`
- Test: `tests/e2e/carrinho.spec.ts`, `tests/unit/mock-shipping.test.ts`

**Interfaces:**
- Produces: `ShippingPort { quote(i: { cep: string; items: { productId: string; qty: number }[] }): Promise<ShippingQuote[] | { error: "cep_invalido" | "cep_nao_atendido" }> }`, `type ShippingQuote = { id: string; service: string; carrier: string; priceCents: number | null; days: string }` — mock: CEP com 8 dígitos começando em `0`–`9` → 2 opções (`PAC`, `SEDEX`, `priceCents: null`, `days: "[X] dias"`); `00000000` → `cep_nao_atendido`; tamanho ≠ 8 → `cep_invalido`. `CouponPort { validate(code: string, subtotalCents: number | null): Promise<{ ok: true; code: string; discountCents: number | null; label: string } | { ok: false; reason: "invalido" | "expirado" }> }` — mock aceita `TESTE10` (`label: "[desconto]"`, `discountCents: null`), `EXPIRADO` → expirado. Server actions `quoteShippingAction`, `validateCouponAction` (resolvem preços no servidor via `catalog.byIds`; o cliente só manda ids e quantidades), chamadas com `useMutation` do TanStack Query.
- Página client: lê `useCartStore`; preços via `useQuery({ queryKey: ["cart-prices", lines], queryFn: () => priceCartAction(lines), placeholderData: keepPreviousData })`, em que `priceCartAction(lines) → { lines: PricedLine[]; unknownIds: string[] }` e o cliente chama `pruneUnknown(unknownIds)`. Título `INVENTÁRIO`, linhas (foto, nome, raridade, "Argola: …", stepper, remover → `toast("Item removido.", { action: { label: "DESFAZER", onClick: undo }, duration: 6000 })` do sonner), CEP (`MaskedInput mask="cep"`, `inputMode="numeric"`), opções de frete (radio), cupom (form RHF; `Código secreto`, placeholder `↑↑↓↓←→←→BA`), `FreeShippingBar`, resumo (subtotal/frete/desconto/total via `formatTotal`), `FINALIZAR` → `/checkout`, `‹ CONTINUAR JOGANDO` → `/loja`. O frete escolhido e o cupom ficam em `sessionStorage` (`pp_checkout_draft`) para o checkout.
- Vazio (`CarrinhoVazio.dc.html`): `INVENTÁRIO VAZIO`, sugestões = `catalog.featured(3)`, CTA loja.

- [ ] **Step 1: Testes que falham:** com 2 itens pré-setados, ver 2 linhas e total `[VALOR]`; `+` aumenta qty e o header acompanha; remover → linha some, `DESFAZER` devolve na mesma posição; CEP `01001-000` → 2 opções de frete; CEP `00000-000` → mensagem "CEP não atendido"; cupom `TESTE10` aplicado aparece no resumo; `EXPIRADO` mostra erro; carrinho com id inexistente no storage é podado sem erro; esvaziar → `INVENTÁRIO VAZIO` com 3 sugestões; `FINALIZAR` → `/checkout`; `expectA11y`; `snap("carrinho")`, `snap("carrinho-vazio")`.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Carrinho.dc.html`, `CarrinhoVazio.dc.html`, `CelCarrinho.dc.html`. **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(cart): add cart page with shipping quote, coupon and undo`.

---

### Task 14: Autenticação mock (Entrar, Criar conta, Recuperar senha) + proteção de rotas

**Files:**
- Create: `lib/session.ts`, `lib/data/mock/auth.ts`, `lib/validation/auth.ts`, `app/(conta)/entrar/page.tsx`, `app/(conta)/cadastro/page.tsx`, `app/(conta)/recuperar-senha/page.tsx`, `app/(conta)/actions.ts`, `components/conta/LoginForm.tsx`, `SignupForm.tsx`, `PasswordRules.tsx`, `SocialButtons.tsx`, `proxy.ts`
- Modify: `components/layout/Header.tsx` (sessão), `lib/cart/store.ts` (mescla ao logar via `replace`)
- Test: `tests/unit/auth-schema.test.ts`, `tests/unit/session.test.ts`, `tests/e2e/auth.spec.ts`, `tests/e2e/auth.mobile.spec.ts`

**Interfaces:**
- Produces: `type SessionUser = { id: string; name: string; email: string }`; `lib/session.ts` com **iron-session** (`npm install iron-session`): `getIronSession<{ userId?: string; expiresAt?: number }>(await cookies(), { cookieName: "pp_session", password: env.SESSION_SECRET, cookieOptions: { httpOnly: true, sameSite: "lax", secure: production } })`; `ttl` de 30 dias com "manter conectado", senão cookie de sessão; `createSession(userId, remember)`, `getSession(): Promise<SessionUser | null>` (checa `expiresAt`), `destroySession()`.
- Produces: `AuthPort { signIn(email, password): Promise<SessionUser | null>; signUp(i: { name; email; phone; password; acceptTerms: true; marketingEmail: boolean; termsVersion: string }): Promise<SessionUser | { error: "email_em_uso" }>; signInWithProvider(p: "google" | "facebook" | "apple"): Promise<SessionUser>; requestPasswordReset(email: string): Promise<void>; savedCart(userId): Promise<CartState | null>; saveCart(userId, s: CartState): Promise<void> }` (mock: provider loga como `ana`).
- `lib/validation/auth.ts`: `passwordRules = [{ id: "len", label: "8+ caracteres", test }, { id: "upper", label: "1 maiúscula" }, { id: "digit", label: "1 número" }, { id: "symbol", label: "1 símbolo" }]`; `signupSchema`, `loginSchema`.
- Formulários `LoginForm`/`SignupForm` em React Hook Form + `zodResolver`; `PasswordRules` lê `watch("password")`; erros do servidor entram via `setError`.
- `/entrar` (`Entrar.dc.html`): `PLAYER LOGIN`, e-mail, senha com `MOSTRAR`/`OCULTAR`, "Manter conectado", `ENTRAR`, "Esqueci a senha" → estado `recuperar` → `enviado` ("Confira seu e-mail", **mesma mensagem para e-mail existente ou não**). `?modo=recuperar` abre direto no estado. Login social: Google e Facebook (Apple só se `authApple`) — botões com marca conforme diretrizes oficiais (logo multicolor do Google em fundo branco, "Continuar com Google"; Facebook azul `#1877F2`). Erro de login genérico "E-mail ou senha incorretos." Após login: redireciona para `next` **somente se for caminho relativo começando com `/` e não `//`**; default `/conta`.
- `/cadastro` (`Cadastro.dc.html`): `NEW PLAYER`, nome, e-mail, celular (máscara), senha + `PasswordRules` ao vivo, aceite Termos+Política **obrigatório** (botão `disabled` até marcar), "Novidades por e-mail" **desmarcado**. Registrar consentimentos (`terms`, `privacy`, `email_marketing` se marcado) com versão `"2026-10-28"`.
- Celular (`CelEntrar.dc.html`): abas `ENTRAR`/`CRIAR CONTA` na mesma tela (`/entrar?aba=criar`; `/cadastro` no celular renderiza o mesmo componente com aba criar).
- `proxy.ts`: `matcher: ["/conta/:path*"]` → sem cookie válido redireciona `/entrar?next=<path>`. (Trocas valida no próprio form.)
- Ao logar, o cliente chama `syncCartAction(local)` → servidor devolve `mergeCarts(local, saved)`, salva e o cliente faz `replace`.

- [ ] **Step 1: Testes que falham:** unit — com `sealData`/`unsealData` do iron-session: selo válido abre; selo com 1 caractere alterado → `getSession()` retorna `null`; `expiresAt` no passado → `null`; `passwordRules` para `"abc"` falham 3 de 4. E2E — login `ana@teste.dev/Senha@123` → `/conta` e header `MINHA CONTA`; senha errada → mensagem genérica, campo senha com foco; `MOSTRAR` troca `type` para `text`; `/conta` deslogado → `/entrar?next=%2Fconta`; `next=//evil.com` → vai para `/conta`; recuperar com e-mail inexistente mostra "Confira seu e-mail"; cadastro: botão `CRIAR CONTA` desabilitado até aceite; senha fraca mostra regras não cumpridas; e-mail `ana@teste.dev` → "E-mail já cadastrado"; sucesso cria sessão; carrinho visitante (1 item) + carrinho salvo da ana (fixture: 1 `estrela-numero`) → após login `CARRINHO [2]`; mobile: alternar abas `ENTRAR`/`CRIAR CONTA` com `aria-selected`; `expectA11y` nas 3 telas; `snap("entrar")`, `snap("cadastro")`, `snap("recuperar-enviado")`.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Entrar.dc.html` (3 modos), `Cadastro.dc.html`, `CelEntrar.dc.html` (2 abas). **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(auth): add mock auth, signup, password recovery and route guard`.

---

### Task 15: Checkout (`SAVE GAME`)

**Files:**
- Create: `app/(checkout)/checkout/page.tsx`, `app/(checkout)/checkout/actions.ts`, `components/checkout/CheckoutForm.tsx`, `PaymentPicker.tsx`, `lib/validation/checkout.ts`, `lib/data/mock/orders.ts`, `lib/data/mock/address-lookup.ts`
- Test: `tests/unit/checkout-schema.test.ts`, `tests/unit/mock-orders.test.ts`, `tests/e2e/checkout.spec.ts`, `tests/e2e/checkout.mobile.spec.ts`

**Interfaces:**
- Produces (types): `type Address = { id?: string; label?: string; cep: string; street: string; number: string; complement?: string; district: string; city: string; state: string; isDefault?: boolean }`; `type Customer = { name: string; email: string; phone: string; cpf: string }`; `type Order = { id: string; number: string; userId: string | null; guestToken: string | null; status: OrderStatus; paymentMethod: PaymentMethod; items: { productId: string | null; name: string; ring: RingOption; unitPriceCents: number | null; qty: number; image: ProductImage | null }[]; subtotalCents: number | null; shippingCents: number | null; discountCents: number; totalCents: number | null; shippingAddress: Address; customer: Customer; shippingService: string; trackingCode: string | null; isCustom: boolean; createdAt: string; events: { status: OrderStatus; at: string; note?: string }[]; payment: PixPayment | BoletoPayment | CardPayment }` (`PixPayment`/`BoletoPayment`/`CardPayment` na Task 16, declarar aqui como `{ kind: "pix"|"boleto"|"cartao" } & Record<string, unknown>` e refinar lá).
- Produces: `AddressLookupPort { byCep(cep: string): Promise<Omit<Address,"number"|"complement"> | null> }` (mock: `01001000` → Praça da Sé, Sé, São Paulo/SP; demais válidos → `null` = preencher manual). `OrdersPort { create(i: CreateOrderInput, idempotencyKey: string): Promise<Order>; get(id: string, viewer: { userId: string | null; guestTokens: string[] }): Promise<Order | null>; listForUser(userId: string): Promise<Order[]>; setStatus(id: string, s: OrderStatus): Promise<void> }` — `get` retorna `null` se o viewer não é dono (simula RLS).
- `CheckoutForm` em React Hook Form + `zodResolver(checkoutSchema)`; `MaskedInput` para CEP, CPF, celular, cartão e validade; o autopreenchimento do CEP usa `useQuery({ queryKey: ["cep", cep], queryFn: () => lookupCepAction(cep), enabled: isValidCep(cep) })` e preenche com `setValue`.
- Server action `placeOrderAction(input: CheckoutInput)`: revalida com o mesmo schema zod, **recalcula preços no servidor**, cria pedido `aguardando_pagamento` com idempotência por campo oculto `checkoutToken` (UUID gerado ao montar o form; mesmo token → mesmo pedido), visitante recebe `guestToken` salvo no cookie httpOnly `pp_guest_orders` (lista, máx. 10), "Salvar meus dados e criar conta" (opcional, desmarcado) exige senha + regras, e redireciona `redirect(`/pedido/${id}/pagamento`)`. Carrinho **não** é limpo aqui (só ao confirmar pagamento — Task 16).
- Tela (`Checkout.dc.html`): etapas `1 DADOS · 2 ENTREGA · 3 PAGAMENTO` (indicador visual; formulário único com seções e âncoras — sem perder dados entre etapas), quadro "Já tem conta? ENTRAR / CRIAR CONTA" (`next=/checkout`; logado: preenche nome/e-mail/celular/CPF e endereço principal, e o quadro some), campos nome, e-mail, celular, CPF (validação `isValidCpf`, hint "para nota fiscal e antifraude"), CEP com autopreenchimento, número, complemento; frete (do `pp_checkout_draft` ou nova cotação); pagamento `PIX — aprovação na hora` (padrão), `CARTÃO — [parcelas]`, `BOLETO — até 3 dias` (`PillRadioGroup`); cartão mostra número, nome, validade, CVV (mock; nada sai do servidor mock); resumo lateral (desktop) / barra fixa com total + `SAVE GAME` (celular); texto "Ao continuar você aceita os Termos de Uso e a Política de Privacidade" com links; carrinho vazio → redirect `/carrinho`.

- [ ] **Step 1: Testes que falham:** unit — schema rejeita CPF inválido, CEP com 7 dígitos, e-mail inválido; `create` com mesma `idempotencyKey` duas vezes retorna o mesmo `id`; `get` com viewer errado → `null`. E2E — com carrinho de 1 item: CEP `01001-000` preenche rua/bairro/cidade/UF; enviar com CPF `111.111.111-11` mostra erro no campo e foca nele; caminho feliz Pix → URL `/pedido/<id>/pagamento` e tela Pix; **duplo clique em `SAVE GAME`** cria 1 pedido (consultar `GET /api/__mock__/pedidos?count`); logado como ana: campos já preenchidos e quadro "Já tem conta?" ausente; `/checkout` com carrinho vazio → `/carrinho`; mobile: barra fixa com total e `SAVE GAME`, inputs com `font-size` ≥ 16px; `expectA11y`; `snap("checkout")`.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Checkout.dc.html`, `CelCheckout.dc.html`. **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(checkout): add checkout form with idempotent order creation`.

---

### Task 16: Telas de pagamento (Pix, Boleto, Recusado, Confirmado)

**Files:**
- Create: `app/(checkout)/pedido/[id]/pagamento/page.tsx`, `app/(checkout)/pedido/[id]/confirmado/page.tsx`, `app/(checkout)/pedido/[id]/actions.ts`, `components/checkout/PixPanel.tsx`, `BoletoPanel.tsx`, `DeclinedPanel.tsx`, `components/checkout/usePaymentStatus.ts`, `lib/data/mock/payments.ts`, `app/api/pedidos/[id]/status/route.ts`, `app/api/__mock__/pedidos/[id]/route.ts`
- Test: `tests/unit/pix-countdown.test.ts`, `tests/e2e/pagamento.spec.ts`, `tests/e2e/pagamento.mobile.spec.ts`

**Interfaces:**
- Produces: `type PixPayment = { kind: "pix"; copyPaste: string; expiresAt: string }` (mock: `copyPaste = "[codigo-pix]"`, expira em **30 min**); `type BoletoPayment = { kind: "boleto"; line: string; pdfUrl: string | null; dueDate: string | null }` (mock: linha `"[linha digitável]"`, `pdfUrl: null` → botão "BAIXAR PDF" desabilitado com nota); `type CardPayment = { kind: "cartao"; result: "aprovado" | "recusado"; last4: string }`.
- Produces: `PaymentsPort { start(orderId: string, method: PaymentMethod, card?: { number: string; ... }): Promise<Order["payment"]>; renewPix(orderId: string): Promise<PixPayment>; status(orderId: string): Promise<OrderStatus> }`; cartão `4000000000000002` → `recusado`, status permanece `aguardando_pagamento`.
- `pixRemaining(expiresAt: string, now: number): { seconds: number; label: string; ratio: number; low: boolean }` (segundos via `differenceInSeconds` do date-fns, mínimo 0) — `label` `MM:SS`, `low` quando < 5 min (cor `danger`), `ratio` para a barra.
- `usePaymentStatus(orderId, initial)` = `useQuery({ queryKey: ["order-status", orderId], queryFn: () => fetch(`/api/pedidos/${orderId}/status`), initialData: initial, refetchInterval: (q) => isFinalStatus(q.state.data) ? false : 3000, refetchIntervalInBackground: false })`. O TanStack Query já pausa o polling com a aba oculta e refaz ao voltar o foco; ao virar `pago` → `router.replace(`/pedido/${id}/confirmado`)`. A rota de status aplica a mesma checagem de posse do `OrdersPort.get` (404 caso contrário).
- `/pedido/[id]/pagamento` escolhe o painel por `order.paymentMethod` + resultado: **Pix** (`Pix.dc.html`/`CelPix.dc.html`: `PixQr value={copyPaste}`, `copia e cola` em `<input readonly id="pix-codigo">`, `COPIAR`→`COPIADO ✓` (celular: `COPIAR CÓDIGO PIX`/`CÓDIGO COPIADO ✓`), contador, "Aguardando pagamento…" com `aria-live`; expirado → `GERAR NOVO PIX` chama `renewPixAction`); **Boleto** `JOGO PAUSADO` (`Aguardando.dc.html`: linha digitável + copiar, PDF, vencimento `[00/00/0000]`, aviso de cancelamento); **Recusado** `CONTINUE?` (`Falha.dc.html`: contagem 9→0 decorativa, `aria-hidden` no número, motivos comuns, `TENTAR DE NOVO` → `/checkout`, `PAGAR COM PIX` → `switchToPixAction`, `ContactButton kind="falar"`; carrinho preservado). Pedido inexistente/de outro → `notFound()`.
- `/pedido/[id]/confirmado` (`Sucesso.dc.html`): `STAGE CLEAR!`, número `formatOrderNumber`, `OrderProgress step={1}`, aviso da foto por e-mail antes do envio, CTAs. Ao montar, `useCartStore.getState().clear()` (uma vez, marcado por `sessionStorage pp_cleared_<id>`). Só acessível se status ∈ `pago` e posteriores; senão redireciona para `/pagamento`.
- Rota de teste `POST /api/__mock__/pedidos/[id]` body `{ status }` e `GET /api/__mock__/pedidos?count` (404 fora de mock).

- [ ] **Step 1: Testes que falham:** unit — `pixRemaining(now+1800s)` → `"30:00"`, ratio 1; `now+299s` → `low: true`; `now-5s` → `seconds: 0`, `"00:00"`. E2E — Pix: tela mostra `30:00`/`29:5x`; `COPIAR` vira `COPIADO ✓` (com `context.grantPermissions(["clipboard-read","clipboard-write"])`, conteúdo `[codigo-pix]`); `POST /api/__mock__/pedidos/<id> {status:"pago"}` → em ≤ 6s a tela vai sozinha para `/confirmado` com `STAGE CLEAR!` e o carrinho fica `[0]`; **expiração** com `page.clock.install()` + `fastForward("31:00")` → `GERAR NOVO PIX`, clicar reinicia `30:00` e o carrinho continua com os itens; Boleto: `JOGO PAUSADO` e copiar linha; Cartão recusado (`4000 0000 0000 0002`) → `CONTINUE?`, `PAGAR COM PIX` leva ao painel Pix do mesmo pedido; cartão aprovado → `/confirmado`; sessão de outro navegador (novo `context`) abrindo `/pedido/<id>/pagamento` → 404, e `GET /api/pedidos/<id>/status` → 404; `/pedido/<id>/confirmado` com status `aguardando_pagamento` → redireciona; `expectA11y` em cada painel; `snap("pix")`, `snap("boleto")`, `snap("recusado")`, `snap("confirmado")` (com relógio congelado para estabilidade).
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Pix.dc.html`, `CelPix.dc.html`, `Aguardando.dc.html`, `Falha.dc.html`, `Sucesso.dc.html`. **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(payment): add pix, boleto, declined and confirmation screens`.

---

### Task 17: Minha conta (`/conta`)

**Files:**
- Create: `app/(conta)/conta/page.tsx`, `app/(conta)/conta/actions.ts`, `components/conta/ProfileTabs.tsx`, `ProfileForm.tsx`, `ChangePasswordForm.tsx`, `AddressBook.tsx`, `ConsentSwitches.tsx`, `ConnectedAccounts.tsx`, `DeleteAccount.tsx`, `AccountMenuMobile.tsx`, `lib/data/mock/account.ts`, `lib/validation/address.ts`, `app/api/conta/exportar/route.ts`
- Test: `tests/e2e/conta.spec.ts`, `tests/e2e/conta.mobile.spec.ts`, `tests/unit/mock-account.test.ts`

**Interfaces:**
- Produces: `AccountPort { profile(userId): Promise<Profile>; updateProfile(userId, p: { name; phone; cpf?: string | null }): Promise<void>; changePassword(userId, current, next): Promise<{ ok: boolean }>; addresses(userId): Promise<Address[]>; upsertAddress(userId, a: Address): Promise<Address>; deleteAddress(userId, id): Promise<void>; setDefaultAddress(userId, id): Promise<void>; consents(userId): Promise<ConsentRecord[]>; setConsent(userId, type: "email_marketing", granted: boolean): Promise<void>; connections(userId): Promise<{ provider: "google"|"facebook"|"apple"; email: string | null }[]>; connect/disconnect(userId, provider): Promise<void>; exportData(userId): Promise<Record<string, unknown>>; deleteAccount(userId, password): Promise<{ ok: boolean }> }`; `type Profile = { id; name; email; phone; cpf: string | null; avatarUrl: string | null }`; `type ConsentRecord = { type: "email_marketing"|"terms"|"privacy"; granted: boolean; version: string; grantedAt: string; revokedAt: string | null }` — **histórico append-only** (`setConsent` adiciona registro, não sobrescreve).
- `deleteAccount` mock: apaga perfil/endereços/consents/favoritos, anonimiza pedidos (`customer` → `{ name: "[removido]", ... }`, `userId: null`), destrói sessão. Desconectar a última forma de login (sem senha e 1 provedor) é bloqueado com mensagem.
- Desktop (`Perfil.dc.html`): abas `MEUS DADOS · ENDEREÇOS · PEDIDOS · PRIVACIDADE E DADOS` sincronizadas com `?aba=` (`aria-current="page"`); Meus dados (CPF opcional), alterar senha, contas conectadas (`Conectada · email` / `Não conectada`, `CONECTAR`/`DESCONECTAR`); Endereços CRUD + principal (form com autopreenchimento CEP da Task 15); Pedidos: 2 últimos + link `/conta/pedidos`; Privacidade: switch "Novidades por e-mail — Lançamentos e promoções", `BAIXAR MEUS DADOS` (`GET /api/conta/exportar` → `Content-Disposition: attachment; filename="pixel-perfect-meus-dados.json"`), `GERENCIAR COOKIES` (`openCookiePreferences()`), contato do encarregado `[e-mail do encarregado]`, `EXCLUIR CONTA` → confirmação com senha (estado `confirmando` do design) → logout e home com aviso.
- Celular (`CelPerfil.dc.html`): `/conta` sem `?aba` mostra o menu em lista (8 itens do design; "Favoritos" → `/loja?favoritos=1` **fora do escopo: link para `/loja`**, registrar pendência; "Ajuda" via `getContact`), cada item abre a aba correspondente.

- [ ] **Step 1: Testes que falham:** unit — `setConsent` duas vezes gera 2 registros e o último `revokedAt` preenchido; `deleteAccount` com senha errada → `{ ok:false }` e nada apagado. E2E (ana) — editar nome salva e mostra confirmação; adicionar endereço com CEP `01001-000`, marcar principal, excluir; switch de novidades alterna e persiste após reload; `BAIXAR MEUS DADOS` dispara download cujo JSON tem `profile.email === "ana@teste.dev"` e **não** contém dados do bruno; excluir conta com senha errada mostra erro; com senha certa desloga e `ana@teste.dev` não consegue mais entrar; `DESCONECTAR` Google funciona (ana tem senha); mobile: menu com 8 itens, "Meus pedidos" → `/conta/pedidos`; `expectA11y` por aba; `snap("conta-dados")`, `snap("conta-privacidade")`, `snap("conta-menu")` (mobile).
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Perfil.dc.html` (4 abas + confirmação) e `CelPerfil.dc.html`. **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(account): add profile, addresses, connected accounts and privacy controls`.

---

### Task 18: Meus pedidos (`/conta/pedidos`)

**Files:**
- Create: `app/(conta)/conta/pedidos/page.tsx`, `components/conta/OrderCard.tsx`, `OrdersFilter.tsx`, `lib/orders-view.ts`
- Modify: `lib/data/mock/fixtures.ts` (pedidos #0001–#0005 da ana, conforme `Pedidos.dc.html`)
- Test: `tests/unit/orders-view.test.ts`, `tests/e2e/pedidos.spec.ts`

**Interfaces:**
- Produces (`lib/orders-view.ts`): `orderStatusView(o: Order, channel = getContact()): { label: string; color: string; group: "andamento" | "entregues" | "cancelados"; step: 0|1|2|3|4; action: { label: string; href: string } }` — mapa do design: `aguardando_aprovacao` → `AGUARDANDO APROVAÇÃO` (celular: `APROVAR DESENHO`) yellow, passo 0, ação `contactLabel("ver")`; `aguardando_pagamento` → `AGUARDANDO PAGAMENTO` yellow, passo 0, ação `PAGAR` → `/pedido/id/pagamento`; `pago` → `PAGO` accent passo 1; `em_producao` → `EM PRODUÇÃO` accent passo 2, ação `contactLabel("falar")`; `enviado` → `ENVIADO` cyan passo 3, `RASTREAR` (href `#rastreio-<id>` até existir URL de rastreio); `entregue` → `ENTREGUE` green passo 4, `COMPRAR DE NOVO` → `/produto/<slug>`; `cancelado`/`reembolsado` → muted, sem progresso, `VER PRODUTO`. `filterOrders(orders, filter: "todos"|"andamento"|"entregues"|"cancelados", q: string)` (busca por número e nome de item).
- Página: `HISTÓRICO DE PARTIDAS`, filtros com contadores (`?filtro=`), busca, cards (fotos, `PEDIDO #0005`, data, status, valor `formatTotal`, `OrderProgress` com nomes de fase, selo `ENCOMENDA` se `isCustom`), `DETALHES ▼`/`FECHAR ▲` (`aria-expanded`): itens, frete, total, endereço, rastreio, pagamento, nota fiscal (placeholder), link "Solicitar troca" → `/trocas?pedido=<id>`, ajuda (`ContactButton`). Vazio por filtro com mensagem. Mobile conforme `CelPedidos.dc.html` (resumo compacto, setas ▲▼).

- [ ] **Step 1: Testes que falham:** unit — contagens dos filtros para as 5 fixtures: todos 5, andamento 3, entregues 1, cancelados 1; `orderStatusView` de `em_producao` tem `step 2` e ação `FALAR NO DIRECT`. E2E (ana) — 5 cards, `#0004` tem selo `ENCOMENDA`; filtro `ENTREGUES` → 1 card e URL `?filtro=entregues`; busca "estrela" → 3; `DETALHES` alterna `aria-expanded` e mostra rastreio `[AA000000000BR]` em `#0003`; bruno vê "nenhuma partida ainda" e não vê pedidos da ana; acesso direto `/pedido/<id-da-ana>/pagamento` logado como bruno → 404; `expectA11y`; `snap("pedidos")`.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Pedidos.dc.html` e `CelPedidos.dc.html`. **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(orders): add order history with filters and details`.

---

### Task 19: Encomendas (`/encomendas`)

**Files:**
- Create: `app/(loja)/encomendas/page.tsx`, `components/encomendas/*` (Steps, OrderTypes, Checklist, Faq, ChatExample)
- Test: `tests/e2e/encomendas.spec.ts`

**Interfaces:**
- Consumes: `ContactButton`, `SuggestedMessage`, `Accordion`, `getContact`.
- Conteúdo de `Encomendas.dc.html`: explicação, exemplo ilustrativo de conversa (marcado `aria-label="Exemplo ilustrativo de conversa"`), 4 fases, tipos de encomenda, checklist "antes de chamar", FAQ (prazo `[prazo]`, preço, pagamento, quantidade) em `Accordion`. Todo CTA = `ContactButton kind="chamar"|"encomendar"`; junto do principal, `SuggestedMessage text="Oi! Quero encomendar um chaveiro: [ideia], cores [ ], para [data]"` (aparece porque Instagram não aceita pré-preenchimento; com WhatsApp o texto vai no `href`).

- [ ] **Step 1: Testes que falham:** todos os CTAs de contato têm `href` `https://ig.me/m/pixelperfect.teste` e `target="_blank"`; `COPIAR` copia exatamente o texto sugerido; FAQ abre/fecha; layout 390px sem overflow horizontal; `expectA11y`; `snap("encomendas")`.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Encomendas.dc.html` (desktop e 390px responsivo). **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(custom-orders): add custom orders page with contact CTAs`.

---

### Task 20: Páginas legais (MDX) — Privacidade, Termos, conteúdo de Trocas

**Files:**
- Create: `content/legal/privacidade.mdx`, `termos.mdx`, `trocas.mdx`, `components/legal/LegalLayout.tsx`, `components/legal/Toc.tsx`, `components/legal/mdx.tsx` (`<Canal/>`, `<Placeholder>`, `<RightsGrid/>`), `mdx-components.tsx`, `app/privacidade/page.tsx`, `app/termos/page.tsx`
- Modify: `next.config.ts` (`@next/mdx`, `pageExtensions`)
- Test: `tests/e2e/legal.spec.ts`

**Interfaces:**
- Produces: `LegalLayout({ title: string; kicker?: string; updatedAt: string | null; toc: { id: string; label: string }[]; children })`; `<Canal variant="nome"|"short"|"link" />` renderiza o canal ativo (único lugar do MDX que cita o canal); `<RightsGrid/>` com os 8 direitos de `Privacidade.dc.html`.
- Texto: transcrever **literalmente** os rascunhos de `Privacidade.dc.html` e `Termos.dc.html` (título de Termos: `REGRAS DO JOGO`), preservando todos os `[placeholders]` (`[razão social]`, `[00.000.000/0000-00]`, `[e-mail do encarregado]`, `[intermediador de pagamento]`…). Nenhum texto jurídico novo. Cabeçalho de cada MDX: comentário `{/* RASCUNHO — pendente revisão jurídica */}`. `trocas.mdx` = política de `Trocas.dc.html` (usada na Task 21), regra de encomendas `[a definir com advogado]`.
- Índice com âncoras (`<nav aria-label="Nesta página">`), headings com `id` estável (slug), `scroll-margin-top` para o header.

- [ ] **Step 1: Testes que falham:** `/privacidade` tem índice com ≥ 1 link e clicar move o foco/scroll para a seção (`#direitos` visível); texto contém `[razão social]`; o nome do canal aparece via `<Canal/>` ("Instagram"); `/termos` tem `REGRAS DO JOGO`; `expectA11y` nas duas; `snap("privacidade")`, `snap("termos")`.
- [ ] **Step 2:** FAIL. **Step 3:** `npm install @next/mdx@16.4.3 @mdx-js/loader @mdx-js/react @types/mdx`; implementar. **Step 4:** Revisão visual vs `Privacidade.dc.html`, `Termos.dc.html`. **Step 5:** PASS (o teste `no-hardcoded-channel` ignora `content/**` só para `<Canal/>` — confirmar que continua verde).
- [ ] **Step 6:** Commit `feat(legal): add MDX privacy policy and terms pages`.

---

### Task 21: Trocas e devoluções (`/trocas`) com formulário

**Files:**
- Create: `app/trocas/page.tsx`, `app/trocas/actions.ts`, `components/trocas/ReturnForm.tsx`, `components/trocas/PhotoPicker.tsx`, `lib/validation/return.ts`, `lib/data/mock/returns.ts`
- Test: `tests/unit/return-schema.test.ts`, `tests/e2e/trocas.spec.ts`

**Interfaces:**
- Produces: `ReturnsPort { create(userId: string, i: { orderId: string; reason: "arrependimento"|"defeito"|"diferente"|"outro"; description: string; preference: "troca"|"reembolso"|"conserto"; photos: File[] }): Promise<{ protocol: string }> }` — protocolo `T-` + 4 dígitos sequenciais (formato do design `[T-0000]`); valida que o pedido é do usuário (senão erro "Pedido não encontrado").
- `returnSchema`: `description` 10–1000 chars; fotos 0–4, cada uma `image/jpeg|png|webp` ≤ **5 MB** (limite proposto — confirmar com o dono; constante `MAX_RETURN_PHOTO_BYTES`); `reason="arrependimento"` só se pedido entregue há ≤ 7 dias (mock usa `events`), senão mensagem citando CDC art. 49.
- Página (`Trocas.dc.html`): destaques (7 dias arrependimento — CDC art. 49; 90 dias defeito; frete de volta por conta da loja), política (MDX `trocas.mdx`), formulário: deslogado mostra "Entre para solicitar" + `ENTRAR` (`next=/trocas`); logado: select de pedido (`?pedido=` pré-seleciona), motivos (`PillRadioGroup` com os 4 do design), descrição, fotos via **react-dropzone** (`npm install react-dropzone`; `useDropzone({ accept: { "image/jpeg": [], "image/png": [], "image/webp": [] }, maxSize: MAX_RETURN_PHOTO_BYTES, maxFiles: 4 })`, com preview, remover e erros de `fileRejections` traduzidos), preferência `TROCA · REEMBOLSO · CONSERTO`, `ENVIAR` → estado enviado com protocolo e `NOVA SOLICITAÇÃO`.

- [ ] **Step 1: Testes que falham:** unit — foto `image/gif` rejeitada; 5 fotos rejeitadas; 6 MB rejeitada. E2E — deslogado vê CTA de login; ana com `?pedido=<0002>` pré-selecionado, motivo `Chegou com defeito`, descrição, 1 foto (`setInputFiles` com webp de fixture) → protocolo `T-0001`; GIF mostra erro no campo; `expectA11y`; `snap("trocas")`, `snap("trocas-enviado")`.
- [ ] **Step 2:** FAIL. **Step 3:** Implementar. **Step 4:** Revisão visual vs `Trocas.dc.html` (formulário e enviado). **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat(returns): add returns policy page and request form`.

---

### Task 22: Fechamento — varredura de qualidade, Lighthouse e documentação

**Files:**
- Create: `tests/e2e/a11y-sweep.spec.ts`, `tests/e2e/visual-sweep.spec.ts`, `docs/PENDENCIAS.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: todas as rotas. Lista canônica de rotas em `tests/e2e/support/routes.ts`: `/`, `/loja`, `/produto/garota-pixel`, `/produto/planeta-pixel`, `/encomendas`, `/carrinho`, `/entrar`, `/cadastro`, `/privacidade`, `/termos`, `/trocas`, `/rota-inexistente`, e (logado) `/conta`, `/conta/pedidos`, `/checkout`.

- [ ] **Step 1:** `a11y-sweep.spec.ts`: para cada rota × projeto → `expectA11y`, todos os alvos interativos visíveis ≥ 44×44 (exceto links em texto corrido `p a`), nenhum `border-radius` fora de `.bead`, sem overflow horizontal no mobile, nenhum erro no console. Rodar → corrigir o que falhar → PASS.
- [ ] **Step 2:** `visual-sweep.spec.ts` reaproveita `snap` para a lista inteira; rodar `npm run e2e:visual -- --repeat-each=3` sem diffs (estabilidade).
- [ ] **Step 3:** Lighthouse mobile (chrome-devtools MCP `lighthouse_audit`, build de produção) em `/`, `/loja`, `/produto/garota-pixel`, `/checkout`: **Performance ≥ 90 e Acessibilidade ≥ 90**. Otimizar (imagens `next/image` com `sizes`, GSAP carregado só na home via `dynamic`, fontes `preload`) até atingir; registrar notas no README.
- [ ] **Step 4:** `docs/PENDENCIAS.md`: todos os placeholders/decisões que ficaram (preços, prazos, frete grátis, CNPJ/razão social, encarregado, usuário Instagram, texto "Sobre", fotos extras/medidas, parcelas, limite de fotos de troca 5 MB, faixa de preço da loja oculta, favoritos sem página, Apple login, logo, revisão jurídica) + lista de ports a implementar no plano de backend (Supabase/MP/Melhor Envio/ViaCEP/Resend/Umami) com assinaturas de `lib/data/ports.ts`.
- [ ] **Step 5:** README: setup (`npm install`, `.env.local` a partir de `.env.example`), scripts, como atualizar baselines (`npm run e2e:visual -- --update-snapshots`, só após revisão visual), baselines nascem e são comparados só no container (`npm run e2e:visual`), o mesmo que um CI usará.
- [ ] **Step 6:** `npm run check && npm run build-storybook && npm run e2e && npm run e2e:visual` → tudo verde. Commit `chore: add quality sweeps, lighthouse pass and handoff docs`.

---

## Fora do escopo deste plano (próximos planos)

- Adaptadores reais: Supabase (schema, RLS, auth social), Mercado Pago (pagamentos + webhook com assinatura e idempotência), Melhor Envio, ViaCEP, Resend + React Email, Umami/Plausible.
- `/admin` (pedidos, status, rastreio, criação de encomenda com link de pagamento).
- "Monte o seu chaveiro na tela" (`referencia/Personalizar.dc.html`), avaliações, pontos, blog.
