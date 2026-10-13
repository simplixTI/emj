import { contato } from '@/data/conteudo';

/**
 * Monta um link wa.me com mensagem pré-preenchida.
 * Centralizado para que todo CTA de WhatsApp fale a mesma língua.
 */
export function linkWhatsApp(mensagem: string, numero: string = contato.telefoneDigits): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
}

export const MSG_AULA_EXPERIMENTAL =
  'Olá! Vim pelo site e gostaria de agendar uma aula experimental para meu filho(a).';

export const MSG_CAMP =
  'Olá! Vim pelo site e quero saber mais sobre a próxima edição do Camp Maestro Júnior.';

export function msgUnidade(nome: string): string {
  return `Olá! Vim pelo site e gostaria de agendar uma aula experimental na unidade ${nome}.`;
}

/** Link do Google Maps a partir de uma busca textual — nunca um pin inventado. */
export function linkMapa(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/** Embed do Google Maps sem necessidade de API key. */
export function embedMapa(query: string): string {
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
