import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { linkWhatsApp, MSG_AULA_EXPERIMENTAL } from '@/lib/whatsapp';
import { EASE_REVEAL } from '@/lib/motion';

/**
 * Botão flutuante de WhatsApp.
 *
 * Aparece só depois que a pessoa rola — no primeiro viewport o hero já tem
 * dois CTAs e um terceiro botão flutuante seria ruído.
 *
 * Fica acima da safe-area do iOS para não brigar com a barra de gestos.
 */
export function WhatsAppFlutuante() {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const aoRolar = () => setVisivel(window.scrollY > 600);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  return (
    <AnimatePresence>
      {visivel && (
        <motion.a
          href={linkWhatsApp(MSG_AULA_EXPERIMENTAL)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a escola no WhatsApp"
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.3, ease: EASE_REVEAL }}
          className="group fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_-4px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:scale-105 md:right-7 md:h-16 md:w-16"
          style={{ bottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          {/* Glifo oficial do WhatsApp — desenhado, não emoji. */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 md:h-8 md:w-8"
            aria-hidden="true"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.465 3.488" />
          </svg>

          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap bg-[#102F46] px-3.5 py-2 text-[0.8125rem] font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:block">
            Fale com a gente
          </span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
