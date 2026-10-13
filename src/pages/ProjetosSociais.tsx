import { useState } from 'react';
import { CheckCircle2, Instagram, MapPin, Send } from 'lucide-react';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Revelar, GrupoRevelar, ItemRevelar } from '@/components/ui/Revelar';
import { Aviso } from '@/components/ui/Aviso';
import { Botao } from '@/components/ui/Botao';
import {
  CampoArmadilha,
  CampoConsentimento,
  CampoTexto,
  CampoTextoLongo,
} from '@/components/ui/Campo';
import { imagens } from '@/data/imagens';
import { institucional, projetoSocial } from '@/data/conteudo';
import { ehSpam, enviarContatoParceria, mascararTelefone, validarEmail } from '@/lib/leads';
import { useSeo } from '@/lib/seo';

function FormularioParceria() {
  const [abertoEm] = useState(() => Date.now());
  const [armadilha, setArmadilha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroGeral, setErroGeral] = useState('');
  const [erros, setErros] = useState<Record<string, string | undefined>>({});
  const [form, setForm] = useState({
    nome: '',
    organizacao: '',
    email: '',
    telefone: '',
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
    if (!form.nome.trim()) e.nome = 'Informe seu nome.';
    if (!validarEmail(form.email)) e.email = 'Informe um e-mail válido.';
    if (!form.mensagem.trim()) e.mensagem = 'Conte brevemente sua proposta.';
    if (!form.consentimento) e.consentimento = 'É necessário aceitar para enviar.';
    setErros(e);
    if (Object.values(e).some(Boolean)) return;

    if (ehSpam(armadilha, abertoEm)) {
      setErroGeral('Não foi possível enviar. Recarregue a página e tente novamente.');
      return;
    }

    setEnviando(true);
    const r = await enviarContatoParceria(form);
    setEnviando(false);
    if (r.ok) setEnviado(true);
    else setErroGeral(r.erro);
  }

  if (enviado) {
    return (
      <div className="border border-[#DDE3E9] bg-white p-8 text-center md:p-12" role="status">
        <CheckCircle2
          size={44}
          strokeWidth={1.5}
          className="mx-auto text-[#E53E55]"
          aria-hidden="true"
        />
        <h3 className="display-sm mt-5 font-display text-[#102F46]">Mensagem enviada</h3>
        <p className="measure mx-auto mt-4 leading-relaxed text-[#5F6B76]">
          Obrigado pelo interesse. A equipe da escola vai analisar sua proposta e entrar em contato.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="border border-[#DDE3E9] bg-white p-6 md:p-10">
      <h2 className="display-sm font-display text-[#102F46]">Quero apoiar ou ser parceiro</h2>
      <p className="measure mt-3 leading-relaxed text-[#5F6B76]">
        Empresas, instituições e pessoas que queiram apoiar a atuação social da escola podem se
        apresentar por aqui.
      </p>

      <CampoArmadilha valor={armadilha} aoMudar={setArmadilha} />

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <CampoTexto
          rotulo="Seu nome"
          valor={form.nome}
          aoMudar={definir('nome') as (v: string) => void}
          erro={erros.nome}
          autoComplete="name"
          obrigatorio
        />
        <CampoTexto
          rotulo="Empresa ou instituição"
          valor={form.organizacao}
          aoMudar={definir('organizacao') as (v: string) => void}
          autoComplete="organization"
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
        <CampoTexto
          rotulo="Telefone"
          tipo="tel"
          inputMode="tel"
          valor={form.telefone}
          aoMudar={(v) => definir('telefone')(mascararTelefone(v))}
          autoComplete="tel"
          placeholder="(21) 99999-9999"
        />
        <CampoTextoLongo
          rotulo="Como gostaria de contribuir?"
          valor={form.mensagem}
          aoMudar={definir('mensagem') as (v: string) => void}
          erro={erros.mensagem}
          linhas={5}
          className="sm:col-span-2"
          obrigatorio
        />
      </div>

      <div className="mt-6">
        <CampoConsentimento
          marcado={form.consentimento}
          aoMudar={definir('consentimento') as (v: boolean) => void}
          erro={erros.consentimento}
        >
          Autorizo o tratamento dos meus dados para que a escola entre em contato sobre esta
          proposta.
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
          icone={!enviando ? <Send size={18} strokeWidth={2} aria-hidden="true" /> : undefined}
        >
          {enviando ? 'Enviando…' : 'Enviar proposta'}
        </Botao>
      </div>
    </form>
  );
}

export default function ProjetosSociais() {
  useSeo({
    titulo: 'Projetos Sociais — Escola de Futebol Maestro Júnior',
    descricao:
      'A inclusão social de crianças e jovens pelo esporte é o projeto fundador da Escola Maestro Júnior. Conheça a proposta e saiba como apoiar.',
    caminho: '/projetos-sociais',
  });

  return (
    <>
      <CabecalhoPagina
        titulo="Projetos Sociais"
        descricao="Incluir socialmente crianças e jovens através da prática do esporte. É assim que a escola se define desde a fundação."
        imagem={imagens.projetosSociais}
      />

      <section className="bg-white py-20 md:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Revelar>
                <h2 className="display-md font-display text-[#102F46]">
                  O esporte abre portas
                  <br />
                  que a vida fechou
                </h2>
              </Revelar>

              <Revelar atraso={0.08}>
                <blockquote className="measure mt-8 text-xl leading-relaxed text-[#102F46]">
                  {institucional.missao}
                </blockquote>
              </Revelar>

              <Revelar atraso={0.14}>
                <p className="measure mt-7 leading-relaxed text-[#5F6B76]">
                  {projetoSocial.proposito}
                </p>
              </Revelar>

              <Revelar atraso={0.2}>
                <p className="measure mt-5 leading-relaxed text-[#5F6B76]">
                  {projetoSocial.origem}
                </p>
              </Revelar>
            </div>

            <div className="lg:col-span-5">
              <Revelar atraso={0.1}>
                <div className="on-navy bg-[#102F46] p-8 md:p-10">
                  <h2 className="font-display text-[1.5rem] uppercase leading-tight text-white">
                    Quem sustenta o projeto
                  </h2>

                  <dl className="mt-7 space-y-6">
                    <div>
                      <dt className="font-display text-[0.75rem] uppercase tracking-[0.14em] text-[#A8C0D4]">
                        Patrocínio
                      </dt>
                      <dd className="mt-1.5 font-display text-[1.75rem] uppercase leading-none text-white">
                        {projetoSocial.patrocinador}
                      </dd>
                      <dd className="mt-2">
                        <a
                          href={projetoSocial.patrocinadorPerfil}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-[0.875rem] text-[#A8C0D4] transition-colors hover:text-white"
                        >
                          <Instagram size={15} strokeWidth={1.5} aria-hidden="true" />
                          {projetoSocial.patrocinadorHandle}
                        </a>
                      </dd>
                    </div>

                    <div className="border-t border-white/15 pt-6">
                      <dt className="font-display text-[0.75rem] uppercase tracking-[0.14em] text-[#A8C0D4]">
                        Apoio
                      </dt>
                      <dd className="mt-1.5 leading-snug text-white">{projetoSocial.apoio}</dd>
                    </div>

                    <div className="border-t border-white/15 pt-6">
                      <dt className="font-display text-[0.75rem] uppercase tracking-[0.14em] text-[#A8C0D4]">
                        No ar desde
                      </dt>
                      <dd className="tabular mt-1.5 font-display text-[1.75rem] leading-none text-white">
                        {projetoSocial.inicio}
                      </dd>
                    </div>

                    <div className="border-t border-white/15 pt-6">
                      <dt className="font-display text-[0.75rem] uppercase tracking-[0.14em] text-[#A8C0D4]">
                        Acompanhe o projeto
                      </dt>
                      <dd className="mt-2">
                        <a
                          href={projetoSocial.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-white transition-colors hover:text-[#E53E55]"
                        >
                          <Instagram size={17} strokeWidth={1.5} aria-hidden="true" />
                          {projetoSocial.instagramHandle}
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </Revelar>
            </div>
          </div>
        </div>
      </section>

      {/* O que o projeto trabalha */}
      <section className="on-navy bg-[#102F46] py-20 md:py-28">
        <div className="shell">
          <Revelar>
            <h2 className="display-md max-w-[22ch] font-display text-white">
              Antes do fundamento, a formação cidadã
            </h2>
          </Revelar>

          <GrupoRevelar className="mt-12 grid gap-px border-t border-white/15 md:grid-cols-3">
            {projetoSocial.pilares.map((p, i) => (
              <ItemRevelar key={p.titulo} as="article" indice={i}>
                <div className="h-full border-b border-white/15 py-8 md:border-b-0 md:pr-8">
                  <h3 className="font-display text-[1.625rem] uppercase leading-tight text-white">
                    {p.titulo}
                  </h3>
                  <p className="mt-3.5 leading-relaxed text-[#A8C0D4]">{p.texto}</p>
                </div>
              </ItemRevelar>
            ))}
          </GrupoRevelar>
        </div>
      </section>

      {/* Onde o projeto já está */}
      <section className="bg-[#F3F5F7] py-20 md:py-28">
        <div className="shell">
          <Revelar>
            <h2 className="display-md font-display text-[#102F46]">Nas comunidades</h2>
          </Revelar>

          <Revelar atraso={0.08}>
            <p className="measure mt-6 leading-relaxed text-[#5F6B76]">
              O projeto mantém escolas de futebol dentro de comunidades do Rio de Janeiro. Esta é a
              unidade confirmada publicamente até agora.
            </p>
          </Revelar>

          <GrupoRevelar className="mt-10 grid gap-5 md:grid-cols-2">
            {projetoSocial.unidadesComunitarias.map((u, i) => (
              <ItemRevelar key={u.nome} as="article" indice={i}>
                <div className="h-full border border-[#DDE3E9] bg-white p-7">
                  <h3 className="font-display text-[1.75rem] uppercase leading-none text-[#102F46]">
                    {u.nome}
                  </h3>
                  <p className="mt-2 flex items-start gap-2 text-[0.9375rem] text-[#5F6B76]">
                    <MapPin
                      size={16}
                      strokeWidth={1.5}
                      className="mt-0.5 shrink-0 text-[#E53E55]"
                      aria-hidden="true"
                    />
                    {u.bairro} — {u.cidade}/{u.estado}
                  </p>
                  <p className="mt-5 border-t border-[#DDE3E9] pt-5 leading-relaxed text-[#5F6B76]">
                    {u.descricao}
                  </p>
                </div>
              </ItemRevelar>
            ))}
          </GrupoRevelar>

          <Revelar atraso={0.1}>
            <div className="mt-10 max-w-3xl">
              <Aviso procedencia="a_validar">
                Outras comunidades atendidas, número de crianças beneficiadas e resultados do
                projeto não foram publicados aqui porque ainda não há dados confirmados. Eles podem
                ser cadastrados pelo painel administrativo a qualquer momento.
              </Aviso>
            </div>
          </Revelar>
        </div>
      </section>

      <section className="bg-[#F3F5F7] py-20 md:py-28">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <Revelar>
              <FormularioParceria />
            </Revelar>
          </div>
        </div>
      </section>
    </>
  );
}
