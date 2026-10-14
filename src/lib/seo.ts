import { useEffect } from 'react';

interface SeoProps {
  titulo: string;
  descricao: string;
  caminho: string;
  imagem?: string;
}

const BASE = 'https://www.escolamaestrojunior.com.br';

function meta(seletor: string, atributo: string, valor: string) {
  let el = document.head.querySelector<HTMLMetaElement>(seletor);
  if (!el) {
    el = document.createElement('meta');
    const [chave, nome] = seletor.includes('property')
      ? ['property', seletor.match(/"(.*?)"/)?.[1] ?? '']
      : ['name', seletor.match(/"(.*?)"/)?.[1] ?? ''];
    el.setAttribute(chave, nome);
    document.head.appendChild(el);
  }
  el.setAttribute(atributo, valor);
}

/**
 * SEO por página. Sem dependência extra: a aplicação é pequena e um
 * helper de ~40 linhas evita carregar uma lib inteira no bundle.
 */
export function useSeo({ titulo, descricao, caminho, imagem }: SeoProps) {
  useEffect(() => {
    const url = `${BASE}${caminho}`;
    const og = imagem ?? `${BASE}/og-image.jpg`;

    document.title = titulo;
    meta('meta[name="description"]', 'content', descricao);
    meta('meta[property="og:title"]', 'content', titulo);
    meta('meta[property="og:description"]', 'content', descricao);
    meta('meta[property="og:url"]', 'content', url);
    meta('meta[property="og:image"]', 'content', og);
    meta('meta[name="twitter:title"]', 'content', titulo);
    meta('meta[name="twitter:description"]', 'content', descricao);
    meta('meta[name="twitter:image"]', 'content', og);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [titulo, descricao, caminho, imagem]);
}
