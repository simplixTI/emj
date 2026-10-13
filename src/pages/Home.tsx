import { AberturaMarca } from '@/components/layout/AberturaMarca';
import { Hero } from '@/components/home/Hero';
import { NossaEscola } from '@/components/home/NossaEscola';
import { Pilares } from '@/components/home/Pilares';
import { Unidades } from '@/components/home/Unidades';
import { CampDestaque } from '@/components/home/CampDestaque';
import { ProjetosSociais } from '@/components/home/ProjetosSociais';
import { Instagram } from '@/components/home/Instagram';
import { ChamadaFinal } from '@/components/home/ChamadaFinal';
import { useSeo } from '@/lib/seo';

export default function Home() {
  useSeo({
    titulo: 'Escola de Futebol Maestro Júnior — Mais que futebol. Formação para a vida.',
    descricao:
      'Escola de futebol para crianças e adolescentes conduzida pelo Maestro Júnior, ídolo do Flamengo e da Seleção Brasileira. Unidades no Rio de Janeiro e em Fortaleza. Agende uma aula experimental.',
    caminho: '/',
  });

  return (
    <>
      <AberturaMarca />
      <Hero />
      <NossaEscola />
      <Pilares />
      <Unidades />
      <CampDestaque />
      <ProjetosSociais />
      <Instagram />
      <ChamadaFinal />
    </>
  );
}
