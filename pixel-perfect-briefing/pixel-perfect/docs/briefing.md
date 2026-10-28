# Pixel Perfect Artesanato — Briefing do projeto

> Documento de referência para implementar o site. Complementa o `CLAUDE.md` da raiz.
> Placeholders entre colchetes `[…]` ainda não têm valor definido pelo dono da loja.

---

## 1. Visão geral

**O que é:** loja virtual de artesanato em pixel art — chaveiros montados à mão com continhas termofusíveis (hama/perler beads), passadas a ferro e finalizadas com argola.

**Como vende:**
1. **Itens prontos** — catálogo com carrinho e pagamento no site (Pix, cartão, boleto).
2. **Encomendas personalizadas** — combinadas **pelo Direct do Instagram** (cliente manda a ideia → loja envia o desenho em pixel e o orçamento → cliente aprova e paga → produção → envio). O site apresenta o serviço e leva ao Direct; a encomenda aparece depois em "Meus pedidos".

> **Canal de contato:** no lançamento **não haverá WhatsApp** — todo contato é pelo **Instagram** (Direct). O WhatsApp deve entrar no futuro, então o canal precisa ser **configurável** (ver seção 9 › Canal de contato), sem textos "Instagram"/"WhatsApp" fixos espalhados pelo código.

**Público:** jovens e adultos que gostam de games, cultura geek, fofura e presentes personalizados. Chegam principalmente pelo Instagram, ou seja, **pelo celular**.

**Tom de voz:** divertido, próximo, com vocabulário de videogame — sem atrapalhar a clareza. Ver glossário (seção 4).

**Objetivo do MVP:** vender itens prontos com Pix/cartão/boleto, calcular frete, permitir conta de cliente com histórico de pedidos e cumprir LGPD/CDC.

---

## 2. Escopo

### MVP (implementar)
- Home (com seções de parallax) · Loja/catálogo · Produto · Encomendas (Direct do Instagram)
- Carrinho (com gaveta lateral "Item coletado!") · Finalizar compra · Pix · Aguardando pagamento (boleto) · Pagamento recusado · Pedido concluído
- Entrar / Criar conta (e-mail + Google, Apple, Facebook) · Recuperar senha
- Minha conta (dados, endereços, contas conectadas, privacidade e dados) · Meus pedidos
- Trocas e devoluções (com formulário de solicitação) · Política de Privacidade · Termos de Uso
- Aviso de cookies · Página 404
- Versão celular de tudo (telas específicas em `docs/design/celular/`)
- E-mails transacionais (boas-vindas, pedido recebido, pagamento aprovado, enviado, recuperação de senha)

### Fora do escopo agora
- **"Monte o seu chaveiro na tela"** (`referencia/Personalizar.dc.html`) — conceito adiado.
- Painel administrativo completo (no MVP, administrar pelo Supabase Studio; ver seção 9).
- Avaliações de clientes, programa de pontos, blog.

### Decisões em aberto (perguntar ao dono antes de implementar)
- **Home final:** usar a estrutura de `desktop/Main.dc.html` com as seções de parallax de `desktop/Parallax.dc.html`, ou só uma delas?
- **Logo:** 6 caminhos em `referencia/Logo.dc.html`, nenhum escolhido. Enquanto isso, usar o logotipo em texto "PIXEL PERFECT / ARTESANATO" dos cabeçalhos.
- Frete grátis acima de um valor? (barra "[Faltam R$ X para frete grátis]" no carrinho)
- Login com Apple no lançamento (exige conta Apple Developer paga)?

---

## 3. Design system

