import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { BotaoLink } from '@/components/ui/Botao';
import { LinhasCampo } from '@/components/ui/LinhasCampo';
import { imagens } from '@/data/imagens';
import { EASE_REVEAL } from '@/lib/motion';
import { useAbertura } from '@/hooks/useAbertura';

/**
 * O APITO INICIAL — o momento autoral do site.
 *
 * Encadeado com a abertura de marca: quando a cortina da logo começa a subir,
 * o hero já está em movimento por baixo. O visitante nunca vê uma tela parada.
 *
 * Três coisas acontecem juntas:
 *   1. a fotografia entra com zoom-out e segue respirando devagar (Ken Burns)
 *   2. as linhas de campo se desenham
 *   3. as linhas do título sobem de trás de uma máscara, uma a uma
 *
 * Nada mais na página compete com isto. Todo o resto usa a revelação padrão.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const semMovimento = useReducedMotion();
  const { atraso } = useAbertura();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const yFoto = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const opacidadeTexto = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <section
      ref={ref}
      id="conteudo"
      className="on-navy relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-[#102F46]"
    >
      {/* Fotografia: entrada com zoom-out e, depois, respiração contínua.
          É o que mantém o hero vivo mesmo com a pessoa parada. */}
      <motion.div
        className="absolute inset-0"
        style={semMovimento ? undefined : { y: yFoto }}
      >
        <motion.picture
          initial={semMovimento ? false : { scale: 1.16 }}
          animate={
            semMovimento
              ? undefined
              : {
                  scale: [1.16, 1.0, 1.06],
                  transition: {
                    times: [0, 0.35, 1],
                    duration: 26,
                    delay: atraso * 0.4,
                    ease: ['easeOut', 'easeInOut'],
                    repeat: Infinity,
                    repeatType: 'reverse',
                  },
                }
          }
          className="block h-full w-full"
        >
          {imagens.heroHome.webp && (
            <source srcSet={imagens.heroHome.webp} type="image/webp" />
          )}
          <img
            src={imagens.heroHome.src}
            alt={imagens.heroHome.alt}
            fetchPriority="high"
            decoding="sync"
            className="h-full w-full object-cover"
            style={{ objectPosition: imagens.heroHome.focus }}
            data-imagem={imagens.heroHome.key}
          />
        </motion.picture>
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0A1F2F] via-[#102F46]/78 to-[#102F46]/35"
        aria-hidden="true"
      />

      {/* Véu só no topo: protege a legibilidade do menu sobre céu claro,
          sem escurecer o meio da fotografia. */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#0A1F2F]/75 to-transparent md:h-36"
        aria-hidden="true"
      />

      <LinhasCampo animar cor="#FFFFFF" opacidade={0.13} />

      <motion.div
        className="shell relative z-10 pb-16 pt-32 md:pb-24"
        style={semMovimento ? undefined : { opacity: opacidadeTexto }}
      >
        <h1 className="display-xl font-display text-white">
          {['Mais que futebol.', 'Formação para a vida.'].map((linha, i) => (
            <span key={linha} className="block overflow-hidden pb-[0.12em]">
              <motion.span
                className="block"
                initial={semMovimento ? false : { y: '110%' }}
                animate={{ y: '0%' }}
                transition={{
                  duration: 0.95,
                  delay: atraso + 0.1 + i * 0.11,
                  ease: EASE_REVEAL,
                }}
              >
                {i === 1 ? (
                  <>
                    <span className="stroke-red">Formação</span> para a vida.
                  </>
                ) : (
                  linha
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={semMovimento ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: atraso + 0.58, ease: EASE_REVEAL }}
          className="measure mt-7 text-lg leading-relaxed text-[#D6E2EC] md:mt-8 md:text-xl"
        >
          Aprendizado, disciplina, amizade e paixão pelo futebol. Venha fazer parte da Escola
          Maestro Júnior.
        </motion.p>

        <motion.div
          initial={semMovimento ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: atraso + 0.7, ease: EASE_REVEAL }}
          className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-11"
        >
          <BotaoLink
            to="/contato"
            icone={<ArrowRight size={19} strokeWidth={2} aria-hidden="true" />}
          >
            Agende uma aula experimental
          </BotaoLink>
          <BotaoLink to="/metodologia" variante="secundario">
            Conheça nossa metodologia
          </BotaoLink>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        initial={semMovimento ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: atraso + 1.1 }}
        style={semMovimento ? undefined : { opacity: opacidadeTexto }}
        className="absolute bottom-7 right-5 z-10 hidden md:right-10 md:block"
      >
        <motion.div
          animate={semMovimento ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-11 w-11 items-center justify-center border border-white/25 text-white/70"
        >
          <ArrowDown size={18} strokeWidth={1.5} />
        </motion.div>
      </motion.div>
    </section>
  );
}
