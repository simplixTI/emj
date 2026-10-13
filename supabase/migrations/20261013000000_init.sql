-- ============================================================================
-- Escola de Futebol Maestro Júnior — esquema inicial
--
-- PRINCÍPIO DE SEGURANÇA: este banco guarda nome e idade de CRIANÇAS.
-- Pela LGPD (art. 14), isso exige consentimento específico do responsável e
-- tratamento no melhor interesse da criança.
--
-- Por isso o RLS é desenhado às avessas do padrão:
--   - a chave anon (que vive no navegador) pode APENAS INSERIR leads;
--   - a chave anon NÃO CONSEGUE LER NENHUM LEAD. Nunca. Nem o próprio.
--   - a leitura acontece só pelas Edge Functions (service_role) ou pelo
--     painel admin autenticado.
--
-- Resultado: mesmo que a chave anon vaze (e ela é pública por natureza),
-- nenhum dado de criança sai do servidor.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- LEADS DE AULA EXPERIMENTAL
-- ---------------------------------------------------------------------------
create table public.leads_aula (
  id uuid primary key default gen_random_uuid(),
  nome_responsavel text not null,
  nome_crianca text not null,
  idade_crianca text not null,
  unidade_interesse text,
  telefone text not null,
  email text not null,
  mensagem text,
  consentimento boolean not null default false,
  origem text default 'site',
  -- Funil: novo -> contatado -> agendado -> matriculado | perdido
  situacao text not null default 'novo',
  anotacoes text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint leads_aula_consentimento_obrigatorio check (consentimento = true),
  constraint leads_aula_situacao_valida
    check (situacao in ('novo', 'contatado', 'agendado', 'matriculado', 'perdido'))
);

-- ---------------------------------------------------------------------------
-- INTERESSADOS NO CAMP
-- ---------------------------------------------------------------------------
create table public.leads_camp (
  id uuid primary key default gen_random_uuid(),
  nome_responsavel text not null,
  nome_crianca text not null,
  idade_crianca text not null,
  telefone text not null,
  email text not null,
  mensagem text,
  consentimento boolean not null default false,
  -- Edição à qual o interesse se refere; nulo = próxima edição, qualquer que seja
  edicao_id uuid,
  avisado boolean not null default false,
  criado_em timestamptz not null default now(),

  constraint leads_camp_consentimento_obrigatorio check (consentimento = true)
);

-- ---------------------------------------------------------------------------
-- MENSAGENS INSTITUCIONAIS (contato, parcerias)
-- ---------------------------------------------------------------------------
create table public.mensagens (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  organizacao text,
  email text not null,
  telefone text,
  assunto text default 'contato',
  mensagem text not null,
  consentimento boolean not null default false,
  lida boolean not null default false,
  criado_em timestamptz not null default now(),

  constraint mensagens_consentimento_obrigatorio check (consentimento = true)
);

-- ---------------------------------------------------------------------------
-- CONTEÚDO ADMINISTRÁVEL
-- ---------------------------------------------------------------------------

-- Unidades. Começam com os dados recuperados do site de 2019, marcadas
-- como 'a_validar' até a escola confirmar.
create table public.unidades (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nome text not null,
  cidade text not null,
  estado text not null,
  regiao text not null,
  local text,
  endereco text not null,
  telefones text[] not null default '{}',
  whatsapp text,
  faixa_etaria text,
  -- [{dias:['seg'],hora:'08:00',faixa:'4 a 7 anos'}]
  horarios jsonb not null default '[]',
  mapa_query text,
  foto_url text,
  procedencia text not null default 'a_validar',
  publicada boolean not null default false,
  observacao text,
  ordem int not null default 0,
  atualizado_em timestamptz not null default now(),

  constraint unidades_procedencia_valida
    check (procedencia in ('verificado', 'a_validar', 'provisorio'))
);

-- Edições do Camp. Duas por ano, sem presumir datas.
create table public.camp_edicoes (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  periodo text,
  ano int not null,
  local text default 'Le Canton — Teresópolis, RJ',
  -- 'historico' = já aconteceu | 'confirmada' = próxima, com data
  -- | 'rascunho' = em preparação, NÃO aparece no site
  situacao text not null default 'rascunho',
  inscricoes_url text,
  observacao text,
  criado_em timestamptz not null default now(),

  constraint camp_edicoes_situacao_valida
    check (situacao in ('rascunho', 'confirmada', 'historico'))
);

-- Projetos sociais.
create table public.projetos_sociais (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  comunidade text,
  bairro text,
  cidade text default 'Rio de Janeiro',
  estado text default 'RJ',
  descricao text,
  patrocinador text,
  apoio text,
  inicio int,
  foto_url text,
  publicado boolean not null default false,
  ordem int not null default 0,
  atualizado_em timestamptz not null default now()
);

