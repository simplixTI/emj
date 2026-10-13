import { ArrowRight } from 'lucide-react';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Revelar, GrupoRevelar, ItemRevelar } from '@/components/ui/Revelar';
import { Figura } from '@/components/ui/Figura';
import { BotaoLink } from '@/components/ui/Botao';
import { Aviso } from '@/components/ui/Aviso';
import { imagens } from '@/data/imagens';
import { institucional, faixasEtarias, depoimentosPublicados } from '@/data/conteudo';
import { useSeo } from '@/lib/seo';

/**
 * Metodologia.
 *
 * Construída sobre o texto real da escola (2019). Não inventamos método
 * proprietário, certificação nem nome de programa. O que é interpretação
 * nossa está marcado como tal.
 */

const ETAPAS = [
  {
    titulo: 'Desenvolvimento técnico e motor',
    texto:
      'Os fundamentos vêm antes da tática: domínio, passe, condução e finalização, trabalhados com repetição e correção individual. Junto deles, coordenação, equilíbrio e lateralidade — habilidades que a criança leva para qualquer esporte e para a vida fora do campo.',
  },
  {
    titulo: 'Aprendizado por faixa etária',
    texto:
      'As turmas são separadas por idade porque uma criança de cinco anos e um adolescente de quinze não aprendem da mesma forma, nem pelos mesmos motivos. Nos menores, o jogo é a ferramenta. Nos maiores, entram leitura de jogo, posicionamento e responsabilidade coletiva.',
  },
  {
    titulo: 'Formação de valores',
    texto:
      'Pontualidade, respeito ao adversário, aceitar a decisão do árbitro, cumprimentar quem perdeu. Essas não são regras do treino: são o treino. É o que a escola chama de formação do caráter — e é por isso que ela existe.',
  },
  {
    titulo: 'Convivência e trabalho em equipe',
    texto:
      'Futebol é o esporte coletivo por excelência. A criança aprende que depende dos outros e que os outros dependem dela — e que isso vale tanto na vitória quanto na derrota.',
  },
  {
    titulo: 'O papel dos professores',
    texto:
      'O professor acompanha, corrige e puxa — mas sobretudo observa. Numa escola de formação, saber quando intervir e quando deixar a criança resolver sozinha é mais determinante do que qualquer exercício.',
  },
  {
    titulo: 'Evolução e acompanhamento',
    texto:
      'Cada aluno evolui no próprio tempo. O acompanhamento é individual e contínuo, e a conversa com a família faz parte do processo — o que acontece no campo não fica só no campo.',
  },
];