### Cores
| Token | Hex | Uso |
|---|---|---|
| `bg` | `#14121F` | fundo principal |
| `surface` | `#1E1B2E` | cards, inputs |
| `surface-2` | `#2C2840` | caixas de destaque ("telas" de fliperama) |
| `deep` | `#191626` / `#0B0A12` | áreas internas, visor |
| `border` | `#4A4566` | bordas neutras |
| `border-soft` | `#2C2840` | divisórias |
| `text` | `#EDE9FF` | texto principal e bordas fortes |
| `text-muted` | `#C9C4E3` | texto secundário |
| `text-subtle` | `#A9A3C9` | legendas |
| `accent` | `#FF5FAE` | rosa — cor da marca, CTAs principais |
| `link` | `#FF8CC4` | links em texto corrido |
| `yellow` | `#FFD23F` | preços, rótulos, sombra dos CTAs |
| `cyan` | `#4FD1FF` | status "enviado", detalhes |
| `green` | `#7CFF6B` | sucesso, "entregue", "copiado" |
| `contact` | `#D62976` (texto `#FFFFFF`) | botões de contato pelo Instagram (ícone de "enviar"/avião de papel) |
| `whatsapp` (futuro) | `#3DDC84` (texto `#0B2E17`) | quando o canal for WhatsApp |
| `danger` | `#FF6B6B` / texto `#FF8A8A` | erro, excluir conta |
| `purple` | `#9B5CFF` | variações de produto |

### Tipografia (Google Fonts)
- **Press Start 2P** — títulos, botões, rótulos, preços, menus. Tamanhos usados: 7–9px (selos/rótulos), 10–12px (botões/menus), 13–16px (subtítulos), 20–48px (títulos). Line-height 1.4–1.6.
- **Space Mono** (400/700) — textos corridos, campos, descrições. 13–18px, line-height 1.5–1.7.

### Forma e profundidade
- **Sem border-radius** (exceções: continhas/círculos decorativos).
- Bordas sólidas de **3–4px**.
- Sombras **duras, sem desfoque**: `box-shadow: 6px 6px 0 #FFD23F` em CTAs rosa; `10–12px 10–12px 0 accent` em caixas de destaque.
- Blocos pixelados (peças, 404) com bisel: `inset 4px 4px 0 rgba(255,255,255,.38), inset -4px -4px 0 rgba(0,0,0,.32)`.
- Layout: container `max-width: 1200px`, gutter 24px (desktop) / 16px (celular). Espaçamento vertical de seções 80–96px desktop, 32–48px celular.

### Componentes recorrentes
- **Botão primário:** fundo `accent`, texto `bg`, Press Start 11–12px, padding ~18px 22px, sombra `6px 6px 0 yellow`.
- **Botão secundário:** transparente, borda 3px `text`, texto `text`.
- **Pílula/aba selecionável:** borda 3px `border`; selecionada = fundo `text`, texto `bg`. Usar `aria-pressed`/`aria-selected`.
- **Switch:** quadrado 64×36, borda 3px; ligado = fundo `accent`, botão à direita. `role="switch"` + `aria-checked`.
- **Selo de raridade/status:** Press Start 7–8px, fundo de cor + texto `bg` (ex.: "★★★ ÉPICO", "NOVO", "ESGOTADO", "EM PRODUÇÃO").
- **Barra de progresso de pedido:** 4 segmentos (Pago · Produção · Enviado · Entregue).
- **Gaveta lateral (desktop) / folha inferior (celular):** overlay `rgba(11,10,18,.72)`, painel com borda 4px `text` e sombra `accent`.
- **Barra fixa inferior (celular):** atalhos Início/Loja/Encomenda/Conta, ou preço + CTA na página de produto/carrinho/checkout.
- **Cabeçalho desktop:** logo texto à esquerda, menu (LOJA · ENCOMENDAS · ENTRAR/MINHA CONTA), botão amarelo "CARRINHO [n]".
- **Cabeçalho celular:** botão menu (☰) · logo · carrinho com contador.

### Ícones
SVG inline com traço (`stroke`, `stroke-linecap: square`), herdando `currentColor`. Nada de emoji na interface.

---

## 4. Glossário de microcopy (tema fliperama)

