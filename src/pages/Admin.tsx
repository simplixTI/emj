import { useEffect, useState } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';
import { aoMudarSessao, entrar, sair, sessaoAtual } from '@/lib/admin';
import { PainelLeads } from '@/components/admin/PainelLeads';
import { PainelBot } from '@/components/admin/PainelBot';
import { PainelMensagens } from '@/components/admin/PainelMensagens';
import { supabaseConfigurado } from '@/lib/supabase';

type Aba = 'leads' | 'camp' | 'mensagens' | 'bot';

const ABAS: { id: Aba; rotulo: string }[] = [
  { id: 'leads', rotulo: 'Aulas experimentais' },
  { id: 'camp', rotulo: 'Interesse no Camp' },
  { id: 'mensagens', rotulo: 'Mensagens' },
  { id: 'bot', rotulo: 'Atendimento WhatsApp' },
];

/**
 * Painel administrativo.
 *
 * Fica fora do layout público de propósito: sem menu, sem rodapé, sem botão
 * de WhatsApp. É uma ferramenta de trabalho, não uma página do site — e a
 * densidade aqui é maior do que no site, porque quem usa vem todo dia.
 */
export default function Admin() {
  const [logado, setLogado] = useState<boolean | null>(null);
  const [aba, setAba] = useState<Aba>('leads');

  useEffect(() => {
    document.title = 'Painel — Escola Maestro Júnior';
    // O painel nunca deve ser indexado.
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);

    if (!supabaseConfigurado) {
      setLogado(false);
      return () => meta.remove();
    }

    sessaoAtual().then((s) => setLogado(Boolean(s)));
    const cancelar = aoMudarSessao(setLogado);
    return () => {
      cancelar();
      meta.remove();
    };
  }, []);

  if (logado === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0A1F2F]">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-[#E53E55]" />
        <span className="sr-only">Carregando painel</span>
      </div>
    );
  }

  if (!logado) return <TelaLogin />;

  return (
    <div className="min-h-screen bg-[#F3F5F7]">
      <header className="on-navy sticky top-0 z-20 border-b border-white/10 bg-[#102F46]">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-display text-[0.9375rem] uppercase leading-tight tracking-[0.02em] text-white">
              Painel
              <span className="block text-[#A8C0D4]">Maestro Júnior</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => sair()}
            className="flex min-h-[44px] cursor-pointer items-center gap-2 border border-white/20 px-4 font-display text-[0.875rem] uppercase tracking-[0.05em] text-white transition-colors hover:border-[#E53E55] hover:bg-[#E53E55]"
          >
            <LogOut size={16} strokeWidth={1.75} aria-hidden="true" />
            Sair
          </button>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-5" aria-label="Seções do painel">
          {ABAS.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAba(a.id)}
              aria-current={aba === a.id ? 'page' : undefined}
              className={`relative min-h-[48px] shrink-0 cursor-pointer whitespace-nowrap px-4 font-display text-[0.875rem] uppercase tracking-[0.05em] transition-colors ${
                aba === a.id ? 'text-white' : 'text-[#A8C0D4] hover:text-white'
              }`}
            >
              {a.rotulo}
              {aba === a.id && (
                <span className="absolute inset-x-2 bottom-0 h-[2px] bg-[#E53E55]" />
              )}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        {aba === 'leads' && <PainelLeads tipo="aula" />}
        {aba === 'camp' && <PainelLeads tipo="camp" />}
        {aba === 'mensagens' && <PainelMensagens />}
        {aba === 'bot' && <PainelBot />}
      </main>
    </div>
  );
}

/* --------------------------------- login --------------------------------- */

function TelaLogin() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setErro('');

    if (!supabaseConfigurado) {
      setErro(
        'O Supabase ainda não foi configurado neste ambiente. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
      );
      return;
    }

    setEnviando(true);
    try {
      await entrar(email, senha);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="on-navy flex min-h-screen items-center justify-center bg-[#102F46] px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt="" width={72} height={72} className="h-18 w-18 object-contain" />
          <h1 className="mt-6 text-center font-display text-[1.75rem] uppercase leading-none text-white">
            Painel da escola
          </h1>
          <p className="mt-3 text-center text-[0.9375rem] text-[#A8C0D4]">
            Acesso restrito à equipe.
          </p>
        </div>

        <form onSubmit={submeter} className="mt-10 space-y-5">
          <div>
            <label
              htmlFor="admin-email"
              className="block font-display text-[0.8125rem] uppercase tracking-[0.1em] text-[#A8C0D4]"
            >
              E-mail
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 min-h-[52px] w-full border border-white/20 bg-white/[0.06] px-4 text-white placeholder:text-white/35 focus:border-white focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="admin-senha"
              className="block font-display text-[0.8125rem] uppercase tracking-[0.1em] text-[#A8C0D4]"
            >
              Senha
            </label>
            <input
              id="admin-senha"
              type="password"
              autoComplete="current-password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="mt-2 min-h-[52px] w-full border border-white/20 bg-white/[0.06] px-4 text-white focus:border-white focus:outline-none"
            />
          </div>

          {erro && (
            <p role="alert" className="border border-[#E53E55]/50 bg-[#E53E55]/10 p-3 text-[0.875rem] text-[#FFC9D0]">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="min-h-[56px] w-full cursor-pointer bg-[#E53E55] font-display text-[1rem] uppercase tracking-[0.05em] text-white transition-colors hover:bg-[#C72F44] disabled:opacity-50"
          >
            {enviando ? 'Entrando…' : 'Entrar'}
          </button>
        </form>

        <p className="mt-8 flex items-start gap-2 text-[0.8125rem] leading-relaxed text-[#A8C0D4]/80">
          <ShieldCheck size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" aria-hidden="true" />
          Os dados de responsáveis e crianças só são visíveis para quem está autenticado. A chave
          pública do site não consegue ler nenhum cadastro.
        </p>
      </div>
    </div>
  );
}
