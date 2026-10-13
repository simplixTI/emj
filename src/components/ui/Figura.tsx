import { useState } from 'react';
import type { Imagem } from '@/data/imagens';

interface Props {
  imagem: Imagem;
  className?: string;
  /** Proporção via aspect-ratio do Tailwind. Ex.: 'aspect-[4/3]' */
  proporcao?: string;
  prioridade?: boolean;
  /** Overlay navy por cima, para texto ficar legível. 0 a 100. */
  overlay?: number;
  sizes?: string;
}

/**
 * Imagem com reserva de espaço (sem CLS), WebP quando disponível,
 * carregamento preguiçoso e transição de entrada ao decodificar.
 *
 * O fundo navy sob a imagem evita o flash branco entre a reserva e o load —
 * em telas escuras isso é visível e parece defeito.
 */
export function Figura({
  imagem,
  className = '',
  proporcao = 'aspect-[4/3]',
  prioridade = false,
  overlay = 0,
  sizes = '100vw',
}: Props) {
  const [carregada, setCarregada] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#102F46] ${proporcao} ${className}`}
      data-imagem={imagem.key}
      data-provisoria={imagem.provisoria || undefined}
    >
      <picture>
        {imagem.webp && <source srcSet={imagem.webp} type="image/webp" />}
        <img
          src={imagem.src}
          alt={imagem.alt}
          sizes={sizes}
          loading={prioridade ? 'eager' : 'lazy'}
          decoding={prioridade ? 'sync' : 'async'}
          fetchPriority={prioridade ? 'high' : 'auto'}
          onLoad={() => setCarregada(true)}
          style={{ objectPosition: imagem.focus ?? '50% 50%' }}
          className={`h-full w-full object-cover transition-opacity duration-700 ease-out ${
            carregada ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </picture>
      {overlay > 0 && (
        <div
          className="absolute inset-0 bg-[#102F46]"
          style={{ opacity: overlay / 100 }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

/**
 * Imagem de fundo que preenche o container, sem a reserva de proporção.
 * Usada nos heros, onde a altura vem da seção e não da imagem.
 */
export function FiguraFundo({
  imagem,
  prioridade = false,
  className = '',
}: {
  imagem: Imagem;
  prioridade?: boolean;
  className?: string;
}) {
  return (
    <picture className={className}>
      {imagem.webp && <source srcSet={imagem.webp} type="image/webp" />}
      <img
        src={imagem.src}
        alt={imagem.alt}
        loading={prioridade ? 'eager' : 'lazy'}
        decoding={prioridade ? 'sync' : 'async'}
        fetchPriority={prioridade ? 'high' : 'auto'}
        className="h-full w-full object-cover"
        style={{ objectPosition: imagem.focus ?? '50% 50%' }}
        data-imagem={imagem.key}
        data-provisoria={imagem.provisoria || undefined}
      />
    </picture>
  );
}
