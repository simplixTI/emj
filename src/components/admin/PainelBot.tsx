import { useEffect, useState } from 'react';
import { AlertTriangle, Check, Plus, Trash2 } from 'lucide-react';
import {
  CATEGORIAS_CONHECIMENTO,
  MODELOS,
  atualizarConhecimento,
  criarConhecimento,
  lerConfigBot,
  listarConhecimento,
  removerConhecimento,
  salvarConfigBot,
  type ConfigBot,
  type ItemConhecimento,
} from '@/lib/admin';

const rotulo = 'block font-display text-[0.8125rem] uppercase tracking-[0.1em] text-[#5F6B76]';
const campo =
  'mt-2 min-h-[48px] w-full border border-[#DDE3E9] bg-white px-4 text-[#102F46] focus:border-[#102F46] focus:outline-none';

/**
 * Configuração do atendimento automático no WhatsApp.
 *
 * O dono escolhe o provedor, o modelo, o tom e — o mais importante — o que o
 * bot pode dizer. A base de conhecimento é a única fonte de verdade do bot:
 * o que não estiver cadastrado aqui, ele não responde, ele passa para humano.
 */
export function PainelBot() {
  const [config, setConfig] = useState<ConfigBot | null>(null);
  const [itens, setItens] = useState<ItemConhecimento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [c, k] = await Promise.all([lerConfigBot(), listarConhecimento()]);
        setConfig(c);
        setItens(k);
      } catch (e) {
        setErro((e as Error).message);
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  async function salvar() {
    if (!config) return;
    setSalvando(true);
    setErro('');
    setSalvo(false);
    try {
      await salvarConfigBot(config);
      setSalvo(true);
      window.setTimeout(() => setSalvo(false), 2600);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setSalvando(false);
    }
  }

  function mudar<K extends keyof ConfigBot>(chave: K, valor: ConfigBot[K]) {
    setConfig((c) => (c ? { ...c, [chave]: valor } : c));
  }

  if (carregando) return <p className="text-[#5F6B76]">Carregando…</p>;
  if (!config) {
    return (
      <p role="alert" className="border border-[#C72F44] bg-[#C72F44]/[0.05] p-4 text-[#C72F44]">
        {erro || 'Não foi possível carregar a configuração.'}
      </p>
    );
  }

  return (
    <div className="space-y-10">
      <section>
        <h1 className="font-display text-[2rem] uppercase leading-none text-[#102F46]">
          Atendimento no WhatsApp
        </h1>
        <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-[#5F6B76]">
          Aqui você controla o assistente que responde as famílias no WhatsApp. Tudo o que ele pode
          dizer vem da base de conhecimento abaixo — se não estiver cadastrado, ele passa a conversa
          para uma pessoa em vez de inventar.
        </p>
      </section>

      {/* Liga/desliga */}
      <section className="border border-[#DDE3E9] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-[1.25rem] uppercase text-[#102F46]">
              Assistente {config.ativo ? 'ligado' : 'desligado'}
            </h2>
            <p className="mt-1.5 text-[0.9375rem] text-[#5F6B76]">
              {config.ativo
                ? 'As mensagens recebidas são respondidas automaticamente.'
                : 'As mensagens chegam normalmente, mas ninguém responde automaticamente.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => mudar('ativo', !config.ativo)}
            role="switch"
            aria-checked={config.ativo}
            className={`relative h-9 w-16 shrink-0 cursor-pointer rounded-full transition-colors ${
              config.ativo ? 'bg-[#1E7A4B]' : 'bg-[#DDE3E9]'
            }`}
          >
            <span className="sr-only">Ativar atendimento automático</span>
            <span
              className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-transform ${
                config.ativo ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </section>

      {/* Modelo */}
      <section className="border border-[#DDE3E9] bg-white p-6">
        <h2 className="font-display text-[1.25rem] uppercase text-[#102F46]">
          Inteligência artificial
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="provedor" className={rotulo}>
              Provedor
            </label>
            <select
              id="provedor"
              value={config.provedor}
              onChange={(e) => {
                const p = e.target.value as ConfigBot['provedor'];
                // Trocar de provedor exige trocar o modelo: os nomes não se
                // misturam entre APIs.
                mudar('provedor', p);
                mudar('modelo', MODELOS[p][0].valor);
              }}
              className={`${campo} cursor-pointer`}
            >
              <option value="deepseek">DeepSeek — mais econômico</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic (Claude)</option>
            </select>
          </div>

          <div>
            <label htmlFor="modelo" className={rotulo}>
              Modelo
            </label>
            <select
              id="modelo"
              value={config.modelo}
              onChange={(e) => mudar('modelo', e.target.value)}
              className={`${campo} cursor-pointer`}
            >
              {MODELOS[config.provedor].map((m) => (
                <option key={m.valor} value={m.valor}>
                  {m.rotulo}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="temperatura" className={rotulo}>
              Criatividade — {config.temperatura.toFixed(2)}
            </label>
            <input
              id="temperatura"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={config.temperatura}
              onChange={(e) => mudar('temperatura', Number(e.target.value))}
              className="mt-4 w-full cursor-pointer accent-[#E53E55]"
            />
            <p className="mt-2 text-[0.8125rem] text-[#5F6B76]">
              Mais baixo = respostas mais previsíveis e seguras. Para atendimento, recomendamos
              entre 0,30 e 0,50.
            </p>
          </div>

          <div>
            <label htmlFor="whatsapp-dono" className={rotulo}>
              WhatsApp para receber avisos
            </label>
            <input
              id="whatsapp-dono"
              type="tel"
              inputMode="tel"
              placeholder="5521999999999"
              value={config.whatsapp_dono ?? ''}
              onChange={(e) => mudar('whatsapp_dono', e.target.value)}
              className={`${campo} tabular`}
            />
            <p className="mt-2 text-[0.8125rem] text-[#5F6B76]">
              Avisamos aqui quando um lead ficar pronto ou alguém precisar falar com uma pessoa.
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="persona" className={rotulo}>
            Como o assistente deve falar
          </label>
          <textarea
            id="persona"
            rows={4}
            value={config.persona}
            onChange={(e) => mudar('persona', e.target.value)}
            className={`${campo} resize-y py-3 leading-relaxed`}
          />
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={salvar}
            disabled={salvando}
            className="min-h-[52px] cursor-pointer bg-[#E53E55] px-7 font-display text-[1rem] uppercase tracking-[0.05em] text-white transition-colors hover:bg-[#C72F44] disabled:opacity-50"
          >
            {salvando ? 'Salvando…' : 'Salvar configuração'}
          </button>
          {salvo && (
            <span role="status" className="flex items-center gap-2 text-[0.9375rem] text-[#1E7A4B]">
              <Check size={18} strokeWidth={2} aria-hidden="true" />
              Salvo
            </span>
          )}
        </div>

        <p className="mt-6 flex items-start gap-2.5 border border-[#DDE3E9] bg-[#F3F5F7] p-4 text-[0.8125rem] leading-relaxed text-[#5F6B76]">
          <AlertTriangle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
          A chave de API de cada provedor fica guardada no servidor, nunca aqui. Se você trocar o
          provedor e a chave dele não estiver configurada, o assistente avisa a família que a equipe
          vai responder — ele nunca fica mudo.
        </p>
      </section>

      {erro && (
        <p role="alert" className="border border-[#C72F44] bg-[#C72F44]/[0.05] p-4 text-[#C72F44]">
          {erro}
        </p>
      )}

      <BaseConhecimento itens={itens} aoMudar={setItens} />
    </div>
  );
}

/* ---------------------------- base de conhecimento ----------------------- */

function BaseConhecimento({
  itens,
  aoMudar,
}: {
  itens: ItemConhecimento[];
  aoMudar: (i: ItemConhecimento[]) => void;
}) {
  const [categoria, setCategoria] = useState('geral');
  const [pergunta, setPergunta] = useState('');
  const [resposta, setResposta] = useState('');
  const [erro, setErro] = useState('');

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!resposta.trim()) return;
    setErro('');
    try {
      await criarConhecimento({
        categoria,
        pergunta: pergunta.trim() || null,
        resposta: resposta.trim(),
        prioridade: 0,
        ativo: true,
      });
      aoMudar(await listarConhecimento());
      setPergunta('');
      setResposta('');
    } catch (err) {
      setErro((err as Error).message);
    }
  }

  async function alternar(item: ItemConhecimento) {
    await atualizarConhecimento(item.id, { ativo: !item.ativo });
    aoMudar(await listarConhecimento());
  }

  async function excluir(id: string) {
    if (!window.confirm('Remover esta informação da base do assistente?')) return;
    await removerConhecimento(id);
    aoMudar(await listarConhecimento());
  }

  return (
    <section className="border border-[#DDE3E9] bg-white p-6">
      <h2 className="font-display text-[1.25rem] uppercase text-[#102F46]">
        O que o assistente pode responder
      </h2>
      <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-[#5F6B76]">
        Cadastre aqui preços, horários, regras e respostas prontas. O assistente só usa o que está
        nesta lista. Tudo o que não estiver aqui, ele encaminha para a equipe.
      </p>

      <form onSubmit={adicionar} className="mt-6 grid gap-4 border-b border-[#DDE3E9] pb-6 md:grid-cols-[180px_1fr]">
        <div>
          <label htmlFor="kb-categoria" className={rotulo}>
            Assunto
          </label>
          <select
            id="kb-categoria"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className={`${campo} cursor-pointer`}
          >
            {CATEGORIAS_CONHECIMENTO.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="kb-pergunta" className={rotulo}>
            Pergunta (opcional)
          </label>
          <input
            id="kb-pergunta"
            value={pergunta}
            onChange={(e) => setPergunta(e.target.value)}
            placeholder="Ex.: Quanto custa a mensalidade?"
            className={campo}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="kb-resposta" className={rotulo}>
            O que o assistente deve dizer
          </label>
          <textarea
            id="kb-resposta"
            rows={3}
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Ex.: A mensalidade da unidade Barra da Tijuca é R$ 000,00, com duas aulas por semana."
            className={`${campo} resize-y py-3 leading-relaxed`}
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="flex min-h-[48px] cursor-pointer items-center gap-2 bg-[#102F46] px-6 font-display text-[0.9375rem] uppercase tracking-[0.05em] text-white transition-colors hover:bg-[#1B4463]"
          >
            <Plus size={17} strokeWidth={2} aria-hidden="true" />
            Adicionar
          </button>
        </div>
      </form>

      {erro && (
        <p role="alert" className="mt-4 text-[0.875rem] text-[#C72F44]">
          {erro}
        </p>
      )}

      {!itens.length ? (
        <div className="mt-8 border border-dashed border-[#DDE3E9] p-10 text-center">
          <p className="font-display text-[1.125rem] uppercase text-[#102F46]">
            A base está vazia
          </p>
          <p className="measure mx-auto mt-2 text-[0.9375rem] text-[#5F6B76]">
            Enquanto estiver assim, o assistente vai encaminhar quase tudo para a equipe — o que é
            seguro, mas dá mais trabalho. Comece pelos horários e pelos valores.
          </p>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-[#DDE3E9]">
          {itens.map((item) => (
            <li key={item.id} className="flex items-start gap-4 py-4">
              <div className="flex-1">
                <span className="font-display text-[0.6875rem] uppercase tracking-[0.12em] text-[#5F6B76]">
                  {CATEGORIAS_CONHECIMENTO.find((c) => c.valor === item.categoria)?.rotulo ??
                    item.categoria}
                </span>
                {item.pergunta && (
                  <p className="mt-1 font-medium text-[#102F46]">{item.pergunta}</p>
                )}
                <p
                  className={`mt-1 leading-relaxed ${
                    item.ativo ? 'text-[#5F6B76]' : 'text-[#5F6B76]/50 line-through'
                  }`}
                >
                  {item.resposta}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => alternar(item)}
                  className="min-h-[40px] cursor-pointer border border-[#DDE3E9] px-3 text-[0.8125rem] text-[#5F6B76] transition-colors hover:border-[#102F46] hover:text-[#102F46]"
                >
                  {item.ativo ? 'Desativar' : 'Ativar'}
                </button>
                <button
                  type="button"
                  onClick={() => excluir(item.id)}
                  aria-label="Remover informação"
                  className="flex min-h-[40px] w-10 cursor-pointer items-center justify-center border border-[#DDE3E9] text-[#5F6B76] transition-colors hover:border-[#C72F44] hover:text-[#C72F44]"
                >
                  <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
