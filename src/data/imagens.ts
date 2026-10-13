/**
 * REGISTRO CENTRAL DE IMAGENS
 *
 * A maior parte do site usa FOTOS REAIS da escola, fornecidas pela própria
 * instituição: o Camp Maestro Júnior no Le Canton, com o Júnior em campo, as
 * crianças uniformizadas, as medalhas e o castelo do resort ao fundo.
 *
 * Só restam provisórias (banco de imagens) as 4 fotos das UNIDADES, para as
 * quais a escola ainda não enviou material. Estão marcadas com
 * `provisoria: true` e aparecem no /admin para troca.
 *
 * ⚠️ REGRA DE OURO: nenhuma imagem entra aqui sem ter sido ABERTA e olhada.
 * Responder HTTP 200 não diz nada sobre o que a foto mostra. Uma primeira
 * seleção foi feita só por URL e colocou uma tenista na Metodologia, um
 * estádio de críquete em Fortaleza e uma mulher na academia em Guaratiba.
 * Toda imagem abaixo foi inspecionada visualmente.
 *
 * As fotos reais foram reencodadas para no máximo 1600px, em JPEG e WebP.
 * Os originais ficam em /.orig (fora do build).
 *
 * Conferência visual completa: 13/10/2026.
 */

export interface Imagem {
  /** Chave estável. É por ela que o admin faz a troca. */
  readonly key: string;
  readonly src: string;
  /** Versão WebP, servida por <picture> quando existe. */
  readonly webp?: string;
  /** Texto alternativo descritivo — acessibilidade, não palavra-chave. */
  readonly alt: string;
  readonly provisoria: boolean;
  /** Ponto focal, para o recorte não cortar rostos. */
  readonly focus?: string;
}

/** Foto real da escola (JPEG + WebP no /public). */
const real = (
  arquivo: string,
  key: string,
  alt: string,
  focus?: string,
): Imagem => ({
  key,
  src: `/${arquivo}.jpg`,
  webp: `/${arquivo}.webp`,
  alt,
  provisoria: false,
  focus,
});

/** Imagem de banco, provisória até a escola enviar a real. */
const banco = (id: string, key: string, alt: string, w = 1400, focus?: string): Imagem => ({
  key,
  src: `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=78`,
  alt,
  provisoria: true,
  focus,
});

export const imagens = {
  /** Grupo do Camp com os braços erguidos, Júnior ao fundo. Foto real. */
  heroHome: real(
    'camp-07',
    'hero-home',
    'Crianças e professores do Camp Maestro Júnior com os braços erguidos em campo',
    '50% 42%',
  ),

  /** Maestro Júnior com dois alunos uniformizados. Foto real. */
  nossaEscola: real(
    'F1',
    'nossa-escola',
    'Maestro Júnior em campo com dois alunos da escola, uniformizados, durante uma atividade',
    '50% 35%',
  ),

  /** Júnior dominando a bola diante das crianças. Foto real. */
  nossaEscolaDetalhe: real(
    'camp-05',
    'nossa-escola-detalhe',
    'Maestro Júnior dominando a bola enquanto as crianças observam',
    '50% 35%',
  ),

  /** Time do Camp reunido com Júnior, castelo do Le Canton ao fundo. Foto real. */
  pilares: real(
    'camp-01',
    'pilares',
    'Turma do Camp Maestro Júnior reunida com o Júnior, no campo do Le Canton',
    '50% 45%',
  ),

  /** Júnior orientando um grupo de alunos antes do treino. Foto real. */
  metodologia: real(
    'camp-09',
    'metodologia',
    'Maestro Júnior orientando um grupo de alunos antes do treino',
    '50% 45%',
  ),

  /** Quatro crianças pequenas atrás da placa do Camp. Foto real. */
  metodologiaFaixas: real(
    'camp-12',
    'metodologia-faixas',
    'Quatro crianças pequenas abraçadas atrás da placa do Camp Maestro Júnior',
    '50% 35%',
  ),

  /** Júnior em campo junto com os pais dos alunos. Foto real. */
  metodologiaProfessores: real(
    'camp-10',
    'metodologia-professores',
    'Maestro Júnior caminhando em campo ao lado dos pais dos alunos',
    '50% 40%',
  ),

  /** Vista ampla do campo do Le Canton, com o castelo e a serra. Foto real. */
  campHero: real(
    'camp-06',
    'camp-hero',
    'Turma do Camp no campo do Le Canton, com o castelo e a serra de Teresópolis ao fundo',
    '50% 45%',
  ),

  /** Júnior de camisa do Camp em campo. Foto real. */
  campExperiencia: real(
    'camp-04',
    'camp-experiencia',
    'Maestro Júnior em campo com a camisa do Camp, ao lado dos banners do evento',
    '50% 40%',
  ),

  /** Júnior jogando com crianças e pais. Foto real. */
  ctaFinal: real(
    'camp-08',
    'cta-final',
    'Maestro Júnior jogando com crianças e pais durante o Camp',
    '50% 42%',
  ),

  /** Placa do Camp no gramado do Le Canton. Foto real. */
  contato: real(
    'camp-02',
    'contato',
    'Placa do Camp Maestro Júnior no gramado do Le Canton',
    '50% 45%',
  ),

  /**
   * Foto real do projeto social em comunidade do Rio, enviada pela escola.
   * Dá para ver os coletes da escola com a marca da Light, patrocinadora.
   */
  projetosSociais: real(
    'projetosocial',
    'projetos-sociais',
    'Crianças do projeto social da Escola Maestro Júnior reunidas na quadra da comunidade, à noite',
    '50% 58%',
  ),
} as const satisfies Record<string, Imagem>;

