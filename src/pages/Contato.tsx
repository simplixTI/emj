import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Instagram, Mail, MessageCircle, Phone, Send } from 'lucide-react';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Revelar } from '@/components/ui/Revelar';
import { Botao, BotaoExterno } from '@/components/ui/Botao';
import {
  CampoArmadilha,
  CampoConsentimento,
  CampoSelecao,
  CampoTexto,
  CampoTextoLongo,
} from '@/components/ui/Campo';
import { contato } from '@/data/conteudo';
import { unidadesPublicadas } from '@/data/unidades';
import { imagens } from '@/data/imagens';
import {
  ehSpam,
  enviarLeadAula,
  mascararTelefone,
  validarEmail,
  validarIdade,
  validarTelefone,
} from '@/lib/leads';
import { linkWhatsApp, MSG_AULA_EXPERIMENTAL } from '@/lib/whatsapp';
import { useSeo } from '@/lib/seo';

export default function Contato() {
  useSeo({
    titulo: 'Contato — Agende uma aula experimental | Escola Maestro Júnior',
    descricao:
      'Agende uma aula experimental na Escola de Futebol Maestro Júnior. Unidades no Rio de Janeiro e em Fortaleza. Fale por WhatsApp, telefone ou e-mail.',
    caminho: '/contato',
  });

  const [abertoEm] = useState(() => Date.now());
  const [armadilha, setArmadilha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroGeral, setErroGeral] = useState('');
  const [erros, setErros] = useState<Record<string, string | undefined>>({});

  const [form, setForm] = useState({
    nomeResponsavel: '',
    nomeCrianca: '',
    idadeCrianca: '',
    unidadeInteresse: '',
    telefone: '',
    email: '',
    mensagem: '',
    consentimento: false,
  });

  const definir = (campo: keyof typeof form) => (v: string | boolean) => {
    setForm((f) => ({ ...f, [campo]: v }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  };

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErroGeral('');

    const e: Record<string, string | undefined> = {};
    if (!form.nomeResponsavel.trim()) e.nomeResponsavel = 'Informe o nome do responsável.';
    if (!form.nomeCrianca.trim()) e.nomeCrianca = 'Informe o nome da criança.';
    if (!validarIdade(form.idadeCrianca)) e.idadeCrianca = 'Informe a idade entre 3 e 18 anos.';
    if (!form.unidadeInteresse) e.unidadeInteresse = 'Escolha a unidade de interesse.';
    if (!validarTelefone(form.telefone)) e.telefone = 'Informe um telefone com DDD.';
    if (!validarEmail(form.email)) e.email = 'Informe um e-mail válido.';
    if (!form.consentimento) e.consentimento = 'É necessário aceitar para enviar.';
    setErros(e);
    if (Object.values(e).some(Boolean)) return;

    if (ehSpam(armadilha, abertoEm)) {
      setErroGeral('Não foi possível enviar. Recarregue a página e tente novamente.');
      return;
    }

    setEnviando(true);
    const r = await enviarLeadAula({ ...form, origem: 'contato' });
    setEnviando(false);
    if (r.ok) setEnviado(true);
    else setErroGeral(r.erro);
  }

  return (
    <>
      <CabecalhoPagina
        titulo="Agende uma aula experimental"
        descricao="Preencha os dados e nossa equipe entra em contato para marcar o melhor dia e horário."
        imagem={imagens.contato}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Formulário */}
            <div className="lg:col-span-7">
              {enviado ? (
                <div
                  className="border border-[#DDE3E9] bg-[#F3F5F7] p-8 text-center md:p-12"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2
                    size={48}
                    strokeWidth={1.5}
                    className="mx-auto text-[#E53E55]"
                    aria-hidden="true"
                  />
                  <h2 className="display-sm mt-5 font-display text-[#102F46]">
                    Recebemos sua solicitação
                  </h2>
                  <p className="measure mx-auto mt-4 leading-relaxed text-[#5F6B76]">
                    Nossa equipe entra em contato pelo WhatsApp para confirmar o dia e o horário da
                    aula experimental. Se preferir falar agora, chame a gente direto.
                  </p>
                  <div className="mt-8 flex justify-center">
                    <BotaoExterno
                      href={linkWhatsApp(MSG_AULA_EXPERIMENTAL)}
                      icone={<MessageCircle size={19} strokeWidth={1.75} aria-hidden="true" />}
                    >
                      Falar no WhatsApp
                    </BotaoExterno>
                  </div>
                </div>
              ) : (
                <form onSubmit={enviar} noValidate>
                  <h2 className="sr-only">Formulário de aula experimental</h2>
                  <CampoArmadilha valor={armadilha} aoMudar={setArmadilha} />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <CampoTexto
                      rotulo="Nome do responsável"
                      valor={form.nomeResponsavel}
                      aoMudar={definir('nomeResponsavel') as (v: string) => void}
                      erro={erros.nomeResponsavel}
                      autoComplete="name"
                      obrigatorio
                    />
                    <CampoTexto
                      rotulo="Nome da criança"
                      valor={form.nomeCrianca}
                      aoMudar={definir('nomeCrianca') as (v: string) => void}
                      erro={erros.nomeCrianca}
                      obrigatorio
                    />
                    <CampoTexto
                      rotulo="Idade da criança"
                      valor={form.idadeCrianca}
                      aoMudar={definir('idadeCrianca') as (v: string) => void}
                      erro={erros.idadeCrianca}
                      inputMode="numeric"
                      placeholder="Ex.: 9"
                      obrigatorio
                    />
                    <CampoSelecao
                      rotulo="Unidade de interesse"
                      valor={form.unidadeInteresse}
                      aoMudar={definir('unidadeInteresse') as (v: string) => void}
                      erro={erros.unidadeInteresse}
                      opcoes={unidadesPublicadas.map((u) => ({
                        valor: u.slug,
                        rotulo: `${u.nome} — ${u.cidade}/${u.estado}`,
                      }))}
                      obrigatorio
                    />
                    <CampoTexto
                      rotulo="Telefone / WhatsApp"
                      tipo="tel"
                      inputMode="tel"
                      valor={form.telefone}
                      aoMudar={(v) => definir('telefone')(mascararTelefone(v))}
                      erro={erros.telefone}
                      autoComplete="tel"
                      placeholder="(21) 99999-9999"
                      obrigatorio
                    />
                    <CampoTexto
                      rotulo="E-mail"
                      tipo="email"
                      inputMode="email"
                      valor={form.email}
                      aoMudar={definir('email') as (v: string) => void}
                      erro={erros.email}
                      autoComplete="email"
                      obrigatorio
                    />
                    <CampoTextoLongo
                      rotulo="Mensagem"
                      valor={form.mensagem}
                      aoMudar={definir('mensagem') as (v: string) => void}
                      ajuda="Opcional — conte se a criança já joga, se tem preferência de horário, qualquer coisa que ajude."
                      linhas={4}
                      className="sm:col-span-2"
                    />
                  </div>

                  <div className="mt-6">
                    <CampoConsentimento
                      marcado={form.consentimento}
                      aoMudar={definir('consentimento') as (v: boolean) => void}
                      erro={erros.consentimento}
                    >
                      Declaro ser o responsável legal pela criança e autorizo a Escola de Futebol
                      Maestro Júnior a tratar os dados informados — incluindo o nome e a idade da
                      criança — exclusivamente para agendar a aula experimental e entrar em
                      contato, conforme a{' '}
                      <Link to="/privacidade" className="font-medium text-[#102F46] underline">
                        Política de Privacidade
                      </Link>
                      .
                    </CampoConsentimento>
                  </div>

                  {erroGeral && (
                    <p
                      role="alert"
                      className="mt-5 border border-[#C72F44] bg-[#C72F44]/[0.05] p-4 text-[0.875rem] text-[#C72F44]"
                    >
                      {erroGeral}
                    </p>
                  )}

                  <div className="mt-7">
                    <Botao
                      type="submit"
                      disabled={enviando}
                      className="w-full sm:w-auto"
                      icone={
                        !enviando ? <Send size={18} strokeWidth={2} aria-hidden="true" /> : undefined
                      }
                    >
                      {enviando ? 'Enviando…' : 'Enviar mensagem'}
                    </Botao>
                  </div>
                </form>
              )}
            </div>

            {/* Canais diretos */}
            <aside className="lg:col-span-5">
              <Revelar>
                <div className="on-navy bg-[#102F46] p-8">
                  <h2 className="font-display text-[1.5rem] uppercase text-white">
                    Prefere falar agora?
                  </h2>
                  <p className="mt-4 leading-relaxed text-[#A8C0D4]">
                    O WhatsApp é o caminho mais rápido — normalmente respondemos no mesmo dia.
                  </p>

                  <div className="mt-7">
                    <BotaoExterno
                      href={linkWhatsApp(MSG_AULA_EXPERIMENTAL)}
                      className="w-full"
                      icone={<MessageCircle size={19} strokeWidth={1.75} aria-hidden="true" />}
                    >
                      Chamar no WhatsApp
                    </BotaoExterno>
                  </div>

                  <ul className="mt-8 space-y-4 border-t border-white/15 pt-7">
                    <li>
                      <a
                        href={`tel:+${contato.telefoneDigits}`}
                        className="flex items-center gap-3 text-white transition-colors hover:text-[#E53E55]"
                      >
                        <Phone size={18} strokeWidth={1.5} aria-hidden="true" />
                        <span className="tabular">{contato.telefone}</span>
                      </a>
                    </li>
                    <li>
                      <a
                        href={`mailto:${contato.email}`}
                        className="flex items-start gap-3 break-all text-white transition-colors hover:text-[#E53E55]"
                      >
                        <Mail
                          size={18}
                          strokeWidth={1.5}
                          className="mt-1 shrink-0"
                          aria-hidden="true"
                        />
                        {contato.email}
                      </a>
                    </li>
                    <li>
                      <a
                        href={contato.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-white transition-colors hover:text-[#E53E55]"
                      >
                        <Instagram size={18} strokeWidth={1.5} aria-hidden="true" />
                        {contato.instagramHandle}
                      </a>
                    </li>
                  </ul>
                </div>
              </Revelar>

              <Revelar atraso={0.08}>
                <div className="mt-6 border border-[#DDE3E9] p-7">
                  <h2 className="font-display text-[1.25rem] uppercase text-[#102F46]">
                    Nossas unidades
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {unidadesPublicadas.map((u) => (
                      <li key={u.slug} className="border-b border-[#DDE3E9] pb-4 last:border-0 last:pb-0">
                        <Link
                          to={`/unidades/${u.slug}`}
                          className="font-display text-[1.125rem] uppercase text-[#102F46] transition-colors hover:text-[#E53E55]"
                        >
                          {u.nome}
                        </Link>
                        <p className="mt-1 text-[0.875rem] leading-snug text-[#5F6B76]">
                          {u.endereco}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Revelar>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
