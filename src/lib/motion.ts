import type { Transition, Variants } from 'framer-motion';

/**
 * A GRAMÁTICA ÚNICA DE REVELAÇÃO.
 *
 * O site inteiro usa um só movimento de entrada: sobe 16px e desmascara.
 * Seções não inventam entradas próprias — isso é o que separa "um movimento
 * autoral" de "efeitos espalhados".
 *
 * O único momento que foge disso é o hero da Home (o apito inicial), em
 * components/home/Hero.tsx. É deliberado e acontece uma vez só.
 */
export const EASE_REVEAL = [0.16, 1, 0.3, 1] as const;

export const transicaoRevelacao: Transition = {
  duration: 0.52,
  ease: EASE_REVEAL,
};

/** Entrada padrão de qualquer bloco. */
export const revelar: Variants = {
  oculto: { opacity: 0, y: 16 },
  visivel: { opacity: 1, y: 0, transition: transicaoRevelacao },
};

/** Container que escalona os filhos. Use com `revelar` nos itens. */
export const escalonar = (atraso = 0.07): Variants => ({
  oculto: {},
  visivel: { transition: { staggerChildren: atraso, delayChildren: 0.05 } },
});

/** Revelação com máscara — o texto sobe de trás de uma borda limpa. */
export const revelarMascara: Variants = {
  oculto: { y: '110%' },
  visivel: {
    y: '0%',
    transition: { duration: 0.8, ease: EASE_REVEAL },
  },
};

/**
 * Props de viewport usadas em todo o site. `once` evita que o conteúdo
 * re-anime ao rolar para cima — repetição vira ruído.
 */
export const aoEntrar = {
  initial: 'oculto',
  whileInView: 'visivel',
  viewport: { once: true, margin: '-80px' },
} as const;

/** Quebra um título em linhas para a animação de máscara. */
export function emLinhas(texto: string): string[] {
  return texto.split('\n').map((l) => l.trim()).filter(Boolean);
}