-- Galerias de fotos (camp, unidades, projetos).
create table public.fotos (
  id uuid primary key default gen_random_uuid(),
  -- chave do registro de imagens do site (src/data/imagens.ts) OU galeria livre
  chave text,
  galeria text not null default 'camp',
  url text not null,
  alt text not null,
  ordem int not null default 0,
  publicada boolean not null default true,
  criado_em timestamptz not null default now()
);

-- Depoimentos. Entram despublicados: consentimento de 2019 não vale para
-- um site novo (LGPD).
create table public.depoimentos (
  id uuid primary key default gen_random_uuid(),
  texto text not null,
  autor text not null,
  publicado boolean not null default false,
  consentimento_reautorizado boolean not null default false,
  criado_em timestamptz not null default now()
);

-- Blocos de texto institucional editáveis pelo admin.
create table public.conteudo (
  chave text primary key,
  valor text not null,
  descricao text,
  atualizado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- BOT DE WHATSAPP
-- ---------------------------------------------------------------------------

-- Configuração da LLM, editável pelo dono no /admin.
-- Linha única (id = 1), para não haver ambiguidade sobre qual config vale.
create table public.bot_config (
  id int primary key default 1,
  ativo boolean not null default true,
  provedor text not null default 'deepseek',
  modelo text not null default 'deepseek-chat',
  temperatura numeric(3, 2) not null default 0.40,
  max_tokens int not null default 600,
  persona text not null default
    'Você é um atendente da Escola de Futebol Maestro Júnior. Fale como uma pessoa da equipe: simpático, direto e natural. Nunca pareça um robô.',
  -- Horário comercial para o aviso automático de atendimento
  horario_atendimento text default 'Segunda a sexta, das 9h às 18h',
  -- Telefone do dono para receber avisos de lead qualificado
  whatsapp_dono text,
  atualizado_em timestamptz not null default now(),

  constraint bot_config_linha_unica check (id = 1),
  constraint bot_config_provedor_valido
    check (provedor in ('deepseek', 'openai', 'anthropic')),
  constraint bot_config_temperatura_valida
    check (temperatura >= 0 and temperatura <= 2)
);

insert into public.bot_config (id) values (1);

-- Base de conhecimento do bot. É daqui que ele tira as respostas — e ele é
-- instruído a NUNCA responder nada que não esteja aqui.
create table public.bot_conhecimento (
  id uuid primary key default gen_random_uuid(),
  categoria text not null default 'geral',
  pergunta text,
  resposta text not null,
  prioridade int not null default 0,
  ativo boolean not null default true,
  criado_em timestamptz not null default now(),

  constraint bot_conhecimento_categoria_valida
    check (categoria in ('geral', 'unidades', 'horarios', 'valores', 'camp',
                         'matricula', 'metodologia', 'projetos', 'politicas'))
);

-- Conversas do WhatsApp.
create table public.bot_conversas (
  telefone text primary key,
  nome_contato text,
  -- [{role:'user'|'assistant', content:'...', at:'...'}]
  mensagens jsonb not null default '[]',
  -- Quando o dono assume a conversa, o bot cala a boca.
  assumida_por_humano boolean not null default false,
  assumida_em timestamptz,
  atualizado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- TRIGGERS DE atualizado_em
-- ---------------------------------------------------------------------------
create or replace function public.tocar_atualizado_em()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger t_leads_aula_atualizado before update on public.leads_aula
  for each row execute function public.tocar_atualizado_em();
create trigger t_unidades_atualizado before update on public.unidades
  for each row execute function public.tocar_atualizado_em();
create trigger t_projetos_atualizado before update on public.projetos_sociais
  for each row execute function public.tocar_atualizado_em();
create trigger t_conteudo_atualizado before update on public.conteudo
  for each row execute function public.tocar_atualizado_em();
create trigger t_bot_config_atualizado before update on public.bot_config
  for each row execute function public.tocar_atualizado_em();
create trigger t_bot_conversas_atualizado before update on public.bot_conversas
  for each row execute function public.tocar_atualizado_em();

-- ---------------------------------------------------------------------------
-- ÍNDICES
-- ---------------------------------------------------------------------------
create index idx_leads_aula_criado on public.leads_aula (criado_em desc);
create index idx_leads_aula_situacao on public.leads_aula (situacao);
create index idx_leads_camp_criado on public.leads_camp (criado_em desc);
create index idx_mensagens_criado on public.mensagens (criado_em desc);
create index idx_unidades_publicada on public.unidades (publicada, ordem);
create index idx_fotos_galeria on public.fotos (galeria, ordem) where publicada;
create index idx_bot_conhecimento_ativo on public.bot_conhecimento (categoria, prioridade desc)
  where ativo;

-- ===========================================================================
-- ROW LEVEL SECURITY
-- ===========================================================================

alter table public.leads_aula        enable row level security;
alter table public.leads_camp        enable row level security;
alter table public.mensagens         enable row level security;
alter table public.unidades          enable row level security;
alter table public.camp_edicoes      enable row level security;
alter table public.projetos_sociais  enable row level security;
alter table public.fotos             enable row level security;
alter table public.depoimentos       enable row level security;
alter table public.conteudo          enable row level security;
alter table public.bot_config        enable row level security;
alter table public.bot_conhecimento  enable row level security;
alter table public.bot_conversas     enable row level security;

-- --- DADOS PESSOAIS: escrita pública, leitura ZERO -------------------------
-- O site precisa gravar o lead. Ninguém com a chave anon precisa lê-lo.
-- Sem policy de SELECT, a leitura é negada por padrão — inclusive para quem
-- acabou de inserir. É de propósito.

create policy "qualquer um pode enviar um lead de aula"
  on public.leads_aula for insert to anon, authenticated
  with check (consentimento = true);

create policy "qualquer um pode entrar na lista do camp"
  on public.leads_camp for insert to anon, authenticated
  with check (consentimento = true);

create policy "qualquer um pode enviar uma mensagem"
  on public.mensagens for insert to anon, authenticated
  with check (consentimento = true);

-- Leitura e gestão dos leads: apenas usuários autenticados (equipe da escola).
create policy "equipe lê leads de aula"
  on public.leads_aula for select to authenticated using (true);
create policy "equipe atualiza leads de aula"
  on public.leads_aula for update to authenticated using (true) with check (true);

create policy "equipe lê leads do camp"
  on public.leads_camp for select to authenticated using (true);
create policy "equipe atualiza leads do camp"
  on public.leads_camp for update to authenticated using (true) with check (true);

create policy "equipe lê mensagens"
  on public.mensagens for select to authenticated using (true);
create policy "equipe atualiza mensagens"
  on public.mensagens for update to authenticated using (true) with check (true);

-- --- CONTEÚDO PÚBLICO: leitura só do que está publicado --------------------

create policy "público lê unidades publicadas"
  on public.unidades for select to anon, authenticated using (publicada = true);
create policy "equipe gerencia unidades"
  on public.unidades for all to authenticated using (true) with check (true);

-- Rascunhos de edição do Camp não vazam: só 'confirmada' e 'historico'.
create policy "público lê edições divulgadas do camp"
  on public.camp_edicoes for select to anon, authenticated
  using (situacao in ('confirmada', 'historico'));
create policy "equipe gerencia edições do camp"
  on public.camp_edicoes for all to authenticated using (true) with check (true);

create policy "público lê projetos publicados"
  on public.projetos_sociais for select to anon, authenticated using (publicado = true);
create policy "equipe gerencia projetos"
  on public.projetos_sociais for all to authenticated using (true) with check (true);

create policy "público lê fotos publicadas"
  on public.fotos for select to anon, authenticated using (publicada = true);
create policy "equipe gerencia fotos"
  on public.fotos for all to authenticated using (true) with check (true);

-- Depoimento só aparece com a reautorização explícita do responsável.
create policy "público lê depoimentos reautorizados"
  on public.depoimentos for select to anon, authenticated
  using (publicado = true and consentimento_reautorizado = true);
create policy "equipe gerencia depoimentos"
  on public.depoimentos for all to authenticated using (true) with check (true);

create policy "público lê conteúdo"
  on public.conteudo for select to anon, authenticated using (true);
create policy "equipe gerencia conteúdo"
  on public.conteudo for all to authenticated using (true) with check (true);

-- --- BOT: nada é público ---------------------------------------------------
-- A config pode conter o telefone do dono; as conversas contêm dados de
-- famílias. Só a equipe autenticada e as Edge Functions (service_role) leem.

create policy "equipe gerencia config do bot"
  on public.bot_config for all to authenticated using (true) with check (true);

create policy "equipe gerencia conhecimento do bot"
  on public.bot_conhecimento for all to authenticated using (true) with check (true);

create policy "equipe lê conversas do bot"
  on public.bot_conversas for select to authenticated using (true);
create policy "equipe atualiza conversas do bot"
  on public.bot_conversas for update to authenticated using (true) with check (true);

-- ===========================================================================
-- STORAGE — mídia do site
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('midia', 'midia', true)
on conflict (id) do nothing;

create policy "público vê a mídia do site"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'midia');

create policy "equipe envia mídia"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'midia');

create policy "equipe substitui mídia"
  on storage.objects for update to authenticated
  using (bucket_id = 'midia');

create policy "equipe remove mídia"
  on storage.objects for delete to authenticated
  using (bucket_id = 'midia');
