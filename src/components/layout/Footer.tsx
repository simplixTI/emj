import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { contato } from '@/data/conteudo';
import { unidadesPublicadas } from '@/data/unidades';

const ANO = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="on-navy bg-[#0A1F2F] text-[#A8C0D4]">
      <div className="shell py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Escola de Futebol Maestro Júnior"
                width={56}
                height={56}
                className="h-14 w-14 object-contain"
              />
              <span className="font-display text-base uppercase leading-[1.05] tracking-[0.02em] text-white">
                Escola de Futebol
                <br />
                Maestro Júnior
              </span>
            </Link>
            <p className="measure mt-6 text-[0.9375rem] leading-relaxed">
              Futebol, disciplina e amizade para crianças e adolescentes. Desde{' '}
              <span className="tabular">{contato.fundacao}</span>, conduzida por Leovegildo Lins
              Gama Júnior.
            </p>

            <div className="mt-7 flex gap-3">
              <a
                href={contato.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Escola Maestro Júnior"
                className="flex h-12 w-12 items-center justify-center border border-white/15 text-white transition-colors duration-200 hover:border-[#E53E55] hover:bg-[#E53E55]"
              >
                <Instagram size={20} strokeWidth={1.5} aria-hidden="true" />
              </a>
              <a
                href={contato.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook da Escola Maestro Júnior"
                className="flex h-12 w-12 items-center justify-center border border-white/15 text-white transition-colors duration-200 hover:border-[#E53E55] hover:bg-[#E53E55]"
              >
                <Facebook size={20} strokeWidth={1.5} aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav className="md:col-span-2" aria-label="Navegação do rodapé">
            <h2 className="font-display text-[0.8125rem] uppercase tracking-[0.14em] text-white/55">
              Navegação
            </h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {[
                ['/', 'Home'],
                ['/metodologia', 'Metodologia'],
                ['/unidades', 'Unidades'],
                ['/camp', 'Camp Maestro Júnior'],
                ['/projetos-sociais', 'Projetos Sociais'],
                ['/contato', 'Contato'],
              ].map(([to, rotulo]) => (
                <li key={to}>
                  <Link to={to} className="transition-colors hover:text-white">
                    {rotulo}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="font-display text-[0.8125rem] uppercase tracking-[0.14em] text-white/55">
              Unidades
            </h2>
            <ul className="mt-5 space-y-3 text-[0.9375rem]">
              {unidadesPublicadas.map((u) => (
                <li key={u.slug}>
                  <Link
                    to={`/unidades/${u.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    {u.nome}
                    <span className="text-white/40"> — {u.estado}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h2 className="font-display text-[0.8125rem] uppercase tracking-[0.14em] text-white/55">
              Fale com a gente
            </h2>
            <ul className="mt-5 space-y-4 text-[0.9375rem]">
              <li>
                <a
                  href={`tel:+${contato.telefoneDigits}`}
                  className="flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Phone size={17} strokeWidth={1.5} aria-hidden="true" />
                  <span className="tabular">{contato.telefone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contato.email}`}
                  className="flex items-start gap-2.5 break-all transition-colors hover:text-white"
                >
                  <Mail size={17} strokeWidth={1.5} className="mt-1 shrink-0" aria-hidden="true" />
                  <span>{contato.email}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-7 text-[0.8125rem] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <span className="tabular">{ANO}</span> Escola de Futebol Maestro Júnior. Todos os
            direitos reservados.
          </p>
          <Link to="/privacidade" className="transition-colors hover:text-white">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  );
}
