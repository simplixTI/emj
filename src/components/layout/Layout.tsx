import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppFlutuante } from './WhatsAppFlutuante';

/** Rola para o topo a cada navegação — exceto quando a URL traz uma âncora. */
function RolarAoTopo() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const alvo = document.querySelector(hash);
      if (alvo) {
        alvo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname, hash]);

  return null;
}

export function Layout() {
  return (
    <>
      <RolarAoTopo />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFlutuante />
    </>
  );
}