| Contexto | Texto |
|---|---|
| CTA principal da home | INSERT COIN › |
| Vitrine / loja | SELECIONE SEU ITEM |
| Adicionar ao carrinho | + PEGAR ITEM |
| Gaveta após adicionar | ITEM COLETADO! |
| Carrinho | INVENTÁRIO / INVENTÁRIO VAZIO |
| Continuar comprando | ‹ CONTINUAR JOGANDO |
| Cupom | Código secreto (placeholder `↑↑↓↓←→←→BA`) |
| Checkout | SAVE GAME |
| Boleto pendente | JOGO PAUSADO |
| Pagamento recusado | CONTINUE? (contagem 9→0) |
| Pedido concluído | STAGE CLEAR! |
| Login / cadastro | PLAYER LOGIN / NEW PLAYER |
| Pedidos | HISTÓRICO DE PARTIDAS / fases |
| Produtos relacionados | VOCÊ TAMBÉM PODE DESBLOQUEAR |
| Newsletter | CONTINUE? 9 … YES! |
| Cookies | SAVE DATA? (COOKIES) |
| 404 | FASE NÃO ENCONTRADA · CONTINUE? ▶ SIM / NÃO |
| Termos | REGRAS DO JOGO |

---

## 5. Mapa de telas e rotas

| Rota | Desktop | Celular | Observações |
|---|---|---|---|
| `/` | `Main.dc.html` + `Parallax.dc.html` | `CelHome.dc.html`, `CelMenu.dc.html` | ver decisão em aberto sobre a home |
| `/loja` | `Loja.dc.html` | `CelLoja.dc.html` | filtros em query string: `?categoria=&q=&cor=&disponivel=&ordem=&pagina=` |
| `/produto/[slug]` | `Produto.dc.html` | `CelProduto.dc.html` | gaveta "Item coletado!" ao adicionar |
| `/encomendas` | `Encomendas.dc.html` | — (layout responsivo) | CTAs para o Direct do Instagram |
| `/carrinho` | `Carrinho.dc.html`, `CarrinhoVazio.dc.html` | `CelCarrinho.dc.html` | |
| `/checkout` | `Checkout.dc.html` | `CelCheckout.dc.html` | destino do botão depende da forma de pagamento |
| `/pedido/[id]/pagamento` | `Pix.dc.html` · `Aguardando.dc.html` · `Falha.dc.html` | `CelPix.dc.html` | estado conforme método/status |
| `/pedido/[id]/confirmado` | `Sucesso.dc.html` | — | |
| `/entrar` | `Entrar.dc.html` | `CelEntrar.dc.html` (abas Entrar/Criar conta) | inclui recuperar senha |
| `/cadastro` | `Cadastro.dc.html` | `CelEntrar.dc.html` | |
| `/conta` | `Perfil.dc.html` | `CelPerfil.dc.html` | abas: dados, endereços, privacidade |
| `/conta/pedidos` | `Pedidos.dc.html` | `CelPedidos.dc.html` | |
| `/trocas` | `Trocas.dc.html` | — | formulário exige login |
| `/privacidade` | `Privacidade.dc.html` | — | |
| `/termos` | `Termos.dc.html` | — | |
| 404 (`not-found.tsx`) | `NaoEncontrada.dc.html` | `Cel404.dc.html` | |

**Imagens do design** (`docs/design/img/`):
- `/_blob/ff963464d565c9b110e7df46e932d367` → `garota-pixel.webp`
- `/_blob/67ddb026040a2247409a721a4508d547` → `estrela-numero-13.webp`
- `/_blob/c9c1d7aa851c7c0fb3461d1f4394cb45` → `estrela-inicial-r.webp`

Produtos sem foto no design (sorvete, gatinho, coração, planeta, cacto) são **exemplos ilustrativos** desenhados com continhas — não são produtos reais.

---

## 6. Comportamento por tela

### Home
- Hero com CTA "INSERT COIN" (→ loja) e "ENCOMENDAR" (→ encomendas).
- Faixa-letreiro rosa com chamadas.
- Vitrine de destaques (carrossel horizontal no celular) com "VER TODOS".
- Bloco "Como funciona a encomenda" (3 fases) com botão "ENCOMENDAR PELO DIRECT".
- Newsletter (consentimento explícito; só e-mail).
- **Parallax** (se aprovado): camadas de estrelas, lua, montanhas pixeladas e fotos flutuantes no hero; faixas de texto em sentidos opostos; peças de blocos girando atrás do quadro "Conta por conta"; vitrine com colunas em velocidades diferentes; nuvens e cidade pixelada no CTA final. Intensidade configurável; **desligar com `prefers-reduced-motion`**.
- Aviso de cookies fixo no rodapé (ver seção 8).

