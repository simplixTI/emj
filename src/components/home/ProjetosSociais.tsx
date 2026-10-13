import { ArrowRight } from 'lucide-react';
import { Revelar } from '@/components/ui/Revelar';
import { Figura } from '@/components/ui/Figura';
import { BotaoLink } from '@/components/ui/Botao';
import { imagens } from '@/data/imagens';
import { institucional, projetoSocial } from '@/data/conteudo';

/**
 * Projetos sociais na Home.
 *
 * Conteúdo confirmado pela escola: patrocínio da Light, apoio do Governo do
 * Estado do RJ, em atividade desde 2022, com unidade no Morro da Babilônia.
 *
 * O que continua FORA: número de crianças atendidas, lista completa de
 * comunidades e resultados. A escola não informou, e não estimamos.
 */
export function ProjetosSociais() {
  return (
    <section className="bg-white py-20 md:py-28 lg:py-36">
      <div className="shell">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <Revelar>
              <Figura
                imagem={imagens.projetosSociais}
                proporcao="aspect-[5/4]"
                sizes="(min-width: 1024px) 48vw, 92vw"
              />
            </Revelar>
          </div>

          <div className="lg:col-span-6">
            <Revelar>
              <h2 className="display-lg font-display text-[#102F46]">
                O futebol como
                <br />
                <span className="stroke-red">porta de entrada</span>
              </h2>
            </Revelar>

            <Revelar atraso={0.08}>
              <p className="measure mt-8 text-lg leading-relaxed text-[#102F46]">
                {institucional.missao}
              </p>
            </Revelar>

            <Revelar atraso={0.14}>
              <p className="measure mt-5 leading-relaxed text-[#5F6B76]">
                {projetoSocial.resumo} A iniciativa leva esporte, cultura e novas oportunidades a
                crianças e jovens de áreas vulneráveis da cidade — entre elas, a unidade do{' '}
                <strong className="font-semibold text-[#102F46]">Morro da Babilônia</strong>, no
                Leme.
              </p>
            </Revelar>

            <Revelar atraso={0.2}>
              <dl className="mt-9 flex flex-wrap gap-x-12 gap-y-6 border-t border-[#DDE3E9] pt-7">
                <div>
                  <dt className="font-display text-[0.75rem] uppercase tracking-[0.14em] text-[#5F6B76]">
                    Patrocínio
                  </dt>
                  <dd className="mt-1 font-display text-[1.5rem] uppercase leading-none text-[#102F46]">
                    {projetoSocial.patrocinador}
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-[0.75rem] uppercase tracking-[0.14em] text-[#5F6B76]">
                    Apoio
                  </dt>
                  <dd className="mt-1 max-w-[22ch] leading-snug text-[#102F46]">
                    {projetoSocial.apoio}
                  </dd>
                </div>
                <div>
                  <dt className="font-display text-[0.75rem] uppercase tracking-[0.14em] text-[#5F6B76]">
                    Desde
                  </dt>
                  <dd className="tabular mt-1 font-display text-[1.5rem] leading-none text-[#102F46]">
                    {projetoSocial.inicio}
                  </dd>
                </div>
              </dl>
            </Revelar>

            <Revelar atraso={0.26}>
              <div className="mt-9">
                <BotaoLink
                  to="/projetos-sociais"
                  variante="secundarioClaro"
                  icone={<ArrowRight size={19} strokeWidth={2} aria-hidden="true" />}
                >
                  Conheça nossos projetos
                </BotaoLink>
              </div>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  );
}
