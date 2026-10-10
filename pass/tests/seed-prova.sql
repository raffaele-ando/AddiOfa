-- 5 domande di prova per le prove locali (NON e' il banco vero: quello e' pass/seed.sql, generato dai contenuti).
-- T001-T003 nucleo gratuito (core=1), T004-T005 a pagamento. T003 senza quinta opzione: non entra nel TENG.
DELETE FROM questions WHERE id LIKE 'T0%';
INSERT INTO questions (id, prompt, options, extra_option, correct_index, explanation_it, theory_id, category, level, grammar_topic, core) VALUES
('T001', 'She ___ to school every day.', '["go","goes","going","gone"]', 'went', 1, 'Con she serve la -s del present simple: goes.', 'present-simple', 'grammar', 'A2', 'present-simple', 1),
('T002', 'I have lived here ___ 2019.', '["for","since","during","from"]', 'while', 1, 'Since indica il punto di partenza nel tempo; for una durata.', 'present-perfect', 'grammar', 'B1', 'present-perfect', 1),
('T003', 'Choose the word that means "enormous".', '["tiny","huge","narrow","quiet"]', NULL, 1, 'Enormous e huge significano entrambi molto grande.', NULL, 'vocabulary', 'B1', NULL, 1),
('T004', 'If it rains tomorrow, we ___ at home.', '["stay","will stay","stayed","would stay"]', 'had stayed', 1, 'Primo periodo ipotetico: if + present, will + verbo base.', 'conditionals', 'grammar', 'B1', 'conditionals', 0),
('T005', 'He asked me where ___.', '["do I live","I lived","I live","did I live"]', 'live I', 1, 'Nel discorso indiretto l''ordine e'' soggetto + verbo, senza ausiliare.', 'reported-speech', 'grammar', 'B2', 'reported-speech', 0);
