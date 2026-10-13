import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Phone } from 'lucide-react';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Revelar, GrupoRevelar, ItemRevelar } from '@/components/ui/Revelar';
import { Figura } from '@/components/ui/Figura';
import { Aviso } from '@/components/ui/Aviso';
import { unidadesPublicadas, regioes, diasDaUnidade } from '@/data/unidades';
import { imagensUnidades, imagens } from '@/data/imagens';
import { useSeo } from '@/lib/seo';

export default function Unidades() {
  useSeo({
    titulo: 'Unidades — Escola de Futebol Maestro Júnior',
    descricao:
      'Unidades da Escola de Futebol Maestro Júnior na Barra da Tijuca, Jacarepaguá, Ilha de Guaratiba e Fortaleza. Endereços, horários, faixas etárias e contato.',
    caminho: '/unidades',
  });

  const todasRegioes = useMemo(() => regioes(), []);
  const [filtro, setFiltro] = useState<string>('todas');

  const lista = useMemo(
    () => (filtro === 'todas' ? unidadesPublicadas : unidadesPublicadas.filter((u) => u.regiao === filtro)),
    [filtro],
  );

  return (
    <>
      <CabecalhoPagina
        titulo="Unidades"
        descricao="Escolha a unidade mais perto de casa e agende uma aula experimental."
        imagem={imagens.nossaEscola}
      />

      <section className="bg-white py-16 md:py-24">
        <div className="shell">
          {/* Filtro por região. Só aparece quando há mais de uma. */}
          {todasRegioes.length > 1 && (
            <Revelar>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="sr-only" id="rotulo-filtro">
                  Filtrar unidades por região
                </span>
                <div
                  role="group"
                  aria-labelledby="rotulo-filtro"
                  className="flex flex-wrap gap-2.5"
                >
                  {['todas', ...todasRegioes].map((r) => {
                    const ativo = filtro === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setFiltro(r)}
                        aria-pressed={ativo}
                        className={`min-h-[44px] cursor-pointer whitespace-nowrap border px-5 font-display text-[0.9375rem] uppercase tracking-[0.05em] transition-colors duration-200 ${
                          ativo
                            ? 'border-[#E53E55] bg-[#E53E55] text-white'
                            : 'border-[#DDE3E9] text-[#102F46] hover:border-[#102F46]'
                        }`}
                      >
                        {r === 'todas' ? 'Todas' : r}
                      </button>
                    );
                  })}
                </div>
              </div>
            </Revelar>
          )}

          <p className="mt-6 text-[0.875rem] text-[#5F6B76]" aria-live="polite">
            <span className="tabular font-medium text-[#102F46]">{lista.length}</span>{' '}
            {lista.length === 1 ? 'unidade' : 'unidades'}
            {filtro !== 'todas' && ` em ${filtro}`}
          </p>

          <GrupoRevelar className="mt-8 grid gap-8 lg:gap-10">
            {lista.map((u, i) => {
              const foto = imagensUnidades[u.slug];
              return (
                <ItemRevelar key={u.slug} as="article" indice={i}>
                  <div className="grid gap-0 border border-[#DDE3E9] md:grid-cols-12">
                    {/* No desktop a foto é posicionada em absoluto dentro da
                        célula, para que a altura do card venha do texto e os
                        cards fiquem todos iguais. */}
                    <div className="relative md:col-span-5 lg:col-span-4">
                      <Figura
                        imagem={foto}
                        proporcao="aspect-[4/3] md:absolute md:inset-0 md:aspect-auto md:h-full"
                        sizes="(min-width: 768px) 38vw, 92vw"
                      />
                    </div>

                    <div className="flex flex-col p-6 md:col-span-7 md:p-8 lg:col-span-8">
                      <h2 className="font-display text-[2rem] uppercase leading-none text-[#102F46] md:text-[2.5rem]">
                        {u.nome}
                      </h2>
                      <p className="mt-1 text-[0.9375rem] text-[#5F6B76]">
                        {u.local} — {u.cidade}/{u.estado}
                      </p>

                      <dl className="mt-6 grid gap-4 border-t border-[#DDE3E9] pt-5 sm:grid-cols-2">
                        <div>
                          <dt className="font-display text-[0.75rem] uppercase tracking-[0.12em] text-[#5F6B76]">
                            Endereço
                          </dt>
                          <dd className="mt-1.5 flex items-start gap-2 text-[0.9375rem] leading-snug text-[#102F46]">
                            <MapPin
                              size={16}
                              strokeWidth={1.5}
                              className="mt-0.5 shrink-0"
                              aria-hidden="true"
                            />
                            {u.endereco}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-display text-[0.75rem] uppercase tracking-[0.12em] text-[#5F6B76]">
                            Contato
                          </dt>
                          <dd className="mt-1.5 space-y-1">
                            {u.telefones.map((t) => (
                              <a
                                key={t}
                                href={`tel:+55${t.replace(/\D/g, '')}`}
                                className="tabular flex items-center gap-2 text-[0.9375rem] text-[#102F46] transition-colors hover:text-[#E53E55]"
                              >
                                <Phone size={15} strokeWidth={1.5} aria-hidden="true" />
                                {t}
                              </a>
                            ))}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-display text-[0.75rem] uppercase tracking-[0.12em] text-[#5F6B76]">
                            Faixa etária
                          </dt>
                          <dd className="tabular mt-1.5 text-[0.9375rem] text-[#102F46]">
                            {u.faixaEtaria}
                          </dd>
                        </div>

                        <div>
                          <dt className="font-display text-[0.75rem] uppercase tracking-[0.12em] text-[#5F6B76]">
                            Dias de treino
                          </dt>
                          <dd className="mt-1.5 text-[0.9375rem] text-[#102F46]">
                            {diasDaUnidade(u).join(' · ')}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-7 flex flex-wrap gap-3">
                        <Link
                          to={`/unidades/${u.slug}`}
                          className="group inline-flex min-h-[52px] items-center gap-2 bg-[#E53E55] px-6 font-display text-[0.9375rem] uppercase tracking-[0.05em] text-white transition-colors duration-200 hover:bg-[#C72F44]"
                        >
                          Conhecer unidade
                          <ArrowRight
                            size={17}
                            strokeWidth={2}
                            aria-hidden="true"
                            className="transition-transform duration-200 group-hover:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </ItemRevelar>
              );
            })}
          </GrupoRevelar>

          <Revelar atraso={0.1}>
            <div className="mt-12 max-w-3xl">
              <Aviso procedencia="a_validar">
                Endereços, telefones e horários foram recuperados do site oficial da escola
                (registro público de 2019) para que o novo site já nascesse com informação real.
                Precisam ser conferidos e atualizados pela escola antes da publicação definitiva —
                tudo é editável pelo painel administrativo.
              </Aviso>
            </div>
          </Revelar>
        </div>
      </section>
    </>
  );
}
