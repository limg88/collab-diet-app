-- ============================================================
-- Diet App — Seed data
-- Generated from dieta.xlsx
-- Run: psql $DATABASE_URL -f seed.sql
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING
-- ============================================================

-- ─── USERS (bcrypt hash of 'Password1!' — change in prod) ───
INSERT INTO users (id, email, "passwordHash", "createdAt")
SELECT '1915ce9d-20db-4a69-9a03-58e82bdeef05', 'giovanni.limatola@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'giovanni.limatola@gmail.com');

INSERT INTO users (id, email, "passwordHash", "createdAt")
SELECT '4698588d-4b1f-4033-a84e-5be12008b7a2', 'ggiacobonep@gmail.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'ggiacobonep@gmail.com');

DO $$
DECLARE
  v_giovanni_id UUID;
  v_giovanna_id  UUID;
  v_menu_id      UUID;
  v_day_id       UUID;
  v_meal_id      UUID;

  v_ing_albicocche UUID;
  v_ing2_albicocche UUID;
  v_ing_albume UUID;
  v_ing2_albume UUID;
  v_ing_alici UUID;
  v_ing2_alici UUID;
  v_ing_ananas UUID;
  v_ing2_ananas UUID;
  v_ing_anguria UUID;
  v_ing2_anguria UUID;
  v_ing_arance UUID;
  v_ing2_arance UUID;
  v_ing_arista_di_maiale UUID;
  v_ing2_arista_di_maiale UUID;
  v_ing_banana UUID;
  v_ing2_banana UUID;
  v_ing_bastoncini UUID;
  v_ing2_bastoncini UUID;
  v_ing_bevanda_di_riso UUID;
  v_ing2_bevanda_di_riso UUID;
  v_ing_bevanda_di_soia UUID;
  v_ing2_bevanda_di_soia UUID;
  v_ing_bieta UUID;
  v_ing2_bieta UUID;
  v_ing_bietole UUID;
  v_ing2_bietole UUID;
  v_ing_biscotti_magretti UUID;
  v_ing2_biscotti_magretti UUID;
  v_ing_biscotti_misura_privolat UUID;
  v_ing2_biscotti_misura_privolat UUID;
  v_ing_biscotti_orosaiwa UUID;
  v_ing2_biscotti_orosaiwa UUID;
  v_ing_bresaola UUID;
  v_ing2_bresaola UUID;
  v_ing_broccoli UUID;
  v_ing2_broccoli UUID;
  v_ing_burro_di_arachidi UUID;
  v_ing2_burro_di_arachidi UUID;
  v_ing_cachi UUID;
  v_ing2_cachi UUID;
  v_ing_calamaro UUID;
  v_ing2_calamaro UUID;
  v_ing_caponata UUID;
  v_ing2_caponata UUID;
  v_ing_carote UUID;
  v_ing2_carote UUID;
  v_ing_ceci_cotti UUID;
  v_ing2_ceci_cotti UUID;
  v_ing_cereali_g_galbusera UUID;
  v_ing2_cereali_g_galbusera UUID;
  v_ing_cheerios UUID;
  v_ing2_cheerios UUID;
  v_ing_cicoria UUID;
  v_ing2_cicoria UUID;
  v_ing_ciliegie UUID;
  v_ing2_ciliegie UUID;
  v_ing_cioccolato_fondente UUID;
  v_ing2_cioccolato_fondente UUID;
  v_ing_cornflakes UUID;
  v_ing2_cornflakes UUID;
  v_ing_cous_cous UUID;
  v_ing2_cous_cous UUID;
  v_ing_crackers_riso_su_riso UUID;
  v_ing2_crackers_riso_su_riso UUID;
  v_ing_crostini UUID;
  v_ing2_crostini UUID;
  v_ing_dietetic_dolcificante UUID;
  v_ing2_dietetic_dolcificante UUID;
  v_ing_fagiolini UUID;
  v_ing2_fagiolini UUID;
  v_ing_farina_di_riso UUID;
  v_ing2_farina_di_riso UUID;
  v_ing_farino_di_avena UUID;
  v_ing2_farino_di_avena UUID;
  v_ing_fesa_di_tacchino UUID;
  v_ing2_fesa_di_tacchino UUID;
  v_ing_feta UUID;
  v_ing2_feta UUID;
  v_ing_fette_biscottate UUID;
  v_ing2_fette_biscottate UUID;
  v_ing_filetto_di_manzo UUID;
  v_ing2_filetto_di_manzo UUID;
  v_ing_finocchi UUID;
  v_ing2_finocchi UUID;
  v_ing_fiocchi_di_avena UUID;
  v_ing2_fiocchi_di_avena UUID;
  v_ing_fiocchi_di_latte UUID;
  v_ing2_fiocchi_di_latte UUID;
  v_ing_fior_di_latte UUID;
  v_ing2_fior_di_latte UUID;
  v_ing_fragole UUID;
  v_ing2_fragole UUID;
  v_ing_fresella UUID;
  v_ing2_fresella UUID;
  v_ing_frutta_fresca UUID;
  v_ing2_frutta_fresca UUID;
  v_ing_frutta_secca UUID;
  v_ing2_frutta_secca UUID;
  v_ing_frutta_sotto_vuoto UUID;
  v_ing2_frutta_sotto_vuoto UUID;
  v_ing_funghi UUID;
  v_ing2_funghi UUID;
  v_ing_hamburger_di_pollo UUID;
  v_ing2_hamburger_di_pollo UUID;
  v_ing_hamburger_di_soia UUID;
  v_ing2_hamburger_di_soia UUID;
  v_ing_hamburger_vegetale UUID;
  v_ing2_hamburger_vegetale UUID;
  v_ing_kefir UUID;
  v_ing2_kefir UUID;
  v_ing_kiwi UUID;
  v_ing2_kiwi UUID;
  v_ing_lamponi UUID;
  v_ing2_lamponi UUID;
  v_ing_latte_scramato UUID;
  v_ing2_latte_scramato UUID;
  v_ing_lattuga UUID;
  v_ing2_lattuga UUID;
  v_ing_lenticchie_decorticate UUID;
  v_ing2_lenticchie_decorticate UUID;
  v_ing_lievito_in_polvere UUID;
  v_ing2_lievito_in_polvere UUID;
  v_ing_lonza UUID;
  v_ing2_lonza UUID;
  v_ing_mais UUID;
  v_ing2_mais UUID;
  v_ing_mandarini UUID;
  v_ing2_mandarini UUID;
  v_ing_manzo_magro UUID;
  v_ing2_manzo_magro UUID;
  v_ing_manzo_magro_macinato UUID;
  v_ing2_manzo_magro_macinato UUID;
  v_ing_marmellata UUID;
  v_ing2_marmellata UUID;
  v_ing_mela UUID;
  v_ing2_mela UUID;
  v_ing_melanzane UUID;
  v_ing2_melanzane UUID;
  v_ing_melone UUID;
  v_ing2_melone UUID;
  v_ing_merluzzo UUID;
  v_ing2_merluzzo UUID;
  v_ing_miele UUID;
  v_ing2_miele UUID;
  v_ing_minestrone_leggerezza UUID;
  v_ing2_minestrone_leggerezza UUID;
  v_ing_mirtilli UUID;
  v_ing2_mirtilli UUID;
  v_ing_noci UUID;
  v_ing2_noci UUID;
  v_ing_orata UUID;
  v_ing2_orata UUID;
  v_ing_pane UUID;
  v_ing2_pane UUID;
  v_ing_pane_tostato UUID;
  v_ing2_pane_tostato UUID;
  v_ing_pangrattato UUID;
  v_ing2_pangrattato UUID;
  v_ing_panino UUID;
  v_ing2_panino UUID;
  v_ing_panko UUID;
  v_ing2_panko UUID;
  v_ing_parmigiano UUID;
  v_ing2_parmigiano UUID;
  v_ing_passata_di_pomodoro UUID;
  v_ing2_passata_di_pomodoro UUID;
  v_ing_pasta UUID;
  v_ing2_pasta UUID;
  v_ing_patate UUID;
  v_ing2_patate UUID;
  v_ing_peperoni UUID;
  v_ing2_peperoni UUID;
  v_ing_pera UUID;
  v_ing2_pera UUID;
  v_ing_persico UUID;
  v_ing2_persico UUID;
  v_ing_pesche UUID;
  v_ing2_pesche UUID;
  v_ing_pesto UUID;
  v_ing2_pesto UUID;
  v_ing_petto_di_pollo UUID;
  v_ing2_petto_di_pollo UUID;
  v_ing_philadelphia UUID;
  v_ing2_philadelphia UUID;
  v_ing_piadina UUID;
  v_ing2_piadina UUID;
  v_ing_piselli UUID;
  v_ing2_piselli UUID;
  v_ing_pizza UUID;
  v_ing2_pizza UUID;
  v_ing_platessa UUID;
  v_ing2_platessa UUID;
  v_ing_polpo UUID;
  v_ing2_polpo UUID;
  v_ing_pomodori_da_insalata UUID;
  v_ing2_pomodori_da_insalata UUID;
  v_ing_pomodorini UUID;
  v_ing2_pomodorini UUID;
  v_ing_porro UUID;
  v_ing2_porro UUID;
  v_ing_primosale UUID;
  v_ing2_primosale UUID;
  v_ing_prosciutto_cotto UUID;
  v_ing2_prosciutto_cotto UUID;
  v_ing_prosciutto_crudo UUID;
  v_ing2_prosciutto_crudo UUID;
  v_ing_prugne UUID;
  v_ing2_prugne UUID;
  v_ing_ricotta UUID;
  v_ing2_ricotta UUID;
  v_ing_riso UUID;
  v_ing2_riso UUID;
  v_ing_roastbeef UUID;
  v_ing2_roastbeef UUID;
  v_ing_robiola UUID;
  v_ing2_robiola UUID;
  v_ing_rucola UUID;
  v_ing2_rucola UUID;
  v_ing_salmone UUID;
  v_ing2_salmone UUID;
  v_ing_salmone_affumicato UUID;
  v_ing2_salmone_affumicato UUID;
  v_ing_salsiccia UUID;
  v_ing2_salsiccia UUID;
  v_ing_seppie UUID;
  v_ing2_seppie UUID;
  v_ing_spigola UUID;
  v_ing2_spigola UUID;
  v_ing_spinaci UUID;
  v_ing2_spinaci UUID;
  v_ing_tacchino UUID;
  v_ing2_tacchino UUID;
  v_ing_taccole UUID;
  v_ing2_taccole UUID;
  v_ing_te UUID;
  v_ing2_te UUID;
  v_ing_tonno UUID;
  v_ing2_tonno UUID;
  v_ing_tonno_in_scatola_al_naturale UUID;
  v_ing2_tonno_in_scatola_al_naturale UUID;
  v_ing_totano UUID;
  v_ing2_totano UUID;
  v_ing_tris_di_verdure UUID;
  v_ing2_tris_di_verdure UUID;
  v_ing_uova UUID;
  v_ing2_uova UUID;
  v_ing_uova_di_gallina UUID;
  v_ing2_uova_di_gallina UUID;
  v_ing_uova_di_gallina_intero UUID;
  v_ing2_uova_di_gallina_intero UUID;
  v_ing_uva UUID;
  v_ing2_uva UUID;
  v_ing_valeriana UUID;
  v_ing2_valeriana UUID;
  v_ing_yogurt_greco UUID;
  v_ing2_yogurt_greco UUID;
  v_ing_yogurt_scremato UUID;
  v_ing2_yogurt_scremato UUID;
  v_ing_zucca UUID;
  v_ing2_zucca UUID;
  v_ing_zucchine UUID;
  v_ing2_zucchine UUID;
  v_ing_zuppa_del_casale UUID;
  v_ing2_zuppa_del_casale UUID;
