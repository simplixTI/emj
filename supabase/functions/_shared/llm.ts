/**
 * Camada de LLM com provedor trocável.
 *
 * O dono escolhe provedor e modelo no /admin; aqui só traduzimos isso para a
 * API certa. As três APIs são parecidas o bastante para uma interface única,
 * e a diferença real (Anthropic separa o system prompt do histórico) fica
 * isolada em uma função.
 *
 * As chaves vivem em secrets da Edge Function — nunca no banco, nunca no
 * frontend. Trocar de provedor no admin não exige deploy; exige apenas que a
 * chave daquele provedor esteja configurada.
 */

export type Provedor = 'deepseek' | 'openai' | 'anthropic';

export interface Mensagem {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConfigLlm {
  provedor: Provedor;
  modelo: string;
  temperatura: number;
  maxTokens: number;
}

export interface RespostaBot {
  resposta: string;
  estado: 'DUVIDA' | 'LEAD_EM_ANDAMENTO' | 'LEAD_QUALIFICADO' | 'PASSAR_PARA_HUMANO';
  lead: {
    nomeResponsavel: string | null;
    nomeCrianca: string | null;
    idadeCrianca: string | null;
    unidadeInteresse: string | null;
    melhorHorario: string | null;
  };
  passarParaHumano: boolean;
  motivo: string | null;
}

const LEAD_VAZIO: RespostaBot['lead'] = {
  nomeResponsavel: null,
  nomeCrianca: null,
  idadeCrianca: null,
  unidadeInteresse: null,
  melhorHorario: null,
};

const ENDPOINTS: Record<Provedor, { url: string; envKey: string }> = {
  deepseek: { url: 'https://api.deepseek.com/chat/completions', envKey: 'DEEPSEEK_API_KEY' },
  openai: { url: 'https://api.openai.com/v1/chat/completions', envKey: 'OPENAI_API_KEY' },
  anthropic: { url: 'https://api.anthropic.com/v1/messages', envKey: 'ANTHROPIC_API_KEY' },
};

/** Teto duro da resposta. O prompt já pede mensagens curtas; isto é a rede. */
const MAX_CARACTERES = 700;

function cortarNaFrase(texto: string): string {
  const limpo = texto.trim();
  if (limpo.length <= MAX_CARACTERES) return limpo;

  const janela = limpo.slice(0, MAX_CARACTERES);
  const fim = Math.max(
    janela.lastIndexOf('.'),
    janela.lastIndexOf('!'),
    janela.lastIndexOf('?'),
    janela.lastIndexOf('\n'),
  );
  // Só corta na pontuação se sobrar mensagem suficiente; senão, corta no espaço.
  if (fim >= MAX_CARACTERES * 0.5) return janela.slice(0, fim + 1).trim();
  const espaco = janela.lastIndexOf(' ');
  return (espaco > 0 ? janela.slice(0, espaco) : janela).trim();
}

export async function conversar(
  config: ConfigLlm,
  promptSistema: string,
  historico: Mensagem[],
): Promise<RespostaBot> {
  const { url, envKey } = ENDPOINTS[config.provedor];
  const chave = Deno.env.get(envKey);

  if (!chave) {
    throw new Error(
      `A chave ${envKey} não está configurada. ` +
        `O provedor "${config.provedor}" foi escolhido no painel, mas a chave dele não existe ` +
        `nos secrets da Edge Function.`,
    );
  }

  const bruto =
    config.provedor === 'anthropic'
      ? await chamarAnthropic(url, chave, config, promptSistema, historico)
      : await chamarCompativelOpenAi(url, chave, config, promptSistema, historico);

  return interpretar(bruto);
}

/* ----------------------------- DeepSeek / OpenAI ------------------------- */

async function chamarCompativelOpenAi(
  url: string,
  chave: string,
  config: ConfigLlm,
  promptSistema: string,
  historico: Mensagem[],
): Promise<string> {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${chave}`,
    },
    body: JSON.stringify({
      model: config.modelo,
      messages: [{ role: 'system', content: promptSistema }, ...historico],
      response_format: { type: 'json_object' },
      temperature: config.temperatura,
      max_tokens: config.maxTokens,
    }),
  });

  if (!resposta.ok) {
    const corpo = await resposta.text().catch(() => '');
    throw new Error(`${config.provedor} respondeu ${resposta.status}: ${corpo.slice(0, 300)}`);
  }

  const dados = await resposta.json();
  return dados?.choices?.[0]?.message?.content ?? '';
}

/* -------------------------------- Anthropic ------------------------------ */

async function chamarAnthropic(
  url: string,
  chave: string,
  config: ConfigLlm,
  promptSistema: string,
  historico: Mensagem[],
): Promise<string> {
  const resposta = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': chave,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: config.modelo,
      // A Anthropic recebe o system fora da lista de mensagens.
      system: promptSistema,
      messages: historico,
      temperature: config.temperatura,
      max_tokens: config.maxTokens,
    }),
  });

  if (!resposta.ok) {
    const corpo = await resposta.text().catch(() => '');
    throw new Error(`anthropic respondeu ${resposta.status}: ${corpo.slice(0, 300)}`);
  }

  const dados = await resposta.json();
  return dados?.content?.[0]?.text ?? '';
}

/* ------------------------------- Interpretação --------------------------- */

const ESTADOS_VALIDOS: RespostaBot['estado'][] = [
  'DUVIDA',
  'LEAD_EM_ANDAMENTO',
  'LEAD_QUALIFICADO',
  'PASSAR_PARA_HUMANO',
];

/**
 * Lê o JSON do modelo com tolerância: às vezes vem embrulhado em texto ou em
 * cercas de markdown. Se nada funcionar, trata o conteúdo todo como a resposta
 * — o pior caso ainda entrega algo útil à família, em vez de um erro.
 */
function interpretar(conteudo: string): RespostaBot {
  let obj: Record<string, unknown> | null = null;

  try {
    obj = JSON.parse(conteudo);
  } catch {
    const achado = conteudo.match(/\{[\s\S]*\}/);
    if (achado) {
      try {
        obj = JSON.parse(achado[0]);
      } catch {
        obj = null;
      }
    }
  }

  if (!obj || typeof obj !== 'object') {
    return {
      resposta: cortarNaFrase(conteudo) || 'Oi! Como posso ajudar?',
      estado: 'DUVIDA',
      lead: { ...LEAD_VAZIO },
      passarParaHumano: false,
      motivo: null,
    };
  }

  const lead = (obj.lead && typeof obj.lead === 'object' ? obj.lead : {}) as Record<string, unknown>;
  const estado = ESTADOS_VALIDOS.includes(obj.estado as RespostaBot['estado'])
    ? (obj.estado as RespostaBot['estado'])
    : 'DUVIDA';

  const texto = (valor: unknown) =>
    typeof valor === 'string' && valor.trim() ? valor.trim() : null;

  return {
    resposta:
      cortarNaFrase(String(obj.resposta ?? '')) ||
      'Oi! Obrigado por falar com a Escola Maestro Júnior. Como posso ajudar?',
    estado,
    lead: {
      nomeResponsavel: texto(lead.nomeResponsavel),
      nomeCrianca: texto(lead.nomeCrianca),
      idadeCrianca: texto(lead.idadeCrianca),
      unidadeInteresse: texto(lead.unidadeInteresse),
      melhorHorario: texto(lead.melhorHorario),
    },
    // Estado terminal sempre implica passar para humano, mesmo que o modelo
    // tenha esquecido de marcar a flag.
    passarParaHumano:
      Boolean(obj.passarParaHumano) ||
      estado === 'PASSAR_PARA_HUMANO' ||
      estado === 'LEAD_QUALIFICADO',
    motivo: texto(obj.motivo),
  };
}
