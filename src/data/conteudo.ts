import type { Depoimento, EdicaoCamp, Pilar } from '@/types';

/* ------------------------------------------------------------------ *
 * CONTATOS — todos verificados em fonte pública (docs/PESQUISA.md §1)
 * ------------------------------------------------------------------ */
export const contato = {
  telefone: '(21) 99504-4848',
  telefoneDigits: '5521995044848',
  telefoneSecundario: '(21) 97958-9988',
  /** Confirmado pela escola em 13/10/2026. */
  email: 'rodrigo@escolamaestrojunior.com',
  instagram: 'https://www.instagram.com/escolamaestrojunior/',
  instagramHandle: '@escolamaestrojunior',
  facebook: 'https://www.facebook.com/escolamaestrojunior/',
  fundacao: 2017,
} as const;

/* ------------------------------------------------------------------ *
 * TEXTO INSTITUCIONAL — transcrito do site oficial de 2019.
 * É a voz real da escola. Não reescrevemos: citamos.
 * ------------------------------------------------------------------ */
export const institucional = {
  /** Citação do próprio Júnior, publicada no site da escola. */
  epigrafe: {
    texto:
      'O esporte junto à cultura, completa os verdadeiros alicerces de uma formação moral, física e até mesmo social.',
    autor: 'Leovegildo Lins Gama Júnior',
    procedencia: 'verificado' as const,
  },

  /** Parágrafos literais do site de 2019. */
  missao:
    'A Escola Maestro Junior é um projeto centrado no objetivo de incluir socialmente, crianças e jovens através da prática do esporte.',

  formacao:
    'A prática do esporte de forma disciplinada e aliada à imagem do ídolo alcança excelentes resultados, tanto nos aspectos teóricos, táticos e técnicos como também no que diz respeito à formação do caráter dos jovens socialmente, fisicamente e emocionalmente.',

  idolo:
    'À frente do projeto temos o Maestro Leovegildo Lins Gama Júnior, incontestavelmente, um dos maiores jogadores de futebol do mundo. Com passagem pelo Flamengo, Seleção Brasileira e pela Itália, contribui com a sua experiência e vivência dentro e fora dos campos, onde é exemplo de profissionalismo e caráter.',

  procedencia: 'verificado' as const,
} as const;

/** Faixas etárias declaradas pela escola no site de 2019. */
export const faixasEtarias = ['4 a 9 anos', '10 a 13 anos', '14 a 16 anos'] as const;

/* ------------------------------------------------------------------ *
 * PILARES — proposta editorial nossa, pedida no briefing.
 * NÃO é a metodologia oficial da escola. Marcado como provisório e
 * sinalizado na interface para validação.
 * ------------------------------------------------------------------ */
export const pilares: Pilar[] = [
  {
    id: 'tecnico',
    titulo: 'Desenvolvimento técnico',
    texto:
      'Fundamentos trabalhados com paciência e repetição: domínio, passe, condução, finalização. A evolução acontece no ritmo de cada criança, não no ritmo da turma.',
    icone: 'target',
  },
  {
    id: 'humana',
    titulo: 'Formação humana',
    texto:
      'Respeito ao colega, ao professor e ao adversário. Disciplina como hábito, não como castigo. O que se aprende no campo atravessa o portão e vai junto para casa.',
    icone: 'heart',
  },
  {
    id: 'saude',
    titulo: 'Saúde e bem-estar',
    texto:
      'Movimento regular, coordenação e consciência corporal numa idade em que o corpo está se formando. O esporte como parte de uma rotina ativa, não como obrigação.',
    icone: 'activity',
  },
  {
    id: 'amizade',
    titulo: 'Diversão e amizade',
    texto:
      'Ninguém volta para um lugar onde não se diverte. As amizades formadas no treino são o motivo pelo qual as crianças pedem para vir — e a razão de ficarem.',
    icone: 'users',
  },
];

export const PILARES_PROCEDENCIA = 'provisorio' as const;

/* ------------------------------------------------------------------ *
 * CAMP MAESTRO JÚNIOR
 * ------------------------------------------------------------------ */
