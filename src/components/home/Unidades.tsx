import { Link } from 'react-router-dom';
import { ArrowRight, MapPin } from 'lucide-react';
import { GrupoRevelar, ItemRevelar, Revelar } from '@/components/ui/Revelar';
import { Figura } from '@/components/ui/Figura';
import { BotaoLink } from '@/components/ui/Botao';
import { unidadesPublicadas, diasDaUnidade } from '@/data/unidades';
import { imagensUnidades } from '@/data/imagens';

/**
 * As unidades na Home. Esta é a seção que responde "tem perto de mim?" —
 * a pergunta que mais decide a conversão. Por isso endereço e dias aparecem
 * no próprio card, sem exigir um clique.
 */
export function Unidades() {
  return (
    <section className="bg-[#F3F5F7] py-20 md:py-28 lg:py-36">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Revelar>
            <h2 className="display-lg font-display text-[#102F46]">
              Conheça nossas
              <br />
              <span className="stroke-red">unidades</span>
            </h2>
          </Revelar>

          <Revelar atraso={0.08}>
            <p className="measure text-[#5F6B76] md:max-w-sm md:text-right">
              Rio de Janeiro e Fortaleza. Escolha a mais perto de casa e agende uma aula
              experimental.
            </p>
          </Revelar>
        </div>

        <GrupoRevelar
          as="div"
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
        >
          {unidadesPublicadas.map((u, i) => {
            const foto = imagensUnidades[u.slug];
            const dias = diasDaUnidade(u);

            return (
              <ItemRevelar key={u.slug} as="article" indice={i}>
                <Link
                  to={`/unidades/${u.slug}`}
                  className="group flex h-full flex-col border border-[#DDE3E9] bg-white transition-all duration-300 hover:border-[#102F46] hover:shadow-[0_12px_28px_-14px_rgba(16,47,70,0.35)]"
                >
                  <div className="overflow-hidden">
                    <Figura
                      imagem={foto}
                      proporcao="aspect-[4/3]"
                      sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw"
                      className="transition-transform duration-[600ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-[1.5rem] uppercase leading-none text-[#102F46]">
                      {u.nome}
                    </h3>

                    <p className="mt-2.5 flex items-start gap-2 text-[0.875rem] leading-snug text-[#5F6B76]">
                      <MapPin
                        size={15}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span>
                        {u.local}
                        <br />
                        {u.cidade} — {u.estado}
                      </span>
                    </p>

                    <dl className="mt-5 space-y-2 border-t border-[#DDE3E9] pt-4 text-[0.8125rem]">
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#5F6B76]">Idades</dt>
                        <dd className="tabular font-medium text-[#102F46]">{u.faixaEtaria}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#5F6B76]">Dias</dt>
                        <dd className="text-right font-medium text-[#102F46]">
                          {dias.join(' · ')}
                        </dd>
                      </div>
                    </dl>

                    <span className="mt-6 inline-flex items-center gap-2 font-display text-[0.9375rem] uppercase tracking-[0.04em] text-[#E53E55]">
                      Conhecer unidade
                      <ArrowRight
                        size={17}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              </ItemRevelar>
            );
          })}
        </GrupoRevelar>

        <Revelar atraso={0.1}>
          <div className="mt-12 flex justify-center">
            <BotaoLink to="/unidades" variante="secundarioClaro">
              Ver todas as unidades e horários
            </BotaoLink>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
