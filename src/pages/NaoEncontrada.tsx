import { BotaoLink } from '@/components/ui/Botao';
import { LinhasCampo } from '@/components/ui/LinhasCampo';
import { useSeo } from '@/lib/seo';

export default function NaoEncontrada() {
  useSeo({
    titulo: 'Página não encontrada — Escola de Futebol Maestro Júnior',
    descricao: 'A página que você procura não existe ou foi movida.',
    caminho: '/404',
  });

  return (
    <section className="on-navy relative flex min-h-[90svh] items-center overflow-hidden bg-[#102F46]">
      <LinhasCampo cor="#FFFFFF" opacidade={0.1} />
      <div className="shell relative z-10 py-28 text-center">
        <p className="tabular font-display text-[7rem] leading-none text-[#E53E55] md:text-[11rem]">
          404
        </p>
        <h1 className="display-md mx-auto mt-4 max-w-[18ch] font-display text-white">
          Essa bola saiu pela linha de fundo
        </h1>
        <p className="mx-auto mt-6 max-w-[46ch] leading-relaxed text-[#A8C0D4]">
          A página que você procura não existe ou mudou de endereço. Vamos recomeçar do meio de
          campo.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <BotaoLink to="/">Voltar para a home</BotaoLink>
          <BotaoLink to="/unidades" variante="secundario">
            Ver as unidades
          </BotaoLink>
        </div>
      </div>
    </section>
  );
}
