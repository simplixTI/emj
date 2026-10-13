import { useId } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface Base {
  rotulo: string;
  valor: string;
  aoMudar: (v: string) => void;
  erro?: string;
  ajuda?: string;
  obrigatorio?: boolean;
  autoComplete?: string;
  placeholder?: string;
  className?: string;
}

/**
 * Campo de formulário.
 *
 * Rótulo sempre visível (nunca só placeholder — some assim que a pessoa digita
 * e quem usa leitor de tela fica sem referência). O erro aparece colado no
 * campo, nomeia o problema e diz como resolver.
 */
function Moldura({
  id,
  rotulo,
  erro,
  ajuda,
  obrigatorio,
  children,
  className = '',
}: {
  id: string;
  rotulo: string;
  erro?: string;
  ajuda?: string;
  obrigatorio?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block font-display text-[0.875rem] uppercase tracking-[0.08em] text-[#102F46]"
      >
        {rotulo}
        {obrigatorio && (
          <span className="ml-1 text-[#E53E55]" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {ajuda && (
        <p id={`${id}-ajuda`} className="mt-1.5 text-[0.8125rem] text-[#5F6B76]">
          {ajuda}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {erro && (
        <p
          id={`${id}-erro`}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-[0.8125rem] font-medium text-[#C72F44]"
        >
          <AlertCircle size={15} strokeWidth={2} aria-hidden="true" />
          {erro}
        </p>
      )}
    </div>
  );
}

const ENTRADA =
  'w-full border bg-white px-4 py-3.5 text-[1rem] text-[#102F46] placeholder:text-[#9AA7B2] ' +
  'transition-colors duration-150 min-h-[52px] ' +
  'focus:border-[#102F46] focus:outline-none';

function borda(erro?: string) {
  return erro ? 'border-[#C72F44]' : 'border-[#DDE3E9]';
}

export function CampoTexto({
  rotulo,
  valor,
  aoMudar,
  erro,
  ajuda,
  obrigatorio,
  autoComplete,
  placeholder,
  tipo = 'text',
  inputMode,
  className,
}: Base & {
  tipo?: 'text' | 'email' | 'tel';
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
}) {
  const id = useId();
  return (
    <Moldura
      id={id}
      rotulo={rotulo}
      erro={erro}
      ajuda={ajuda}
      obrigatorio={obrigatorio}
      className={className}
    >
      <input
        id={id}
        type={tipo}
        inputMode={inputMode}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={obrigatorio}
        aria-invalid={erro ? true : undefined}
        aria-describedby={
          [ajuda && `${id}-ajuda`, erro && `${id}-erro`].filter(Boolean).join(' ') || undefined
        }
        className={`${ENTRADA} ${borda(erro)}`}
      />
    </Moldura>
  );
}

export function CampoSelecao({
  rotulo,
  valor,
  aoMudar,
  erro,
  ajuda,
  obrigatorio,
  opcoes,
  className,
}: Base & { opcoes: { valor: string; rotulo: string }[] }) {
  const id = useId();
  return (
    <Moldura
      id={id}
      rotulo={rotulo}
      erro={erro}
      ajuda={ajuda}
      obrigatorio={obrigatorio}
      className={className}
    >
      <select
        id={id}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        required={obrigatorio}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${ENTRADA} ${borda(erro)} cursor-pointer appearance-none bg-[length:18px] bg-[right_1rem_center] bg-no-repeat pr-11`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23102F46' stroke-width='1.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="">Selecione…</option>
        {opcoes.map((o) => (
          <option key={o.valor} value={o.valor}>
            {o.rotulo}
          </option>
        ))}
      </select>
    </Moldura>
  );
}

export function CampoTextoLongo({
  rotulo,
  valor,
  aoMudar,
  erro,
  ajuda,
  obrigatorio,
  placeholder,
  linhas = 4,
  className,
}: Base & { linhas?: number }) {
  const id = useId();
  return (
    <Moldura
      id={id}
      rotulo={rotulo}
      erro={erro}
      ajuda={ajuda}
      obrigatorio={obrigatorio}
      className={className}
    >
      <textarea
        id={id}
        rows={linhas}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
        required={obrigatorio}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        className={`${ENTRADA} ${borda(erro)} resize-y leading-relaxed`}
      />
    </Moldura>
  );
}

/**
 * Consentimento LGPD. Dados de criança exigem consentimento específico e
 * destacado — não pode ser uma linha escondida no rodapé do formulário.
 */
export function CampoConsentimento({
  marcado,
  aoMudar,
  erro,
  children,
}: {
  marcado: boolean;
  aoMudar: (v: boolean) => void;
  erro?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div>
      <div
        className={`flex gap-3 border p-4 transition-colors ${
          erro ? 'border-[#C72F44] bg-[#C72F44]/[0.04]' : 'border-[#DDE3E9] bg-[#F3F5F7]'
        }`}
      >
        <input
          id={id}
          type="checkbox"
          checked={marcado}
          onChange={(e) => aoMudar(e.target.checked)}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-erro` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#E53E55]"
        />
        <label htmlFor={id} className="cursor-pointer text-[0.875rem] leading-relaxed text-[#5F6B76]">
          {children}
        </label>
      </div>
      {erro && (
        <p
          id={`${id}-erro`}
          role="alert"
          className="mt-2 flex items-center gap-1.5 text-[0.8125rem] font-medium text-[#C72F44]"
        >
          <AlertCircle size={15} strokeWidth={2} aria-hidden="true" />
          {erro}
        </p>
      )}
    </div>
  );
}

/** Honeypot: invisível para humanos, irresistível para bots. */
export function CampoArmadilha({
  valor,
  aoMudar,
}: {
  valor: string;
  aoMudar: (v: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor="site-url-confirm">Não preencha este campo</label>
      <input
        id="site-url-confirm"
        name="site-url-confirm"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
      />
    </div>
  );
}
