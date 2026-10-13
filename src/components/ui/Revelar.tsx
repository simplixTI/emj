import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { EASE_REVEAL } from '@/lib/motion';
import { useRevelarNaTela } from '@/hooks/useRevelarNaTela';

interface Props {
  children: ReactNode;
  className?: string;
  /** Atraso em segundos. Para listas, prefira <GrupoRevelar>. */
  atraso?: number;
  as?: 'div' | 'section' | 'li' | 'article' | 'header' | 'ul';
}

const TRANSICAO = { duration: 0.52, ease: EASE_REVEAL };

/**
 * A entrada padrão de qualquer bloco do site: sobe 16px e aparece.
 *
 * Usa <useRevelarNaTela>, que garante que o conteúdo SEMPRE termina visível —
 * mesmo se o IntersectionObserver não disparar. Ver o comentário do hook.
 */
export function Revelar({ children, className = '', atraso = 0, as = 'div' }: Props) {
  const Componente = motion[as];
  const semMovimento = useReducedMotion();
  const { ref, visivel } = useRevelarNaTela<HTMLDivElement>();

  if (semMovimento) {
    const Simples = as;
    return (
      <Simples ref={ref as never} className={className}>
        {children}
      </Simples>
    );
  }

  return (
    <Componente
      ref={ref as never}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={visivel ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ ...TRANSICAO, delay: atraso }}
    >
      {children}
    </Componente>
  );
}

/** Índice do filho dentro do grupo, para escalonar a entrada. */
const ContextoGrupo = createContext<{ visivel: boolean; intervalo: number } | null>(null);

/**
 * Container que escalona a entrada dos <ItemRevelar> filhos.
 * O escalonamento é calculado por índice, não por variantes do Framer: assim
 * cada item carrega o próprio atraso e nenhum depende da propagação do pai.
 */
export function GrupoRevelar({
  children,
  className = '',
  intervalo = 0.07,
  as = 'div',
}: Props & { intervalo?: number }) {
  const Componente = as;
  const { ref, visivel } = useRevelarNaTela<HTMLDivElement>();

  return (
    <ContextoGrupo.Provider value={{ visivel, intervalo }}>
      <Componente ref={ref as never} className={className}>
        {children}
      </Componente>
    </ContextoGrupo.Provider>
  );
}

export function ItemRevelar({
  children,
  className = '',
  as = 'div',
  indice = 0,
}: Omit<Props, 'atraso'> & { indice?: number }) {
  const grupo = useContext(ContextoGrupo);
  const semMovimento = useReducedMotion();
  const Componente = motion[as];

  // Fora de um grupo, o item se revela sozinho.
  const solo = useRevelarNaTela<HTMLDivElement>();
  const visivel = grupo ? grupo.visivel : solo.visivel;
  const atraso = grupo ? indice * grupo.intervalo : 0;

  if (semMovimento) {
    const Simples = as;
    return (
      <Simples ref={grupo ? undefined : (solo.ref as never)} className={className}>
        {children}
      </Simples>
    );
  }

  return (
    <Componente
      ref={grupo ? undefined : (solo.ref as never)}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={visivel ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ ...TRANSICAO, delay: atraso }}
    >
      {children}
    </Componente>
  );
}
