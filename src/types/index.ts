/**
 * Procedência do conteúdo. Todo texto e dado do site carrega uma destas marcas,
 * para que nada provisório seja publicado como fato por descuido.
 *
 * - `verificado`  — confirmado em fonte pública citada em docs/PESQUISA.md
 * - `a_validar`   — veio de fonte pública, mas está desatualizado (ex.: 2019)
 * - `provisorio`  — texto editorial escrito por nós; precisa de aprovação
 */
export type Procedencia = 'verificado' | 'a_validar' | 'provisorio';

export interface Horario {
  /** 'seg' | 'ter' | ... — dias em que a turma acontece */
  dias: DiaSemana[];
  /** '08:00' */
  hora: string;
  /** Faixa etária da turma, como a escola publicou. Ex.: '4 a 7 anos' */
  faixa: string;
}

export type DiaSemana = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab';

export interface Unidade {
  id: string;
  /** usado na URL: /unidades/barra-da-tijuca */
  slug: string;
  nome: string;
  cidade: string;
  estado: string;
  regiao: string;
  /** Nome do clube/arena que sedia a unidade */
  local: string;
  endereco: string;
  telefones: string[];
  /** Somente dígitos, com DDI. Ex.: '5521995044848' */
  whatsapp: string | null;
  horarios: Horario[];
  /** Faixa etária agregada, calculada a partir dos horários */
  faixaEtaria: string;
  /** Consulta do Google Maps — nunca um pin inventado */
  mapaQuery: string;
  foto: string | null;
  procedencia: Procedencia;
  /** Visível no site? Unidades a validar entram ocultas até a escola confirmar. */
  publicada: boolean;
  observacao?: string;
}

export interface EdicaoCamp {
  id: string;
  titulo: string;
  periodo: string;
  ano: number;
  local: string;
  procedencia: Procedencia;
  fonte?: string;
}

export interface Depoimento {
  id: string;
  texto: string;
  autor: string;
  procedencia: Procedencia;
  /** Consentimento LGPD de 2019 não se estende a um site novo. */
  publicado: boolean;
}

export interface Pilar {
  id: string;
  titulo: string;
  texto: string;
  icone: 'target' | 'heart' | 'activity' | 'users';
}

export interface LeadAula {
  nomeResponsavel: string;
  nomeCrianca: string;
  idadeCrianca: string;
  unidadeInteresse: string;
  telefone: string;
  email: string;
  mensagem?: string;
  consentimento: boolean;
  origem: string;
}

export interface LeadCamp {
  nomeResponsavel: string;
  nomeCrianca: string;
  idadeCrianca: string;
  telefone: string;
  email: string;
  mensagem?: string;
  consentimento: boolean;
}
