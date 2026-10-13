import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, Heart, Target, Users } from 'lucide-react';
import { Revelar } from '@/components/ui/Revelar';
import { Aviso } from '@/components/ui/Aviso';
import { Figura } from '@/components/ui/Figura';
import { imagens } from '@/data/imagens';
import { pilares, PILARES_PROCEDENCIA } from '@/data/conteudo';
import { EASE_REVEAL } from '@/lib/motion';

const ICONES = {
  target: Target,
  heart: Heart,
  activity: Activity,
  users: Users,
} as const;

/**
 * Os quatro pilares.
 *
 * Deliberadamente NÃO é uma grade de quatro cards iguais com ícone, título e
 * texto — esse é o layout preguiçoso que faz todo site parecer o mesmo site.
 * Aqui é uma lista editorial: coluna fixa à esquerda com a fotografia, lista
 * à direita com separadores de 1px. O item sob o cursor acende; os outros
 * recuam. A hierarquia vem do contraste, não de caixas.
 */
export function Pilares() {
  const [ativo, setAtivo] = useState(0);
  const semMovimento = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  return (
    <section ref={ref} className="on-navy relative overflow-hidden bg-[#102F46] py-20 md:py-28 lg:py-36">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Coluna fixa: título + fotografia */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <Revelar>
                <h2 className="display-lg font-display text-white">
                  Muito além das
                  <br />
                  <span className="stroke-red">quatro linhas</span>
                </h2>
              </Revelar>

              <Revelar atraso={0.08}>
                <p className="measure mt-7 text-lg leading-relaxed text-[#A8C0D4]">
                  O que a criança leva do treino para casa importa tanto quanto o que ela aprende
                  com a bola no pé.
                </p>
              </Revelar>

              <Revelar atraso={0.14}>
                <div className="relative mt-10 hidden lg:block">
                  <Figura
                    imagem={imagens.pilares}
                    proporcao="aspect-[4/3]"
                    sizes="(min-width: 1024px) 40vw, 92vw"
                  />
                </div>
              </Revelar>
            </div>
          </div>

          {/* Lista editorial */}
          <div className="lg:col-span-7">
            <ul className="border-t border-white/15">
              {pilares.map((pilar, i) => {
                const Icone = ICONES[pilar.icone];
                const estaAtivo = ativo === i;

                return (
                  <motion.li
                    key={pilar.id}
                    initial={semMovimento ? false : { opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.52, delay: i * 0.07, ease: EASE_REVEAL }}
                    className="border-b border-white/15"
                    onMouseEnter={() => setAtivo(i)}
                    onFocus={() => setAtivo(i)}
                  >
                    <div
                      className="group flex cursor-default gap-5 py-8 transition-colors duration-300 md:gap-7 md:py-10"
                      tabIndex={0}
                    >
                      <Icone
                        size={28}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className={`mt-1 shrink-0 transition-colors duration-300 ${
                          estaAtivo ? 'text-[#E53E55]' : 'text-[#2A5A7E]'
                        }`}
                      />
                      <div>
                        <h3
                          className={`display-sm font-display transition-colors duration-300 ${
                            estaAtivo ? 'text-white' : 'text-white/55'
                          }`}
                        >
                          {pilar.titulo}
                        </h3>
                        <p
                          className={`measure mt-3 leading-relaxed transition-colors duration-300 ${
                            estaAtivo ? 'text-[#A8C0D4]' : 'text-[#A8C0D4]/55'
                          }`}
                        >
                          {pilar.texto}
                        </p>
                      </div>
                    </div>
                  </motion.li>
                );
              })}
            </ul>

            <Revelar atraso={0.1}>
              <div className="mt-8">
                <Aviso procedencia={PILARES_PROCEDENCIA} tema="navy">
                  Estes quatro pilares são uma proposta editorial inicial, escrita para o novo site.
                  Precisam ser revisados e aprovados pela escola antes da publicação, para refletir
                  a metodologia realmente praticada.
                </Aviso>
              </div>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  );
}
