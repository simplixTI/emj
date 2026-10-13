import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Home from '@/pages/Home';

/**
 * A Home carrega de forma síncrona (é a entrada de quase todo o tráfego,
 * vindo do Instagram). As demais páginas entram por code-splitting.
 */
const Metodologia = lazy(() => import('@/pages/Metodologia'));
const Unidades = lazy(() => import('@/pages/Unidades'));
const UnidadeDetalhe = lazy(() => import('@/pages/UnidadeDetalhe'));
const Camp = lazy(() => import('@/pages/Camp'));
const ProjetosSociais = lazy(() => import('@/pages/ProjetosSociais'));
const Contato = lazy(() => import('@/pages/Contato'));
const Privacidade = lazy(() => import('@/pages/Privacidade'));
const NaoEncontrada = lazy(() => import('@/pages/NaoEncontrada'));

/** O painel vive fora do layout público: sem menu, sem rodapé, sem WhatsApp. */
const Admin = lazy(() => import('@/pages/Admin'));

/** Placeholder de rota. Navy para não piscar branco entre páginas escuras. */
function Carregando() {
  return (
    <div
      className="flex min-h-[60svh] items-center justify-center bg-[#102F46]"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Carregando página</span>
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-white/25 border-t-[#E53E55]" />
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="admin"
          element={
            <Suspense fallback={<Carregando />}>
              <Admin />
            </Suspense>
          }
        />

        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="metodologia"
            element={
              <Suspense fallback={<Carregando />}>
                <Metodologia />
              </Suspense>
            }
          />
          <Route
            path="unidades"
            element={
              <Suspense fallback={<Carregando />}>
                <Unidades />
              </Suspense>
            }
          />
          <Route
            path="unidades/:slug"
            element={
              <Suspense fallback={<Carregando />}>
                <UnidadeDetalhe />
              </Suspense>
            }
          />
          <Route
            path="camp"
            element={
              <Suspense fallback={<Carregando />}>
                <Camp />
              </Suspense>
            }
          />
          <Route
            path="projetos-sociais"
            element={
              <Suspense fallback={<Carregando />}>
                <ProjetosSociais />
              </Suspense>
            }
          />
          <Route
            path="contato"
            element={
              <Suspense fallback={<Carregando />}>
                <Contato />
              </Suspense>
            }
          />
          <Route
            path="privacidade"
            element={
              <Suspense fallback={<Carregando />}>
                <Privacidade />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={<Carregando />}>
                <NaoEncontrada />
              </Suspense>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
