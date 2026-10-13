import { Instagram as InstagramIcon, ArrowUpRight } from 'lucide-react';
import { Revelar } from '@/components/ui/Revelar';
import { BotaoExterno } from '@/components/ui/Botao';
import { Aviso } from '@/components/ui/Aviso';
import { contato } from '@/data/conteudo';
import { destaquesSociais } from '@/data/imagens';

/**
 * Área social.
 *
 * A API do Instagram exige token de longa duração gerado pela própria conta —
 * algo que a escola precisa autorizar. Enquanto isso não existe, esta seção é
 * uma grade curada e administrável (as imagens vêm do admin), e não um embed
 * quebrado nem um print falso de feed.
 *
 * Quando a escola autorizar, basta trocar a origem das imagens pelo retorno
 * da Instagram Basic Display API — o layout não muda.
 */
export function Instagram() {
  const posts = destaquesSociais.slice(0, 6);

  return (
    <section className="bg-[#F3F5F7] py-20 md:py-28">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Revelar>
            <h2 className="display-md font-display text-[#102F46]">
              Acompanhe o dia a dia
            </h2>
            <a
              href={contato.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-[#5F6B76] transition-colors hover:text-[#E53E55]"
            >
              <InstagramIcon size={18} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-medium">{contato.instagramHandle}</span>
            </a>
          </Revelar>

          <Revelar atraso={0.08}>
            <BotaoExterno
              href={contato.instagram}
              variante="secundarioClaro"
              icone={<ArrowUpRight size={18} strokeWidth={2} aria-hidden="true" />}
            >
              Seguir no Instagram
            </BotaoExterno>
          </Revelar>
        </div>

        <Revelar atraso={0.1}>
          <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {posts.map((post) => (
              <li key={post.key}>
                <a
                  href={contato.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block aspect-square overflow-hidden bg-[#102F46]"
                  aria-label={`Ver no Instagram — ${post.alt}`}
                >
                  <picture>
                    {post.webp && <source srcSet={post.webp} type="image/webp" />}
                    <img
                      src={post.src}
                      alt={post.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      data-imagem={post.key}
                    />
                  </picture>
                  <span
                    className="absolute inset-0 flex items-center justify-center bg-[#102F46]/0 text-white opacity-0 transition-all duration-300 group-hover:bg-[#102F46]/55 group-hover:opacity-100"
                    aria-hidden="true"
                  >
                    <InstagramIcon size={26} strokeWidth={1.5} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </Revelar>

        <Revelar atraso={0.14}>
          <div className="mt-7">
            <Aviso procedencia="a_validar">
              A integração com o feed ao vivo do Instagram depende de uma autorização da conta
              oficial da escola. Até lá, estas são fotos reais selecionadas pela escola e curadas
              pelo painel administrativo.
            </Aviso>
          </div>
        </Revelar>
      </div>
    </section>
  );
}
