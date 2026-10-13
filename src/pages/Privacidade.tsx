import { CabecalhoPagina } from '@/components/ui/CabecalhoPagina';
import { Aviso } from '@/components/ui/Aviso';
import { contato } from '@/data/conteudo';
import { useSeo } from '@/lib/seo';

/**
 * Política de privacidade com foco em dados de criança.
 *
 * O site coleta nome e idade de menores — o que, pela LGPD (art. 14), exige
 * consentimento específico e destacado do responsável legal e tratamento no
 * melhor interesse da criança. Esta página precisa de revisão jurídica antes
 * da publicação.
 */

const SECOES = [
  {
    titulo: 'Quem somos',
    conteudo: [
      `A Escola de Futebol Maestro Júnior é a controladora dos dados pessoais coletados neste site. Para qualquer assunto relacionado a dados pessoais, o contato é ${contato.email} ou ${contato.telefone}.`,
    ],
  },
  {
    titulo: 'Quais dados coletamos',
    conteudo: [
      'Coletamos apenas o que você digita nos formulários do site: nome do responsável, nome e idade da criança, telefone, e-mail, unidade de interesse e a mensagem que você escrever.',
      'Não usamos cookies de rastreamento publicitário nem vendemos ou compartilhamos dados com terceiros para fins de marketing.',
    ],
  },
  {
    titulo: 'Dados de crianças e adolescentes',
    destaque: true,
    conteudo: [
      'Este site coleta o nome e a idade de crianças. Conforme o artigo 14 da Lei Geral de Proteção de Dados (Lei 13.709/2018), esses dados só são tratados com o consentimento específico e destacado dado por ao menos um dos pais ou pelo responsável legal — é exatamente o que a caixa de autorização nos formulários representa.',
      'Os dados da criança são usados somente para agendar a aula experimental ou a participação no Camp e para o contato relacionado a isso. Não são usados para publicidade, não são repassados a terceiros e não são utilizados para criar perfis.',
      'Fotos e vídeos de alunos só são publicados mediante autorização de uso de imagem assinada pelo responsável, obtida separadamente desta política.',
    ],
  },
  {
    titulo: 'Para que usamos',
    conteudo: [
      'Para entrar em contato sobre a aula experimental solicitada, responder sua mensagem, informar sobre as edições do Camp Maestro Júnior quando você pedir, e organizar internamente as matrículas.',
    ],
  },
  {
    titulo: 'Por quanto tempo guardamos',
    conteudo: [
      'Mantemos os dados enquanto durar o atendimento e o vínculo com a escola. Se não houver matrícula, os dados de contato são eliminados em até 24 meses, salvo obrigação legal de guarda.',
    ],
  },
  {
    titulo: 'Seus direitos',
    conteudo: [
      'Você pode, a qualquer momento, pedir confirmação de tratamento, acesso, correção, anonimização, portabilidade ou eliminação dos dados, bem como revogar o consentimento dado. Basta escrever para o contato indicado acima; respondemos em até 15 dias.',
    ],
  },
  {
    titulo: 'Segurança',
    conteudo: [
      'Os dados são armazenados em servidores com acesso restrito e criptografia em trânsito. As informações enviadas pelos formulários não podem ser lidas publicamente: apenas a equipe autorizada da escola tem acesso, por meio de login próprio.',
    ],
  },
];

export default function Privacidade() {
  useSeo({
    titulo: 'Política de Privacidade — Escola de Futebol Maestro Júnior',
    descricao:
      'Como a Escola de Futebol Maestro Júnior trata os dados pessoais de responsáveis e crianças, conforme a LGPD.',
    caminho: '/privacidade',
  });

  return (
    <>
      <CabecalhoPagina
        titulo="Política de Privacidade"
        descricao="Como tratamos os dados de responsáveis e de crianças, conforme a LGPD."
      />

      <section className="bg-white py-16 md:py-24">
        <div className="shell">
          <div className="mx-auto max-w-3xl">
            <Aviso procedencia="provisorio">
              Esta política foi redigida como base técnica para o novo site e precisa de revisão
              jurídica antes da publicação definitiva, especialmente nos trechos sobre dados de
              menores e prazos de retenção.
            </Aviso>

            <div className="mt-12 space-y-12">
              {SECOES.map((secao) => (
                <section key={secao.titulo}>
                  <h2 className="display-sm font-display text-[#102F46]">{secao.titulo}</h2>
                  <div
                    className={
                      secao.destaque
                        ? 'mt-5 space-y-4 border border-[#DDE3E9] bg-[#F3F5F7] p-6'
                        : 'mt-5 space-y-4'
                    }
                  >
                    {secao.conteudo.map((p, i) => (
                      <p key={i} className="measure leading-relaxed text-[#5F6B76]">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <p className="mt-14 border-t border-[#DDE3E9] pt-6 text-[0.8125rem] text-[#5F6B76]">
              Última atualização: outubro de 2026.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
