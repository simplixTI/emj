import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { EASE_REVEAL } from '@/lib/motion';

const CHAVE_SESSAO = 'emj:abertura-vista';

/**
 * ABERTURA DE MARCA — o apito antes do apito.
 *
 * Sequência, em 2,1s:
 *   1. a logo entra do centro, com leve escala e desfoque que resolve
 *   2. um traço vermelho corre sob ela, da esquerda para a direita
 *   3. o nome da escola sobe de trás de uma máscara
 *   4. a cortina navy sobe e entrega o hero já em movimento
 *
 * Roda UMA VEZ por sessão: quem volta à home não espera de novo. E não roda
 * nunca com prefers-reduced-motion — nesse caso o hero aparece direto.
 *
 * Enquanto está no ar, o scroll do corpo fica travado para a cortina não
 * revelar meia página.
 */
export function AberturaMarca() {
  const semMovimento = useReducedMotion();

  const [ativa, setAtiva] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(CHAVE_SESSAO) !== '1';
    } catch {
      // Navegação privada / cookies bloqueados: mostra uma vez e segue.
      return true;
    }
  });

  useEffect(() => {
    if (!ativa) return;

    if (semMovimento) {
      setAtiva(false);
      return;
    }

    document.body.style.overflow = 'hidden';
    const fim = window.setTimeout(() => setAtiva(false), 2100);

    // Pular a abertura com Esc, clique ou qualquer tecla.
    const pular = () => setAtiva(false);
    window.addEventListener('keydown', pular);
    window.addEventListener('pointerdown', pular);

    return () => {
      window.clearTimeout(fim);
      window.removeEventListener('keydown', pular);
      window.removeEventListener('pointerdown', pular);
      document.body.style.overflow = '';
    };
  }, [ativa, semMovimento]);

  useEffect(() => {
    if (ativa) return;
    document.body.style.overflow = '';
    try {
      sessionStorage.setItem(CHAVE_SESSAO, '1');
    } catch {
      /* sem sessionStorage, a abertura repete — aceitável */
    }
  }, [ativa]);

  if (semMovimento) return null;

  return (
    <AnimatePresence>
      {ativa && (
        <motion.div
          key="abertura"
          className="fixed inset-0 z-[90] flex items-center justify-center overflow-hidden bg-[#102F46]"
          // A cortina sai para cima com clip-path: o hero já está lá embaixo,
          // então a saída revela em vez de "trocar de tela".
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.85, ease: EASE_REVEAL }}
          aria-hidden="true"
        >
          {/* Círculo central do campo, desenhando-se atrás da logo */}
          <svg
            className="pointer-events-none absolute"
            width="520"
            height="520"
            viewBox="0 0 520 520"
            fill="none"
          >
            <motion.circle
              cx="260"
              cy="260"
              r="180"
              stroke="#FFFFFF"
              strokeWidth="1.25"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.18 }}
              transition={{ duration: 1.5, ease: EASE_REVEAL }}
            />
          </svg>

          <div className="relative flex flex-col items-center px-6">
            <motion.img
              src="/logo.png"
              alt=""
              width={150}
              height={150}
              className="h-[104px] w-[104px] object-contain md:h-[150px] md:w-[150px]"
              initial={{ opacity: 0, scale: 0.86, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.85, ease: EASE_REVEAL }}
            />

            {/* O traço vermelho da marca, correndo sob a logo */}
            <motion.span
              className="mt-7 block h-[3px] bg-[#E53E55]"
              initial={{ width: 0 }}
              animate={{ width: 132 }}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE_REVEAL }}
            />

            <span className="mt-7 block overflow-hidden">
              <motion.span
                className="block text-center font-display text-[1.125rem] uppercase leading-[1.1] tracking-[0.18em] text-white md:text-[1.375rem]"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.7, delay: 0.72, ease: EASE_REVEAL }}
              >
                Escola de Futebol
                <br />
                <span className="text-[#A8C0D4]">Maestro Júnior</span>
              </motion.span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