export const camp = {
  parceiro: 'Le Canton',
  parceiroDescricao: 'Resort Le Canton',
  cidade: 'Teresópolis',
  estado: 'RJ',
  endereco: 'Rua Antônio da Silva, 300 — Vargem Grande, Teresópolis — RJ',
  mapaQuery: 'Le Canton, Rua Antônio da Silva 300, Vargem Grande, Teresópolis, RJ',
  frequencia: 'Duas edições por ano',

  /** Formato confirmado pela página oficial do evento (Sympla, abril/2024). */
  formato: [
    {
      titulo: 'Chegada e abertura',
      texto:
        'No primeiro dia, os participantes são recebidos no resort e a cerimônia de abertura acontece no fim da tarde.',
    },
    {
      titulo: 'Treinos de campo',
      texto:
        'O segundo dia é o mais cheio: treinos pela manhã e à tarde, conduzidos com a presença do Maestro Júnior.',
    },
    {
      titulo: 'Jogo e encerramento',
      texto:
        'No terceiro dia há mais um treino, a tradicional partida entre pais e filhos e a cerimônia de encerramento.',
    },
  ],

  /** Confirmado: todo participante recebe. */
  recebe: ['Medalha', 'Certificado de participação', 'Acesso à estrutura do Le Canton'],

  procedencia: 'verificado' as const,

  /**
   * Datas e valores da próxima edição ficam VAZIOS de propósito.
   * Só entram no ar quando a escola confirmar, pelo /admin.
   */
  proximaEdicao: null as null | { periodo: string; ano: number; inscricoes: string },
} as const;

/** Edições documentadas em fonte pública. Nenhuma data futura foi presumida. */
export const edicoesCamp: EdicaoCamp[] = [
  {
    id: '2026-10',
    titulo: 'Edição Dia das Crianças',
    periodo: '9 a 12 de outubro',
    ano: 2026,
    local: 'Le Canton — Teresópolis, RJ',
    procedencia: 'verificado',
    fonte: 'O Fluminense',
  },
  {
    id: '2024-04',
    titulo: 'Edição de abril',
    periodo: '19 a 21 de abril',
    ano: 2024,
    local: 'Le Canton — Teresópolis, RJ',
    procedencia: 'verificado',
    fonte: 'Sympla',
  },
  {
    id: '2023-pascoa',
    titulo: 'Edição de Páscoa',
    periodo: 'Feriado da Semana Santa',
    ano: 2023,
    local: 'Le Canton — Teresópolis, RJ',
    procedencia: 'verificado',
    fonte: 'Sympla',
  },
];

/** Perguntas respondidas apenas com o que é confirmado. */
export const campFaq = [
  {
    p: 'Onde acontece o Camp?',
    r: 'No Le Canton, em Teresópolis, na Região Serrana do Rio de Janeiro. O endereço é Rua Antônio da Silva, 300 — Vargem Grande.',
  },
  {
    p: 'Quantas edições acontecem por ano?',
    r: 'Duas. Historicamente, uma no feriado da Páscoa e outra no período do Dia das Crianças.',
  },
  {
    p: 'Quanto tempo dura?',
    r: 'Três dias: abertura na chegada, um dia cheio de treinos e, no último dia, a partida entre pais e filhos com o encerramento.',
  },
  {
    p: 'O Júnior participa?',
    r: 'Sim. A clínica é comandada pelo próprio Maestro Júnior, presente nos treinos.',
  },
  {
    p: 'O que o participante recebe?',
    r: 'Medalha e certificado de participação, além de acesso à estrutura de lazer do Le Canton.',
  },
  {
    p: 'Qual o valor e quando abrem as inscrições?',
    r: 'O valor e as datas mudam a cada edição e são divulgados quando as inscrições abrem. Entre na lista de interesse e avisamos você primeiro.',
  },
  {
    p: 'Qual a idade mínima?',
    r: 'A faixa atendida é confirmada a cada edição. Deixe a idade da criança na lista de interesse e nossa equipe retorna com essa informação.',
  },
];

/* ------------------------------------------------------------------ *
 * PROJETOS SOCIAIS
 *
 * Informação fornecida diretamente pela escola em 13/10/2026.
 * É a fonte mais autoritativa possível — a própria instituição.
 * Mesmo assim, nenhum número de beneficiados foi incluído: a escola não
 * informou, e não vamos estimar.
 * ------------------------------------------------------------------ */
