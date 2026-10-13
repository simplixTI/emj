import { useEffect, useState } from 'react';
import { Mail, MailOpen } from 'lucide-react';
import { listarMensagens, marcarMensagemLida, type MensagemContato } from '@/lib/admin';

function dataBr(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit',
  });
}

export function PainelMensagens() {
  const [mensagens, setMensagens] = useState<MensagemContato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  async function carregar() {
    try {
      setMensagens(await listarMensagens());
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function alternarLida(m: MensagemContato) {
    setMensagens((atual) =>
      atual.map((x) => (x.id === m.id ? { ...x, lida: !x.lida } : x)),
    );
    try {
      await marcarMensagemLida(m.id, !m.lida);
    } catch (e) {
      setErro((e as Error).message);
      carregar();
    }
  }

  const naoLidas = mensagens.filter((m) => !m.lida).length;

  return (
    <section>
      <h1 className="font-display text-[2rem] uppercase leading-none text-[#102F46]">Mensagens</h1>
      <p className="mt-2 text-[0.9375rem] text-[#5F6B76]">
        <span className="tabular font-medium text-[#102F46]">{mensagens.length}</span> no total
        {naoLidas > 0 && (
          <>
            {' · '}
            <span className="tabular font-medium text-[#E53E55]">{naoLidas}</span> não lidas
          </>
        )}
      </p>

      {erro && (
        <p role="alert" className="mt-6 border border-[#C72F44] bg-[#C72F44]/[0.05] p-4 text-[0.875rem] text-[#C72F44]">
          {erro}
        </p>
      )}

      {carregando ? (
        <p className="mt-10 text-[#5F6B76]">Carregando…</p>
      ) : !mensagens.length ? (
        <div className="mt-10 border border-dashed border-[#DDE3E9] bg-white p-12 text-center">
          <p className="font-display text-[1.25rem] uppercase text-[#102F46]">Caixa vazia</p>
          <p className="mt-2 text-[#5F6B76]">
            Mensagens enviadas pelo formulário de contato e de parcerias aparecem aqui.
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {mensagens.map((m) => (
            <li
              key={m.id}
              className={`border bg-white p-5 ${m.lida ? 'border-[#DDE3E9]' : 'border-[#E53E55]'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-[1.25rem] uppercase leading-none text-[#102F46]">
                    {m.nome}
                    {m.organizacao && (
                      <span className="ml-2 text-[0.9375rem] normal-case text-[#5F6B76]">
                        — {m.organizacao}
                      </span>
                    )}
                  </h2>
                  <p className="mt-1.5 text-[0.875rem] text-[#5F6B76]">
                    {m.assunto === 'parceria' ? 'Proposta de parceria' : 'Contato'} ·{' '}
                    <a href={`mailto:${m.email}`} className="underline hover:text-[#E53E55]">
                      {m.email}
                    </a>
                    {m.telefone && <span className="tabular"> · {m.telefone}</span>}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="tabular text-[0.8125rem] text-[#5F6B76]">{dataBr(m.criado_em)}</span>
                  <button
                    type="button"
                    onClick={() => alternarLida(m)}
                    aria-label={m.lida ? 'Marcar como não lida' : 'Marcar como lida'}
                    className="flex min-h-[40px] w-10 cursor-pointer items-center justify-center border border-[#DDE3E9] text-[#5F6B76] transition-colors hover:border-[#102F46] hover:text-[#102F46]"
                  >
                    {m.lida ? (
                      <MailOpen size={16} strokeWidth={1.75} aria-hidden="true" />
                    ) : (
                      <Mail size={16} strokeWidth={1.75} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <p className="mt-4 border-t border-[#DDE3E9] pt-4 leading-relaxed text-[#102F46]">
                {m.mensagem}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