BEGIN
  SELECT id INTO v_giovanni_id FROM users WHERE email = 'giovanni.limatola@gmail.com' LIMIT 1;
  SELECT id INTO v_giovanna_id  FROM users WHERE email = 'ggiacobonep@gmail.com' LIMIT 1;

  -- ─── INGREDIENTS (owned by Giovanni) ───────────────────────
  v_ing_albicocche := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_albicocche, v_giovanni_id, 'albicocche', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('albicocche'));
  SELECT id INTO v_ing_albicocche FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('albicocche') LIMIT 1;

  v_ing_albume := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_albume, v_giovanni_id, 'albume', 'Uova', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('albume'));
  SELECT id INTO v_ing_albume FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('albume') LIMIT 1;

  v_ing_alici := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_alici, v_giovanni_id, 'alici', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('alici'));
  SELECT id INTO v_ing_alici FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('alici') LIMIT 1;

  v_ing_ananas := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_ananas, v_giovanni_id, 'ananas', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('ananas'));
  SELECT id INTO v_ing_ananas FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('ananas') LIMIT 1;

  v_ing_anguria := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_anguria, v_giovanni_id, 'anguria', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('anguria'));
  SELECT id INTO v_ing_anguria FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('anguria') LIMIT 1;

  v_ing_arance := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_arance, v_giovanni_id, 'arance', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('arance'));
  SELECT id INTO v_ing_arance FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('arance') LIMIT 1;

  v_ing_arista_di_maiale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_arista_di_maiale, v_giovanni_id, 'arista di maiale', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('arista di maiale'));
  SELECT id INTO v_ing_arista_di_maiale FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('arista di maiale') LIMIT 1;

  v_ing_banana := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_banana, v_giovanni_id, 'banana', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('banana'));
  SELECT id INTO v_ing_banana FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('banana') LIMIT 1;

  v_ing_bastoncini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_bastoncini, v_giovanni_id, 'bastoncini', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bastoncini'));
  SELECT id INTO v_ing_bastoncini FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bastoncini') LIMIT 1;

  v_ing_bevanda_di_riso := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_bevanda_di_riso, v_giovanni_id, 'bevanda di riso', 'Bevande vegetali', 'ml', 200, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bevanda di riso'));
  SELECT id INTO v_ing_bevanda_di_riso FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bevanda di riso') LIMIT 1;

  v_ing_bevanda_di_soia := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_bevanda_di_soia, v_giovanni_id, 'bevanda di soia', 'Bevande vegetali', 'ml', 200, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bevanda di soia'));
  SELECT id INTO v_ing_bevanda_di_soia FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bevanda di soia') LIMIT 1;

  v_ing_bieta := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_bieta, v_giovanni_id, 'bieta', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bieta'));
  SELECT id INTO v_ing_bieta FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bieta') LIMIT 1;

  v_ing_bietole := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_bietole, v_giovanni_id, 'bietole', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bietole'));
  SELECT id INTO v_ing_bietole FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bietole') LIMIT 1;

  v_ing_biscotti_magretti := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_biscotti_magretti, v_giovanni_id, 'biscotti magretti', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('biscotti magretti'));
  SELECT id INTO v_ing_biscotti_magretti FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('biscotti magretti') LIMIT 1;

  v_ing_biscotti_misura_privolat := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_biscotti_misura_privolat, v_giovanni_id, 'biscotti misura privolat', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('biscotti misura privolat'));
  SELECT id INTO v_ing_biscotti_misura_privolat FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('biscotti misura privolat') LIMIT 1;

  v_ing_biscotti_orosaiwa := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_biscotti_orosaiwa, v_giovanni_id, 'biscotti orosaiwa', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('biscotti orosaiwa'));
  SELECT id INTO v_ing_biscotti_orosaiwa FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('biscotti orosaiwa') LIMIT 1;

  v_ing_bresaola := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_bresaola, v_giovanni_id, 'bresaola', 'Salumi e affettati', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bresaola'));
  SELECT id INTO v_ing_bresaola FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('bresaola') LIMIT 1;

  v_ing_broccoli := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_broccoli, v_giovanni_id, 'broccoli', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('broccoli'));
  SELECT id INTO v_ing_broccoli FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('broccoli') LIMIT 1;

  v_ing_burro_di_arachidi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_burro_di_arachidi, v_giovanni_id, 'burro di arachidi', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('burro di arachidi'));
  SELECT id INTO v_ing_burro_di_arachidi FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('burro di arachidi') LIMIT 1;

  v_ing_cachi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_cachi, v_giovanni_id, 'cachi', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cachi'));
  SELECT id INTO v_ing_cachi FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cachi') LIMIT 1;

  v_ing_calamaro := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_calamaro, v_giovanni_id, 'calamaro', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('calamaro'));
  SELECT id INTO v_ing_calamaro FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('calamaro') LIMIT 1;

  v_ing_caponata := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_caponata, v_giovanni_id, 'caponata', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('caponata'));
  SELECT id INTO v_ing_caponata FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('caponata') LIMIT 1;

  v_ing_carote := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_carote, v_giovanni_id, 'carote', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('carote'));
  SELECT id INTO v_ing_carote FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('carote') LIMIT 1;

  v_ing_ceci_cotti := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_ceci_cotti, v_giovanni_id, 'ceci cotti', 'Legumi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('ceci cotti'));
  SELECT id INTO v_ing_ceci_cotti FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('ceci cotti') LIMIT 1;

  v_ing_cereali_g_galbusera := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_cereali_g_galbusera, v_giovanni_id, 'cereali g galbusera', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cereali g galbusera'));
  SELECT id INTO v_ing_cereali_g_galbusera FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cereali g galbusera') LIMIT 1;

  v_ing_cheerios := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_cheerios, v_giovanni_id, 'cheerios', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cheerios'));
  SELECT id INTO v_ing_cheerios FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cheerios') LIMIT 1;

  v_ing_cicoria := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_cicoria, v_giovanni_id, 'cicoria', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cicoria'));
  SELECT id INTO v_ing_cicoria FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cicoria') LIMIT 1;

  v_ing_ciliegie := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_ciliegie, v_giovanni_id, 'ciliegie', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('ciliegie'));
  SELECT id INTO v_ing_ciliegie FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('ciliegie') LIMIT 1;

  v_ing_cioccolato_fondente := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_cioccolato_fondente, v_giovanni_id, 'cioccolato fondente', 'Dolci e snack', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cioccolato fondente'));
  SELECT id INTO v_ing_cioccolato_fondente FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cioccolato fondente') LIMIT 1;

  v_ing_cornflakes := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_cornflakes, v_giovanni_id, 'cornflakes', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cornflakes'));
  SELECT id INTO v_ing_cornflakes FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cornflakes') LIMIT 1;

  v_ing_cous_cous := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_cous_cous, v_giovanni_id, 'cous cous', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cous cous'));
  SELECT id INTO v_ing_cous_cous FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('cous cous') LIMIT 1;

  v_ing_crackers_riso_su_riso := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_crackers_riso_su_riso, v_giovanni_id, 'crackers riso su riso', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('crackers riso su riso'));
  SELECT id INTO v_ing_crackers_riso_su_riso FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('crackers riso su riso') LIMIT 1;

  v_ing_crostini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_crostini, v_giovanni_id, 'crostini', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('crostini'));
  SELECT id INTO v_ing_crostini FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('crostini') LIMIT 1;

  v_ing_dietetic_dolcificante := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_dietetic_dolcificante, v_giovanni_id, 'dietetic dolcificante', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('dietetic dolcificante'));
  SELECT id INTO v_ing_dietetic_dolcificante FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('dietetic dolcificante') LIMIT 1;

  v_ing_fagiolini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_fagiolini, v_giovanni_id, 'fagiolini', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fagiolini'));
  SELECT id INTO v_ing_fagiolini FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fagiolini') LIMIT 1;

  v_ing_farina_di_riso := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_farina_di_riso, v_giovanni_id, 'farina di riso', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('farina di riso'));
  SELECT id INTO v_ing_farina_di_riso FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('farina di riso') LIMIT 1;

  v_ing_farino_di_avena := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_farino_di_avena, v_giovanni_id, 'farino di avena', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('farino di avena'));
  SELECT id INTO v_ing_farino_di_avena FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('farino di avena') LIMIT 1;

  v_ing_fesa_di_tacchino := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_fesa_di_tacchino, v_giovanni_id, 'fesa di tacchino', 'Salumi e affettati', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fesa di tacchino'));
  SELECT id INTO v_ing_fesa_di_tacchino FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fesa di tacchino') LIMIT 1;

  v_ing_feta := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_feta, v_giovanni_id, 'feta', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('feta'));
  SELECT id INTO v_ing_feta FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('feta') LIMIT 1;

  v_ing_fette_biscottate := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_fette_biscottate, v_giovanni_id, 'fette biscottate', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fette biscottate'));
  SELECT id INTO v_ing_fette_biscottate FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fette biscottate') LIMIT 1;

  v_ing_filetto_di_manzo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_filetto_di_manzo, v_giovanni_id, 'filetto di manzo', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('filetto di manzo'));
  SELECT id INTO v_ing_filetto_di_manzo FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('filetto di manzo') LIMIT 1;

  v_ing_finocchi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_finocchi, v_giovanni_id, 'finocchi', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('finocchi'));
  SELECT id INTO v_ing_finocchi FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('finocchi') LIMIT 1;

  v_ing_fiocchi_di_avena := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_fiocchi_di_avena, v_giovanni_id, 'fiocchi di avena', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fiocchi di avena'));
  SELECT id INTO v_ing_fiocchi_di_avena FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fiocchi di avena') LIMIT 1;

  v_ing_fiocchi_di_latte := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_fiocchi_di_latte, v_giovanni_id, 'fiocchi di latte', 'Latticini e yogurt', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fiocchi di latte'));
  SELECT id INTO v_ing_fiocchi_di_latte FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fiocchi di latte') LIMIT 1;

  v_ing_fior_di_latte := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_fior_di_latte, v_giovanni_id, 'fior di latte', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fior di latte'));
  SELECT id INTO v_ing_fior_di_latte FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fior di latte') LIMIT 1;

  v_ing_fragole := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_fragole, v_giovanni_id, 'fragole', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fragole'));
  SELECT id INTO v_ing_fragole FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fragole') LIMIT 1;

  v_ing_fresella := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_fresella, v_giovanni_id, 'fresella', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fresella'));
  SELECT id INTO v_ing_fresella FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('fresella') LIMIT 1;

  v_ing_frutta_fresca := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_frutta_fresca, v_giovanni_id, 'frutta fresca', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('frutta fresca'));
  SELECT id INTO v_ing_frutta_fresca FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('frutta fresca') LIMIT 1;

  v_ing_frutta_secca := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_frutta_secca, v_giovanni_id, 'frutta secca', 'Frutta secca e noci', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('frutta secca'));
  SELECT id INTO v_ing_frutta_secca FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('frutta secca') LIMIT 1;

  v_ing_frutta_sotto_vuoto := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_frutta_sotto_vuoto, v_giovanni_id, 'frutta sotto vuoto', 'Frutta', 'unit', 1, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('frutta sotto vuoto'));
  SELECT id INTO v_ing_frutta_sotto_vuoto FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('frutta sotto vuoto') LIMIT 1;

  v_ing_funghi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_funghi, v_giovanni_id, 'funghi', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('funghi'));
  SELECT id INTO v_ing_funghi FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('funghi') LIMIT 1;

  v_ing_hamburger_di_pollo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_hamburger_di_pollo, v_giovanni_id, 'hamburger di pollo', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('hamburger di pollo'));
  SELECT id INTO v_ing_hamburger_di_pollo FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('hamburger di pollo') LIMIT 1;

  v_ing_hamburger_di_soia := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_hamburger_di_soia, v_giovanni_id, 'hamburger di soia', 'Legumi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('hamburger di soia'));
  SELECT id INTO v_ing_hamburger_di_soia FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('hamburger di soia') LIMIT 1;

  v_ing_hamburger_vegetale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_hamburger_vegetale, v_giovanni_id, 'hamburger vegetale', 'Legumi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('hamburger vegetale'));
  SELECT id INTO v_ing_hamburger_vegetale FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('hamburger vegetale') LIMIT 1;

  v_ing_kefir := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_kefir, v_giovanni_id, 'kefir', 'Latticini e yogurt', 'ml', 200, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('kefir'));
  SELECT id INTO v_ing_kefir FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('kefir') LIMIT 1;

  v_ing_kiwi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_kiwi, v_giovanni_id, 'kiwi', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('kiwi'));
  SELECT id INTO v_ing_kiwi FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('kiwi') LIMIT 1;

  v_ing_lamponi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_lamponi, v_giovanni_id, 'lamponi', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lamponi'));
  SELECT id INTO v_ing_lamponi FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lamponi') LIMIT 1;

  v_ing_latte_scramato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_latte_scramato, v_giovanni_id, 'latte scramato', 'Latticini e yogurt', 'ml', 200, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('latte scramato'));
  SELECT id INTO v_ing_latte_scramato FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('latte scramato') LIMIT 1;

  v_ing_lattuga := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_lattuga, v_giovanni_id, 'lattuga', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lattuga'));
  SELECT id INTO v_ing_lattuga FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lattuga') LIMIT 1;

  v_ing_lenticchie_decorticate := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_lenticchie_decorticate, v_giovanni_id, 'lenticchie decorticate', 'Legumi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lenticchie decorticate'));
  SELECT id INTO v_ing_lenticchie_decorticate FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lenticchie decorticate') LIMIT 1;

  v_ing_lievito_in_polvere := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_lievito_in_polvere, v_giovanni_id, 'lievito in polvere', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lievito in polvere'));
  SELECT id INTO v_ing_lievito_in_polvere FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lievito in polvere') LIMIT 1;

  v_ing_lonza := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_lonza, v_giovanni_id, 'lonza', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lonza'));
  SELECT id INTO v_ing_lonza FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('lonza') LIMIT 1;

  v_ing_mais := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_mais, v_giovanni_id, 'mais', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('mais'));
  SELECT id INTO v_ing_mais FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('mais') LIMIT 1;

  v_ing_mandarini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_mandarini, v_giovanni_id, 'mandarini', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('mandarini'));
  SELECT id INTO v_ing_mandarini FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('mandarini') LIMIT 1;

  v_ing_manzo_magro := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_manzo_magro, v_giovanni_id, 'manzo magro', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('manzo magro'));
  SELECT id INTO v_ing_manzo_magro FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('manzo magro') LIMIT 1;

  v_ing_manzo_magro_macinato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_manzo_magro_macinato, v_giovanni_id, 'manzo magro macinato', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('manzo magro macinato'));
  SELECT id INTO v_ing_manzo_magro_macinato FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('manzo magro macinato') LIMIT 1;

  v_ing_marmellata := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_marmellata, v_giovanni_id, 'marmellata', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('marmellata'));
  SELECT id INTO v_ing_marmellata FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('marmellata') LIMIT 1;

  v_ing_mela := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_mela, v_giovanni_id, 'mela', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('mela'));
  SELECT id INTO v_ing_mela FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('mela') LIMIT 1;

  v_ing_melanzane := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_melanzane, v_giovanni_id, 'melanzane', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('melanzane'));
  SELECT id INTO v_ing_melanzane FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('melanzane') LIMIT 1;

  v_ing_melone := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_melone, v_giovanni_id, 'melone', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('melone'));
  SELECT id INTO v_ing_melone FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('melone') LIMIT 1;

  v_ing_merluzzo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_merluzzo, v_giovanni_id, 'merluzzo', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('merluzzo'));
  SELECT id INTO v_ing_merluzzo FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('merluzzo') LIMIT 1;

  v_ing_miele := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_miele, v_giovanni_id, 'miele', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('miele'));
  SELECT id INTO v_ing_miele FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('miele') LIMIT 1;

  v_ing_minestrone_leggerezza := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_minestrone_leggerezza, v_giovanni_id, 'minestrone leggerezza', 'Piatti pronti', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('minestrone leggerezza'));
  SELECT id INTO v_ing_minestrone_leggerezza FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('minestrone leggerezza') LIMIT 1;

  v_ing_mirtilli := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_mirtilli, v_giovanni_id, 'mirtilli', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('mirtilli'));
  SELECT id INTO v_ing_mirtilli FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('mirtilli') LIMIT 1;

  v_ing_noci := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_noci, v_giovanni_id, 'noci', 'Frutta secca e noci', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('noci'));
  SELECT id INTO v_ing_noci FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('noci') LIMIT 1;

  v_ing_orata := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_orata, v_giovanni_id, 'orata', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('orata'));
  SELECT id INTO v_ing_orata FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('orata') LIMIT 1;

  v_ing_pane := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pane, v_giovanni_id, 'pane', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pane'));
  SELECT id INTO v_ing_pane FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pane') LIMIT 1;

  v_ing_pane_tostato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pane_tostato, v_giovanni_id, 'pane tostato', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pane tostato'));
  SELECT id INTO v_ing_pane_tostato FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pane tostato') LIMIT 1;

  v_ing_pangrattato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pangrattato, v_giovanni_id, 'pangrattato', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pangrattato'));
  SELECT id INTO v_ing_pangrattato FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pangrattato') LIMIT 1;

  v_ing_panino := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_panino, v_giovanni_id, 'panino', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('panino'));
  SELECT id INTO v_ing_panino FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('panino') LIMIT 1;

  v_ing_panko := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_panko, v_giovanni_id, 'panko', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('panko'));
  SELECT id INTO v_ing_panko FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('panko') LIMIT 1;

  v_ing_parmigiano := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_parmigiano, v_giovanni_id, 'parmigiano', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('parmigiano'));
  SELECT id INTO v_ing_parmigiano FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('parmigiano') LIMIT 1;

  v_ing_passata_di_pomodoro := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_passata_di_pomodoro, v_giovanni_id, 'passata di pomodoro', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('passata di pomodoro'));
  SELECT id INTO v_ing_passata_di_pomodoro FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('passata di pomodoro') LIMIT 1;

  v_ing_pasta := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pasta, v_giovanni_id, 'pasta', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pasta'));
  SELECT id INTO v_ing_pasta FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pasta') LIMIT 1;

  v_ing_patate := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_patate, v_giovanni_id, 'patate', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('patate'));
  SELECT id INTO v_ing_patate FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('patate') LIMIT 1;

  v_ing_peperoni := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_peperoni, v_giovanni_id, 'peperoni', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('peperoni'));
  SELECT id INTO v_ing_peperoni FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('peperoni') LIMIT 1;

  v_ing_pera := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pera, v_giovanni_id, 'pera', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pera'));
  SELECT id INTO v_ing_pera FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pera') LIMIT 1;

  v_ing_persico := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_persico, v_giovanni_id, 'persico', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('persico'));
  SELECT id INTO v_ing_persico FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('persico') LIMIT 1;

  v_ing_pesche := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pesche, v_giovanni_id, 'pesche', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pesche'));
  SELECT id INTO v_ing_pesche FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pesche') LIMIT 1;

  v_ing_pesto := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pesto, v_giovanni_id, 'pesto', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pesto'));
  SELECT id INTO v_ing_pesto FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pesto') LIMIT 1;

  v_ing_petto_di_pollo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_petto_di_pollo, v_giovanni_id, 'petto di pollo', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('petto di pollo'));
  SELECT id INTO v_ing_petto_di_pollo FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('petto di pollo') LIMIT 1;

  v_ing_philadelphia := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_philadelphia, v_giovanni_id, 'philadelphia', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('philadelphia'));
  SELECT id INTO v_ing_philadelphia FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('philadelphia') LIMIT 1;

  v_ing_piadina := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_piadina, v_giovanni_id, 'piadina', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('piadina'));
  SELECT id INTO v_ing_piadina FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('piadina') LIMIT 1;

  v_ing_piselli := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_piselli, v_giovanni_id, 'piselli', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('piselli'));
  SELECT id INTO v_ing_piselli FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('piselli') LIMIT 1;

  v_ing_pizza := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pizza, v_giovanni_id, 'pizza', 'Piatti pronti', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pizza'));
  SELECT id INTO v_ing_pizza FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pizza') LIMIT 1;

  v_ing_platessa := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_platessa, v_giovanni_id, 'platessa', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('platessa'));
  SELECT id INTO v_ing_platessa FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('platessa') LIMIT 1;

  v_ing_polpo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_polpo, v_giovanni_id, 'polpo', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('polpo'));
  SELECT id INTO v_ing_polpo FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('polpo') LIMIT 1;

  v_ing_pomodori_da_insalata := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pomodori_da_insalata, v_giovanni_id, 'pomodori da insalata', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pomodori da insalata'));
  SELECT id INTO v_ing_pomodori_da_insalata FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pomodori da insalata') LIMIT 1;

  v_ing_pomodorini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_pomodorini, v_giovanni_id, 'pomodorini', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pomodorini'));
  SELECT id INTO v_ing_pomodorini FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('pomodorini') LIMIT 1;

  v_ing_porro := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_porro, v_giovanni_id, 'porro', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('porro'));
  SELECT id INTO v_ing_porro FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('porro') LIMIT 1;

  v_ing_primosale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_primosale, v_giovanni_id, 'primosale', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('primosale'));
  SELECT id INTO v_ing_primosale FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('primosale') LIMIT 1;

  v_ing_prosciutto_cotto := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_prosciutto_cotto, v_giovanni_id, 'prosciutto cotto', 'Salumi e affettati', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('prosciutto cotto'));
  SELECT id INTO v_ing_prosciutto_cotto FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('prosciutto cotto') LIMIT 1;

  v_ing_prosciutto_crudo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_prosciutto_crudo, v_giovanni_id, 'prosciutto crudo', 'Salumi e affettati', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('prosciutto crudo'));
  SELECT id INTO v_ing_prosciutto_crudo FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('prosciutto crudo') LIMIT 1;

  v_ing_prugne := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_prugne, v_giovanni_id, 'prugne', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('prugne'));
  SELECT id INTO v_ing_prugne FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('prugne') LIMIT 1;

  v_ing_ricotta := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_ricotta, v_giovanni_id, 'ricotta', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('ricotta'));
  SELECT id INTO v_ing_ricotta FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('ricotta') LIMIT 1;

  v_ing_riso := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_riso, v_giovanni_id, 'riso', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('riso'));
  SELECT id INTO v_ing_riso FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('riso') LIMIT 1;

  v_ing_roastbeef := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_roastbeef, v_giovanni_id, 'roastbeef', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('roastbeef'));
  SELECT id INTO v_ing_roastbeef FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('roastbeef') LIMIT 1;

  v_ing_robiola := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_robiola, v_giovanni_id, 'robiola', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('robiola'));
  SELECT id INTO v_ing_robiola FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('robiola') LIMIT 1;

  v_ing_rucola := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_rucola, v_giovanni_id, 'rucola', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('rucola'));
  SELECT id INTO v_ing_rucola FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('rucola') LIMIT 1;

  v_ing_salmone := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_salmone, v_giovanni_id, 'salmone', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('salmone'));
  SELECT id INTO v_ing_salmone FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('salmone') LIMIT 1;

  v_ing_salmone_affumicato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_salmone_affumicato, v_giovanni_id, 'salmone affumicato', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('salmone affumicato'));
  SELECT id INTO v_ing_salmone_affumicato FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('salmone affumicato') LIMIT 1;

  v_ing_salsiccia := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_salsiccia, v_giovanni_id, 'salsiccia', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('salsiccia'));
  SELECT id INTO v_ing_salsiccia FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('salsiccia') LIMIT 1;

  v_ing_seppie := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_seppie, v_giovanni_id, 'seppie', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('seppie'));
  SELECT id INTO v_ing_seppie FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('seppie') LIMIT 1;

  v_ing_spigola := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_spigola, v_giovanni_id, 'spigola', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('spigola'));
  SELECT id INTO v_ing_spigola FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('spigola') LIMIT 1;

  v_ing_spinaci := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_spinaci, v_giovanni_id, 'spinaci', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('spinaci'));
  SELECT id INTO v_ing_spinaci FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('spinaci') LIMIT 1;

  v_ing_tacchino := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_tacchino, v_giovanni_id, 'tacchino', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('tacchino'));
  SELECT id INTO v_ing_tacchino FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('tacchino') LIMIT 1;

  v_ing_taccole := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_taccole, v_giovanni_id, 'taccole', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('taccole'));
  SELECT id INTO v_ing_taccole FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('taccole') LIMIT 1;

  v_ing_te := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_te, v_giovanni_id, 'te', 'Bevande', 'ml', 250, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('te'));
  SELECT id INTO v_ing_te FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('te') LIMIT 1;

  v_ing_tonno := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_tonno, v_giovanni_id, 'tonno', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('tonno'));
  SELECT id INTO v_ing_tonno FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('tonno') LIMIT 1;

  v_ing_tonno_in_scatola_al_naturale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_tonno_in_scatola_al_naturale, v_giovanni_id, 'tonno in scatola al naturale', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('tonno in scatola al naturale'));
  SELECT id INTO v_ing_tonno_in_scatola_al_naturale FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('tonno in scatola al naturale') LIMIT 1;

  v_ing_totano := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_totano, v_giovanni_id, 'totano', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('totano'));
  SELECT id INTO v_ing_totano FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('totano') LIMIT 1;

  v_ing_tris_di_verdure := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_tris_di_verdure, v_giovanni_id, 'tris di verdure', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('tris di verdure'));
  SELECT id INTO v_ing_tris_di_verdure FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('tris di verdure') LIMIT 1;

  v_ing_uova := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_uova, v_giovanni_id, 'uova', 'Uova', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('uova'));
  SELECT id INTO v_ing_uova FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('uova') LIMIT 1;

  v_ing_uova_di_gallina := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_uova_di_gallina, v_giovanni_id, 'uova di gallina', 'Uova', 'unit', 1, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('uova di gallina'));
  SELECT id INTO v_ing_uova_di_gallina FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('uova di gallina') LIMIT 1;

  v_ing_uova_di_gallina_intero := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_uova_di_gallina_intero, v_giovanni_id, 'uova di gallina intero', 'Uova', 'unit', 1, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('uova di gallina intero'));
  SELECT id INTO v_ing_uova_di_gallina_intero FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('uova di gallina intero') LIMIT 1;

  v_ing_uva := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_uva, v_giovanni_id, 'uva', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('uva'));
  SELECT id INTO v_ing_uva FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('uva') LIMIT 1;

  v_ing_valeriana := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_valeriana, v_giovanni_id, 'valeriana', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('valeriana'));
  SELECT id INTO v_ing_valeriana FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('valeriana') LIMIT 1;

  v_ing_yogurt_greco := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_yogurt_greco, v_giovanni_id, 'yogurt greco', 'Latticini e yogurt', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('yogurt greco'));
  SELECT id INTO v_ing_yogurt_greco FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('yogurt greco') LIMIT 1;

  v_ing_yogurt_scremato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_yogurt_scremato, v_giovanni_id, 'yogurt scremato', 'Latticini e yogurt', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('yogurt scremato'));
  SELECT id INTO v_ing_yogurt_scremato FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('yogurt scremato') LIMIT 1;

  v_ing_zucca := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_zucca, v_giovanni_id, 'zucca', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('zucca'));
  SELECT id INTO v_ing_zucca FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('zucca') LIMIT 1;

  v_ing_zucchine := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_zucchine, v_giovanni_id, 'zucchine', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('zucchine'));
  SELECT id INTO v_ing_zucchine FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('zucchine') LIMIT 1;

  v_ing_zuppa_del_casale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing_zuppa_del_casale, v_giovanni_id, 'zuppa del casale', 'Piatti pronti', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('zuppa del casale'));
  SELECT id INTO v_ing_zuppa_del_casale FROM ingredients WHERE "userId" = v_giovanni_id AND lower(name) = lower('zuppa del casale') LIMIT 1;

  -- ─── INGREDIENTS (owned by Giovanna) ───────────────────────
  v_ing2_albicocche := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_albicocche, v_giovanna_id, 'albicocche', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('albicocche'));
  SELECT id INTO v_ing2_albicocche FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('albicocche') LIMIT 1;

  v_ing2_albume := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_albume, v_giovanna_id, 'albume', 'Uova', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('albume'));
  SELECT id INTO v_ing2_albume FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('albume') LIMIT 1;

  v_ing2_alici := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_alici, v_giovanna_id, 'alici', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('alici'));
  SELECT id INTO v_ing2_alici FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('alici') LIMIT 1;

  v_ing2_ananas := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_ananas, v_giovanna_id, 'ananas', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('ananas'));
  SELECT id INTO v_ing2_ananas FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('ananas') LIMIT 1;

  v_ing2_anguria := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_anguria, v_giovanna_id, 'anguria', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('anguria'));
  SELECT id INTO v_ing2_anguria FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('anguria') LIMIT 1;

  v_ing2_arance := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_arance, v_giovanna_id, 'arance', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('arance'));
  SELECT id INTO v_ing2_arance FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('arance') LIMIT 1;

  v_ing2_arista_di_maiale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_arista_di_maiale, v_giovanna_id, 'arista di maiale', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('arista di maiale'));
  SELECT id INTO v_ing2_arista_di_maiale FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('arista di maiale') LIMIT 1;

  v_ing2_banana := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_banana, v_giovanna_id, 'banana', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('banana'));
  SELECT id INTO v_ing2_banana FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('banana') LIMIT 1;

  v_ing2_bastoncini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_bastoncini, v_giovanna_id, 'bastoncini', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bastoncini'));
  SELECT id INTO v_ing2_bastoncini FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bastoncini') LIMIT 1;

  v_ing2_bevanda_di_riso := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_bevanda_di_riso, v_giovanna_id, 'bevanda di riso', 'Bevande vegetali', 'ml', 200, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bevanda di riso'));
  SELECT id INTO v_ing2_bevanda_di_riso FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bevanda di riso') LIMIT 1;

  v_ing2_bevanda_di_soia := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_bevanda_di_soia, v_giovanna_id, 'bevanda di soia', 'Bevande vegetali', 'ml', 200, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bevanda di soia'));
  SELECT id INTO v_ing2_bevanda_di_soia FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bevanda di soia') LIMIT 1;

  v_ing2_bieta := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_bieta, v_giovanna_id, 'bieta', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bieta'));
  SELECT id INTO v_ing2_bieta FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bieta') LIMIT 1;

  v_ing2_bietole := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_bietole, v_giovanna_id, 'bietole', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bietole'));
  SELECT id INTO v_ing2_bietole FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bietole') LIMIT 1;

  v_ing2_biscotti_magretti := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_biscotti_magretti, v_giovanna_id, 'biscotti magretti', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('biscotti magretti'));
  SELECT id INTO v_ing2_biscotti_magretti FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('biscotti magretti') LIMIT 1;

  v_ing2_biscotti_misura_privolat := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_biscotti_misura_privolat, v_giovanna_id, 'biscotti misura privolat', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('biscotti misura privolat'));
  SELECT id INTO v_ing2_biscotti_misura_privolat FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('biscotti misura privolat') LIMIT 1;

  v_ing2_biscotti_orosaiwa := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_biscotti_orosaiwa, v_giovanna_id, 'biscotti orosaiwa', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('biscotti orosaiwa'));
  SELECT id INTO v_ing2_biscotti_orosaiwa FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('biscotti orosaiwa') LIMIT 1;

  v_ing2_bresaola := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_bresaola, v_giovanna_id, 'bresaola', 'Salumi e affettati', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bresaola'));
  SELECT id INTO v_ing2_bresaola FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('bresaola') LIMIT 1;

  v_ing2_broccoli := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_broccoli, v_giovanna_id, 'broccoli', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('broccoli'));
  SELECT id INTO v_ing2_broccoli FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('broccoli') LIMIT 1;

  v_ing2_burro_di_arachidi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_burro_di_arachidi, v_giovanna_id, 'burro di arachidi', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('burro di arachidi'));
  SELECT id INTO v_ing2_burro_di_arachidi FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('burro di arachidi') LIMIT 1;

  v_ing2_cachi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_cachi, v_giovanna_id, 'cachi', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cachi'));
  SELECT id INTO v_ing2_cachi FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cachi') LIMIT 1;

  v_ing2_calamaro := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_calamaro, v_giovanna_id, 'calamaro', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('calamaro'));
  SELECT id INTO v_ing2_calamaro FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('calamaro') LIMIT 1;

  v_ing2_caponata := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_caponata, v_giovanna_id, 'caponata', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('caponata'));
  SELECT id INTO v_ing2_caponata FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('caponata') LIMIT 1;

  v_ing2_carote := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_carote, v_giovanna_id, 'carote', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('carote'));
  SELECT id INTO v_ing2_carote FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('carote') LIMIT 1;

  v_ing2_ceci_cotti := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_ceci_cotti, v_giovanna_id, 'ceci cotti', 'Legumi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('ceci cotti'));
  SELECT id INTO v_ing2_ceci_cotti FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('ceci cotti') LIMIT 1;

  v_ing2_cereali_g_galbusera := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_cereali_g_galbusera, v_giovanna_id, 'cereali g galbusera', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cereali g galbusera'));
  SELECT id INTO v_ing2_cereali_g_galbusera FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cereali g galbusera') LIMIT 1;

  v_ing2_cheerios := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_cheerios, v_giovanna_id, 'cheerios', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cheerios'));
  SELECT id INTO v_ing2_cheerios FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cheerios') LIMIT 1;

  v_ing2_cicoria := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_cicoria, v_giovanna_id, 'cicoria', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cicoria'));
  SELECT id INTO v_ing2_cicoria FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cicoria') LIMIT 1;

  v_ing2_ciliegie := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_ciliegie, v_giovanna_id, 'ciliegie', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('ciliegie'));
  SELECT id INTO v_ing2_ciliegie FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('ciliegie') LIMIT 1;

  v_ing2_cioccolato_fondente := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_cioccolato_fondente, v_giovanna_id, 'cioccolato fondente', 'Dolci e snack', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cioccolato fondente'));
  SELECT id INTO v_ing2_cioccolato_fondente FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cioccolato fondente') LIMIT 1;

  v_ing2_cornflakes := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_cornflakes, v_giovanna_id, 'cornflakes', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cornflakes'));
  SELECT id INTO v_ing2_cornflakes FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cornflakes') LIMIT 1;

  v_ing2_cous_cous := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_cous_cous, v_giovanna_id, 'cous cous', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cous cous'));
  SELECT id INTO v_ing2_cous_cous FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('cous cous') LIMIT 1;

  v_ing2_crackers_riso_su_riso := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_crackers_riso_su_riso, v_giovanna_id, 'crackers riso su riso', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('crackers riso su riso'));
  SELECT id INTO v_ing2_crackers_riso_su_riso FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('crackers riso su riso') LIMIT 1;

  v_ing2_crostini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_crostini, v_giovanna_id, 'crostini', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('crostini'));
  SELECT id INTO v_ing2_crostini FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('crostini') LIMIT 1;

  v_ing2_dietetic_dolcificante := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_dietetic_dolcificante, v_giovanna_id, 'dietetic dolcificante', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('dietetic dolcificante'));
  SELECT id INTO v_ing2_dietetic_dolcificante FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('dietetic dolcificante') LIMIT 1;

  v_ing2_fagiolini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_fagiolini, v_giovanna_id, 'fagiolini', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fagiolini'));
  SELECT id INTO v_ing2_fagiolini FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fagiolini') LIMIT 1;

  v_ing2_farina_di_riso := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_farina_di_riso, v_giovanna_id, 'farina di riso', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('farina di riso'));
  SELECT id INTO v_ing2_farina_di_riso FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('farina di riso') LIMIT 1;

  v_ing2_farino_di_avena := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_farino_di_avena, v_giovanna_id, 'farino di avena', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('farino di avena'));
  SELECT id INTO v_ing2_farino_di_avena FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('farino di avena') LIMIT 1;

  v_ing2_fesa_di_tacchino := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_fesa_di_tacchino, v_giovanna_id, 'fesa di tacchino', 'Salumi e affettati', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fesa di tacchino'));
  SELECT id INTO v_ing2_fesa_di_tacchino FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fesa di tacchino') LIMIT 1;

  v_ing2_feta := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_feta, v_giovanna_id, 'feta', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('feta'));
  SELECT id INTO v_ing2_feta FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('feta') LIMIT 1;

  v_ing2_fette_biscottate := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_fette_biscottate, v_giovanna_id, 'fette biscottate', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fette biscottate'));
  SELECT id INTO v_ing2_fette_biscottate FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fette biscottate') LIMIT 1;

  v_ing2_filetto_di_manzo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_filetto_di_manzo, v_giovanna_id, 'filetto di manzo', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('filetto di manzo'));
  SELECT id INTO v_ing2_filetto_di_manzo FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('filetto di manzo') LIMIT 1;

  v_ing2_finocchi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_finocchi, v_giovanna_id, 'finocchi', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('finocchi'));
  SELECT id INTO v_ing2_finocchi FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('finocchi') LIMIT 1;

  v_ing2_fiocchi_di_avena := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_fiocchi_di_avena, v_giovanna_id, 'fiocchi di avena', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fiocchi di avena'));
  SELECT id INTO v_ing2_fiocchi_di_avena FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fiocchi di avena') LIMIT 1;

  v_ing2_fiocchi_di_latte := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_fiocchi_di_latte, v_giovanna_id, 'fiocchi di latte', 'Latticini e yogurt', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fiocchi di latte'));
  SELECT id INTO v_ing2_fiocchi_di_latte FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fiocchi di latte') LIMIT 1;

  v_ing2_fior_di_latte := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_fior_di_latte, v_giovanna_id, 'fior di latte', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fior di latte'));
  SELECT id INTO v_ing2_fior_di_latte FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fior di latte') LIMIT 1;

  v_ing2_fragole := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_fragole, v_giovanna_id, 'fragole', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fragole'));
  SELECT id INTO v_ing2_fragole FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fragole') LIMIT 1;

  v_ing2_fresella := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_fresella, v_giovanna_id, 'fresella', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fresella'));
  SELECT id INTO v_ing2_fresella FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('fresella') LIMIT 1;

  v_ing2_frutta_fresca := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_frutta_fresca, v_giovanna_id, 'frutta fresca', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('frutta fresca'));
  SELECT id INTO v_ing2_frutta_fresca FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('frutta fresca') LIMIT 1;

  v_ing2_frutta_secca := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_frutta_secca, v_giovanna_id, 'frutta secca', 'Frutta secca e noci', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('frutta secca'));
  SELECT id INTO v_ing2_frutta_secca FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('frutta secca') LIMIT 1;

  v_ing2_frutta_sotto_vuoto := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_frutta_sotto_vuoto, v_giovanna_id, 'frutta sotto vuoto', 'Frutta', 'unit', 1, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('frutta sotto vuoto'));
  SELECT id INTO v_ing2_frutta_sotto_vuoto FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('frutta sotto vuoto') LIMIT 1;

  v_ing2_funghi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_funghi, v_giovanna_id, 'funghi', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('funghi'));
  SELECT id INTO v_ing2_funghi FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('funghi') LIMIT 1;

  v_ing2_hamburger_di_pollo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_hamburger_di_pollo, v_giovanna_id, 'hamburger di pollo', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('hamburger di pollo'));
  SELECT id INTO v_ing2_hamburger_di_pollo FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('hamburger di pollo') LIMIT 1;

  v_ing2_hamburger_di_soia := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_hamburger_di_soia, v_giovanna_id, 'hamburger di soia', 'Legumi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('hamburger di soia'));
  SELECT id INTO v_ing2_hamburger_di_soia FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('hamburger di soia') LIMIT 1;

  v_ing2_hamburger_vegetale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_hamburger_vegetale, v_giovanna_id, 'hamburger vegetale', 'Legumi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('hamburger vegetale'));
  SELECT id INTO v_ing2_hamburger_vegetale FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('hamburger vegetale') LIMIT 1;

  v_ing2_kefir := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_kefir, v_giovanna_id, 'kefir', 'Latticini e yogurt', 'ml', 200, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('kefir'));
  SELECT id INTO v_ing2_kefir FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('kefir') LIMIT 1;

  v_ing2_kiwi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_kiwi, v_giovanna_id, 'kiwi', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('kiwi'));
  SELECT id INTO v_ing2_kiwi FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('kiwi') LIMIT 1;

  v_ing2_lamponi := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_lamponi, v_giovanna_id, 'lamponi', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lamponi'));
  SELECT id INTO v_ing2_lamponi FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lamponi') LIMIT 1;

  v_ing2_latte_scramato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_latte_scramato, v_giovanna_id, 'latte scramato', 'Latticini e yogurt', 'ml', 200, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('latte scramato'));
  SELECT id INTO v_ing2_latte_scramato FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('latte scramato') LIMIT 1;

  v_ing2_lattuga := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_lattuga, v_giovanna_id, 'lattuga', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lattuga'));
  SELECT id INTO v_ing2_lattuga FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lattuga') LIMIT 1;

  v_ing2_lenticchie_decorticate := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_lenticchie_decorticate, v_giovanna_id, 'lenticchie decorticate', 'Legumi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lenticchie decorticate'));
  SELECT id INTO v_ing2_lenticchie_decorticate FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lenticchie decorticate') LIMIT 1;

  v_ing2_lievito_in_polvere := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_lievito_in_polvere, v_giovanna_id, 'lievito in polvere', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lievito in polvere'));
  SELECT id INTO v_ing2_lievito_in_polvere FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lievito in polvere') LIMIT 1;

  v_ing2_lonza := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_lonza, v_giovanna_id, 'lonza', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lonza'));
  SELECT id INTO v_ing2_lonza FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('lonza') LIMIT 1;

  v_ing2_mais := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_mais, v_giovanna_id, 'mais', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('mais'));
  SELECT id INTO v_ing2_mais FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('mais') LIMIT 1;

  v_ing2_mandarini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_mandarini, v_giovanna_id, 'mandarini', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('mandarini'));
  SELECT id INTO v_ing2_mandarini FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('mandarini') LIMIT 1;

  v_ing2_manzo_magro := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_manzo_magro, v_giovanna_id, 'manzo magro', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('manzo magro'));
  SELECT id INTO v_ing2_manzo_magro FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('manzo magro') LIMIT 1;

  v_ing2_manzo_magro_macinato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_manzo_magro_macinato, v_giovanna_id, 'manzo magro macinato', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('manzo magro macinato'));
  SELECT id INTO v_ing2_manzo_magro_macinato FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('manzo magro macinato') LIMIT 1;

  v_ing2_marmellata := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_marmellata, v_giovanna_id, 'marmellata', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('marmellata'));
  SELECT id INTO v_ing2_marmellata FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('marmellata') LIMIT 1;

  v_ing2_mela := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_mela, v_giovanna_id, 'mela', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('mela'));
  SELECT id INTO v_ing2_mela FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('mela') LIMIT 1;

  v_ing2_melanzane := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_melanzane, v_giovanna_id, 'melanzane', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('melanzane'));
  SELECT id INTO v_ing2_melanzane FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('melanzane') LIMIT 1;

  v_ing2_melone := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_melone, v_giovanna_id, 'melone', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('melone'));
  SELECT id INTO v_ing2_melone FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('melone') LIMIT 1;

  v_ing2_merluzzo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_merluzzo, v_giovanna_id, 'merluzzo', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('merluzzo'));
  SELECT id INTO v_ing2_merluzzo FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('merluzzo') LIMIT 1;

  v_ing2_miele := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_miele, v_giovanna_id, 'miele', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('miele'));
  SELECT id INTO v_ing2_miele FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('miele') LIMIT 1;

  v_ing2_minestrone_leggerezza := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_minestrone_leggerezza, v_giovanna_id, 'minestrone leggerezza', 'Piatti pronti', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('minestrone leggerezza'));
  SELECT id INTO v_ing2_minestrone_leggerezza FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('minestrone leggerezza') LIMIT 1;

  v_ing2_mirtilli := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_mirtilli, v_giovanna_id, 'mirtilli', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('mirtilli'));
  SELECT id INTO v_ing2_mirtilli FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('mirtilli') LIMIT 1;

  v_ing2_noci := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_noci, v_giovanna_id, 'noci', 'Frutta secca e noci', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('noci'));
  SELECT id INTO v_ing2_noci FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('noci') LIMIT 1;

  v_ing2_orata := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_orata, v_giovanna_id, 'orata', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('orata'));
  SELECT id INTO v_ing2_orata FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('orata') LIMIT 1;

  v_ing2_pane := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pane, v_giovanna_id, 'pane', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pane'));
  SELECT id INTO v_ing2_pane FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pane') LIMIT 1;

  v_ing2_pane_tostato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pane_tostato, v_giovanna_id, 'pane tostato', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pane tostato'));
  SELECT id INTO v_ing2_pane_tostato FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pane tostato') LIMIT 1;

  v_ing2_pangrattato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pangrattato, v_giovanna_id, 'pangrattato', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pangrattato'));
  SELECT id INTO v_ing2_pangrattato FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pangrattato') LIMIT 1;

  v_ing2_panino := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_panino, v_giovanna_id, 'panino', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('panino'));
  SELECT id INTO v_ing2_panino FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('panino') LIMIT 1;

  v_ing2_panko := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_panko, v_giovanna_id, 'panko', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('panko'));
  SELECT id INTO v_ing2_panko FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('panko') LIMIT 1;

  v_ing2_parmigiano := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_parmigiano, v_giovanna_id, 'parmigiano', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('parmigiano'));
  SELECT id INTO v_ing2_parmigiano FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('parmigiano') LIMIT 1;

  v_ing2_passata_di_pomodoro := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_passata_di_pomodoro, v_giovanna_id, 'passata di pomodoro', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('passata di pomodoro'));
  SELECT id INTO v_ing2_passata_di_pomodoro FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('passata di pomodoro') LIMIT 1;

  v_ing2_pasta := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pasta, v_giovanna_id, 'pasta', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pasta'));
  SELECT id INTO v_ing2_pasta FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pasta') LIMIT 1;

  v_ing2_patate := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_patate, v_giovanna_id, 'patate', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('patate'));
  SELECT id INTO v_ing2_patate FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('patate') LIMIT 1;

  v_ing2_peperoni := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_peperoni, v_giovanna_id, 'peperoni', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('peperoni'));
  SELECT id INTO v_ing2_peperoni FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('peperoni') LIMIT 1;

  v_ing2_pera := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pera, v_giovanna_id, 'pera', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pera'));
  SELECT id INTO v_ing2_pera FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pera') LIMIT 1;

  v_ing2_persico := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_persico, v_giovanna_id, 'persico', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('persico'));
  SELECT id INTO v_ing2_persico FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('persico') LIMIT 1;

  v_ing2_pesche := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pesche, v_giovanna_id, 'pesche', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pesche'));
  SELECT id INTO v_ing2_pesche FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pesche') LIMIT 1;

  v_ing2_pesto := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pesto, v_giovanna_id, 'pesto', 'Condimenti e salse', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pesto'));
  SELECT id INTO v_ing2_pesto FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pesto') LIMIT 1;

  v_ing2_petto_di_pollo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_petto_di_pollo, v_giovanna_id, 'petto di pollo', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('petto di pollo'));
  SELECT id INTO v_ing2_petto_di_pollo FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('petto di pollo') LIMIT 1;

  v_ing2_philadelphia := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_philadelphia, v_giovanna_id, 'philadelphia', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('philadelphia'));
  SELECT id INTO v_ing2_philadelphia FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('philadelphia') LIMIT 1;

  v_ing2_piadina := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_piadina, v_giovanna_id, 'piadina', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('piadina'));
  SELECT id INTO v_ing2_piadina FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('piadina') LIMIT 1;

  v_ing2_piselli := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_piselli, v_giovanna_id, 'piselli', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('piselli'));
  SELECT id INTO v_ing2_piselli FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('piselli') LIMIT 1;

  v_ing2_pizza := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pizza, v_giovanna_id, 'pizza', 'Piatti pronti', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pizza'));
  SELECT id INTO v_ing2_pizza FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pizza') LIMIT 1;

  v_ing2_platessa := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_platessa, v_giovanna_id, 'platessa', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('platessa'));
  SELECT id INTO v_ing2_platessa FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('platessa') LIMIT 1;

  v_ing2_polpo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_polpo, v_giovanna_id, 'polpo', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('polpo'));
  SELECT id INTO v_ing2_polpo FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('polpo') LIMIT 1;

  v_ing2_pomodori_da_insalata := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pomodori_da_insalata, v_giovanna_id, 'pomodori da insalata', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pomodori da insalata'));
  SELECT id INTO v_ing2_pomodori_da_insalata FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pomodori da insalata') LIMIT 1;

  v_ing2_pomodorini := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_pomodorini, v_giovanna_id, 'pomodorini', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pomodorini'));
  SELECT id INTO v_ing2_pomodorini FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('pomodorini') LIMIT 1;

  v_ing2_porro := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_porro, v_giovanna_id, 'porro', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('porro'));
  SELECT id INTO v_ing2_porro FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('porro') LIMIT 1;

  v_ing2_primosale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_primosale, v_giovanna_id, 'primosale', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('primosale'));
  SELECT id INTO v_ing2_primosale FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('primosale') LIMIT 1;

  v_ing2_prosciutto_cotto := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_prosciutto_cotto, v_giovanna_id, 'prosciutto cotto', 'Salumi e affettati', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('prosciutto cotto'));
  SELECT id INTO v_ing2_prosciutto_cotto FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('prosciutto cotto') LIMIT 1;

  v_ing2_prosciutto_crudo := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_prosciutto_crudo, v_giovanna_id, 'prosciutto crudo', 'Salumi e affettati', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('prosciutto crudo'));
  SELECT id INTO v_ing2_prosciutto_crudo FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('prosciutto crudo') LIMIT 1;

  v_ing2_prugne := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_prugne, v_giovanna_id, 'prugne', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('prugne'));
  SELECT id INTO v_ing2_prugne FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('prugne') LIMIT 1;

  v_ing2_ricotta := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_ricotta, v_giovanna_id, 'ricotta', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('ricotta'));
  SELECT id INTO v_ing2_ricotta FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('ricotta') LIMIT 1;

  v_ing2_riso := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_riso, v_giovanna_id, 'riso', 'Cereali e prodotti da forno', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('riso'));
  SELECT id INTO v_ing2_riso FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('riso') LIMIT 1;

  v_ing2_roastbeef := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_roastbeef, v_giovanna_id, 'roastbeef', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('roastbeef'));
  SELECT id INTO v_ing2_roastbeef FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('roastbeef') LIMIT 1;

  v_ing2_robiola := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_robiola, v_giovanna_id, 'robiola', 'Formaggi', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('robiola'));
  SELECT id INTO v_ing2_robiola FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('robiola') LIMIT 1;

  v_ing2_rucola := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_rucola, v_giovanna_id, 'rucola', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('rucola'));
  SELECT id INTO v_ing2_rucola FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('rucola') LIMIT 1;

  v_ing2_salmone := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_salmone, v_giovanna_id, 'salmone', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('salmone'));
  SELECT id INTO v_ing2_salmone FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('salmone') LIMIT 1;

  v_ing2_salmone_affumicato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_salmone_affumicato, v_giovanna_id, 'salmone affumicato', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('salmone affumicato'));
  SELECT id INTO v_ing2_salmone_affumicato FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('salmone affumicato') LIMIT 1;

  v_ing2_salsiccia := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_salsiccia, v_giovanna_id, 'salsiccia', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('salsiccia'));
  SELECT id INTO v_ing2_salsiccia FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('salsiccia') LIMIT 1;

  v_ing2_seppie := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_seppie, v_giovanna_id, 'seppie', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('seppie'));
  SELECT id INTO v_ing2_seppie FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('seppie') LIMIT 1;

  v_ing2_spigola := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_spigola, v_giovanna_id, 'spigola', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('spigola'));
  SELECT id INTO v_ing2_spigola FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('spigola') LIMIT 1;

  v_ing2_spinaci := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_spinaci, v_giovanna_id, 'spinaci', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('spinaci'));
  SELECT id INTO v_ing2_spinaci FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('spinaci') LIMIT 1;

  v_ing2_tacchino := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_tacchino, v_giovanna_id, 'tacchino', 'Carne', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('tacchino'));
  SELECT id INTO v_ing2_tacchino FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('tacchino') LIMIT 1;

  v_ing2_taccole := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_taccole, v_giovanna_id, 'taccole', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('taccole'));
  SELECT id INTO v_ing2_taccole FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('taccole') LIMIT 1;

  v_ing2_te := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_te, v_giovanna_id, 'te', 'Bevande', 'ml', 250, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('te'));
  SELECT id INTO v_ing2_te FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('te') LIMIT 1;

  v_ing2_tonno := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_tonno, v_giovanna_id, 'tonno', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('tonno'));
  SELECT id INTO v_ing2_tonno FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('tonno') LIMIT 1;

  v_ing2_tonno_in_scatola_al_naturale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_tonno_in_scatola_al_naturale, v_giovanna_id, 'tonno in scatola al naturale', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('tonno in scatola al naturale'));
  SELECT id INTO v_ing2_tonno_in_scatola_al_naturale FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('tonno in scatola al naturale') LIMIT 1;

  v_ing2_totano := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_totano, v_giovanna_id, 'totano', 'Pesce e frutti di mare', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('totano'));
  SELECT id INTO v_ing2_totano FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('totano') LIMIT 1;

  v_ing2_tris_di_verdure := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_tris_di_verdure, v_giovanna_id, 'tris di verdure', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('tris di verdure'));
  SELECT id INTO v_ing2_tris_di_verdure FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('tris di verdure') LIMIT 1;

  v_ing2_uova := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_uova, v_giovanna_id, 'uova', 'Uova', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('uova'));
  SELECT id INTO v_ing2_uova FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('uova') LIMIT 1;

  v_ing2_uova_di_gallina := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_uova_di_gallina, v_giovanna_id, 'uova di gallina', 'Uova', 'unit', 1, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('uova di gallina'));
  SELECT id INTO v_ing2_uova_di_gallina FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('uova di gallina') LIMIT 1;

  v_ing2_uova_di_gallina_intero := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_uova_di_gallina_intero, v_giovanna_id, 'uova di gallina intero', 'Uova', 'unit', 1, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('uova di gallina intero'));
  SELECT id INTO v_ing2_uova_di_gallina_intero FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('uova di gallina intero') LIMIT 1;

  v_ing2_uva := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_uva, v_giovanna_id, 'uva', 'Frutta', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('uva'));
  SELECT id INTO v_ing2_uva FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('uva') LIMIT 1;

  v_ing2_valeriana := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_valeriana, v_giovanna_id, 'valeriana', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('valeriana'));
  SELECT id INTO v_ing2_valeriana FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('valeriana') LIMIT 1;

  v_ing2_yogurt_greco := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_yogurt_greco, v_giovanna_id, 'yogurt greco', 'Latticini e yogurt', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('yogurt greco'));
  SELECT id INTO v_ing2_yogurt_greco FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('yogurt greco') LIMIT 1;

  v_ing2_yogurt_scremato := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_yogurt_scremato, v_giovanna_id, 'yogurt scremato', 'Latticini e yogurt', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('yogurt scremato'));
  SELECT id INTO v_ing2_yogurt_scremato FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('yogurt scremato') LIMIT 1;

  v_ing2_zucca := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_zucca, v_giovanna_id, 'zucca', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('zucca'));
  SELECT id INTO v_ing2_zucca FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('zucca') LIMIT 1;

  v_ing2_zucchine := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_zucchine, v_giovanna_id, 'zucchine', 'Verdure', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('zucchine'));
  SELECT id INTO v_ing2_zucchine FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('zucchine') LIMIT 1;

  v_ing2_zuppa_del_casale := gen_random_uuid();
  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")
  SELECT v_ing2_zuppa_del_casale, v_giovanna_id, 'zuppa del casale', 'Piatti pronti', 'gr', 100, NOW(), NOW()
  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('zuppa del casale'));
  SELECT id INTO v_ing2_zuppa_del_casale FROM ingredients WHERE "userId" = v_giovanna_id AND lower(name) = lower('zuppa del casale') LIMIT 1;

  -- ─── WEEKLY MENU for giovanni.limatola@gmail.com ──────────────────────────────
  v_menu_id := gen_random_uuid();
  INSERT INTO weekly_menus (id, "userId", "weekStart", "createdAt")
  SELECT v_menu_id, v_giovanni_id, '2026-03-16', NOW()
  WHERE NOT EXISTS (SELECT 1 FROM weekly_menus WHERE "userId" = v_giovanni_id AND "weekStart" = '2026-03-16');
  SELECT id INTO v_menu_id FROM weekly_menus WHERE "userId" = v_giovanni_id AND "weekStart" = '2026-03-16' LIMIT 1;

  -- Lunedì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 1
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 1);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 1 LIMIT 1;

  -- Lunedì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_yogurt_greco, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_yogurt_greco);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_cheerios, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_cheerios);

  -- Lunedì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_banana, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_banana);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_frutta_secca, 20, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_frutta_secca);

  -- Lunedì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_zucchine, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_zucchine);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_fiocchi_di_latte, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_fiocchi_di_latte);

  -- Lunedì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_fesa_di_tacchino, 120, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_fesa_di_tacchino);

  -- Lunedì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_petto_di_pollo, 280, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_petto_di_pollo);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_peperoni, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_peperoni);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_panko, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_panko);

  -- Martedì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 2
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 2);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 2 LIMIT 1;

  -- Martedì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_te, 300, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_te);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 40, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_marmellata, 20, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_marmellata);

  -- Martedì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_banana, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_banana);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_frutta_secca, 25, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_frutta_secca);

  -- Martedì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_salmone_affumicato, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_salmone_affumicato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pomodori_da_insalata, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pomodori_da_insalata);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_valeriana, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_valeriana);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);

  -- Martedì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_crackers_riso_su_riso, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_crackers_riso_su_riso);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_parmigiano, 40, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_parmigiano);

  -- Martedì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_piadina, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_piadina);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_fesa_di_tacchino, 120, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_fesa_di_tacchino);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_philadelphia, 25, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_philadelphia);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_rucola, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_rucola);

  -- Mercoledì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 3
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 3);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 3 LIMIT 1;

  -- Mercoledì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_yogurt_greco, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_yogurt_greco);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_cheerios, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_cheerios);

  -- Mercoledì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_banana, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_banana);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_frutta_secca, 20, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_frutta_secca);

  -- Mercoledì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_uova_di_gallina_intero, 120, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_uova_di_gallina_intero);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_tris_di_verdure, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_tris_di_verdure);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);

  -- Mercoledì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_prosciutto_cotto, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_prosciutto_cotto);

  -- Mercoledì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_polpo, 350, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_polpo);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_patate, 350, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_patate);

  -- Giovedì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 4
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 4);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 4 LIMIT 1;

  -- Giovedì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_te, 1, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_te);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 40, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_marmellata, 20, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_marmellata);

  -- Giovedì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_banana, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_banana);

  -- Giovedì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pasta, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pasta);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_spinaci, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_spinaci);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_ricotta, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_ricotta);

  -- Giovedì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_yogurt_greco, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_yogurt_greco);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_banana, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_banana);

  -- Giovedì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_tris_di_verdure, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_tris_di_verdure);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_prosciutto_cotto, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_prosciutto_cotto);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_parmigiano, 20, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_parmigiano);

  -- Venerdì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 5
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 5);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 5 LIMIT 1;

  -- Venerdì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_yogurt_greco, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_yogurt_greco);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_cheerios, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_cheerios);

  -- Venerdì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_cereali_g_galbusera, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_cereali_g_galbusera);

  -- Venerdì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pasta, 80, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pasta);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pesto, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pesto);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_fesa_di_tacchino, 120, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_fesa_di_tacchino);

  -- Venerdì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_yogurt_greco, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_yogurt_greco);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_banana, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_banana);

  -- Venerdì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_roastbeef, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_roastbeef);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_lattuga, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_lattuga);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);

  -- Sabato
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 6
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 6);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 6 LIMIT 1;

  -- Sabato BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_te, 1, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_te);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 40, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_marmellata, 20, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_marmellata);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_burro_di_arachidi, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_burro_di_arachidi);

  -- Sabato MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_banana, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_banana);

  -- Sabato AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 60, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_prosciutto_crudo, 80, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_prosciutto_crudo);

  -- Domenica
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 7
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 7);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 7 LIMIT 1;

  -- Domenica BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_te, 300, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_te);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_fette_biscottate, 40, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_fette_biscottate);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_marmellata, 20, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_marmellata);

  -- Domenica MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_banana, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_banana);

  -- Domenica AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_banana, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_banana);

  -- Domenica DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_pane_tostato, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_pane_tostato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_tris_di_verdure, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_tris_di_verdure);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing_hamburger_vegetale, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing_hamburger_vegetale);

  -- ─── WEEKLY MENU for ggiacobonep@gmail.com ──────────────────────────────
  v_menu_id := gen_random_uuid();
  INSERT INTO weekly_menus (id, "userId", "weekStart", "createdAt")
  SELECT v_menu_id, v_giovanna_id, '2026-03-16', NOW()
  WHERE NOT EXISTS (SELECT 1 FROM weekly_menus WHERE "userId" = v_giovanna_id AND "weekStart" = '2026-03-16');
  SELECT id INTO v_menu_id FROM weekly_menus WHERE "userId" = v_giovanna_id AND "weekStart" = '2026-03-16' LIMIT 1;

  -- Lunedì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 1
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 1);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 1 LIMIT 1;

  -- Lunedì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_latte_scramato, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_latte_scramato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_biscotti_misura_privolat, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_biscotti_misura_privolat);

  -- Lunedì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_secca, 25, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_secca);

  -- Lunedì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_zucchine, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_zucchine);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_philadelphia, 80, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_philadelphia);

  -- Lunedì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_yogurt_greco, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_yogurt_greco);

  -- Lunedì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_petto_di_pollo, 180, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_petto_di_pollo);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_panko, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_panko);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_zucca, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_zucca);

  -- Martedì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 2
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 2);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 2 LIMIT 1;

  -- Martedì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_latte_scramato, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_latte_scramato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_cheerios, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_cheerios);

  -- Martedì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_sotto_vuoto, 2, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_sotto_vuoto);

  -- Martedì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_salmone_affumicato, 80, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_salmone_affumicato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_valeriana, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_valeriana);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_pomodori_da_insalata, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_pomodori_da_insalata);

  -- Martedì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_sotto_vuoto, 2, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_sotto_vuoto);

  -- Martedì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_piadina, 80, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_piadina);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_fesa_di_tacchino, 60, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_fesa_di_tacchino);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_philadelphia, 25, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_philadelphia);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_valeriana, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_valeriana);

  -- Mercoledì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 3
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 3);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 3 LIMIT 1;

  -- Mercoledì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_latte_scramato, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_latte_scramato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_biscotti_misura_privolat, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_biscotti_misura_privolat);

  -- Mercoledì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_sotto_vuoto, 2, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_sotto_vuoto);

  -- Mercoledì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_uova, 2, 'unit'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_uova);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_funghi, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_funghi);

  -- Mercoledì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_pane_tostato, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_pane_tostato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_miele, 10, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_miele);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_noci, 15, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_noci);

  -- Mercoledì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_polpo, 300, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_polpo);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_patate, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_patate);

  -- Giovedì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 4
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 4);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 4 LIMIT 1;

  -- Giovedì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_latte_scramato, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_latte_scramato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_cheerios, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_cheerios);

  -- Giovedì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_sotto_vuoto, 2, 'unit'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_sotto_vuoto);

  -- Giovedì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_ricotta, 100, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_ricotta);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_spinaci, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_spinaci);

  -- Giovedì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_sotto_vuoto, 2, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_sotto_vuoto);

  -- Giovedì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_prosciutto_cotto, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_prosciutto_cotto);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_crostini, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_crostini);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_minestrone_leggerezza, 250, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_minestrone_leggerezza);

  -- Venerdì
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 5
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 5);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 5 LIMIT 1;

  -- Venerdì BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_latte_scramato, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_latte_scramato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_cheerios, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_cheerios);

  -- Venerdì MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_sotto_vuoto, 2, 'unit'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_sotto_vuoto);

  -- Venerdì LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_riso, 50, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_riso);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_piselli, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_piselli);

  -- Venerdì AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_yogurt_greco, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_yogurt_greco);

  -- Venerdì DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_roastbeef, 180, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_roastbeef);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_melanzane, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_melanzane);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_patate, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_patate);

  -- Sabato
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 6
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 6);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 6 LIMIT 1;

  -- Sabato BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_latte_scramato, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_latte_scramato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_cheerios, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_cheerios);

  -- Sabato MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_secca, 25, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_secca);

  -- Sabato LUNCH
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'LUNCH'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'LUNCH' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_salmone, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_salmone);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_pomodori_da_insalata, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_pomodori_da_insalata);

  -- Sabato AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_sotto_vuoto, 2, 'unit'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_sotto_vuoto);

  -- Domenica
  v_day_id := gen_random_uuid();
  INSERT INTO menu_days (id, "menuId", "dayOfWeek")
  SELECT v_day_id, v_menu_id, 7
  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 7);
  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = 7 LIMIT 1;

  -- Domenica BREAKFAST
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'BREAKFAST'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'BREAKFAST' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_latte_scramato, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_latte_scramato);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_cheerios, 30, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_cheerios);

  -- Domenica MORNING_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'MORNING_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'MORNING_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_sotto_vuoto, 2, 'unit'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_sotto_vuoto);

  -- Domenica AFTERNOON_SNACK
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'AFTERNOON_SNACK'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'AFTERNOON_SNACK' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_frutta_sotto_vuoto, 2, 'unit'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_frutta_sotto_vuoto);

  -- Domenica DINNER
  v_meal_id := gen_random_uuid();
  INSERT INTO meals (id, "dayId", "mealType")
  SELECT v_meal_id, v_day_id, 'DINNER'
  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER');
  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = 'DINNER' LIMIT 1;

  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_hamburger_vegetale, 150, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_hamburger_vegetale);
  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)
  SELECT gen_random_uuid(), v_meal_id, v_ing2_tris_di_verdure, 200, 'gr'
  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = v_ing2_tris_di_verdure);

END $$;

-- Seed complete.