### Loja
- Busca por nome/categoria (debounce), categorias (Todos, Personagens, Estrelas, Iniciais e números, Bichinhos, Mini ícones), filtro de cor (multi), faixa de preço, "Só disponíveis", ordenação (Destaques, Novidades, Menor preço, Maior preço), paginação.
- Card: foto, selos, favoritar (♥, exige login — se deslogado, pedir login), nome, preço, "VER ITEM".
- **Esgotado:** card esmaecido + botão "AVISE-ME" (exige login/e-mail e consentimento; vira "AVISAREMOS ✓").
- Estado vazio com "Limpar filtros" e "Encomendar".
- Celular: filtros e ordenação em folha inferior.

### Produto
- Galeria (até 4 fotos), selo de raridade, nome, preço, descrição.
- "Atributos" estilo RPG: tamanho, nº de contas, fofura (barras).
- Variação de **argola** (mosquetão / estrela), quantidade, "+ PEGAR ITEM".
- Acordeões: Detalhes, Cuidados, Envio e trocas (link para `/trocas`).
- Relacionados + card "Quer outro modelo? Encomende o seu".
- Ao adicionar: abre gaveta (desktop) / folha (celular) "ITEM COLETADO!" com resumo do carrinho, barra de frete grátis, "Finalizar compra", "Ver carrinho", "Continuar".
- Celular: barra fixa inferior com preço + CTA.

### Encomendas
- Explica o serviço, exemplo ilustrativo de conversa, 4 fases, tipos de encomenda, checklist "antes de chamar", FAQ (prazo, preço, pagamento, quantidade).
- Botões abrem o Direct: `https://ig.me/m/[usuario]`. O Instagram **não aceita mensagem pré-preenchida** pelo link — por isso mostrar, junto do botão, um texto sugerido com botão "copiar" (ex.: "Oi! Quero encomendar um chaveiro: [ideia], cores [ ], para [data]").

### Carrinho
- Itens com variação, quantidade (+/-), remover (com "Desfazer"), CEP para frete (Melhor Envio), cupom, resumo, "FINALIZAR".
- Carrinho de visitante no `localStorage`; ao logar, mesclar com o carrinho salvo no banco.
- Estado vazio com sugestões de produtos.

### Checkout
- Etapas: Dados → Entrega → Pagamento.
- Quadro "Já tem conta? Entrar / Criar conta" (preenche dados salvos).
- Campos: nome, e-mail, celular, CPF (para nota/antifraude do pagamento), endereço com autopreenchimento por CEP (ViaCEP).
- Pagamento: Pix (padrão), Cartão, Boleto.
- Checkbox opcional "Salvar meus dados e criar conta". Texto de aceite de Termos e Política.
- Ao enviar: cria o pedido (`aguardando_pagamento`) e redireciona para `/pedido/[id]/pagamento`.

### Pagamento
- **Pix:** QR code e "copia e cola" vindos do Mercado Pago, contador até expirar (padrão 30 min), "COPIAR" (vira "COPIADO ✓"), status atualiza sozinho (polling ou Supabase Realtime após webhook). Expirou → gerar novo sem perder o carrinho.
- **Boleto ("JOGO PAUSADO"):** linha digitável + copiar, baixar PDF, vencimento, aviso de cancelamento se não pago.
- **Recusado ("CONTINUE?"):** motivos comuns, "Tentar de novo", "Pagar com Pix", contato pelo Direct. Carrinho preservado.
- **Confirmado ("STAGE CLEAR!"):** número do pedido, fases, aviso de foto da peça por e-mail antes do envio.

