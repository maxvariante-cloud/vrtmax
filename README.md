# VRT Climatização — Landing Page

Landing page de alta conversão para empresa de **instalação, manutenção e higienização de ar-condicionado** (residencial e industrial — São Paulo e região).

## Estrutura

```
.
├── index.html      # Estrutura semântica da página
├── styles.css      # Design system (navy + laranja) + animações + responsivo
├── script.js       # Interações (partículas, contadores, slider antes/depois, menu, etc.)
└── assets/         # Imagens (logo, foto do técnico, antes/depois)
```

## Recursos

- Hero animado com partículas de ar (canvas) e aurora
- Comparador interativo **Antes / Depois** da higienização
- Seção **Como funciona** em 4 passos
- Contadores animados, marcas em marquee, selo de garantia
- Prova social (avaliações) e FAQ
- Barra de CTA fixa no mobile + WhatsApp flutuante
- 100% responsivo, acessível e com suporte a `prefers-reduced-motion`

## Configuração

O número do WhatsApp fica no topo de [`script.js`](script.js):

```js
const phoneNumber = "5511995935810";
const message = "Olá! Vim pelo site e quero solicitar um orçamento para ar-condicionado.";
```

## Imagens

Coloque em `assets/` (veja `assets/LEIA-ME.txt`):
`logo.jpg`, `ads-profissional.png`, `antes.jpg`, `depois.jpg`.
O site já funciona sem elas (usa fallback), mas com as imagens reais fica profissional.

## Publicar (GitHub Pages)

Settings → Pages → Branch: `main` / root → Save.
