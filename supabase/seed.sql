-- ============================================================================
-- Carga inicial — Escola de Futebol Maestro Júnior
--
-- Só entra aqui o que é REAL: as 4 unidades recuperadas do site oficial de
-- 2019 (marcadas a_validar), as 3 edições documentadas do Camp, o projeto
-- social confirmado pela escola e os depoimentos de 2019 — estes últimos
-- DESPUBLICADOS, porque consentimento de 2019 não vale para um site novo.
--
-- Nenhum valor de mensalidade, data futura ou estatística foi inserido.
-- ============================================================================

insert into public.unidades
  (slug, nome, cidade, estado, regiao, local, endereco, telefones, whatsapp,
   faixa_etaria, horarios, mapa_query, procedencia, publicada, observacao, ordem)
values
('barra-da-tijuca', 'Barra da Tijuca', 'Rio de Janeiro', 'RJ', 'Rio de Janeiro',
 'Clube AFBNDES', 'Avenida Ayrton Senna, 550 — Barra da Tijuca, Rio de Janeiro — RJ',
 ARRAY['(21) 99504-4848', '(21) 97958-9988'], '5521995044848', '4 a 15 anos',
 '[{"dias":["seg","qua"],"hora":"08:00","faixa":"13 a 15 anos"},
   {"dias":["seg","qua"],"hora":"09:00","faixa":"8 a 12 anos"},
   {"dias":["seg","qua"],"hora":"10:00","faixa":"4 a 7 anos"},
   {"dias":["seg","qua"],"hora":"15:00","faixa":"4 a 7 anos"},
   {"dias":["seg","qua"],"hora":"16:00","faixa":"8 a 12 anos"},
   {"dias":["seg","qua"],"hora":"17:00","faixa":"13 a 15 anos"}]'::jsonb,
 'Clube AFBNDES, Avenida Ayrton Senna 550, Barra da Tijuca, Rio de Janeiro',
 'a_validar', true,
 'O site anterior da escola destacava: a EMJ agora está no AFBNDES na Av. Ayrton Senna, próximo à Alvorada e ao condomínio Alfa Barra.',
 1),

('jacarepagua', 'Jacarepaguá', 'Rio de Janeiro', 'RJ', 'Rio de Janeiro',
 'Clube Campestre — AEC', 'Rua Retiro dos Artistas, 1765 — Jacarepaguá, Rio de Janeiro — RJ',
 ARRAY['(21) 99504-4848', '(21) 97958-9988'], '5521995044848', '4 a 17 anos',
 '[{"dias":["seg","qua","sex"],"hora":"08:00","faixa":"15 a 17 anos"},
   {"dias":["seg","qua","sex"],"hora":"09:00","faixa":"11 a 14 anos"},
   {"dias":["seg","qua","sex"],"hora":"10:00","faixa":"4 a 10 anos"},
   {"dias":["seg","qua","sex"],"hora":"16:00","faixa":"15 a 17 anos"},
   {"dias":["seg"],"hora":"17:00","faixa":"11 a 14 anos"},
   {"dias":["qua","sex"],"hora":"17:00","faixa":"4 a 10 anos"},
   {"dias":["seg"],"hora":"18:00","faixa":"4 a 10 anos"},
   {"dias":["qua","sex"],"hora":"18:00","faixa":"11 a 14 anos"}]'::jsonb,
 'Clube Campestre AEC, Rua Retiro dos Artistas 1765, Jacarepaguá, Rio de Janeiro',
 'a_validar', true, null, 2),

('ilha-de-guaratiba', 'Ilha de Guaratiba', 'Rio de Janeiro', 'RJ', 'Rio de Janeiro',
 'Arena R1', 'Estrada dos Guimarães, 365 — Ilha de Guaratiba, Rio de Janeiro — RJ',
 ARRAY['(21) 99504-4848', '(21) 97958-9988'], '5521995044848', '4 a 15 anos',
 '[{"dias":["ter","qui"],"hora":"17:00","faixa":"6 a 7 anos"},
   {"dias":["ter","qui"],"hora":"18:00","faixa":"4 a 6 anos"},
   {"dias":["ter","qui"],"hora":"18:00","faixa":"8 a 9 anos"},
   {"dias":["ter","qui"],"hora":"19:00","faixa":"13 a 15 anos"},
   {"dias":["ter","qui"],"hora":"19:00","faixa":"10 a 11 anos"}]'::jsonb,
 'Arena R1, Estrada dos Guimarães 365, Guaratiba, Rio de Janeiro',
 'a_validar', true, null, 3),

('fortaleza', 'Fortaleza', 'Fortaleza', 'CE', 'Ceará',
 'Coliseu Arena', 'Rua I, 119 — Messejana, Fortaleza — CE',
 ARRAY['(85) 98709-3898'], '5585987093898', '4 a 17 anos',
 '[{"dias":["ter","qui"],"hora":"17:00","faixa":"4 a 7 anos"},
   {"dias":["ter","qui"],"hora":"17:00","faixa":"8 a 12 anos"},
   {"dias":["ter","qui"],"hora":"18:00","faixa":"13 a 17 anos"}]'::jsonb,
 'Coliseu Arena, Rua I 119, Messejana, Fortaleza, Ceará',
 'a_validar', true, null, 4)