### Conta
- **Entrar:** e-mail/senha (mostrar/ocultar), manter conectado, esqueci a senha (estados: formulário → "confira seu e-mail"), login social (Google, Facebook, Apple — botões devem seguir as diretrizes visuais oficiais de cada provedor).
- **Cadastro:** nome, e-mail, celular, senha (regras: 8+ caracteres, maiúscula, número, símbolo). Aceite de Termos+Política **obrigatório** (botão desabilitado até marcar). Novidades por e-mail **opcional, desmarcado** (opção por WhatsApp só quando o canal existir).
- **Minha conta:** Meus dados (CPF opcional), alterar senha, contas conectadas (conectar/desconectar), endereços (CRUD, principal), últimos pedidos, **Privacidade e dados** (ver seção 8).
- **Meus pedidos:** filtros (Todos, Em andamento, Entregues, Cancelados), busca, card com fotos/status/valor/progresso, ação contextual (Falar no Direct / Rastrear / Comprar de novo / Ver produto), detalhes expansíveis (itens, frete, total, endereço, rastreio, pagamento, nota fiscal, troca, ajuda). Encomendas aparecem com selo "ENCOMENDA".

### Trocas e devoluções
- Destaques: 7 dias de arrependimento (CDC art. 49), 90 dias para defeito, frete de volta por conta da loja nesses casos.
- Política + regra de encomendas personalizadas `[a definir com advogado]`.
- Formulário (logado): pedido, motivo, descrição, fotos (upload para Storage), preferência (troca/reembolso/conserto) → protocolo.

### Páginas legais
- `Privacidade.dc.html` e `Termos.dc.html` contêm **rascunhos** com placeholders. Implementar a estrutura (índice com âncoras, seções) e carregar o texto de arquivos MDX/Markdown para facilitar revisão jurídica.

### 404
- Número 404 em blocos pixelados com um bloco faltando caindo no lugar (animação; desligar com reduced motion), "CONTINUE? ▶ SIM (início) / NÃO (loja)", busca e atalhos.

---

## 7. Modelo de dados (Supabase / Postgres)

Sugestão inicial — ajustar conforme necessário. Todas as tabelas com `created_at`/`updated_at`.

- **profiles** (`id` = `auth.users.id`, `name`, `phone`, `cpf` nullable, `avatar_url`)
- **addresses** (`user_id`, `label`, `cep`, `street`, `number`, `complement`, `district`, `city`, `state`, `is_default`)
- **categories** (`slug`, `name`, `sort`)
- **products** (`slug`, `name`, `description`, `price_cents`, `rarity` enum `comum|raro|epico`, `is_new`, `is_active`, `stock`, `size_cm`, `bead_count`, `colors` text[], `weight_g`, `dims` para frete)
- **product_categories** (`product_id`, `category_id`)
- **product_images** (`product_id`, `url`, `alt`, `sort`)
- **product_options** (`product_id`, `type` = `argola`, `value` = `mosquetao|estrela`, `price_delta_cents`)
- **carts** / **cart_items** (para usuários logados)
- **orders** (`user_id` nullable, `number`, `status`, `payment_method` `pix|cartao|boleto`, `payment_provider_id`, `subtotal_cents`, `shipping_cents`, `discount_cents`, `total_cents`, `shipping_address` jsonb, `customer` jsonb, `tracking_code`, `shipping_service`, `is_custom` bool, `notes`)
  - `status`: `aguardando_aprovacao` (encomenda) · `aguardando_pagamento` · `pago` · `em_producao` · `enviado` · `entregue` · `cancelado` · `reembolsado`
- **order_items** (`order_id`, `product_id` nullable, `name`, `options` jsonb, `unit_price_cents`, `qty`)
- **order_events** (`order_id`, `status`, `note`) — histórico para a barra de fases
- **favorites** (`user_id`, `product_id`)
- **stock_alerts** (`user_id`/`email`, `product_id`, `consented_at`, `notified_at`)
- **consents** (`user_id`, `type` `email_marketing|terms|privacy` (+ `whatsapp_marketing` no futuro), `granted` bool, `version`, `granted_at`, `revoked_at`) — guardar histórico, não só o estado atual
- **return_requests** (`user_id`, `order_id`, `reason`, `description`, `preference`, `photos` text[], `status`, `protocol`)
- **coupons** (`code`, `type`, `value`, `valid_until`, `max_uses`)
- **data_requests** (`user_id`, `type` `export|delete`, `status`) — pedidos LGPD

