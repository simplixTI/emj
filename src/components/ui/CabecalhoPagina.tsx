import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { LinhasCampo } from './LinhasCampo';
import { EASE_REVEAL } from '@/lib/motion';
import type { Imagem } from '@/data/imagens';

interface Props {
  titulo: ReactNode;
  descricao?: string;
  imagem?: Imagem;
  children?: ReactNode;
  /** Mais alto para a página do Camp, que precisa de atmosfera de evento. */
  alto?: boolean;
}

/**
 * Cabeçalho das páginas internas.
 *
 * Usa a mesma máscara do hero da Home, mas uma só linha e mais rápida — é
 * continuidade de linguagem, não uma repetição do momento autoral.
 */
export function CabecalhoPagina({ titulo, descricao, imagem, children, alto = false }: Props) {
  const semMovimento = useReducedMotion();

  return (
    <header
      className={`on-navy relative flex items-end overflow-hidden bg-[#102F46] ${
        alto ? 'min-h-[78svh]' : 'min-h-[52svh] md:min-h-[58svh]'
      }`}
    >
      {imagem && (
        <>
          <motion.picture
            initial={semMovimento ? false : { scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: EASE_REVEAL }}
            className="absolute inset-0 block h-full w-full"
          >
            {imagem.webp && <source srcSet={imagem.webp} type="image/webp" />}
            <img
              src={imagem.src}
              alt=""
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
              style={{ objectPosition: imagem.focus ?? '50% 45%' }}
              data-imagem={imagem.key}
              data-provisoria={imagem.provisoria || undefined}
            />
          </motion.picture>
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#0A1F2F] via-[#102F46]/82 to-[#102F46]/45"
            aria-hidden="true"
          />
        </>
      )}

      {/* Véu só no topo: protege a legibilidade do menu sobre céu claro,
          sem escurecer o meio da fotografia. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A1F2F]/75 to-transparent md:h-36"
        aria-hidden="true"
      />

      <LinhasCampo cor="#FFFFFF" opacidade={0.1} />

      <div className="shell relative z-10 pb-14 pt-32 md:pb-20 md:pt-40">
        <h1 className={`${alto ? 'display-xl' : 'display-lg'} font-display text-white`}>
          {/* O padding compensa o line-height de cartaz: sem ele, a máscara
              corta as descendentes e os acentos do título. */}
          <span className="block overflow-hidden pb-[0.14em]">
            <motion.span
              className="block"
              initial={semMovimento ? false : { y: '110%' }}
              animate={{ y: '0%' }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE_REVEAL }}
            >
              {titulo}
            </motion.span>
          </span>
        </h1>

        {descricao && (
          <motion.p
            initial={semMovimento ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease: EASE_REVEAL }}
            className="measure mt-6 text-lg leading-relaxed text-[#C4D6E4]"
          >
            {descricao}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={semMovimento ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.54, ease: EASE_REVEAL }}
            className="mt-9"
          >
            {children}
          </motion.div>
        )}
      </div>
    </header>
  );
}
