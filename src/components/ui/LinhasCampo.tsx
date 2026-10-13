import { motion, useReducedMotion } from 'framer-motion';

interface Props {
  /** Desenha as linhas na entrada. Só o hero da Home usa isso. */
  animar?: boolean;
  className?: string;
  /** Cor do traço. Herda a seção. */
  cor?: string;
  opacidade?: number;
}

/**
 * A geometria de marcação de campo — grande área, meia-lua, círculo central.
 *
 * Isto é estrutura, não enfeite: posiciona o olhar e ancora a composição.
 * Fica sempre em `aria-hidden`, atrás do conteúdo, e nunca recebe interação.
 */
export function LinhasCampo({
  animar = false,
  className = '',
  cor = '#FFFFFF',
  opacidade = 0.1,
}: Props) {
  const semMovimento = useReducedMotion();
  const deveAnimar = animar && !semMovimento;

  const traco = {
    stroke: cor,
    strokeWidth: 1.25,
    fill: 'none',
    vectorEffect: 'non-scaling-stroke' as const,
  };

  const desenho = deveAnimar
    ? {
        initial: { pathLength: 0 },
        animate: { pathLength: 1 },
      }
    : {};

  return (
    <svg
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      style={{ opacity: opacidade }}
    >
      {/* linha de fundo */}
      <motion.line
        x1="0"
        y1="860"
        x2="1440"
        y2="860"
        {...traco}
        {...desenho}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* grande área */}
      <motion.path
        d="M 420 860 L 420 650 L 1020 650 L 1020 860"
        {...traco}
        {...desenho}
        transition={{ duration: 1.1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* pequena área */}
      <motion.path
        d="M 600 860 L 600 772 L 840 772 L 840 860"
        {...traco}
        {...desenho}
        transition={{ duration: 0.9, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* meia-lua */}
      <motion.path
        d="M 636 650 A 110 110 0 0 0 804 650"
        {...traco}
        {...desenho}
        transition={{ duration: 0.8, delay: 0.34, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* marca do pênalti */}
      <motion.circle
        cx="720"
        cy="716"
        r="3.5"
        fill={cor}
        stroke="none"
        initial={deveAnimar ? { opacity: 0, scale: 0 } : undefined}
        animate={deveAnimar ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.4, delay: 0.5 }}
      />
      {/* círculo central, cortado pela borda superior */}
      <motion.circle
        cx="720"
        cy="60"
        r="190"
        {...traco}
        {...desenho}
        transition={{ duration: 1.2, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}

/**
 * Variante enxuta: só o arco da meia-lua, usado como marca de seção
 * onde a composição completa seria ruído.
 */
export function ArcoCampo({ cor = '#FFFFFF', opacidade = 0.12, className = '' }: Omit<Props, 'animar'>) {
  return (
    <svg
      className={`pointer-events-none absolute ${className}`}
      viewBox="0 0 400 200"
      aria-hidden="true"
      focusable="false"
      style={{ opacity: opacidade }}
    >
      <path
        d="M 0 200 A 200 200 0 0 1 400 200"
        stroke={cor}
        strokeWidth="1.25"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
      <path
        d="M 60 200 A 140 140 0 0 1 340 200"
        stroke={cor}
        strokeWidth="1.25"
        fill="none"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
