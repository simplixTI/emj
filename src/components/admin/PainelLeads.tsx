import { useEffect, useMemo, useState } from 'react';
import { Download, MessageCircle, Phone, RefreshCw } from 'lucide-react';
import {
  atualizarLead,
  listarLeadsAula,
  listarLeadsCamp,
  type LeadAula,
  type LeadCamp,
} from '@/lib/admin';

const SITUACOES: { valor: LeadAula['situacao']; rotulo: string; cor: string }[] = [
  { valor: 'novo', rotulo: 'Novo', cor: 'bg-[#E53E55] text-white' },
  { valor: 'contatado', rotulo: 'Contatado', cor: 'bg-[#1B4463] text-white' },
  { valor: 'agendado', rotulo: 'Agendado', cor: 'bg-[#2A5A7E] text-white' },
  { valor: 'matriculado', rotulo: 'Matriculado', cor: 'bg-[#1E7A4B] text-white' },
  { valor: 'perdido', rotulo: 'Perdido', cor: 'bg-[#DDE3E9] text-[#5F6B76]' },
];

function dataBr(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function soDigitos(v: string) {
  const d = v.replace(/\D/g, '');
  return d.startsWith('55') ? d : `55${d}`;
}

/** Exporta para CSV com BOM, senão o Excel brasileiro quebra os acentos. */
function baixarCsv(nome: string, linhas: readonly object[]) {
  if (!linhas.length) return;
  const colunas = Object.keys(linhas[0] as Record<string, unknown>);
  const escapar = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const csv = [
    colunas.join(';'),
    ...linhas.map((l) =>
      colunas.map((c) => escapar((l as Record<string, unknown>)[c])).join(';'),
    ),
  ].join('\n');

  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${nome}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function PainelLeads({ tipo }: { tipo: 'aula' | 'camp' }) {
  const [leads, setLeads] = useState<(LeadAula | LeadCamp)[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [filtro, setFiltro] = useState<string>('todos');

  async function carregar() {
    setCarregando(true);
    setErro('');
    try {
      const dados = tipo === 'aula' ? await listarLeadsAula() : await listarLeadsCamp();
      setLeads(dados);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipo]);

  const visiveis = useMemo(() => {
    if (tipo !== 'aula' || filtro === 'todos') return leads;
    return (leads as LeadAula[]).filter((l) => l.situacao === filtro);
  }, [leads, filtro, tipo]);

  async function mudarSituacao(id: string, situacao: LeadAula['situacao']) {
    // Otimista: a lista responde na hora; se falhar, recarregamos do servidor.
    setLeads((atual) =>
      atual.map((l) => (l.id === id ? ({ ...l, situacao } as LeadAula) : l)),
    );
    try {
      await atualizarLead(id, { situacao });
    } catch (e) {
      setErro((e as Error).message);
      carregar();
    }
  }

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[2rem] uppercase leading-none text-[#102F46]">
            {tipo === 'aula' ? 'Aulas experimentais' : 'Interesse no Camp'}
          </h1>
          <p className="mt-2 text-[0.9375rem] text-[#5F6B76]">
            <span className="tabular font-medium text-[#102F46]">{visiveis.length}</span>{' '}
            {visiveis.length === 1 ? 'cadastro' : 'cadastros'}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={carregar}
            className="flex min-h-[44px] cursor-pointer items-center gap-2 border border-[#DDE3E9] bg-white px-4 font-display text-[0.875rem] uppercase tracking-[0.05em] text-[#102F46] transition-colors hover:border-[#102F46]"
          >
            <RefreshCw size={16} strokeWidth={1.75} aria-hidden="true" />
            Atualizar
          </button>
          <button
            type="button"
            onClick={() => baixarCsv(tipo === 'aula' ? 'leads-aula' : 'leads-camp', visiveis)}
            disabled={!visiveis.length}
            className="flex min-h-[44px] cursor-pointer items-center gap-2 border border-[#DDE3E9] bg-white px-4 font-display text-[0.875rem] uppercase tracking-[0.05em] text-[#102F46] transition-colors hover:border-[#102F46] disabled:opacity-40"
          >
            <Download size={16} strokeWidth={1.75} aria-hidden="true" />
            Exportar
          </button>
        </div>
      </div>

      {tipo === 'aula' && (
        <div className="mt-6 flex flex-wrap gap-2">
          {[{ valor: 'todos', rotulo: 'Todos' }, ...SITUACOES].map((s) => (
            <button
              key={s.valor}
              type="button"
              onClick={() => setFiltro(s.valor)}
              aria-pressed={filtro === s.valor}
              className={`min-h-[40px] cursor-pointer border px-4 font-display text-[0.8125rem] uppercase tracking-[0.05em] transition-colors ${
                filtro === s.valor
                  ? 'border-[#102F46] bg-[#102F46] text-white'
                  : 'border-[#DDE3E9] bg-white text-[#5F6B76] hover:border-[#102F46]'
              }`}
            >
              {s.rotulo}
            </button>
          ))}
        </div>
      )}

      {erro && (
        <p role="alert" className="mt-6 border border-[#C72F44] bg-[#C72F44]/[0.05] p-4 text-[0.875rem] text-[#C72F44]">
          {erro}
        </p>
      )}

      {carregando ? (
        <p className="mt-10 text-[#5F6B76]">Carregando…</p>
      ) : !visiveis.length ? (
        <div className="mt-10 border border-dashed border-[#DDE3E9] bg-white p-12 text-center">
          <p className="font-display text-[1.25rem] uppercase text-[#102F46]">
            Nenhum cadastro por aqui
          </p>
          <p className="mt-2 text-[#5F6B76]">
            {filtro !== 'todos'
              ? 'Nenhum lead nesta situação. Experimente outro filtro.'
              : 'Assim que alguém preencher o formulário no site, aparece aqui.'}
          </p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {visiveis.map((lead) => {
            const aula = tipo === 'aula' ? (lead as LeadAula) : null;
            return (
              <li key={lead.id} className="border border-[#DDE3E9] bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="font-display text-[1.375rem] uppercase leading-none text-[#102F46]">
                      {lead.nome_crianca}
                      <span className="tabular ml-2 text-[1rem] text-[#5F6B76]">
                        {lead.idade_crianca} anos
                      </span>
                    </h2>
                    <p className="mt-1.5 text-[0.9375rem] text-[#5F6B76]">
                      Responsável: {lead.nome_responsavel}
                      {aula?.unidade_interesse && ` · Unidade: ${aula.unidade_interesse}`}
                    </p>
                  </div>
                  <span className="tabular shrink-0 text-[0.8125rem] text-[#5F6B76]">
                    {dataBr(lead.criado_em)}
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/${soDigitos(lead.telefone)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-[40px] items-center gap-2 border border-[#DDE3E9] px-3 text-[0.875rem] text-[#102F46] transition-colors hover:border-[#25D366] hover:text-[#1A9E4B]"
                  >
                    <MessageCircle size={15} strokeWidth={1.75} aria-hidden="true" />
                    <span className="tabular">{lead.telefone}</span>
                  </a>
                  <a
                    href={`tel:${lead.telefone.replace(/\D/g, '')}`}
                    className="flex min-h-[40px] items-center gap-2 border border-[#DDE3E9] px-3 text-[0.875rem] text-[#102F46] transition-colors hover:border-[#102F46]"
                  >
                    <Phone size={15} strokeWidth={1.75} aria-hidden="true" />
                    Ligar
                  </a>
                  {!lead.email.endsWith('@whatsapp.local') && (
                    <a
                      href={`mailto:${lead.email}`}
                      className="flex min-h-[40px] items-center border border-[#DDE3E9] px-3 text-[0.875rem] text-[#102F46] transition-colors hover:border-[#102F46]"
                    >
                      {lead.email}
                    </a>
                  )}
                </div>

                {lead.mensagem && (
                  <p className="mt-4 border-t border-[#DDE3E9] pt-4 text-[0.9375rem] leading-relaxed text-[#5F6B76]">
                    “{lead.mensagem}”
                  </p>
                )}

                {aula && (
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#DDE3E9] pt-4">
                    <span className="font-display text-[0.75rem] uppercase tracking-[0.12em] text-[#5F6B76]">
                      Situação
                    </span>
                    {SITUACOES.map((s) => (
                      <button
                        key={s.valor}
                        type="button"
                        onClick={() => mudarSituacao(aula.id, s.valor)}
                        aria-pressed={aula.situacao === s.valor}
                        className={`min-h-[36px] cursor-pointer px-3 font-display text-[0.75rem] uppercase tracking-[0.06em] transition-opacity ${
                          aula.situacao === s.valor
                            ? s.cor
                            : 'bg-[#F3F5F7] text-[#5F6B76] hover:opacity-70'
                        }`}
                      >
                        {s.rotulo}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
