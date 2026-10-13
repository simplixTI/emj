import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase do site público.
 *
 * Usa SOMENTE a chave publicável (anon). Nenhuma credencial de serviço entra
 * no frontend — o service_role vive apenas nas Edge Functions.
 *
 * As políticas RLS (supabase/migrations) garantem que a chave anon pode
 * APENAS inserir leads. Ela não consegue ler lead nenhum: dados de crianças e
 * responsáveis nunca saem do servidor.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const chave = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseConfigurado = Boolean(url && chave);

export const supabase: SupabaseClient | null = supabaseConfigurado
  ? createClient(url!, chave!, { auth: { persistSession: false } })
  : null;

if (!supabaseConfigurado && import.meta.env.DEV) {
  console.warn(
    '[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY ausentes. ' +
      'Os formulários entram em modo demonstração e não gravam nada.',
  );
}