**RLS:** usuário lê/escreve só as próprias linhas em profiles, addresses, carts, orders (leitura), favorites, consents, return_requests. Produtos/categorias públicos para leitura. Escrita de pedidos/status só pelo servidor (service role) e webhooks. Papel `admin` para o dono da loja.

---

## 8. LGPD, cookies e consumidor

- **Aviso de cookies:** botões "Rejeitar opcionais" e "Aceitar todos" com **mesmo destaque**, "Personalizar" com categorias (Necessários sempre ativos; Desempenho e Marketing desligados por padrão). Guardar escolha (cookie próprio) e permitir reabrir pelo link "Cookies" do rodapé. Scripts de analytics/marketing só carregam após consentimento. Preferir analytics sem cookies (Umami ou Plausible).
- **Consentimentos de marketing** separados por canal, opcionais, desmarcados, revogáveis em Minha conta › Privacidade.
- **Privacidade e dados (Minha conta):** baixar meus dados (gera JSON/ZIP), gerenciar cookies, contato do encarregado, **excluir conta** com confirmação por senha (apaga perfil/endereços/preferências; anonimiza pedidos que precisam ser mantidos por obrigação fiscal).
- Coletar só o necessário (CPF apenas no checkout/nota).
- Login social: pedir apenas escopos de nome, e-mail e foto.
- Encarregado (DPO) e dados da empresa: `[placeholders]` na Política.
- CDC: arrependimento de 7 dias para compras online, informações claras de preço/prazo/frete antes do pagamento.

---

## 9. Integrações

| Serviço | Uso | Notas |
|---|---|---|
| Supabase | banco, auth, storage, realtime | RLS em tudo; buckets `products` (público) e `returns` (privado) |
| Mercado Pago | Pix, cartão, boleto | criar pagamento no servidor; **webhook** atualiza `orders.status` e grava `order_events`; validar assinatura do webhook; idempotência |
| Melhor Envio | cotação de frete por CEP, etiqueta, rastreio | cotação no carrinho/checkout; etiqueta gerada pelo admin |
| ViaCEP | autopreenchimento de endereço | |
| Resend + React Email | e-mails transacionais no visual pixel | boas-vindas, pedido recebido, pagamento aprovado, enviado (com rastreio), recuperação de senha, protocolo de troca |
| Instagram (Direct) | canal de contato no lançamento: `https://ig.me/m/[usuario]`; perfil `https://instagram.com/[usuario]` | usuário em variável de ambiente |
| WhatsApp (futuro) | `https://wa.me/55[NUMERO]?text=` | ativar trocando a configuração do canal |
| Umami/Plausible | métricas sem cookies | |

**Administração no MVP:** Supabase Studio para produtos/estoque/status + uma rota `/admin` protegida por papel com: lista de pedidos, mudar status, inserir código de rastreio, criar pedido de encomenda (`is_custom`) a partir da conversa no Direct (gera link de pagamento para o cliente).

### Canal de contato (configurável)
Criar um módulo único, ex. `lib/contact.ts`, que exporta o canal ativo e é usado por **todos** os botões/links de contato (componente `<ContactButton variant="encomenda|ajuda|pedido">`):
```ts
// NEXT_PUBLIC_CONTACT_CHANNEL = "instagram" | "whatsapp"
export const contact = channel === "whatsapp"
  ? { name: "WhatsApp", short: "WhatsApp", href: (msg?: string) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg ?? "")}`, color: "whatsapp", icon: "chat" }
  : { name: "Instagram", short: "Direct",   href: () => `https://ig.me/m/${INSTAGRAM_USER}`, color: "contact", icon: "send" };
