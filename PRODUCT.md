# PRODUCT — Escola de Futebol Maestro Júnior

## O que é

Escola de futebol para crianças e adolescentes, fundada em 2017, conduzida por
Leovegildo Lins Gama Júnior — o Maestro Júnior, ídolo do Flamengo e da Seleção
Brasileira. Unidades no Rio de Janeiro e em Fortaleza. Duas vezes por ano realiza
o **Camp Maestro Júnior**, imersão de 3 dias no resort Le Canton, em Teresópolis.

O site anterior saiu do ar. Este projeto é a nova presença digital.

## Para quem

**Pai ou mãe de criança entre 4 e 17 anos**, majoritariamente no Rio de Janeiro,
chegando pelo Instagram, no celular, em um intervalo de poucos minutos. Não é um
comprador técnico: está decidindo onde o filho vai passar duas tardes por semana.

O que ele precisa responder, nessa ordem:
1. Isso é sério? Quem está por trás?
2. Tem perto de mim? Em que horário? Atende a idade do meu filho?
3. Meu filho vai gostar e vai ser bem tratado?
4. Como eu testo sem me comprometer?

## O trabalho do site

Converter visita em **aula experimental agendada**. Tudo o mais — metodologia,
projetos sociais, Camp — serve a essa decisão ou à captação para o Camp.

Metas, em ordem:
1. Lead de aula experimental (ação principal, presente em todas as páginas)
2. Lista de interesse do Camp (sazonal, dois picos por ano)
3. Contato institucional e parcerias para projetos sociais

## Restrições duras

**Nada inventado.** Não existem fotos reais, estatísticas, valores, datas futuras
nem projetos sociais nomeados publicamente. Ver `docs/PESQUISA.md` para o que é
verificado e o que é provisório. Conteúdo não confirmado aparece marcado e é
editável no `/admin` — nunca é apresentado como fato.

**LGPD.** O site coleta dados de responsáveis **e de crianças** (nome e idade).
Isso exige consentimento explícito, política de privacidade específica, RLS
fechado no Supabase e nenhuma leitura pública de leads.

**Mobile primeiro.** A origem do tráfego é o Instagram.

## O que existe de verdade

- Logo oficial (`public/logo.png`)
- Texto institucional de 2019, na voz da escola
- 4 unidades com endereço, telefone, horário e faixa etária (dados de 2019, a validar)
- Camp: parceria Le Canton, formato de 3 dias, medalha e certificado, 3 edições documentadas
- Contatos: (21) 99504-4848, escolamaestrojunior@gmail.com, Instagram, Facebook

## Plataforma

React + TypeScript + Vite + Tailwind + Framer Motion. Supabase (Postgres, Auth,
Storage) para admin, leads e conteúdo. Deploy na Vercel.

Inclui um **bot de WhatsApp com LLM configurável pelo /admin** — o dono ajusta
provedor, modelo, persona e base de conhecimento sem tocar em código. O bot nunca
inventa preço, horário ou endereço: quando não sabe, passa para humano.
