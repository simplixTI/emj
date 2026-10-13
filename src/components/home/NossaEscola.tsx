import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Revelar } from '@/components/ui/Revelar';
import { Figura } from '@/components/ui/Figura';
import { BotaoLink } from '@/components/ui/Botao';
import { imagens } from '@/data/imagens';
import { institucional, contato } from '@/data/conteudo';

/**
 * A primeira seção de leitura. Depois do navy do hero, o fundo claro marca
 * a troca de registro: aqui o pai para de sentir e começa a avaliar.
 *
 * Todo o texto é citação literal do site oficial de 2019 — a voz da escola,
 * não a nossa.
 */
export function NossaEscola() {
  const ref = useRef<HTMLDivElement>(null);
  const semMovimento = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%']);

  return (
    <section className="bg-white py-20 md:py-28 lg:py-36">
      <div className="shell">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Revelar>
              <h2 className="display-lg font-display text-[#102F46]">
                Uma escola com
                <br />
                <span className="stroke-red">nome e sobrenome</span>
              </h2>
            </Revelar>

            <Revelar atraso={0.08}>
              <p className="measure mt-8 text-lg leading-relaxed text-[#102F46]">
                {institucional.missao}
              </p>
            </Revelar>

            <Revelar atraso={0.14}>
              <p className="measure mt-5 leading-relaxed text-[#5F6B76]">
                {institucional.formacao}
              </p>
            </Revelar>

            <Revelar atraso={0.2}>
              <p className="measure mt-5 leading-relaxed text-[#5F6B76]">{institucional.idolo}</p>
            </Revelar>

            <Revelar atraso={0.26}>
              <div className="mt-10">
                <BotaoLink
                  to="/metodologia"
                  variante="secundarioClaro"
                  icone={<ArrowRight size={19} strokeWidth={2} aria-hidden="true" />}
                >
                  Conheça a metodologia
                </BotaoLink>
              </div>
            </Revelar>
          </div>

          <div ref={ref} className="lg:col-span-7">
            <div className="grid gap-5 sm:grid-cols-5">
              <motion.div
                className="sm:col-span-3"
                style={semMovimento ? undefined : { y }}
              >
                <Figura
                  imagem={imagens.nossaEscola}
                  proporcao="aspect-[3/4]"
                  sizes="(min-width: 1024px) 40vw, 60vw"
                />
              </motion.div>

              <div className="flex flex-col justify-end gap-5 sm:col-span-2">
                <Figura
                  imagem={imagens.nossaEscolaDetalhe}
                  proporcao="aspect-square"
                  sizes="(min-width: 1024px) 26vw, 40vw"
                />

                {/* A epígrafe do próprio Júnior. É a frase que define a escola,
                    então ganha tratamento de bloco, não de legenda. */}
                <Revelar atraso={0.12}>
                  <blockquote className="on-navy bg-[#102F46] p-7">
                    <p className="font-display text-[1.375rem] uppercase leading-[1.08] tracking-[-0.01em] text-white">
                      “{institucional.epigrafe.texto}”
                    </p>
                    <footer className="mt-5 border-t border-white/15 pt-4 text-[0.8125rem] uppercase tracking-[0.1em] text-[#A8C0D4]">
                      {institucional.epigrafe.autor}
                    </footer>
                  </blockquote>
                </Revelar>
              </div>
            </div>

            <Revelar atraso={0.1}>
              <p className="mt-6 text-[0.8125rem] leading-relaxed text-[#5F6B76]">
                Escola fundada em <span className="tabular">{contato.fundacao}</span>, com unidades
                no Rio de Janeiro e em Fortaleza.
              </p>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  );
}
