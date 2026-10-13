# Escola de Futebol Maestro Júnior — site oficial

Site institucional da Escola de Futebol Maestro Júnior, escola de formação para
crianças e adolescentes conduzida por Leovegildo Lins Gama Júnior — o Maestro
Júnior, ídolo do Flamengo e da Seleção Brasileira.

O site tem um trabalho: transformar visita em **aula experimental agendada**.

---

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha com as chaves do Supabase
npm run dev
```

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build localmente |
| `npm run lint` | Checagem de tipos |

Sem as variáveis do Supabase o site funciona normalmente: os formulários
validam, confirmam e direcionam para o WhatsApp, apenas não gravam nada.

---

## Estrutura

```
src/
  components/
    layout/     Header, Footer, WhatsApp flutuante, abertura de marca
    home/       Seções da home
    camp/       Formulário de interesse no Camp
    admin/      Painéis do /admin
    ui/         Botão, Figura, Campo, Revelar, LinhasCampo, Aviso
  pages/        Uma por rota
  data/         Conteúdo verificado (unidades, textos, imagens)
  lib/          Supabase, leads, SEO, WhatsApp, motion, admin
  hooks/        Revelação ao rolar, abertura de marca
supabase/
  migrations/   Esquema + RLS
  functions/    Edge Functions (webhook do WhatsApp, LLM)
docs/
  PESQUISA.md   De onde veio cada informação do site
```

---

## A regra que guia o projeto: nada inventado

A escola estava sem site. O conteúdo foi recuperado de fontes públicas e do
material enviado pela própria escola. **Nenhum endereço, telefone, valor, data,
estatística ou depoimento foi inventado.**

Cada informação carrega uma procedência:

| Marca | Significado |
|---|---|
| `verificado` | Confirmado em fonte pública citada, ou informado pela escola |
| `a_validar` | Veio de fonte pública real, mas está desatualizado (ex.: 2019) |
| `provisorio` | Texto editorial escrito para o site; precisa de aprovação |

Conteúdo `a_validar` e `provisorio` aparece no site com um aviso visível. Veja
[docs/PESQUISA.md](docs/PESQUISA.md) para a procedência completa.

### O que ficou deliberadamente de fora

Número de alunos, mensalidade, valor do Camp, datas da próxima edição e
resultados dos projetos sociais. A escola não confirmou esses dados, então eles
não entram — nem como estimativa.

---

## Fotografia

A maior parte do site usa **fotos reais** enviadas pela escola: o Camp no Le
Canton, o Júnior em campo, as crianças uniformizadas, as medalhas, e o projeto
social na comunidade.

Continuam provisórias (banco de imagens) apenas as **4 fotos das unidades**.
Elas estão marcadas com `provisoria: true` em `src/data/imagens.ts` e aparecem
no `/admin` para troca.

> ⚠️ Toda imagem do registro foi **aberta e conferida visualmente**. Responder
> HTTP 200 não diz nada sobre o que a foto mostra — a primeira seleção, feita só
> por URL, colocou uma tenista na página de Metodologia e um estádio de críquete
> na unidade de Fortaleza. Se for adicionar imagem, **olhe antes**.

---

## Banco de dados e privacidade

O site coleta nome e idade de **crianças**. Pela LGPD (art. 14), isso exige
consentimento específico do responsável legal.

O RLS foi desenhado ao contrário do padrão:

- a chave pública (anon), que vive no navegador, **só pode inserir** leads;
- ela **não consegue ler nenhum lead** — nem o que acabou de criar;
- a leitura só acontece autenticada (painel) ou via `service_role` (Edge Functions).

Mesmo que a chave anon vaze — e ela é pública por natureza — nenhum dado de
criança sai do servidor.

Depoimentos de 2019 entram **despublicados**: um consentimento daquela época não
se estende automaticamente a um site novo.

### Aplicar o esquema

```bash
supabase link --project-ref SEU_PROJECT_REF
supabase db push
```

### Criar o usuário do painel

No painel do Supabase → Authentication → Users → Add user. Não há cadastro
aberto: o acesso ao `/admin` é criado manualmente.

---

## Painel administrativo — `/admin`

Login por e-mail e senha (Supabase Auth). Permite:

- **Aulas experimentais** — leads com funil (novo → contatado → agendado →
  matriculado → perdido), link direto de WhatsApp e exportação CSV
- **Interesse no Camp** — lista de espera da próxima edição
- **Mensagens** — contato e propostas de parceria
- **Atendimento no WhatsApp** — configuração da IA e base de conhecimento

---

## Atendimento automático no WhatsApp

Um bot responde as famílias no WhatsApp e qualifica o lead. O dono controla tudo
pelo `/admin`, sem tocar em código:

- **Provedor e modelo** — DeepSeek, OpenAI ou Anthropic
- **Criatividade** (temperatura) e **persona**
- **Base de conhecimento** — a única fonte de verdade do bot

**A regra do bot:** ele só afirma o que está cadastrado na base. Preço, horário,
endereço e vaga são exatamente o que um modelo inventa com confiança — e numa
escola infantil, informação errada custa a confiança do pai. Quando não sabe, ele
passa para humano.

O dono pode assumir qualquer conversa digitando `/assumir` no próprio chat
(o bot silencia) e devolver com `/voltar`.

### Deploy das funções

```bash
supabase functions deploy uazapi-webhook --no-verify-jwt

supabase secrets set DEEPSEEK_API_KEY=...
supabase secrets set UAZAPI_URL=... UAZAPI_TOKEN=...
supabase secrets set OWNER_WHATSAPP=5521...
```

Aponte o webhook do provedor de WhatsApp para:
`https://SEU_PROJETO.supabase.co/functions/v1/uazapi-webhook`

---

## Deploy na Vercel

1. Importe o repositório
2. Framework **Vite** (detectado automaticamente)
3. Variáveis de ambiente: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`

O `vercel.json` já traz o rewrite de SPA, o cache dos assets e os cabeçalhos de
segurança.

---

## Tecnologia

React 18 · TypeScript · Vite · Tailwind CSS · Framer Motion · Lucide ·
Supabase (Postgres, Auth, Storage, Edge Functions) · Vercel

O design está documentado em [DESIGN.md](DESIGN.md); o contexto do produto, em
[PRODUCT.md](PRODUCT.md).
