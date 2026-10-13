import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

type Variante = 'primario' | 'secundario' | 'secundarioClaro';

interface Base {
  children: ReactNode;
  variante?: Variante;
  className?: string;
  icone?: ReactNode;
}

const BASE =
  'group relative inline-flex items-center justify-center gap-2.5 px-7 min-h-[56px] ' +
  'font-display text-[1.0625rem] font-600 uppercase tracking-[0.04em] ' +
  'transition-all duration-200 ease-out cursor-pointer select-none ' +
  'disabled:opacity-50 disabled:cursor-not-allowed';

const VARIANTES: Record<Variante, string> = {
  // Vermelho sólido. É a única coisa vermelha grande numa tela.
  primario:
    'bg-[#E53E55] text-white hover:bg-[#C72F44] hover:-translate-y-px ' +
    'shadow-[0_2px_0_0_rgba(0,0,0,0.12)] hover:shadow-[0_4px_12px_-2px_rgba(229,62,85,0.45)] active:translate-y-0',
  // Contorno sobre fundo navy.
  secundario:
    'border-[1.5px] border-white/35 text-white hover:border-white hover:bg-white/[0.07]',
  // Contorno sobre fundo claro.
  secundarioClaro:
    'border-[1.5px] border-[#102F46]/25 text-[#102F46] hover:border-[#102F46] hover:bg-[#102F46]/[0.04]',
};

function conteudo(children: ReactNode, icone?: ReactNode) {
  return (
    <>
      <span className="pt-px">{children}</span>
      {icone && (
        <span className="transition-transform duration-200 ease-out group-hover:translate-x-1">
          {icone}
        </span>
      )}
    </>
  );
}

export function BotaoLink({
  to,
  children,
  variante = 'primario',
  className = '',
  icone,
}: Base & { to: string }) {
  return (
    <Link to={to} className={`${BASE} ${VARIANTES[variante]} ${className}`}>
      {conteudo(children, icone)}
    </Link>
  );
}

export function BotaoExterno({
  href,
  children,
  variante = 'primario',
  className = '',
  icone,
}: Base & { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${BASE} ${VARIANTES[variante]} ${className}`}
    >
      {conteudo(children, icone)}
    </a>
  );
}

export function Botao({
  children,
  variante = 'primario',
  className = '',
  icone,
  type = 'button',
  disabled,
  onClick,
}: Base & {
  type?: 'button' | 'submit';
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${BASE} ${VARIANTES[variante]} ${className}`}
    >
      {conteudo(children, icone)}
    </button>
  );
}
