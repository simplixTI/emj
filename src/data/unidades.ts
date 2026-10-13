import type { Unidade } from '@/types';

/**
 * Unidades recuperadas da página /unidades/ do site oficial da escola
 * (snapshot do Wayback Machine, 19/07/2019). São dados reais, publicados pela
 * própria escola — mas têm 7 anos.
 *
 * Por isso TODAS entram com procedencia: 'a_validar'. O site as exibe com um
 * aviso de verificação, e o /admin permite confirmar, corrigir ou desativar
 * cada uma. Nenhum endereço, telefone ou horário aqui foi inventado.
 *
 * Fonte: docs/PESQUISA.md §2
 */
export const unidades: Unidade[] = [
  {
    id: 'barra-da-tijuca',
    slug: 'barra-da-tijuca',
    nome: 'Barra da Tijuca',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    regiao: 'Rio de Janeiro',
    local: 'Clube AFBNDES',
    endereco: 'Avenida Ayrton Senna, 550 — Barra da Tijuca, Rio de Janeiro — RJ',
    telefones: ['(21) 99504-4848', '(21) 97958-9988'],
    whatsapp: '5521995044848',
    horarios: [
      { dias: ['seg', 'qua'], hora: '08:00', faixa: '13 a 15 anos' },
      { dias: ['seg', 'qua'], hora: '09:00', faixa: '8 a 12 anos' },
      { dias: ['seg', 'qua'], hora: '10:00', faixa: '4 a 7 anos' },
      { dias: ['seg', 'qua'], hora: '15:00', faixa: '4 a 7 anos' },
      { dias: ['seg', 'qua'], hora: '16:00', faixa: '8 a 12 anos' },
      { dias: ['seg', 'qua'], hora: '17:00', faixa: '13 a 15 anos' },
    ],
    faixaEtaria: '4 a 15 anos',
    mapaQuery: 'Clube AFBNDES, Avenida Ayrton Senna 550, Barra da Tijuca, Rio de Janeiro',
    foto: null,
    procedencia: 'a_validar',
    publicada: true,
    observacao:
      'O site anterior da escola destacava: "A EMJ agora está no AFBNDES na Av. Ayrton Senna, próximo à Alvorada e ao condomínio Alfa Barra."',
  },
  {
    id: 'jacarepagua',
    slug: 'jacarepagua',
    nome: 'Jacarepaguá',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    regiao: 'Rio de Janeiro',
    local: 'Clube Campestre — AEC',
    endereco: 'Rua Retiro dos Artistas, 1765 — Jacarepaguá, Rio de Janeiro — RJ',
    telefones: ['(21) 99504-4848', '(21) 97958-9988'],
    whatsapp: '5521995044848',
    horarios: [
      { dias: ['seg', 'qua', 'sex'], hora: '08:00', faixa: '15 a 17 anos' },
      { dias: ['seg', 'qua', 'sex'], hora: '09:00', faixa: '11 a 14 anos' },
      { dias: ['seg', 'qua', 'sex'], hora: '10:00', faixa: '4 a 10 anos' },
      { dias: ['seg', 'qua', 'sex'], hora: '16:00', faixa: '15 a 17 anos' },
      { dias: ['seg'], hora: '17:00', faixa: '11 a 14 anos' },
      { dias: ['qua', 'sex'], hora: '17:00', faixa: '4 a 10 anos' },
      { dias: ['seg'], hora: '18:00', faixa: '4 a 10 anos' },
      { dias: ['qua', 'sex'], hora: '18:00', faixa: '11 a 14 anos' },
    ],
    faixaEtaria: '4 a 17 anos',
    mapaQuery: 'Clube Campestre AEC, Rua Retiro dos Artistas 1765, Jacarepaguá, Rio de Janeiro',
    foto: null,
    procedencia: 'a_validar',
    publicada: true,
  },
  {
    id: 'ilha-de-guaratiba',
    slug: 'ilha-de-guaratiba',
    nome: 'Ilha de Guaratiba',
    cidade: 'Rio de Janeiro',
    estado: 'RJ',
    regiao: 'Rio de Janeiro',
    local: 'Arena R1',
    endereco: 'Estrada dos Guimarães, 365 — Ilha de Guaratiba, Rio de Janeiro — RJ',
    telefones: ['(21) 99504-4848', '(21) 97958-9988'],
    whatsapp: '5521995044848',
    horarios: [
      { dias: ['ter', 'qui'], hora: '17:00', faixa: '6 a 7 anos' },
      { dias: ['ter', 'qui'], hora: '18:00', faixa: '4 a 6 anos' },
      { dias: ['ter', 'qui'], hora: '18:00', faixa: '8 a 9 anos' },
      { dias: ['ter', 'qui'], hora: '19:00', faixa: '13 a 15 anos' },
      { dias: ['ter', 'qui'], hora: '19:00', faixa: '10 a 11 anos' },
    ],
    faixaEtaria: '4 a 15 anos',
    mapaQuery: 'Arena R1, Estrada dos Guimarães 365, Guaratiba, Rio de Janeiro',
    foto: null,
    procedencia: 'a_validar',
    publicada: true,
  },
  {
    id: 'fortaleza',
    slug: 'fortaleza',
    nome: 'Fortaleza',
    cidade: 'Fortaleza',
    estado: 'CE',
    regiao: 'Ceará',
    local: 'Coliseu Arena',
    endereco: 'Rua I, 119 — Messejana, Fortaleza — CE',
    telefones: ['(85) 98709-3898'],
    whatsapp: '5585987093898',
    horarios: [
      { dias: ['ter', 'qui'], hora: '17:00', faixa: '4 a 7 anos' },
      { dias: ['ter', 'qui'], hora: '17:00', faixa: '8 a 12 anos' },
      { dias: ['ter', 'qui'], hora: '18:00', faixa: '13 a 17 anos' },
    ],
    faixaEtaria: '4 a 17 anos',
    mapaQuery: 'Coliseu Arena, Rua I 119, Messejana, Fortaleza, Ceará',
    foto: null,
    procedencia: 'a_validar',
    publicada: true,
  },
];

export const unidadesPublicadas = unidades.filter((u) => u.publicada);

export function unidadePorSlug(slug: string): Unidade | undefined {
  return unidades.find((u) => u.slug === slug);
}

/** Regiões com pelo menos uma unidade publicada — alimenta o filtro. */
export function regioes(): string[] {
  return [...new Set(unidadesPublicadas.map((u) => u.regiao))];
}

const ORDEM_DIAS = ['seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
const NOME_DIA: Record<string, string> = {
  seg: 'Segunda',
  ter: 'Terça',
  qua: 'Quarta',
  qui: 'Quinta',
  sex: 'Sexta',
  sab: 'Sábado',
};

/** Dias distintos em que a unidade treina, em ordem de semana. */
export function diasDaUnidade(u: Unidade): string[] {
  const dias = new Set(u.horarios.flatMap((h) => h.dias));
  return ORDEM_DIAS.filter((d) => dias.has(d as never)).map((d) => NOME_DIA[d]);
}