export default function Metodologia() {
  useSeo({
    titulo: 'Metodologia — Escola de Futebol Maestro Júnior',
    descricao:
      'Como a Escola Maestro Júnior ensina futebol: desenvolvimento técnico e motor, aprendizado por faixa etária, formação de valores e acompanhamento individual de cada aluno.',
    caminho: '/metodologia',
  });

  return (
    <>
      <CabecalhoPagina
        titulo="Metodologia"
        descricao="Como ensinamos futebol — e por que isso vai muito além do futebol."
        imagem={imagens.metodologia}
      />

      {/* A filosofia, na voz da própria escola */}
      <section className="bg-white py-20 md:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <Revelar>
                <h2 className="display-md font-display text-[#102F46]">
                  O esporte como meio, não como fim
                </h2>
              </Revelar>
              <Revelar atraso={0.08}>
                <p className="measure mt-7 text-lg leading-relaxed text-[#102F46]">
                  {institucional.formacao}
                </p>
              </Revelar>
              <Revelar atraso={0.14}>
                <p className="measure mt-5 leading-relaxed text-[#5F6B76]">{institucional.idolo}</p>
              </Revelar>
            </div>

            <div className="lg:col-span-5">
              <Revelar atraso={0.1}>
                <blockquote className="on-navy h-full bg-[#102F46] p-8 md:p-10">
                  <p className="font-display text-[1.625rem] uppercase leading-[1.08] text-white">
                    “{institucional.epigrafe.texto}”
                  </p>
                  <footer className="mt-6 border-t border-white/15 pt-5 text-[0.8125rem] uppercase tracking-[0.1em] text-[#A8C0D4]">
                    {institucional.epigrafe.autor}
                  </footer>
                </blockquote>
              </Revelar>
            </div>
          </div>
        </div>
      </section>

      {/* Faixas etárias — dado real declarado pela escola */}
      <section className="bg-[#F3F5F7] py-20 md:py-28">
        <div className="shell">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Revelar>
                <Figura
                  imagem={imagens.metodologiaFaixas}
                  proporcao="aspect-[4/5]"
                  sizes="(min-width: 1024px) 40vw, 92vw"
                />
              </Revelar>
            </div>

            <div className="lg:col-span-7">
              <Revelar>
                <h2 className="display-md font-display text-[#102F46]">
                  Cada idade,
                  <br />
                  <span className="stroke-red">seu momento</span>
                </h2>
              </Revelar>

              <Revelar atraso={0.08}>
                <p className="measure mt-7 leading-relaxed text-[#5F6B76]">
                  As turmas da escola são organizadas em três grandes grupos. A divisão exata de
                  cada unidade segue a grade de horários daquele local.
                </p>
              </Revelar>

              <GrupoRevelar className="mt-9 border-t border-[#DDE3E9]">
                {faixasEtarias.map((faixa, i) => (
                  <ItemRevelar key={faixa} indice={i}>
                    <div className="flex items-baseline justify-between gap-6 border-b border-[#DDE3E9] py-5">
                      <span className="tabular font-display text-[1.75rem] uppercase leading-none text-[#102F46]">
                        {faixa}
                      </span>
                    </div>
                  </ItemRevelar>
                ))}
              </GrupoRevelar>

              <Revelar atraso={0.1}>
                <div className="mt-7">
                  <BotaoLink
                    to="/unidades"
                    variante="secundarioClaro"
                    icone={<ArrowRight size={19} strokeWidth={2} aria-hidden="true" />}
                  >
                    Ver horários por unidade
                  </BotaoLink>
                </div>
              </Revelar>
            </div>
          </div>
        </div>
      </section>

      {/* As etapas — lista editorial, não grade de cards */}
      <section className="bg-white py-20 md:py-28">
        <div className="shell">
          <Revelar>
            <h2 className="display-md max-w-[20ch] font-display text-[#102F46]">
              O que acontece em um treino
            </h2>
          </Revelar>

          <GrupoRevelar className="mt-12 grid gap-x-16 gap-y-0 md:grid-cols-2">
            {ETAPAS.map((etapa, i) => (
              <ItemRevelar key={etapa.titulo} as="article" indice={i}>
                <div className="border-t border-[#DDE3E9] py-8">
                  <h3 className="font-display text-[1.5rem] uppercase leading-tight text-[#102F46]">
                    {etapa.titulo}
                  </h3>
                  <p className="mt-3.5 leading-relaxed text-[#5F6B76]">{etapa.texto}</p>
                </div>
              </ItemRevelar>
            ))}
          </GrupoRevelar>

          <Revelar atraso={0.1}>
            <div className="mt-10">
              <Aviso procedencia="provisorio">
                A descrição das etapas acima é uma proposta editorial redigida para o novo site, a
                partir do texto institucional publicado pela escola. Precisa ser revisada pela
                equipe técnica antes da publicação — nenhuma certificação ou metodologia registrada
                foi atribuída à escola.
              </Aviso>
            </div>
          </Revelar>
        </div>
      </section>

      {/* Espaço para depoimentos reautorizados */}
      <section className="bg-[#F3F5F7] py-20 md:py-28">
        <div className="shell">
          <Revelar>
            <h2 className="display-md font-display text-[#102F46]">O que as famílias dizem</h2>
          </Revelar>

          {depoimentosPublicados.length > 0 ? (
            <GrupoRevelar className="mt-12 grid gap-6 md:grid-cols-3">
              {depoimentosPublicados.map((d, i) => (
                <ItemRevelar key={d.id} as="article" indice={i}>
                  <figure className="flex h-full flex-col border border-[#DDE3E9] bg-white p-7">
                    <blockquote className="flex-1 leading-relaxed text-[#102F46]">
                      “{d.texto}”
                    </blockquote>
                    <figcaption className="mt-6 border-t border-[#DDE3E9] pt-4 text-[0.8125rem] uppercase tracking-[0.08em] text-[#5F6B76]">
                      {d.autor}
                    </figcaption>
                  </figure>
                </ItemRevelar>
              ))}
            </GrupoRevelar>
          ) : (
            <Revelar atraso={0.08}>
              <div className="mt-8 max-w-2xl">
                <Aviso procedencia="a_validar">
                  A escola tem três depoimentos reais de responsáveis, publicados no site anterior.
                  Eles estão preservados no sistema, mas desativados: um consentimento dado em 2019
                  não se estende automaticamente a um site novo. Basta reautorizar pelo painel
                  administrativo para publicá-los aqui.
                </Aviso>
              </div>
            </Revelar>
          )}
        </div>
      </section>

      {/* Fechamento */}
      <section className="on-navy relative overflow-hidden bg-[#102F46] py-20 md:py-28">
        <div className="shell">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Revelar>
                <Figura
                  imagem={imagens.metodologiaProfessores}
                  proporcao="aspect-[16/11]"
                  sizes="(min-width: 1024px) 48vw, 92vw"
                />
              </Revelar>
            </div>
            <div className="lg:col-span-6">
              <Revelar>
                <h2 className="display-md font-display text-white">
                  Venha ver de perto
                </h2>
              </Revelar>
              <Revelar atraso={0.08}>
                <p className="measure mt-6 text-lg leading-relaxed text-[#C4D6E4]">
                  A melhor forma de entender como a escola trabalha é assistir a um treino. Agende
                  uma aula experimental e conheça os professores, o campo e a turma.
                </p>
              </Revelar>
              <Revelar atraso={0.14}>
                <div className="mt-9">
                  <BotaoLink
                    to="/contato"
                    icone={<ArrowRight size={19} strokeWidth={2} aria-hidden="true" />}
                  >
                    Quero conhecer a escola
                  </BotaoLink>
                </div>
              </Revelar>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
