import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { BotaoLink } from '@/components/ui/Botao';
import { EASE_REVEAL } from '@/lib/motion';

const NAV = [
  { to: '/', rotulo: 'Home' },
  { to: '/metodologia', rotulo: 'Metodologia' },
  { to: '/unidades', rotulo: 'Unidades' },
  { to: '/camp', rotulo: 'Camp' },
  { to: '/projetos-sociais', rotulo: 'Projetos Sociais' },
  { to: '/contato', rotulo: 'Contato' },
];

/**
 * Cabeçalho fixo com dois estados.
 *
 * NO TOPO, sobre o hero escuro: transparente, texto branco. A imagem respira.
 *
 * AO ROLAR: branco sólido, texto navy. Nada de navy translúcido — o site
 * alterna seções claras e escuras, e uma barra semitransparente fica
 * ilegível sobre as claras. Sólido é o único estado que funciona sobre as
 * duas, e ainda dá contraste de sobra para o CTA vermelho.
 */
export function Header() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 24);
    aoRolar();
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, []);

  useEffect(() => setAberto(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = aberto ? 'hidden' : '';
    const aoTeclar = (e: KeyboardEvent) => e.key === 'Escape' && setAberto(false);
    window.addEventListener('keydown', aoTeclar);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', aoTeclar);
    };
  }, [aberto]);

  const solido = rolou;

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[#E53E55] focus:px-5 focus:py-3 focus:font-display focus:uppercase focus:text-white"
      >
        Pular para o conteúdo
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ease-out ${
          solido
            ? 'border-b border-[#DDE3E9] bg-white shadow-[0_1px_16px_-6px_rgba(16,47,70,0.25)]'
            : 'on-navy border-b border-transparent bg-transparent'
        }`}
      >
        <div className="shell flex items-center justify-between gap-6 py-3.5">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-3"
            aria-label="Escola de Futebol Maestro Júnior — ir para a home"
          >
            <img
              src="/logo.png"
              alt=""
              width={48}
              height={48}
              className="h-11 w-11 object-contain md:h-12 md:w-12"
            />
            <span
              className={`hidden font-display text-[0.9375rem] uppercase leading-[1.05] tracking-[0.02em] transition-colors duration-300 sm:block ${
                solido ? 'text-[#102F46]' : 'text-white'
              }`}
            >
              Escola de Futebol
              <br />
              <span className={solido ? 'text-[#5F6B76]' : 'text-[#A8C0D4]'}>Maestro Júnior</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `relative py-2 font-display text-[0.9375rem] uppercase tracking-[0.05em] transition-colors duration-200 ${
                    isActive
                      ? solido
                        ? 'text-[#102F46]'
                        : 'text-white'
                      : solido
                        ? 'text-[#5F6B76] hover:text-[#102F46]'
                        : 'text-[#A8C0D4] hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.rotulo}
                    {isActive && (
                      <motion.span
                        layoutId="nav-ativo"
                        className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#E53E55]"
                        transition={{ duration: 0.35, ease: EASE_REVEAL }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <BotaoLink
              to="/contato"
              className="hidden !min-h-[46px] !px-5 !text-[0.875rem] md:inline-flex"
            >
              Agende uma aula experimental
            </BotaoLink>

            <button
              type="button"
              onClick={() => setAberto((v) => !v)}
              aria-expanded={aberto}
              aria-controls="menu-mobile"
              aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
              className={`flex h-12 w-12 items-center justify-center transition-colors hover:text-[#E53E55] lg:hidden ${
                solido ? 'text-[#102F46]' : 'text-white'
              }`}
            >
              {aberto ? <X size={26} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {aberto && (
          <motion.div
            id="menu-mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="on-navy fixed inset-0 z-40 flex flex-col bg-[#102F46] pt-20 lg:hidden"
          >
            <nav className="shell flex flex-1 flex-col justify-center gap-1" aria-label="Navegação">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + i * 0.045, duration: 0.4, ease: EASE_REVEAL }}
                >
                  <NavLink
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `block border-b border-white/10 py-4 font-display text-[2rem] uppercase leading-none tracking-[-0.01em] transition-colors ${
                        isActive ? 'text-[#E53E55]' : 'text-white'
                      }`
                    }
                  >
                    {item.rotulo}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.34, duration: 0.4, ease: EASE_REVEAL }}
              className="shell pb-10 pt-6"
            >
              <BotaoLink to="/contato" className="w-full">
                Agende uma aula experimental
              </BotaoLink>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
