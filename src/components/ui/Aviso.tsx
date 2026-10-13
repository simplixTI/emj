import type { ReactNode } from 'react';
import { Info } from 'lucide-react';
import type { Procedencia } from '@/types';

/**
 * Marca visível de conteúdo que ainda precisa de validação da escola.
 *
 * Existe para que ninguém — nem a escola, nem um visitante — confunda texto
 * editorial provisório com fato confirmado. É discreto, mas honesto.
 * Some sozinho quando a procedência vira 'verificado'.
 */
export function Aviso({
  procedencia,
  children,
  tema = 'claro',
}: {
  procedencia: Procedencia;
  children: ReactNode;
  tema?: 'claro' | 'navy';
}) {
  if (procedencia === 'verificado') return null;

  const estilos =
    tema === 'navy'
      ? 'border-white/15 bg-white/[0.05] text-[#A8C0D4]'
      : 'border-[#DDE3E9] bg-[#F3F5F7] text-[#5F6B76]';

  return (
    <p
      className={`flex items-start gap-2.5 border px-4 py-3 text-[0.8125rem] leading-relaxed ${estilos}`}
      role="note"
    >
      <Info className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
