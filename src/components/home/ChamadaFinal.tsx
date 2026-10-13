import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { Revelar } from '@/components/ui/Revelar';
import { FiguraFundo } from '@/components/ui/Figura';
import { BotaoLink, BotaoExterno } from '@/components/ui/Botao';
import { LinhasCampo } from '@/components/ui/LinhasCampo';
import { imagens } from '@/data/imagens';
import { linkWhatsApp, MSG_AULA_EXPERIMENTAL } from '@/lib/whatsapp';

/**
 * O fechamento. A última coisa que o pai lê antes de decidir.
 *
 * Volta ao navy do hero — a página abre e fecha no mesmo tom, e o miolo claro
 * fica entre eles. Isso dá à Home um começo e um fim, em vez de uma esteira
 * de seções.
 */
export function ChamadaFinal() {
  const ref = useRef<HTMLElement>(null);
  const semMovimento = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);

  return (
    <section ref={ref} className="on-navy relative overflow-hidden bg-[#102F46]">
      <motion.div className="absolute inset-0" style={semMovimento ? undefined : { y }}>
        <FiguraFundo imagem={imagens.ctaFinal} className="block h-full w-full" />
      </motion.div>

      <div className="absolute inset-0 bg-[#102F46]/90" aria-hidden="true" />
      <LinhasCampo cor="#FFFFFF" opacidade={0.09} />

      <div className="shell relative z-10 py-24 text-center md:py-32 lg:py-40">
        <Revelar>
          <h2 className="display-lg mx-auto max-w-[18ch] font-display text-white">
            Seu filho pode começar uma{' '}
            <span className="stroke-red">grande história</span> aqui.
          </h2>
        </Revelar>

        <Revelar atraso={0.08}>
          <p className="mx-auto mt-7 max-w-[52ch] text-lg leading-relaxed text-[#C4D6E4]">
            A primeira aula é para ele conhecer o campo, os professores e a turma. Sem compromisso.
          </p>
        </Revelar>

        <Revelar atraso={0.14}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <BotaoLink
              to="/contato"
              icone={<ArrowRight size={19} strokeWidth={2} aria-hidden="true" />}
            >
              Agende uma aula experimental
            </BotaoLink>
            <BotaoExterno
              href={linkWhatsApp(MSG_AULA_EXPERIMENTAL)}
              variante="secundario"
              icone={<MessageCircle size={19} strokeWidth={1.75} aria-hidden="true" />}
            >
              Falar no WhatsApp
            </BotaoExterno>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
