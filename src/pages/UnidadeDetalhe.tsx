import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, MapPin, MessageCircle, Phone } from 'lucide-react';
import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Revelar } from '@/components/ui/Revelar';
import { BotaoExterno, BotaoLink } from '@/components/ui/Botao';
import { Aviso } from '@/components/ui/Aviso';
import { unidadePorSlug, unidadesPublicadas } from '@/data/unidades';
import { imagensUnidades } from '@/data/imagens';
import { embedMapa, linkMapa, linkWhatsApp, msgUnidade } from '@/lib/whatsapp';
import { useSeo } from '@/lib/seo';
import type { DiaSemana } from '@/types';

const DIAS: { chave: DiaSemana; curto: string; longo: string }[] = [
  { chave: 'seg', curto: 'Seg', longo: 'Segunda' },
  { chave: 'ter', curto: 'Ter', longo: 'Terça' },
  { chave: 'qua', curto: 'Qua', longo: 'Quarta' },
  { chave: 'qui', curto: 'Qui', longo: 'Quinta' },
  { chave: 'sex', curto: 'Sex', longo: 'Sexta' },
];

export default function UnidadeDetalhe() {
  const { slug } = useParams<{ slug: string }>();
  const unidade = slug ? unidadePorSlug(slug) : undefined;

  useSeo({
    titulo: unidade
      ? `Unidade ${unidade.nome} — Escola de Futebol Maestro Júnior`
      : 'Unidade não encontrada',
    descricao: unidade
      ? `Escola de Futebol Maestro Júnior na unidade ${unidade.nome}, em ${unidade.cidade}/${unidade.estado}. ${unidade.local}, ${unidade.endereco}. Turmas de ${unidade.faixaEtaria}.`
      : '',
    caminho: `/unidades/${slug ?? ''}`,
  });

  if (!unidade) return <Navigate to="/unidades" replace />;

  const foto = imagensUnidades[unidade.slug];
  const outras = unidadesPublicadas.filter((u) => u.slug !== unidade.slug);

  // Dias que esta unidade realmente usa — colunas vazias não entram na tabela.
  const diasAtivos = DIAS.filter((d) => unidade.horarios.some((h) => h.dias.includes(d.chave)));
  const horas = [...new Set(unidade.horarios.map((h) => h.hora))].sort();

  return (
    <>
      <CabecalhoPagina
        titulo={unidade.nome}
        descricao={`${unidade.local} — ${unidade.cidade}, ${unidade.estado}`}
        imagem={foto}
      >
        <div className="flex flex-wrap gap-3">
          <BotaoLink
            to="/contato"
            icone={<ArrowRight size={19} strokeWidth={2} aria-hidden="true" />}
          >
            Agendar aula experimental
          </BotaoLink>
          {unidade.whatsapp && (
            <BotaoExterno
              href={linkWhatsApp(msgUnidade(unidade.nome), unidade.whatsapp)}
              variante="secundario"
              icone={<MessageCircle size={19} strokeWidth={1.75} aria-hidden="true" />}
            >
              WhatsApp da unidade
            </BotaoExterno>
          )}
        </div>
      </CabecalhoPagina>

      <section className="bg-white py-16 md:py-24">
        <div className="shell">
          <Link
            to="/unidades"
            className="inline-flex items-center gap-2 text-[0.9375rem] text-[#5F6B76] transition-colors hover:text-[#E53E55]"
          >
            <ArrowLeft size={17} strokeWidth={1.75} aria-hidden="true" />
            Todas as unidades
          </Link>

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Horários */}
            <div className="lg:col-span-7">
              <Revelar>
                <h2 className="display-sm font-display text-[#102F46]">Horários das turmas</h2>
              </Revelar>

              <Revelar atraso={0.08}>
                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[460px] border-collapse text-left">
                    <caption className="sr-only">
                      Grade de horários da unidade {unidade.nome}, com a faixa etária de cada turma
                    </caption>
                    <thead>
                      <tr className="border-b border-[#102F46]">
                        <th
                          scope="col"
                          className="py-3 pr-4 font-display text-[0.8125rem] uppercase tracking-[0.1em] text-[#5F6B76]"
                        >
                          Horário
                        </th>
                        {diasAtivos.map((d) => (
                          <th
                            key={d.chave}
                            scope="col"
                            className="py-3 pr-4 font-display text-[0.8125rem] uppercase tracking-[0.1em] text-[#102F46]"
                          >
                            <span className="md:hidden">{d.curto}</span>
                            <span className="hidden md:inline">{d.longo}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {horas.map((hora) => (
                        <tr key={hora} className="border-b border-[#DDE3E9]">
                          <th
                            scope="row"
                            className="tabular py-4 pr-4 text-left font-display text-[1.125rem] font-600 text-[#102F46]"
                          >
                            {hora}
                          </th>
                          {diasAtivos.map((d) => {
                            const turmas = unidade.horarios.filter(
                              (h) => h.hora === hora && h.dias.includes(d.chave),
                            );
                            return (
                              <td key={d.chave} className="py-4 pr-4 align-top">
                                {turmas.length === 0 ? (
                                  <span className="text-[#DDE3E9]" aria-label="sem turma">
                                    —
                                  </span>
                                ) : (
                                  <ul className="space-y-1">
                                    {turmas.map((t, i) => (
                                      <li
                                        key={`${t.faixa}-${i}`}
                                        className="tabular text-[0.875rem] leading-snug text-[#102F46]"
                                      >
                                        {t.faixa}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Revelar>

              <Revelar atraso={0.12}>
                <div className="mt-7">
                  <Aviso procedencia={unidade.procedencia}>
                    Grade recuperada do registro público do site anterior da escola. Confirme os
                    horários por WhatsApp antes de ir — eles podem ter mudado.
                  </Aviso>
                </div>
              </Revelar>

              {unidade.observacao && (
                <Revelar atraso={0.16}>
                  <p className="mt-5 border border-[#DDE3E9] bg-[#F3F5F7] p-5 text-[0.9375rem] leading-relaxed text-[#5F6B76]">
                    {unidade.observacao}
                  </p>
                </Revelar>
              )}
            </div>

            {/* Informações + mapa */}
            <aside className="lg:col-span-5">
              <Revelar>
                <div className="border border-[#DDE3E9] p-7">
                  <h2 className="font-display text-[1.375rem] uppercase text-[#102F46]">
                    Onde fica
                  </h2>

                  <p className="mt-4 flex items-start gap-2.5 leading-relaxed text-[#102F46]">
                    <MapPin
                      size={18}
                      strokeWidth={1.5}
                      className="mt-1 shrink-0 text-[#E53E55]"
                      aria-hidden="true"
                    />
                    <span>
                      <strong className="block font-semibold">{unidade.local}</strong>
                      {unidade.endereco}
                    </span>
                  </p>

                  <ul className="mt-6 space-y-2.5 border-t border-[#DDE3E9] pt-5">
                    {unidade.telefones.map((t) => (
                      <li key={t}>
                        <a
                          href={`tel:+55${t.replace(/\D/g, '')}`}
                          className="tabular flex items-center gap-2.5 text-[#102F46] transition-colors hover:text-[#E53E55]"
                        >
                          <Phone size={17} strokeWidth={1.5} aria-hidden="true" />
                          {t}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6">
                    <BotaoExterno
                      href={linkMapa(unidade.mapaQuery)}
                      variante="secundarioClaro"
                      className="w-full"
                    >
                      Abrir no Google Maps
                    </BotaoExterno>
                  </div>
                </div>
              </Revelar>

              <Revelar atraso={0.1}>
                <div className="mt-6 border border-[#DDE3E9]">
                  <iframe
                    title={`Mapa da unidade ${unidade.nome}`}
                    src={embedMapa(unidade.mapaQuery)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="aspect-[4/3] w-full border-0"
                  />
                </div>
              </Revelar>
            </aside>
          </div>
        </div>
      </section>

      {/* Outras unidades */}
      {outras.length > 0 && (
        <section className="bg-[#F3F5F7] py-16 md:py-20">
          <div className="shell">
            <Revelar>
              <h2 className="display-sm font-display text-[#102F46]">Outras unidades</h2>
            </Revelar>
            <Revelar atraso={0.08}>
              <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {outras.map((u) => (
                  <li key={u.slug}>
                    <Link
                      to={`/unidades/${u.slug}`}
                      className="group flex min-h-[72px] items-center justify-between gap-4 border border-[#DDE3E9] bg-white px-5 py-4 transition-colors duration-200 hover:border-[#102F46]"
                    >
                      <span>
                        <span className="block font-display text-[1.25rem] uppercase leading-none text-[#102F46]">
                          {u.nome}
                        </span>
                        <span className="mt-1 block text-[0.8125rem] text-[#5F6B76]">
                          {u.cidade} — {u.estado}
                        </span>
                      </span>
                      <ArrowRight
                        size={18}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="shrink-0 text-[#E53E55] transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Revelar>
          </div>
        </section>
      )}
    </>
  );
}
