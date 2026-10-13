import { useState } from 'react';
import { ChevronDown, MapPin, MessageCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Revelar, GrupoRevelar, ItemRevelar } from '@/components/ui/Revelar';
import { Figura } from '@/components/ui/Figura';
import { BotaoExterno } from '@/components/ui/Botao';
import { Aviso } from '@/components/ui/Aviso';
import { FormularioCamp } from '@/components/camp/FormularioCamp';
import { imagens, galeriaCamp } from '@/data/imagens';
import { camp, campFaq, edicoesCamp } from '@/data/conteudo';
import { linkMapa, linkWhatsApp, MSG_CAMP } from '@/lib/whatsapp';
import { EASE_REVEAL } from '@/lib/motion';
import { useSeo } from '@/lib/seo';

function Pergunta({ p, r }: { p: string; r: string }) {
  const [aberto, setAberto] = useState(false);
  return (
    <div className="border-b border-[#DDE3E9]">
      <h3>
        <button
          type="button"
          onClick={() => setAberto((v) => !v)}
          aria-expanded={aberto}
          className="flex w-full cursor-pointer items-center justify-between gap-5 py-5 text-left transition-colors hover:text-[#E53E55]"
        >
          <span className="font-display text-[1.25rem] uppercase leading-tight text-[#102F46]">
            {p}
          </span>
          <ChevronDown
            size={20}
            strokeWidth={1.75}
            aria-hidden="true"
            className={`shrink-0 text-[#E53E55] transition-transform duration-300 ${
              aberto ? 'rotate-180' : ''
            }`}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {aberto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE_REVEAL }}
            className="overflow-hidden"
          >
            <p className="measure pb-6 leading-relaxed text-[#5F6B76]">{r}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Camp() {
  useSeo({
    titulo: 'Camp Maestro Júnior — Futebol, amizade e experiências inesquecíveis',
    descricao:
      'Três dias de imersão no futebol com o Maestro Júnior, no resort Le Canton, em Teresópolis. Duas edições por ano. Entre na lista de interesse da próxima edição.',
    caminho: '/camp',
    imagem: imagens.campHero.src,
  });

  return (
    <>
      <CabecalhoPagina
        alto
        titulo={
          <>
            Camp Maestro
            <br />
            Júnior
          </>
        }
        descricao="Futebol, amizade e experiências inesquecíveis. Três dias de imersão no Le Canton, em Teresópolis."
        imagem={imagens.campHero}
      >
        <div className="flex flex-wrap gap-3">
          <a
            href="#interesse"
            className="group inline-flex min-h-[56px] items-center gap-2.5 bg-[#E53E55] px-7 font-display text-[1.0625rem] uppercase tracking-[0.04em] text-white transition-all duration-200 hover:-translate-y-px hover:bg-[#C72F44]"
          >
            Tenho interesse na próxima edição
          </a>
          <BotaoExterno
            href={linkWhatsApp(MSG_CAMP)}
            variante="secundario"
            icone={<MessageCircle size={19} strokeWidth={1.75} aria-hidden="true" />}
          >
            Falar no WhatsApp
          </BotaoExterno>
        </div>
      </CabecalhoPagina>

      {/* A experiência */}
      <section className="bg-white py-20 md:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <Revelar>
                <h2 className="display-md font-display text-[#102F46]">
                  Três dias que a criança
                  <br />
                  <span className="stroke-red">não esquece</span>
                </h2>
              </Revelar>
              <Revelar atraso={0.08}>
                <p className="measure mt-7 text-lg leading-relaxed text-[#102F46]">
                  Duas vezes por ano, a Escola Maestro Júnior leva crianças e adolescentes para uma
                  imersão no {camp.parceiroDescricao}, na Região Serrana do Rio de Janeiro. São três
                  dias de treino, convivência e lazer — com a presença do próprio Júnior em campo.
                </p>
              </Revelar>
              <Revelar atraso={0.14}>
                <p className="measure mt-5 leading-relaxed text-[#5F6B76]">
                  Longe da rotina da escola e do celular, a garotada treina, divide quarto, come
                  junto e joga junto. No último dia, acontece a partida que todo mundo espera: pais
                  contra filhos.
                </p>
              </Revelar>

              <Revelar atraso={0.2}>
                <div className="mt-9 border-t border-[#DDE3E9] pt-7">
                  <h3 className="font-display text-[0.8125rem] uppercase tracking-[0.14em] text-[#5F6B76]">
                    Todo participante recebe
                  </h3>
                  <ul className="mt-4 space-y-2.5">
                    {camp.recebe.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[#102F46]">
                        <span
                          className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-[#E53E55]"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </Revelar>
            </div>

            <div className="lg:col-span-6">
              <Revelar atraso={0.1}>
                <Figura
                  imagem={imagens.campExperiencia}
                  proporcao="aspect-[4/5]"
                  sizes="(min-width: 1024px) 48vw, 92vw"
                />
              </Revelar>
            </div>
          </div>
        </div>
      </section>

      {/* Como são os três dias */}
      <section className="on-navy bg-[#102F46] py-20 md:py-28">
        <div className="shell">
          <Revelar>
            <h2 className="display-md font-display text-white">Como são os três dias</h2>
          </Revelar>

          <GrupoRevelar className="mt-12 grid gap-px border-t border-white/15 md:grid-cols-3">
            {camp.formato.map((dia, i) => (
              <ItemRevelar key={dia.titulo} as="article" indice={i}>
                <div className="h-full border-b border-white/15 py-8 md:border-b-0 md:pr-8">
                  <h3 className="font-display text-[1.625rem] uppercase leading-tight text-white">
                    {dia.titulo}
                  </h3>
                  <p className="mt-3.5 leading-relaxed text-[#A8C0D4]">{dia.texto}</p>
                </div>
              </ItemRevelar>
            ))}
          </GrupoRevelar>

          <Revelar atraso={0.1}>
            <div className="mt-10 max-w-3xl">
              <Aviso procedencia="verificado" tema="navy">
                Programação baseada na edição de abril de 2024, publicada na página oficial do
                evento. Cada edição pode variar.
              </Aviso>
            </div>
          </Revelar>
        </div>
      </section>

      {/* Onde acontece */}
      <section className="bg-[#F3F5F7] py-20 md:py-28">
        <div className="shell">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Revelar>
                <h2 className="display-md font-display text-[#102F46]">
                  No Le Canton,
                  <br />
                  em Teresópolis
                </h2>
              </Revelar>
              <Revelar atraso={0.08}>
                <p className="measure mt-6 leading-relaxed text-[#5F6B76]">
                  O Camp acontece em parceria com o resort Le Canton, na Região Serrana do Rio de
                  Janeiro. Os participantes têm acesso à estrutura de lazer do resort durante os
                  três dias.
                </p>
              </Revelar>
              <Revelar atraso={0.14}>
                <p className="mt-6 flex items-start gap-2.5 text-[#102F46]">
                  <MapPin
                    size={18}
                    strokeWidth={1.5}
                    className="mt-1 shrink-0 text-[#E53E55]"
                    aria-hidden="true"
                  />
                  {camp.endereco}
                </p>
                <div className="mt-6">
                  <BotaoExterno href={linkMapa(camp.mapaQuery)} variante="secundarioClaro">
                    Ver no mapa
                  </BotaoExterno>
                </div>
              </Revelar>
            </div>

            <div className="lg:col-span-7">
              <Revelar atraso={0.1}>
                <h3 className="sr-only">Edições anteriores</h3>
                <ul className="border-t border-[#DDE3E9]">
                  {edicoesCamp.map((e) => (
                    <li
                      key={e.id}
                      className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-[#DDE3E9] py-5"
                    >
                      <span className="font-display text-[1.25rem] uppercase leading-none text-[#102F46]">
                        {e.titulo}
                      </span>
                      <span className="tabular text-[0.9375rem] text-[#5F6B76]">
                        {e.periodo} · {e.ano}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[0.8125rem] text-[#5F6B76]">
                  Edições documentadas em fontes públicas. A escola realiza duas edições por ano.
                </p>
              </Revelar>
            </div>
          </div>
        </div>
      </section>

      {/* Galeria */}
      <section className="bg-white py-20 md:py-28">
        <div className="shell">
          <Revelar>
            <h2 className="display-md font-display text-[#102F46]">Galeria</h2>
          </Revelar>

          <GrupoRevelar className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 lg:gap-4">
            {galeriaCamp.map((foto, i) => (
              <ItemRevelar
                key={foto.key}
                indice={i}
                className={i === 0 ? 'col-span-2 md:col-span-2 md:row-span-2' : ''}
              >
                <Figura
                  imagem={foto}
                  proporcao={i === 0 ? 'aspect-[4/3] md:aspect-square' : 'aspect-square'}
                  sizes="(min-width: 768px) 32vw, 46vw"
                />
              </ItemRevelar>
            ))}
          </GrupoRevelar>

          <Revelar atraso={0.1}>
            <div className="mt-8 max-w-3xl">
              <Aviso procedencia="provisorio">
                Imagens provisórias. A galeria está pronta para receber as fotos reais das edições
                anteriores assim que a escola subi-las pelo painel administrativo, com as devidas
                autorizações de uso de imagem das crianças.
              </Aviso>
            </div>
          </Revelar>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#F3F5F7] py-20 md:py-28">
        <div className="shell">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Revelar>
                <h2 className="display-md font-display text-[#102F46]">
                  Perguntas
                  <br />
                  frequentes
                </h2>
              </Revelar>
            </div>
            <div className="lg:col-span-8">
              <Revelar atraso={0.08}>
                <div className="border-t border-[#DDE3E9]">
                  {campFaq.map((item) => (
                    <Pergunta key={item.p} p={item.p} r={item.r} />
                  ))}
                </div>
              </Revelar>
            </div>
          </div>
        </div>
      </section>

      {/* Lista de interesse */}
      <section id="interesse" className="scroll-mt-24 bg-white py-20 md:py-28">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <Revelar>
              <FormularioCamp />
            </Revelar>
          </div>
        </div>
      </section>
    </>
  );
}
