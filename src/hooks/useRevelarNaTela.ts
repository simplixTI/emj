import { useEffect, useRef, useState } from 'react';

/**
 * Revelação ao entrar na tela — com rede de segurança.
 *
 * O `whileInView` do Framer é elegante, mas deixa o conteúdo em opacity: 0
 * até o IntersectionObserver disparar. Se o observer não dispara — captura de
 * página inteira, navegador antigo, âncora profunda, restauração de scroll,
 * aba em segundo plano — o bloco fica invisível para sempre. Numa página que
 * vende matrícula, isso é perda de cliente, não detalhe de animação.
 *
 * Aqui a regra é: o conteúdo SEMPRE acaba visível.
 *   - sem IntersectionObserver → visível de imediato;
 *   - com observer → anima ao entrar na tela;
 *   - se nada disparar em 1,6s → revela assim mesmo.
 */
export function useRevelarNaTela<T extends HTMLElement = HTMLDivElement>(margem = '-80px') {
  const ref = useRef<T>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const no = ref.current;

    // Navegador sem suporte: mostra tudo, sem animação.
    if (!no || typeof IntersectionObserver === 'undefined') {
      setVisivel(true);
      return;
    }

    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { rootMargin: margem, threshold: 0 },
    );
    observador.observe(no);

    // Rede de segurança: nada pode ficar invisível para sempre.
    const resgate = window.setTimeout(() => {
      setVisivel(true);
      observador.disconnect();
    }, 1600);

    return () => {
      observador.disconnect();
      window.clearTimeout(resgate);
    };
  }, [margem]);

  return { ref, visivel };
}
