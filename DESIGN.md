# DESIGN — Escola de Futebol Maestro Júnior

## O mundo visual: **Linha de Campo**

Navy profundo como terreno dominante, tipografia condensada em escala de cartaz, e
uma geometria de marcação de campo — as linhas brancas da grande área, do círculo
central, da marca do pênalti — usadas como **estrutura**, não como enfeite.

A referência não é "site de escolinha". É o material gráfico de um clube europeu:
Ajax, Atalanta, as peças de academia do Benfica. Sóbrio, adulto, confiante. A
criança aparece na fotografia; a interface fala com o pai.

**A tensão central:** o nome é de um ídolo dos anos 80, a promessa é formação de
caráter, mas o público decide no Instagram em 2026. O site resolve isso com peso
tipográfico (tradição) e movimento preciso (contemporâneo) — nunca com nostalgia
literal nem com infantilização.

## Cores

```
--navy-900  #0A1F2F   fundo profundo, rodapé
--navy      #102F46   ★ marca — fundo dominante de hero, camp e CTA
--navy-700  #1B4463   elevação sobre navy
--navy-600  #2A5A7E   bordas e hairlines sobre navy
--red       #E53E55   ★ marca — ação, estado ativo, o traço sob a palavra
--red-600   #C72F44   hover de ação
--white     #FFFFFF
--gray-50   #F3F5F7   ★ marca — fundo de leitura
--gray-200  #DDE3E9   bordas em claro
--gray-500  #5F6B76   texto secundário em claro
--ink       #0A1F2F   texto em claro
```

**Regra do vermelho:** o vermelho é escasso e só significa duas coisas — *aja aqui*
(botão, link de ação) ou *você está aqui* (item de menu ativo, slide atual). Nunca
é fundo de seção, nunca é decoração. Em uma tela, no máximo uma área vermelha
grande. Essa escassez é o que faz o CTA funcionar.

**Claro ou escuro:** não por categoria — pelo uso. Navy nas seções de *sentir*
(hero, Camp, CTA final); claro nas seções de *ler e decidir* (unidades, horários,
metodologia, formulários). A alternância marca o ritmo da página.

**Contraste verificado:** branco sobre `--navy` = 12.6:1. `--gray-50` sobre `--navy`
= 11.8:1. `--red` sobre branco = 4.6:1 (texto normal aprovado). Branco sobre `--red`
= 4.6:1. Texto secundário sobre navy usa `--navy-200 #A8C0D4` (7.4:1) — tingido do
matiz, nunca cinza neutro.

## Tipografia

- **Display — Barlow Condensed** 600/700, caixa alta, `letter-spacing: -0.02em`.
  Escala de cartaz: `clamp(3rem, 11vw, 8.5rem)` no hero. Linhas de headline em
  `line-height: 0.88` — o aperto é o que dá a sensação de pôster.
- **Corpo — Inter** 400/500/600. Medida de 65–72ch. `line-height: 1.6`.
- **Dado — Inter com `font-variant-numeric: tabular-nums`** em tabelas de horário,
  para as colunas alinharem.

Sem olho/eyebrow acima de título. O título carrega o próprio peso.

## Movimento

**O momento autoral: o apito inicial.** Na entrada do hero, as linhas de campo se
desenham (stroke-dashoffset, 900ms), e ao mesmo tempo as palavras do título sobem
atrás de uma máscara `clip-path` — linha por linha, 70ms de defasagem, `expo.out`.
Acontece uma vez, na primeira dobra. Nada mais na página compete com isso.

**A gramática única:** todo o resto do site usa *uma* revelação — sobe 16px e
desmascara, 520ms, `cubic-bezier(0.16, 1, 0.3, 1)`, a partir de um estado já
legível (sem JS, o conteúdo aparece). Seções não ganham entradas diferentes entre si.

Além de transform e opacity, o vocabulário inclui `clip-path` (as máscaras),
`backdrop-filter` (só na barra fixa ao rolar) e sombra com deslocamento real.

`prefers-reduced-motion: reduce` desliga parallax, desenho de linhas e máscaras;
o estado final renderiza imediatamente.

## Superfícies do navegador

Seleção de texto em `--red` com texto branco. Barra de rolagem com polegar navy
sobre trilho `--gray-50`. Anel de foco: 2px `--red` com 2px de respiro. Cursor de
texto (`caret-color`) em `--red`. `text-underline-offset: 0.2em`.

## Componentes

- **Botão primário** — vermelho sólido, cantos 2px, 56px de altura no mobile.
  Hover: `--red-600` + elevação de 1px. Nunca gradiente.
- **Botão secundário** — contorno de 1.5px, herda a cor do fundo da seção.
- **Card de unidade** — fotografia 4:3 ao topo, conteúdo abaixo, borda hairline.
  Nos cards o vermelho só aparece no link de ação.
- **Hairline** — 1px `--navy-600` sobre navy, 1px `--gray-200` sobre claro. É o
  separador padrão; o site não usa sombra para separar, só para elevar.

## Proibições deste mundo

- Texto com gradiente, vidro/blur decorativo, sombra dura sem blur
- Grade de cards iguais (ícone + título + texto) como estrutura de página
- Numeração de seção (01 / 02 / 03)
- Emoji no lugar de ícone — ícones são Lucide, traço 1.5px, sem exceção
- Estatística inventada em destaque (não há números verificados para exibir)
- Qualquer coisa que faça a escola parecer uma festa infantil