on conflict (slug) do nothing;

-- Edições documentadas em fonte pública. Nenhuma data futura presumida.
insert into public.camp_edicoes (titulo, periodo, ano, situacao) values
 ('Edição Dia das Crianças', '9 a 12 de outubro', 2026, 'historico'),
 ('Edição de abril', '19 a 21 de abril', 2024, 'historico'),
 ('Edição de Páscoa', 'Feriado da Semana Santa', 2023, 'historico');

insert into public.projetos_sociais
 (nome, comunidade, bairro, descricao, patrocinador, apoio, inicio, publicado, ordem)
values
 ('Escola de Futebol Maestro Júnior — Morro da Babilônia', 'Morro da Babilônia', 'Leme',
  'Unidade do projeto social no Morro da Babilônia, no Leme, beneficiada pelo patrocínio da Light.',
  'Light', 'Governo do Estado do Rio de Janeiro', 2022, true, 1);

-- Depoimentos reais de 2019 — entram DESPUBLICADOS por força da LGPD.
insert into public.depoimentos (texto, autor, publicado, consentimento_reautorizado) values
 ('Imensa alegria de ver meu filho e esses garotos dando os primeiros passos em busca de pequenos sonhos. Muito talento, dedicação dos professores e profissionalismo de toda equipe, alinhado àquele toque de Maestria nos fazem encher os olhos com essa garotada. Muito obrigado EMJ!',
  'Daniel, pai do aluno Kayke Carvalho', false, false),
 ('Gostaria de parabenizar esta escola de campeões, pelo comprometimento da gestão e da competência dos professores ao ensinar ao meu filho conceitos de socialização e comportamento dentro de um coletivo, além do aprimoramento técnico no futebol.',
  'Rodrigo, pai do aluno Rhenan Teixeira', false, false),
 ('Na escolinha do Maestro Júnior, meu filho Felipe, de 8 anos, aprendeu, além de jogar futebol, a importância do espírito de equipe, do respeito, da amizade, e que há dias bons e dias não tão bons. Considero uma excelente escola para a vida.',
  'Carlos, pai do Felipe Bitelli', false, false);

-- Base inicial do bot. Note a entrada de VALORES: ela existe justamente para
-- IMPEDIR que o bot invente preço enquanto a escola não cadastra o real.
insert into public.bot_conhecimento (categoria, pergunta, resposta, prioridade) values
 ('geral', 'Quem é o Maestro Júnior?',
  'Leovegildo Lins Gama Júnior, o Maestro Júnior, é ídolo do Flamengo e da Seleção Brasileira, com passagem também pelo futebol italiano. Ele está à frente da escola, que leva o nome dele.', 10),
 ('geral', 'Desde quando a escola existe?',
  'A Escola de Futebol Maestro Júnior foi fundada em 2017.', 9),
 ('unidades', null,
  'A escola tem unidades na Barra da Tijuca, em Jacarepaguá e na Ilha de Guaratiba (Rio de Janeiro), e em Messejana (Fortaleza/CE). Endereços e horários completos estão no site.', 10),
 ('matricula', 'Como faço para a criança experimentar?',
  'Oferecemos aula experimental. Pegue o nome e a idade da criança, a unidade de preferência e o melhor horário — a equipe confirma o agendamento.', 10),
 ('camp', 'O que é o Camp Maestro Júnior?',
  'É uma imersão de três dias no resort Le Canton, em Teresópolis, comandada pelo próprio Júnior. Acontece duas vezes por ano. Todo participante recebe medalha e certificado, além de acesso à estrutura do resort.', 9),
 ('camp', 'Quando é a próxima edição do Camp?',
  'As datas e os valores mudam a cada edição e só são divulgados quando as inscrições abrem. Ofereça colocar a família na lista de interesse para ser avisada primeiro.', 10),
 ('valores', 'Quanto custa a mensalidade?',
  'ATENÇÃO: os valores ainda não foram cadastrados pela escola. NÃO informe nenhum preço, nem aproximado. Diga que a equipe envia os valores e passe a conversa para um humano.', 10),
 ('projetos', null,
  'Desde 2022 a escola mantém um projeto social em comunidades do Rio, com patrocínio da Light e apoio do Governo do Estado do Rio de Janeiro. Uma das unidades fica no Morro da Babilônia, no Leme.', 8),
 ('politicas', null,
  'Nunca peça documento, CPF, endereço residencial, nome da escola ou foto da criança. Colete apenas nome e idade, e somente para agendar a aula experimental.', 10);

update public.bot_config set whatsapp_dono = '5521995044848' where id = 1;
