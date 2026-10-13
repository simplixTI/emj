import { createClient } from 'jsr:@supabase/supabase-js@2';
import { conversar, type ConfigLlm, type Mensagem, type RespostaBot } from './llm.ts';

/**
 * O cérebro do atendimento no WhatsApp.
 *
 * REGRA CENTRAL: o bot só pode afirmar o que está na base de conhecimento
 * cadastrada pela escola. Preço, horário, endereço e vaga são exatamente o
 * tipo de coisa que um modelo inventa com confiança — e, numa escola
 * infantil, uma informação errada custa a confiança do pai.
 * Quando não sabe, ele passa para humano. Sempre.
 */

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  { auth: { persistSession: false } },
);

const RESPOSTA_DE_EMERGENCIA =
  'Oi! Aqui é da Escola de Futebol Maestro Júnior ⚽ ' +
  'Tivemos uma instabilidade no atendimento automático, mas nossa equipe já vai te responder por aqui.';

/** Quantas mensagens do histórico vão para o modelo. */
const JANELA_HISTORICO = 24;

/* ------------------------------ configuração ----------------------------- */

interface Config extends ConfigLlm {
  ativo: boolean;
  persona: string;
  horarioAtendimento: string | null;
  whatsappDono: string | null;
}

async function lerConfig(): Promise<Config> {
  const { data } = await supabase.from('bot_config').select('*').eq('id', 1).single();

  return {
    ativo: data?.ativo ?? true,
    provedor: data?.provedor ?? 'deepseek',
    modelo: data?.modelo ?? 'deepseek-chat',
    temperatura: Number(data?.temperatura ?? 0.4),
    maxTokens: data?.max_tokens ?? 600,
    persona: data?.persona ?? 'Você é um atendente da Escola de Futebol Maestro Júnior.',
    horarioAtendimento: data?.horario_atendimento ?? null,
    whatsappDono: data?.whatsapp_dono ?? null,
  };
}

/* --------------------------- base de conhecimento ------------------------ */

async function lerConhecimento(): Promise<string> {
  const { data } = await supabase
    .from('bot_conhecimento')
    .select('categoria, pergunta, resposta')
    .eq('ativo', true)
    .order('prioridade', { ascending: false })
    .limit(200);

  if (!data?.length) return '';

  const porCategoria = new Map<string, string[]>();
  for (const item of data) {
    const linha = item.pergunta ? `- ${item.pergunta} → ${item.resposta}` : `- ${item.resposta}`;
    const lista = porCategoria.get(item.categoria) ?? [];
    lista.push(linha);
    porCategoria.set(item.categoria, lista);
  }

  return [...porCategoria.entries()]
    .map(([cat, linhas]) => `## ${cat.toUpperCase()}\n${linhas.join('\n')}`)
    .join('\n\n');
}

/** Unidades publicadas, para o bot indicar a mais perto sem inventar nenhuma. */
async function lerUnidades(): Promise<string> {
  const { data } = await supabase
    .from('unidades')
    .select('nome, cidade, estado, local, endereco, faixa_etaria, horarios')
    .eq('publicada', true)
    .order('ordem');

  if (!data?.length) return 'Nenhuma unidade cadastrada — passe para humano se perguntarem.';

  return data
    .map(
      (u) =>
        `- ${u.nome} (${u.cidade}/${u.estado}) — ${u.local ?? ''}, ${u.endereco}. ` +
        `Idades: ${u.faixa_etaria ?? 'confirmar'}. Horários: ${JSON.stringify(u.horarios)}`,
    )
    .join('\n');
}

/* ------------------------------ prompt ----------------------------------- */

/**
 * Âncora de tempo. Sem isto o modelo chuta o dia da semana a partir do
 * treinamento e diz coisas como "hoje não tem aula" num dia que tem.
 */