export const projetoSocial = {
  patrocinador: 'Light',
  patrocinadorPerfil: 'https://www.instagram.com/lightcomvoce/',
  patrocinadorHandle: '@lightcomvoce',
  apoio: 'Governo do Estado do Rio de Janeiro',
  inicio: 2022,

  /** Perfil próprio do projeto social, informado pela escola. */
  instagram: 'https://www.instagram.com/projetoescolamaestrojunior/',
  instagramHandle: '@projetoescolamaestrojunior',

  resumo:
    'Desde 2022, a Escola Maestro Júnior mantém escolas de futebol em comunidades do Rio de Janeiro com patrocínio da Light e apoio do Governo do Estado do Rio de Janeiro.',

  proposito:
    'A iniciativa leva esporte, cultura e novas oportunidades a crianças, adolescentes e jovens de áreas vulneráveis da cidade. Mais do que ensinar os fundamentos do futebol, o objetivo é a formação cidadã — trabalhando disciplina, respeito e solidariedade.',

  origem:
    'O projeto nasceu da própria trajetória de Leovegildo Lins da Gama Júnior. Os valores que ele levou do campo para a vida são o que a escola tenta devolver a cada criança que entra em quadra.',

  /** Unidade comunitária confirmada pela escola. */
  unidadesComunitarias: [
    {
      nome: 'Morro da Babilônia',
      bairro: 'Leme',
      cidade: 'Rio de Janeiro',
      estado: 'RJ',
      descricao:
        'Unidade da Escola de Futebol Maestro Júnior no Morro da Babilônia, no Leme, beneficiada pelo patrocínio da Light.',
    },
  ],

  pilares: [
    {
      titulo: 'Disciplina',
      texto:
        'Horário, compromisso e constância. O treino só funciona para quem aparece — e aparecer é a primeira lição.',
    },
    {
      titulo: 'Respeito',
      texto:
        'Ao colega, ao professor, ao adversário e ao árbitro. Dentro de campo e, principalmente, fora dele.',
    },
    {
      titulo: 'Solidariedade',
      texto:
        'Futebol é coletivo. A criança aprende que depende dos outros e que os outros dependem dela.',
    },
  ],

  procedencia: 'verificado' as const,
} as const;

/* ------------------------------------------------------------------ *
 * DEPOIMENTOS — reais, do site de 2019.
 * publicado: false em todos. Consentimento de 2019 não se estende
 * automaticamente a um site novo (LGPD). A escola reautoriza no /admin.
 * ------------------------------------------------------------------ */
export const depoimentos: Depoimento[] = [
  {
    id: 'daniel',
    texto:
      'Imensa alegria de ver meu filho e esses garotos dando os primeiros passos em busca de pequenos sonhos. Muito talento, dedicação dos professores e profissionalismo de toda equipe, alinhado àquele toque de Maestria nos fazem encher os olhos com essa garotada. Muito obrigado EMJ!',
    autor: 'Daniel, pai do aluno Kayke Carvalho',
    procedencia: 'a_validar',
    publicado: false,
  },
  {
    id: 'rodrigo',
    texto:
      'Gostaria de parabenizar esta escola de campeões, pelo comprometimento da gestão e da competência dos professores ao ensinar ao meu filho conceitos de socialização e comportamento dentro de um coletivo, além do aprimoramento técnico no futebol.',
    autor: 'Rodrigo, pai do aluno Rhenan Teixeira',
    procedencia: 'a_validar',
    publicado: false,
  },
  {
    id: 'carlos',
    texto:
      'Na escolinha do Maestro Júnior, meu filho Felipe, de 8 anos, aprendeu, além de jogar futebol, a importância do espírito de equipe, do respeito, da amizade, e que há dias bons e dias não tão bons. As crianças aprendem a lidar com as vitórias e com as derrotas. Considero uma excelente escola para a vida.',
    autor: 'Carlos, pai do Felipe Bitelli',
    procedencia: 'a_validar',
    publicado: false,
  },
];

export const depoimentosPublicados = depoimentos.filter((d) => d.publicado);