/**
 * ⚠️ TODAS PROVISÓRIAS. A escola não enviou fotos das unidades.
 * São imagens de banco, conferidas visualmente (futebol de base), apenas para
 * o site não nascer com buracos. Trocar pelo /admin.
 */
export const imagensUnidades: Record<string, Imagem> = {
  'barra-da-tijuca': banco(
    '1600077063877-22118d6290eb',
    'unidade-barra-da-tijuca',
    'Crianças em treino de futebol — imagem provisória da unidade Barra da Tijuca',
    1200,
    '50% 45%',
  ),
  jacarepagua: banco(
    '1622659097509-4d56de14539e',
    'unidade-jacarepagua',
    'Crianças disputando a bola — imagem provisória da unidade Jacarepaguá',
    1200,
    '50% 45%',
  ),
  'ilha-de-guaratiba': banco(
    '1630552227424-81c9e52d7c83',
    'unidade-ilha-de-guaratiba',
    'Goleiro jovem em defesa — imagem provisória da unidade Ilha de Guaratiba',
    1200,
    '50% 45%',
  ),
  fortaleza: banco(
    '1598880513655-d1c6d4b2dfbf',
    'unidade-fortaleza',
    'Crianças correndo atrás da bola — imagem provisória da unidade Fortaleza',
    1200,
    '50% 42%',
  ),
};

/** Galeria do Camp — todas fotos reais das edições no Le Canton. */
export const galeriaCamp: Imagem[] = [
  real('camp-07', 'camp-galeria-1', 'Participantes do Camp comemorando com os braços erguidos'),
  real('camp-11', 'camp-galeria-2', 'Medalhas e camisa oficial do Camp Maestro Júnior'),
  real('camp-12', 'camp-galeria-3', 'Crianças posando atrás da placa do Camp'),
  real('camp-01', 'camp-galeria-4', 'Turma do Camp reunida com o Maestro Júnior'),
  real('camp-08', 'camp-galeria-5', 'Partida entre pais e filhos durante o Camp'),
  real('camp-13', 'camp-galeria-6', 'Medalhas do Camp Maestro Júnior entregues aos participantes'),
];

/** Publicações em destaque na área social da Home. Fotos reais. */
export const destaquesSociais: Imagem[] = [
  real('camp-02', 'social-1', 'Placa do Camp Maestro Júnior no gramado'),
  real('camp-03', 'social-2', 'Arte oficial da Escola de Futebol Maestro Júnior'),
  real('camp-09', 'social-3', 'Júnior orientando os alunos no Camp'),
  real('camp-10', 'social-4', 'Júnior em campo com os pais dos alunos'),
  real('camp-11', 'social-5', 'Medalhas do Camp'),
  real('camp-13', 'social-6', 'Medalhas entregues aos participantes do Camp'),
];

/** Usado pelo /admin para listar o que ainda falta de foto real. */
export function imagensProvisorias(): string[] {
  return [...Object.values(imagens), ...Object.values(imagensUnidades), ...galeriaCamp]
    .filter((i) => i.provisoria)
    .map((i) => i.key);
}