function ancoraDeTempo(): string {
  const agora = new Date();
  const tz = 'America/Sao_Paulo';
  const extenso = agora.toLocaleString('pt-BR', {
    timeZone: tz,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const hora = agora.toLocaleString('pt-BR', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
  });

  return `ÂNCORA DE TEMPO — use isto como verdade para qualquer conta de data ou dia.
- Fuso: America/Sao_Paulo
- Agora: ${extenso}, ${hora}
- Ao resolver "hoje", "amanhã", "esse sábado", calcule a partir daqui e diga o dia da semana E a data, para não restar dúvida.
- A grade de horários é um padrão SEMANAL. Não invente cancelamento nem aula extra.`;
}

function montarPrompt(
  config: Config,
  conhecimento: string,
  unidades: string,
  leadConhecido: RespostaBot['lead'] | null,
  temHistorico: boolean,
): string {
  const jaSabemos = leadConhecido
    ? `JÁ SABEMOS SOBRE ESTA FAMÍLIA: ${JSON.stringify(leadConhecido)}. Não pergunte de novo o que já está preenchido. Campos nulos podem ter sido respondidos no histórico — leia antes de perguntar.`
    : temHistorico
      ? 'CONTATO QUE JÁ CONVERSOU ANTES. Leia o histórico abaixo e continue de onde parou; não recomece.'
      : 'Primeiro contato desta família.';

  const regraHistorico = temHistorico
    ? `
- ANTES DE RESPONDER, releia o histórico e liste mentalmente o que já está RESOLVIDO: nome e idade da criança, nome do responsável, unidade escolhida, horário combinado, aula já agendada, dúvidas já respondidas.
- Tudo o que está nessa lista está TRAVADO. Não pergunte de novo, não ofereça de novo, não recomece fluxo que a família já concluiu.
- Mensagens enviadas manualmente pela equipe são AUTORIDADE máxima. Continue a partir delas; nunca contradiga.`
    : '';

  return `${config.persona}

Você atende no WhatsApp, em português do Brasil. Fale como gente: frases curtas, calorosas e diretas. Nada de linguagem corporativa.

${ancoraDeTempo()}

UNIDADES DA ESCOLA (as únicas que existem):
${unidades}

BASE DE CONHECIMENTO (sua ÚNICA fonte de verdade):
${conhecimento || '(vazia — praticamente tudo deve ir para humano)'}

REGRAS INEGOCIÁVEIS:
- NUNCA invente valor de mensalidade, matrícula ou do Camp. NUNCA invente horário, endereço, data ou vaga disponível. Se não está acima, você NÃO SABE.
- Quando não souber: diga com naturalidade que vai confirmar com a equipe e marque passarParaHumano = true. É sempre melhor que chutar.
- Dados de criança: colete apenas nome e idade, e só para agendar a aula. Nunca peça documento, CPF, endereço residencial, escola ou foto.
- Se quem escreve parecer ser a própria criança, peça gentilmente para falar com o responsável.

O QUE VOCÊ QUER: agendar uma AULA EXPERIMENTAL. Converse com calma, UMA pergunta por vez.
Ordem natural: idade da criança → unidade mais perto → nome da criança → nome do responsável → melhor dia/horário.
Quando tiver idade, unidade, nome da criança, nome do responsável e horário, o estado vira LEAD_QUALIFICADO e você confirma tudo numa mensagem só.

PASSE PARA HUMANO quando: pedirem preço que você não tem, reclamarem, houver questão de saúde ou segurança, pedirem para falar com uma pessoa, ou você ficar em dúvida.

ESTILO: 1 a 3 frases por mensagem. Termine sempre em frase completa. Nada de despejar tudo de uma vez.

${jaSabemos}${regraHistorico}

FORMATO DA SAÍDA — responda SOMENTE com este JSON, sem markdown e sem texto fora dele:
{"resposta":"...","estado":"DUVIDA|LEAD_EM_ANDAMENTO|LEAD_QUALIFICADO|PASSAR_PARA_HUMANO","lead":{"nomeResponsavel":null,"nomeCrianca":null,"idadeCrianca":null,"unidadeInteresse":null,"melhorHorario":null},"passarParaHumano":false,"motivo":null}
Em "lead", repita tudo o que já souber (carregue os valores anteriores adiante), e null no que falta.`;
}

/* ------------------------------- conversa -------------------------------- */

interface Conversa {
  mensagens: Mensagem[];
  assumidaPorHumano: boolean;
}

async function lerConversa(telefone: string): Promise<Conversa> {
  const { data } = await supabase
    .from('bot_conversas')
    .select('mensagens, assumida_por_humano')
    .eq('telefone', telefone)
    .maybeSingle();

  return {
    mensagens: (data?.mensagens ?? []) as Mensagem[],
    assumidaPorHumano: data?.assumida_por_humano ?? false,
  };
}

async function gravarMensagens(telefone: string, novas: Mensagem[]): Promise<void> {
  const { mensagens } = await lerConversa(telefone);
  // Guardamos o histórico completo no banco; a janela é só o que vai ao modelo.
  const todas = [...mensagens, ...novas].slice(-300);

  await supabase
    .from('bot_conversas')
    .upsert({ telefone, mensagens: todas }, { onConflict: 'telefone' });
}

async function definirAssumida(telefone: string, assumida: boolean): Promise<void> {
  await supabase.from('bot_conversas').upsert(
    {
      telefone,
      assumida_por_humano: assumida,
      assumida_em: assumida ? new Date().toISOString() : null,
    },
    { onConflict: 'telefone' },
  );
}

/* --------------------------------- lead ---------------------------------- */

async function salvarLead(telefone: string, lead: RespostaBot['lead']): Promise<void> {
  // Só grava quando há o mínimo para a equipe conseguir retornar o contato.
  if (!lead.nomeCrianca || !lead.idadeCrianca) return;

  await supabase.from('leads_aula').insert({
    nome_responsavel: lead.nomeResponsavel ?? 'Não informado',
    nome_crianca: lead.nomeCrianca,
    idade_crianca: lead.idadeCrianca,
    unidade_interesse: lead.unidadeInteresse,
    telefone,
    email: 'nao-informado@whatsapp.local',
    mensagem: lead.melhorHorario ? `Melhor horário: ${lead.melhorHorario}` : null,
    // O consentimento no WhatsApp é o próprio ato de procurar a escola e
    // entregar os dados espontaneamente; registramos a origem para auditoria.
    consentimento: true,
    origem: 'whatsapp',
  });
}

/* ------------------------------ entrada ---------------------------------- */

export interface Entrada {
  telefone: string;
  texto: string;
  nomeContato?: string;
  /** true quando a mensagem foi digitada pelo próprio número da escola */
  doProprioDono?: boolean;
}

/**
 * Processa uma mensagem recebida. Devolve o texto a enviar de volta, ou null
 * quando o bot deve ficar calado (conversa assumida por humano).
 * Nunca lança: uma falha aqui não pode derrubar o webhook.
 */
export async function processar(entrada: Entrada): Promise<string | null> {
  const { telefone, texto } = entrada;

  try {
    /* --- comandos do dono, digitados dentro da conversa --- */
    if (entrada.doProprioDono) {
      const comando = texto.trim().toLowerCase();

      if (comando === '/assumir') {
        await definirAssumida(telefone, true);
        return 'Agora você está falando direto com a equipe da escola ⚽';
      }
      if (comando === '/voltar') {
        await definirAssumida(telefone, false);
        return 'Obrigado por aguardar! Nosso atendimento automático voltou e segue com você ⚽';
      }

      // Qualquer outra mensagem do dono: ele assumiu a conversa na prática.
      // Guardamos como contexto e o bot se cala.
      await definirAssumida(telefone, true);
      await gravarMensagens(telefone, [{ role: 'assistant', content: texto }]);
      return null;
    }

    const conversa = await lerConversa(telefone);

    // Humano no comando: registra a mensagem da família e fica quieto.
    if (conversa.assumidaPorHumano) {
      await gravarMensagens(telefone, [{ role: 'user', content: texto }]);
      return null;
    }

    const config = await lerConfig();
    if (!config.ativo) {
      await gravarMensagens(telefone, [{ role: 'user', content: texto }]);
      return null;
    }

    // Grava a mensagem da família ANTES de chamar a LLM: se a chamada falhar,
    // o histórico não se perde.
    await gravarMensagens(telefone, [{ role: 'user', content: texto }]);

    const [conhecimento, unidades] = await Promise.all([lerConhecimento(), lerUnidades()]);
    const historico = [...conversa.mensagens, { role: 'user' as const, content: texto }].slice(
      -JANELA_HISTORICO,
    );

    const resultado = await conversar(
      config,
      montarPrompt(config, conhecimento, unidades, null, conversa.mensagens.length > 0),
      historico,
    );

    await gravarMensagens(telefone, [{ role: 'assistant', content: resultado.resposta }]);

    if (resultado.estado === 'LEAD_QUALIFICADO') {
      await salvarLead(telefone, resultado.lead);
      await avisarDono(config, telefone, resultado);
    } else if (resultado.passarParaHumano) {
      await avisarDono(config, telefone, resultado);
    }

    return resultado.resposta;
  } catch (erro) {
    console.error(`[cerebro] falha ao atender ${telefone}:`, (erro as Error).message);
    return RESPOSTA_DE_EMERGENCIA;
  }
}

/* ------------------------------ aviso ao dono ---------------------------- */

async function avisarDono(
  config: Config,
  telefone: string,
  resultado: RespostaBot,
): Promise<void> {
  const destino = config.whatsappDono ?? Deno.env.get('OWNER_WHATSAPP');
  if (!destino) return;

  const titulo =
    resultado.estado === 'LEAD_QUALIFICADO'
      ? '🟢 Aula experimental para agendar'
      : '🔴 Alguém precisa de atendimento';

  const linhas = [
    titulo,
    '',
    `Telefone: ${telefone}`,
    resultado.lead.nomeResponsavel && `Responsável: ${resultado.lead.nomeResponsavel}`,
    resultado.lead.nomeCrianca && `Criança: ${resultado.lead.nomeCrianca}`,
    resultado.lead.idadeCrianca && `Idade: ${resultado.lead.idadeCrianca}`,
    resultado.lead.unidadeInteresse && `Unidade: ${resultado.lead.unidadeInteresse}`,
    resultado.lead.melhorHorario && `Horário: ${resultado.lead.melhorHorario}`,
    resultado.motivo && `Motivo: ${resultado.motivo}`,
  ].filter(Boolean);

  try {
    await enviarWhatsApp(destino, linhas.join('\n'));
  } catch (erro) {
    // Um aviso que falha não pode derrubar o atendimento da família.
    console.error('[cerebro] não consegui avisar o dono:', (erro as Error).message);
  }
}

export async function enviarWhatsApp(telefone: string, texto: string): Promise<void> {
  const url = Deno.env.get('UAZAPI_URL');
  const token = Deno.env.get('UAZAPI_TOKEN');
  if (!url || !token) {
    console.warn('[whatsapp] UAZAPI_URL/UAZAPI_TOKEN ausentes — mensagem não enviada');
    return;
  }

  const resposta = await fetch(`${url.replace(/\/$/, '')}/send/text`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', token },
    body: JSON.stringify({ number: telefone, text: texto }),
  });

  if (!resposta.ok) {
    throw new Error(`uazapi respondeu ${resposta.status}: ${await resposta.text()}`);
  }
}
