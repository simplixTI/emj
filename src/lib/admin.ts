import { supabase } from './supabase';

/**
 * Acesso do painel administrativo.
 *
 * Toda leitura e escrita aqui passa por uma sessão autenticada do Supabase —
 * as policies de RLS exigem `authenticated`. Não existe senha no código, nem
 * token mestre no frontend: quem não estiver logado não lê um único lead.
 */

export interface LeadAula {
  id: string;
  nome_responsavel: string;
  nome_crianca: string;
  idade_crianca: string;
  unidade_interesse: string | null;
  telefone: string;
  email: string;
  mensagem: string | null;
  origem: string;
  situacao: 'novo' | 'contatado' | 'agendado' | 'matriculado' | 'perdido';
  anotacoes: string | null;
  criado_em: string;
}

export interface LeadCamp {
  id: string;
  nome_responsavel: string;
  nome_crianca: string;
  idade_crianca: string;
  telefone: string;
  email: string;
  mensagem: string | null;
  avisado: boolean;
  criado_em: string;
}

export interface MensagemContato {
  id: string;
  nome: string;
  organizacao: string | null;
  email: string;
  telefone: string | null;
  assunto: string;
  mensagem: string;
  lida: boolean;
  criado_em: string;
}

export interface ConfigBot {
  ativo: boolean;
  provedor: 'deepseek' | 'openai' | 'anthropic';
  modelo: string;
  temperatura: number;
  max_tokens: number;
  persona: string;
  horario_atendimento: string | null;
  whatsapp_dono: string | null;
}

export interface ItemConhecimento {
  id: string;
  categoria: string;
  pergunta: string | null;
  resposta: string;
  prioridade: number;
  ativo: boolean;
}

function cliente() {
  if (!supabase) {
    throw new Error(
      'Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
    );
  }
  return supabase;
}

/* --------------------------------- sessão -------------------------------- */

export async function entrar(email: string, senha: string) {
  const { error } = await cliente().auth.signInWithPassword({ email, password: senha });
  if (error) throw new Error(traduzirErroAuth(error.message));
}

export async function sair() {
  await cliente().auth.signOut();
}

export async function sessaoAtual() {
  const { data } = await cliente().auth.getSession();
  return data.session;
}

export function aoMudarSessao(callback: (logado: boolean) => void) {
  const { data } = cliente().auth.onAuthStateChange((_evento, sessao) => {
    callback(Boolean(sessao));
  });
  return () => data.subscription.unsubscribe();
}

/** O Supabase responde em inglês; o painel é da equipe da escola. */
function traduzirErroAuth(mensagem: string): string {
  if (/invalid login credentials/i.test(mensagem)) return 'E-mail ou senha incorretos.';
  if (/email not confirmed/i.test(mensagem)) return 'Confirme o e-mail antes de entrar.';
  if (/too many requests/i.test(mensagem)) {
    return 'Muitas tentativas seguidas. Aguarde um minuto e tente de novo.';
  }
  return 'Não foi possível entrar. Tente novamente.';
}

/* --------------------------------- leads --------------------------------- */

export async function listarLeadsAula(): Promise<LeadAula[]> {
  const { data, error } = await cliente()
    .from('leads_aula')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function atualizarLead(id: string, campos: Partial<LeadAula>) {
  const { error } = await cliente().from('leads_aula').update(campos).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function listarLeadsCamp(): Promise<LeadCamp[]> {
  const { data, error } = await cliente()
    .from('leads_camp')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(500);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function listarMensagens(): Promise<MensagemContato[]> {
  const { data, error } = await cliente()
    .from('mensagens')
    .select('*')
    .order('criado_em', { ascending: false })
    .limit(300);
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function marcarMensagemLida(id: string, lida: boolean) {
  const { error } = await cliente().from('mensagens').update({ lida }).eq('id', id);
  if (error) throw new Error(error.message);
}

/* ---------------------------------- bot ---------------------------------- */

export async function lerConfigBot(): Promise<ConfigBot> {
  const { data, error } = await cliente().from('bot_config').select('*').eq('id', 1).single();
  if (error) throw new Error(error.message);
  return data as ConfigBot;
}

export async function salvarConfigBot(config: Partial<ConfigBot>) {
  const { error } = await cliente().from('bot_config').update(config).eq('id', 1);
  if (error) throw new Error(error.message);
}

export async function listarConhecimento(): Promise<ItemConhecimento[]> {
  const { data, error } = await cliente()
    .from('bot_conhecimento')
    .select('*')
    .order('categoria')
    .order('prioridade', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function criarConhecimento(item: Omit<ItemConhecimento, 'id'>) {
  const { error } = await cliente().from('bot_conhecimento').insert(item);
  if (error) throw new Error(error.message);
}

export async function atualizarConhecimento(id: string, campos: Partial<ItemConhecimento>) {
  const { error } = await cliente().from('bot_conhecimento').update(campos).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function removerConhecimento(id: string) {
  const { error } = await cliente().from('bot_conhecimento').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/** Modelos sugeridos por provedor. O campo continua livre para digitar outro. */
export const MODELOS: Record<ConfigBot['provedor'], { valor: string; rotulo: string }[]> = {
  deepseek: [
    { valor: 'deepseek-chat', rotulo: 'DeepSeek Chat — mais barato' },
    { valor: 'deepseek-reasoner', rotulo: 'DeepSeek Reasoner — raciocina mais' },
  ],
  openai: [
    { valor: 'gpt-4o-mini', rotulo: 'GPT-4o mini — rápido e barato' },
    { valor: 'gpt-4o', rotulo: 'GPT-4o — mais capaz' },
  ],
  anthropic: [
    { valor: 'claude-sonnet-5', rotulo: 'Claude Sonnet 5 — equilibrado' },
    { valor: 'claude-haiku-4-5-20251001', rotulo: 'Claude Haiku 4.5 — mais rápido' },
    { valor: 'claude-opus-5', rotulo: 'Claude Opus 5 — o mais capaz' },
  ],
};

export const CATEGORIAS_CONHECIMENTO = [
  { valor: 'geral', rotulo: 'Geral' },
  { valor: 'unidades', rotulo: 'Unidades' },
  { valor: 'horarios', rotulo: 'Horários' },
  { valor: 'valores', rotulo: 'Valores e mensalidade' },
  { valor: 'camp', rotulo: 'Camp' },
  { valor: 'matricula', rotulo: 'Matrícula' },
  { valor: 'metodologia', rotulo: 'Metodologia' },
  { valor: 'projetos', rotulo: 'Projetos sociais' },
  { valor: 'politicas', rotulo: 'Políticas e regras' },
];
