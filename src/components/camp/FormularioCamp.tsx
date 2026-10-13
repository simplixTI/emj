import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Send } from 'lucide-react';
import {
  CampoArmadilha,
  CampoConsentimento,
  CampoTexto,
  CampoTextoLongo,
} from '@/components/ui/Campo';
import { Botao } from '@/components/ui/Botao';
import {
  ehSpam,
  enviarLeadCamp,
  mascararTelefone,
  validarEmail,
  validarIdade,
  validarTelefone,
} from '@/lib/leads';

type Erros = Partial<Record<string, string>>;

/**
 * Lista de interesse do Camp.
 *
 * Curto de propósito: a pessoa não está comprando, está pedindo para ser
 * avisada. Quanto menos campos, mais gente entra na lista.
 */
export function FormularioCamp() {
  const [abertoEm] = useState(() => Date.now());
  const [armadilha, setArmadilha] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erroGeral, setErroGeral] = useState('');
  const [erros, setErros] = useState<Erros>({});

  const [form, setForm] = useState({
    nomeResponsavel: '',
    nomeCrianca: '',
    idadeCrianca: '',
    telefone: '',
    email: '',
    mensagem: '',
    consentimento: false,
  });

  const definir = (campo: keyof typeof form) => (v: string | boolean) => {
    setForm((f) => ({ ...f, [campo]: v }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  };

  function validar(): boolean {
    const e: Erros = {};
    if (!form.nomeResponsavel.trim()) e.nomeResponsavel = 'Informe seu nome.';
    if (!form.nomeCrianca.trim()) e.nomeCrianca = 'Informe o nome da criança.';
    if (!validarIdade(form.idadeCrianca)) e.idadeCrianca = 'Informe a idade entre 3 e 18 anos.';
    if (!validarTelefone(form.telefone)) e.telefone = 'Informe um telefone com DDD.';
    if (!validarEmail(form.email)) e.email = 'Informe um e-mail válido.';
    if (!form.consentimento) e.consentimento = 'É necessário aceitar para enviar.';
    setErros(e);
    return Object.keys(e).length === 0;
  }

  async function enviar(evento: React.FormEvent) {
    evento.preventDefault();
    setErroGeral('');
    if (!validar()) return;
    if (ehSpam(armadilha, abertoEm)) {
      setErroGeral('Não foi possível enviar. Recarregue a página e tente novamente.');
      return;
    }

    setEnviando(true);
    const r = await enviarLeadCamp(form);
    setEnviando(false);

    if (r.ok) setEnviado(true);
    else setErroGeral(r.erro);
  }

  if (enviado) {
    return (
      <div
        className="border border-[#DDE3E9] bg-white p-8 text-center md:p-12"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2
          size={44}
          strokeWidth={1.5}
          className="mx-auto text-[#E53E55]"
          aria-hidden="true"
        />
        <h3 className="display-sm mt-5 font-display text-[#102F46]">Você está na lista</h3>
        <p className="measure mx-auto mt-4 leading-relaxed text-[#5F6B76]">
          Assim que a próxima edição do Camp for confirmada, você será avisado antes da divulgação
          geral — com datas, valores e condições de inscrição.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="border border-[#DDE3E9] bg-white p-6 md:p-10">
      <h3 className="display-sm font-display text-[#102F46]">
        Quero saber da próxima edição
      </h3>
      <p className="measure mt-3 leading-relaxed text-[#5F6B76]">
        Deixe seus dados e avisamos assim que as datas e as inscrições forem confirmadas.
      </p>

      <CampoArmadilha valor={armadilha} aoMudar={setArmadilha} />

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <CampoTexto
          rotulo="Seu nome"
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
        <CampoTexto
          rotulo="WhatsApp"
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
          className="sm:col-span-2"
          obrigatorio
        />
        <CampoTextoLongo
          rotulo="Alguma dúvida?"
          valor={form.mensagem}
          aoMudar={definir('mensagem') as (v: string) => void}
          linhas={3}
          className="sm:col-span-2"
        />
      </div>

      <div className="mt-6">
        <CampoConsentimento
          marcado={form.consentimento}
          aoMudar={definir('consentimento') as (v: boolean) => void}
          erro={erros.consentimento}
        >
          Autorizo a Escola de Futebol Maestro Júnior a tratar os dados acima — inclusive o nome e a
          idade da criança — para entrar em contato sobre o Camp, conforme a{' '}
          <Link to="/privacidade" className="font-medium text-[#102F46] underline">
            Política de Privacidade
          </Link>
          . Declaro ser o responsável legal pela criança.
        </CampoConsentimento>
      </div>

      {erroGeral && (
        <p role="alert" className="mt-5 border border-[#C72F44] bg-[#C72F44]/[0.05] p-4 text-[0.875rem] text-[#C72F44]">
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
          {enviando ? 'Enviando…' : 'Entrar na lista de interesse'}
        </Botao>
      </div>
    </form>
  );
}
