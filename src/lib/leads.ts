import { supabase, supabaseConfigurado } from './supabase';
import type { LeadAula, LeadCamp } from '@/types';

export type ResultadoEnvio =
  | { ok: true; demo: boolean }
  | { ok: false; erro: string };

const ERRO_GENERICO =
  'Não conseguimos enviar agora. Tente novamente ou fale com a gente pelo WhatsApp.';

/**
 * Antispam sem CAPTCHA: um campo honeypot invisível + tempo mínimo de
 * preenchimento. Bots preenchem tudo e enviam em menos de 2 segundos.
 */
export function ehSpam(honeypot: string, abertoEm: number): boolean {
  if (honeypot.trim() !== '') return true;
  return Date.now() - abertoEm < 2500;
}

async function inserir(tabela: string, dados: Record<string, unknown>): Promise<ResultadoEnvio> {
  // Sem Supabase configurado o site segue utilizável: o formulário valida,
  // confirma e o visitante é direcionado ao WhatsApp. Melhor que um erro.
  if (!supabaseConfigurado || !supabase) {
    if (import.meta.env.DEV) console.info(`[leads] modo demonstração — ${tabela}:`, dados);
    return { ok: true, demo: true };
  }

  const { error } = await supabase.from(tabela).insert(dados);

  if (error) {
    console.error(`[leads] falha ao gravar em ${tabela}:`, error.message);
    return { ok: false, erro: ERRO_GENERICO };
  }
  return { ok: true, demo: false };
}

export function enviarLeadAula(lead: LeadAula): Promise<ResultadoEnvio> {
  return inserir('leads_aula', {
    nome_responsavel: lead.nomeResponsavel.trim(),
    nome_crianca: lead.nomeCrianca.trim(),
    idade_crianca: lead.idadeCrianca.trim(),
    unidade_interesse: lead.unidadeInteresse,
    telefone: lead.telefone.trim(),
    email: lead.email.trim().toLowerCase(),
    mensagem: lead.mensagem?.trim() || null,
    consentimento: lead.consentimento,
    origem: lead.origem,
  });
}

export function enviarLeadCamp(lead: LeadCamp): Promise<ResultadoEnvio> {
  return inserir('leads_camp', {
    nome_responsavel: lead.nomeResponsavel.trim(),
    nome_crianca: lead.nomeCrianca.trim(),
    idade_crianca: lead.idadeCrianca.trim(),
    telefone: lead.telefone.trim(),
    email: lead.email.trim().toLowerCase(),
    mensagem: lead.mensagem?.trim() || null,
    consentimento: lead.consentimento,
  });
}

export function enviarContatoParceria(dados: {
  nome: string;
  organizacao: string;
  email: string;
  telefone: string;
  mensagem: string;
  consentimento: boolean;
}): Promise<ResultadoEnvio> {
  return inserir('mensagens', {
    nome: dados.nome.trim(),
    organizacao: dados.organizacao.trim() || null,
    email: dados.email.trim().toLowerCase(),
    telefone: dados.telefone.trim(),
    mensagem: dados.mensagem.trim(),
    assunto: 'parceria',
    consentimento: dados.consentimento,
  });
}

/* ---------------------------- validação ---------------------------- */

export function validarTelefone(v: string): boolean {
  const d = v.replace(/\D/g, '');
  return d.length >= 10 && d.length <= 13;
}

export function validarEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

export function validarIdade(v: string): boolean {
  const n = Number(v.replace(/\D/g, ''));
  return Number.isFinite(n) && n >= 3 && n <= 18;
}

/** Máscara progressiva de telefone brasileiro. */
export function mascararTelefone(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
