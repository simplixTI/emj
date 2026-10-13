import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Mountain, Medal, CalendarDays } from 'lucide-react';
import { Revelar, GrupoRevelar, ItemRevelar } from '@/components/ui/Revelar';
import { FiguraFundo } from '@/components/ui/Figura';
import { BotaoLink } from '@/components/ui/Botao';
import { ArcoCampo } from '@/components/ui/LinhasCampo';
import { imagens } from '@/data/imagens';
import { camp } from '@/data/conteudo';

const DESTAQUES = [
  {
    icone: Mountain,
    titulo: 'Le Canton, Teresópolis',
    texto: 'Três dias na Região Serrana do Rio, com toda a estrutura do resort à disposição.',
  },
  {
    icone: CalendarDays,
    titulo: 'Duas edições por ano',
    texto: 'Historicamente no feriado da Páscoa e no período do Dia das Crianças.',
  },
  {
    icone: Medal,
    titulo: 'Medalha e certificado',
    texto: 'Todo participante recebe medalha e certificado ao final da imersão.',
  },
];

/**
 * O bloco de maior peso visual da Home.
 *
 * O Camp é o produto mais memorável da escola e precisa parar a rolagem. A
 * fotografia ocupa a largura toda, o título vai à escala máxima, e o parallax
 * é o mais forte do site — mas ainda dentro da mesma gramática.
 */
export function CampDestaque() {
  const ref = useRef<HTMLElement>(null);
  const semMovimento = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
  const escala = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <section ref={ref} className="on-navy relative overflow-hidden bg-[#0A1F2F]">
      <motion.div
        className="absolute inset-0"
        style={semMovimento ? undefined : { y, scale: escala }}
      >
        <FiguraFundo imagem={imagens.campHero} className="block h-full w-full" />
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-br from-[#0A1F2F]/95 via-[#102F46]/88 to-[#102F46]/70"
        aria-hidden="true"
      />
      <ArcoCampo className="-bottom-24 left-1/2 w-[760px] -translate-x-1/2" opacidade={0.1} />

      <div className="shell relative z-10 py-24 md:py-32 lg:py-40">
        <Revelar>
          <h2 className="display-lg max-w-[16ch] font-display text-white">
            Uma experiência inesquecível dentro e fora de campo.
          </h2>
        </Revelar>

        <Revelar atraso={0.1}>
          <p className="measure mt-8 text-lg leading-relaxed text-[#C4D6E4]">
            Duas vezes por ano, o <strong className="font-semibold text-white">Camp Maestro
            Júnior</strong> leva crianças e adolescentes para três dias de imersão no{' '}
            {camp.parceiroDescricao}, em {camp.cidade}. Treinos comandados pelo próprio Maestro
            Júnior, convivência fora da rotina e a tradicional partida entre pais e filhos no
            encerramento.
          </p>
        </Revelar>

        <GrupoRevelar className="mt-14 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-3 sm:gap-10">
          {DESTAQUES.map(({ icone: Icone, titulo, texto }, i) => (
            <ItemRevelar key={titulo} indice={i}>
              <Icone size={26} strokeWidth={1.5} className="text-[#E53E55]" aria-hidden="true" />
              <h3 className="mt-4 font-display text-[1.25rem] uppercase leading-tight text-white">
                {titulo}
              </h3>
              <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-[#A8C0D4]">{texto}</p>
            </ItemRevelar>
          ))}
        </GrupoRevelar>

        <Revelar atraso={0.14}>
          <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <BotaoLink
              to="/camp"
              icone={<ArrowRight size={19} strokeWidth={2} aria-hidden="true" />}
            >
              Conheça o Camp
            </BotaoLink>
            <BotaoLink to="/camp#interesse" variante="secundario">
              Tenho interesse na próxima edição
            </BotaoLink>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