```
Textos da interface usam o canal: "CHAMAR NO {short}", "Encomendas pelo {short}", "Fale com a gente no {short}". O design atual mostra a versão Instagram ("CHAMAR NO DIRECT", "ENCOMENDAR PELO DIRECT", "FALAR NO DIRECT"). Política de Privacidade e Termos também devem citar o canal ativo.

**Variáveis de ambiente (exemplo):**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MERCADOPAGO_ACCESS_TOKEN=
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=
MERCADOPAGO_WEBHOOK_SECRET=
MELHORENVIO_TOKEN=
RESEND_API_KEY=
NEXT_PUBLIC_CONTACT_CHANNEL=instagram
NEXT_PUBLIC_INSTAGRAM_USER=
NEXT_PUBLIC_WHATSAPP_NUMBER=   # futuro, ex.: 55XXXXXXXXXXX
NEXT_PUBLIC_SITE_URL=
```

---

## 10. Estrutura sugerida

```
app/
  (loja)/page.tsx                 # home
  (loja)/loja/page.tsx
  (loja)/produto/[slug]/page.tsx
  (loja)/encomendas/page.tsx
  (loja)/carrinho/page.tsx
  (checkout)/checkout/page.tsx
  (checkout)/pedido/[id]/pagamento/page.tsx
  (checkout)/pedido/[id]/confirmado/page.tsx
  (conta)/entrar/page.tsx
  (conta)/cadastro/page.tsx
  (conta)/recuperar-senha/page.tsx
  (conta)/conta/page.tsx
  (conta)/conta/pedidos/page.tsx
  trocas/page.tsx
  privacidade/page.tsx
  termos/page.tsx
  admin/...
  api/webhooks/mercadopago/route.ts
  api/frete/route.ts
  not-found.tsx
components/
  ui/ (Button, Pill, Switch, Badge, ProgressBar, Drawer, BottomSheet, Field)
  layout/ (Header, MobileHeader, MobileTabBar, Footer, CookieBanner)
  loja/ (ProductCard, ProductGallery, Filters, CartDrawer)
  home/ (ParallaxHero, Ticker, BlocksSection, ...)
  pixel/ (PixelGrid, BeadGrid, PixelBlock — desenhos feitos de grade)
content/legal/ (privacidade.mdx, termos.mdx, trocas.mdx)
emails/ (React Email)
lib/ (supabase, mercadopago, melhorenvio, cart, format)
```

Configurar os tokens da seção 3 no `tailwind.config` (cores, fontes `font-pixel`/`font-mono`, sombras `shadow-hard`, `shadow-hard-lg`).

---

## 11. Etapas de entrega (com critérios de pronto)

1. **Base:** projeto Next + Tailwind com tokens e fontes; componentes de UI; Header/Footer/TabBar; 404. *Pronto quando* `/` e 404 renderizam no visual do design em desktop e 390px.
2. **Catálogo:** schema + seed com os 3 produtos reais; Loja com filtros na URL; Produto com variação de argola. *Pronto quando* filtros/busca/ordenação funcionam e são compartilháveis por link.
3. **Carrinho:** localStorage + mescla ao logar; gaveta "Item coletado!"; frete Melhor Envio. *Pronto quando* o total com frete é calculado para um CEP real (sandbox).
4. **Checkout + pagamento:** pedido no banco; Mercado Pago (sandbox) Pix → cartão → boleto; webhook; telas de pagamento. *Pronto quando* um Pix de teste muda o pedido para `pago` sozinho e a tela atualiza.
5. **Conta:** auth e-mail + Google (Apple/Facebook depois); perfil, endereços, pedidos, privacidade (exportar/excluir). *Pronto quando* um usuário não consegue ler dados de outro (testar RLS).
6. **Pós-venda e legal:** trocas com upload, páginas legais em MDX, cookies com consentimento real, e-mails transacionais.
7. **Home com parallax e polimento:** animações GSAP, reduced motion, Lighthouse ≥ 90 em performance e acessibilidade no celular.

---

## 12. Placeholders a preencher (dono da loja)
Preços · prazos de produção e envio · usuário do Instagram e horário de atendimento (WhatsApp no futuro) · dados da empresa (razão social, CNPJ, endereço) · encarregado de dados (nome e e-mail) · intermediador de pagamento escolhido · parcelamento · valor de frete grátis · medidas/nº de contas de cada produto · fotos extras · texto "Sobre" · regra de trocas para encomendas personalizadas · revisão jurídica de Privacidade e Termos.
