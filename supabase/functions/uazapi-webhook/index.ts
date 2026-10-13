/**
 * Webhook do WhatsApp (uazapi).
 *
 * Responde 200 o mais rápido possível: provedores de WhatsApp reenviam a
 * mensagem quando o webhook demora, e reenvio vira resposta duplicada para a
 * família. Por isso o processamento roda em background (EdgeRuntime.waitUntil)
 * e a resposta HTTP sai na hora.
 */
import { processar, enviarWhatsApp } from '../_shared/cerebro.ts';

interface EventoUazapi {
  event?: string;
  message?: {
    text?: string;
    content?: string;
    sender?: string;
    chatid?: string;
    fromMe?: boolean;
    wasSentByApi?: boolean;
    senderName?: string;
  };
}

/** Normaliza o telefone para só dígitos. */
function soDigitos(valor: string): string {
  return valor.replace(/\D/g, '');
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('ok', { status: 200 });
  }

  let evento: EventoUazapi;
  try {
    evento = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: true, ignorado: 'corpo inválido' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const msg = evento.message;
  const texto = (msg?.text ?? msg?.content ?? '').trim();
  const bruto = msg?.sender ?? msg?.chatid ?? '';
  const telefone = soDigitos(bruto.split('@')[0] ?? '');

  // Sem texto ou sem remetente não há o que fazer (áudio, figurinha, status…).
  if (!texto || !telefone) {
    return new Response(JSON.stringify({ ok: true, ignorado: 'sem texto' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Mensagem que o PRÓPRIO BOT acabou de enviar: ignorar, senão ele conversa
  // sozinho em laço infinito.
  if (msg?.fromMe && msg?.wasSentByApi) {
    return new Response(JSON.stringify({ ok: true, ignorado: 'eco do bot' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const tarefa = (async () => {
    try {
      const resposta = await processar({
        telefone,
        texto,
        nomeContato: msg?.senderName,
        // fromMe sem wasSentByApi = o dono digitou na mão, no celular.
        doProprioDono: Boolean(msg?.fromMe),
      });
      if (resposta) await enviarWhatsApp(telefone, resposta);
    } catch (erro) {
      console.error('[webhook] falha no processamento:', (erro as Error).message);
    }
  })();

  // @ts-ignore — EdgeRuntime existe no runtime do Supabase
  if (typeof EdgeRuntime !== 'undefined') EdgeRuntime.waitUntil(tarefa);
  else await tarefa;

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
});
