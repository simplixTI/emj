import { useState } from 'react';

export const CHAVE_ABERTURA = 'emj:abertura-vista';

/**
 * Diz se a abertura de marca vai rodar nesta renderização.
 *
 * O Hero usa isto para atrasar a própria entrada: assim o título sobe
 * ENQUANTO a cortina sobe, em vez de terminar escondido atrás dela.
 *
 * A leitura acontece no primeiro render, antes de <AberturaMarca> gravar a
 * chave — por isso os dois componentes concordam sem precisar de contexto.
 */
export function useAbertura(): { vaiRodar: boolean; atraso: number } {
  const [vaiRodar] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(CHAVE_ABERTURA) !== '1';
    } catch {
      return true;
    }
  });

  // A cortina começa a subir em 2,1s e leva 0,85s. Entrar em 1,75s coloca o
  // título em movimento no momento em que ele começa a aparecer.
  return { vaiRodar, atraso: vaiRodar ? 1.75 : 0 };
}
