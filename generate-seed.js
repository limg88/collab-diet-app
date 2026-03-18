#!/usr/bin/env node
/**
 * generate-seed.js
 * Parses dieta.xlsx and outputs backend/seed.sql
 */
const XLSX = require('xlsx');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// ─── helpers ─────────────────────────────────────────────────────────────────
function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex').replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
}
function esc(s) { return String(s || '').replace(/'/g, "''"); }
function q(s)   { return `'${esc(s)}'`; }

// ─── typo corrections (raw lowercase key → corrected display name) ───────────
const TYPO_FIXES = {
  'farino di avena':        'Farina di avena',
  'latte scramato':         'Latte scremato',
  'dietetic dolcificante':  'Dolcificante dietetico',
  'uova di gallina intero': 'Uova di gallina intere',
  'cous cous':              'Couscous',
  'frutta sotto vuoto':     'Frutta in busta',
  'minestrone leggerezza':  'Minestrone light',
  'cereali g galbusera':    'Cereali Galbusera',
  'biscotti misura privolat': 'Biscotti Misura',
  'biscotti orosaiwa':      'Biscotti Oro Saiwa',
  'crackers riso su riso':  'Crackers di riso',
  'hamburger di soia':      'Burger di soia',
  'hamburger vegetale':     'Burger vegetale',
  'hamburger di pollo':     'Burger di pollo',
  'tonno in scatola al naturale': 'Tonno al naturale',
};

function fixName(raw) {
  const lower = raw.toLowerCase().trim();
  if (TYPO_FIXES[lower]) return TYPO_FIXES[lower];
  // capitalize first letter only
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

// ─── category mapping ────────────────────────────────────────────────────────
const CATEGORIES = {
  // Cereali
  'biscotti magretti':         'Cereali',
  'biscotti misura privolat':  'Cereali',
  'biscotti orosaiwa':         'Cereali',
  'cereali g galbusera':       'Cereali',
  'cheerios':                  'Cereali',
  'cornflakes':                'Cereali',
  'cous cous':                 'Cereali',
  'crackers riso su riso':     'Cereali',
  'crostini':                  'Cereali',
  'farina di riso':            'Cereali',
  'farino di avena':           'Cereali',
  'fette biscottate':          'Cereali',
  'fiocchi di avena':          'Cereali',
  'fresella':                  'Cereali',
  'pane':                      'Cereali',
  'pane tostato':              'Cereali',
  'pangrattato':               'Cereali',
  'panino':                    'Cereali',
  'panko':                     'Cereali',
  'pasta':                     'Cereali',
  'piadina':                   'Cereali',
  'riso':                      'Cereali',

  // Latticini
  'bevanda di riso':   'Bevande vegetali',
  'bevanda di soia':   'Bevande vegetali',
  'fiocchi di latte':  'Latticini',
  'kefir':             'Latticini',
  'latte scramato':    'Latticini',
  'yogurt greco':      'Latticini',
  'yogurt scremato':   'Latticini',

  // Formaggi
  'feta':         'Formaggi',
  'fior di latte':'Formaggi',
  'parmigiano':   'Formaggi',
  'philadelphia': 'Formaggi',
  'primosale':    'Formaggi',
  'ricotta':      'Formaggi',
  'robiola':      'Formaggi',

  // Uova
  'albume':                 'Uova',
  'uova':                   'Uova',
  'uova di gallina':        'Uova',
  'uova di gallina intero': 'Uova',

  // Frutta
  'albicocche':        'Frutta',
  'ananas':            'Frutta',
  'anguria':           'Frutta',
  'arance':            'Frutta',
  'banana':            'Frutta',
  'cachi':             'Frutta',
  'ciliegie':          'Frutta',
  'fragole':           'Frutta',
  'frutta fresca':     'Frutta',
  'frutta sotto vuoto':'Frutta',
  'kiwi':              'Frutta',
  'lamponi':           'Frutta',
  'mandarini':         'Frutta',
  'mela':              'Frutta',
  'melone':            'Frutta',
  'mirtilli':          'Frutta',
  'pera':              'Frutta',
  'pesche':            'Frutta',
  'prugne':            'Frutta',
  'uva':               'Frutta',

  // Frutta secca
  'frutta secca': 'Frutta secca',
  'noci':         'Frutta secca',

  // Verdure
  'bieta':               'Verdure',
  'bietole':             'Verdure',
  'broccoli':            'Verdure',
  'caponata':            'Verdure',
  'carote':              'Verdure',
  'cicoria':             'Verdure',
  'fagiolini':           'Verdure',
  'finocchi':            'Verdure',
  'funghi':              'Verdure',
  'lattuga':             'Verdure',
  'mais':                'Verdure',
  'melanzane':           'Verdure',
  'patate':              'Verdure',
  'peperoni':            'Verdure',
  'piselli':             'Verdure',
  'pomodori da insalata':'Verdure',
  'pomodorini':          'Verdure',
  'porro':               'Verdure',
  'rucola':              'Verdure',
  'spinaci':             'Verdure',
  'taccole':             'Verdure',
  'tris di verdure':     'Verdure',
  'valeriana':           'Verdure',
  'zucca':               'Verdure',
  'zucchine':            'Verdure',

  // Legumi
  'ceci cotti':              'Legumi',
  'hamburger di soia':       'Legumi',
  'hamburger vegetale':      'Legumi',
  'lenticchie decorticate':  'Legumi',

  // Carne
  'arista di maiale':      'Carne',
  'filetto di manzo':      'Carne',
  'hamburger di pollo':    'Carne',
  'lonza':                 'Carne',
  'manzo magro':           'Carne',
  'manzo magro macinato':  'Carne',
  'petto di pollo':        'Carne',
  'roastbeef':             'Carne',
  'salsiccia':             'Carne',
  'tacchino':              'Carne',

  // Salumi
  'bresaola':         'Salumi',
  'fesa di tacchino': 'Salumi',
  'prosciutto cotto': 'Salumi',
  'prosciutto crudo': 'Salumi',

  // Pesce
  'alici':                       'Pesce',
  'bastoncini':                  'Pesce',
  'calamaro':                    'Pesce',
  'merluzzo':                    'Pesce',
  'orata':                       'Pesce',
  'persico':                     'Pesce',
  'platessa':                    'Pesce',
  'polpo':                       'Pesce',
  'salmone':                     'Pesce',
  'salmone affumicato':          'Pesce',
  'seppie':                      'Pesce',
  'spigola':                     'Pesce',
  'tonno':                       'Pesce',
  'tonno in scatola al naturale':'Pesce',
  'totano':                      'Pesce',

  // Condimenti
  'burro di arachidi':    'Condimenti',
  'dietetic dolcificante':'Condimenti',
  'lievito in polvere':   'Condimenti',
  'marmellata':           'Condimenti',
  'miele':                'Condimenti',
  'passata di pomodoro':  'Condimenti',
  'pesto':                'Condimenti',

  // Dolci
  'cioccolato fondente': 'Dolci',

  // Bevande
  'te': 'Bevande',

  // Piatti pronti
  'minestrone leggerezza': 'Piatti pronti',
  'pizza':                 'Piatti pronti',
  'zuppa del casale':      'Piatti pronti',
};

function getCategory(name) {
  return CATEGORIES[name.toLowerCase().trim()] || 'Altro';
}

function getDefaultUnit(name) {
  const n = name.toLowerCase();
  if (['uova di gallina', 'uova di gallina intero', 'frutta sotto vuoto'].includes(n)) return 'unit';
  if (['te', 'latte scramato', 'bevanda di riso', 'bevanda di soia', 'kefir'].includes(n)) return 'ml';
  return 'gr';
}

function getDefaultQty(name) {
  const n = name.toLowerCase();
  if (['uova di gallina', 'uova di gallina intero', 'frutta sotto vuoto'].includes(n)) return 1;
  if (['te'].includes(n)) return 250;
  if (['latte scramato', 'bevanda di riso', 'bevanda di soia', 'kefir'].includes(n)) return 200;
  return 100;
}

// ─── parse banca dati ────────────────────────────────────────────────────────
const wb = XLSX.readFile('./dieta.xlsx');
const bd = wb.Sheets['banca dati'];
const bdData = XLSX.utils.sheet_to_json(bd, { header: 1, defval: '' });

const allIngredientNames = new Set();
for (let col = 0; col < 16; col++) {
  bdData.slice(1).forEach(row => {
    const v = String(row[col] || '').trim().toLowerCase();
    if (v) allIngredientNames.add(v);
  });
}

// ─── parse menù ──────────────────────────────────────────────────────────────
const menu = wb.Sheets['menù'];
const menuData = XLSX.utils.sheet_to_json(menu, { header: 1, defval: '' });

const dayMap = {
  lunedi:1, martedì:2, martedi:2, mercoledì:3, mercoledi:3,
  giovedì:4, giovedi:4, venerdì:5, venerdi:5, sabato:6, domenica:7
};
const MEAL_TYPES = ['BREAKFAST','MORNING_SNACK','LUNCH','AFTERNOON_SNACK','DINNER'];

function extractUserMenu(rows, startRow, endRow) {
  const days = {};
  let currentDay = null;
  for (let r = startRow; r <= endRow; r++) {
    const row = rows[r];
    const dayName = String(row[0] || '').toLowerCase().trim();
    if (dayName && dayMap[dayName]) {
      currentDay = dayMap[dayName];
      if (!days[currentDay]) {
        days[currentDay] = {};
        MEAL_TYPES.forEach(mt => days[currentDay][mt] = []);
      }
    }
    if (!currentDay) continue;
    for (let m = 0; m < 5; m++) {
      const baseCol = 1 + m * 3;
      const name = String(row[baseCol] || '').trim().toLowerCase();
      const qty  = Number(row[baseCol + 1]) || 0;
      const rawUnit = String(row[baseCol + 2] || 'gr').trim().toLowerCase();
      const unit = rawUnit === 'pezzi' ? 'unit' : rawUnit === 'ml' ? 'ml' : 'gr';
      if (name && qty > 0) {
        days[currentDay][MEAL_TYPES[m]].push({ name, qty, unit });
        allIngredientNames.add(name); // add menu items too
      }
    }
  }
  return days;
}

const giovanniDays = extractUserMenu(menuData, 2, 28);
const giovannaDays = extractUserMenu(menuData, 31, 56);

// ─── build ingredient map (name → uuid) ──────────────────────────────────────
const ingredientMap = {};
[...allIngredientNames].sort().forEach(name => {
  ingredientMap[name] = uuid();
});

// ─── generate SQL ─────────────────────────────────────────────────────────────
const lines = [];

lines.push(`-- ============================================================`);
lines.push(`-- Diet App — Seed data`);
lines.push(`-- Generated from dieta.xlsx`);
lines.push(`-- Run: psql $DATABASE_URL -f seed.sql`);
lines.push(`-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING`);
lines.push(`-- ============================================================`);
lines.push(``);

// ── variables ─────────────────────────────────────────────────────────────────
const WEEK_START = '2026-03-16'; // Monday of seed week
const giovanniId = uuid();
const giovannaId  = uuid();
const giovanniEmail = 'giovanni.limatola@gmail.com';
const giovannaEmail = 'ggiacobonep@gmail.com';

lines.push(`-- ─── USERS (bcrypt hash of 'Password1!' — change in prod) ───`);
lines.push(`INSERT INTO users (id, email, "passwordHash", "createdAt")`);
lines.push(`SELECT ${q(giovanniId)}, ${q(giovanniEmail)}, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW()`);
lines.push(`WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = ${q(giovanniEmail)});`);
lines.push(``);
lines.push(`INSERT INTO users (id, email, "passwordHash", "createdAt")`);
lines.push(`SELECT ${q(giovannaId)}, ${q(giovannaEmail)}, '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', NOW()`);
lines.push(`WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = ${q(giovannaEmail)});`);
lines.push(``);

// ── use DO block so we can reference actual user IDs ─────────────────────────
lines.push(`DO $$`);
lines.push(`DECLARE`);
lines.push(`  v_giovanni_id UUID;`);
lines.push(`  v_giovanna_id  UUID;`);
lines.push(`  v_menu_id      UUID;`);
lines.push(`  v_day_id       UUID;`);
lines.push(`  v_meal_id      UUID;`);
lines.push(``);
// ingredient vars — two sets: v_ing_ (Giovanni) and v_ing2_ (Giovanna)
Object.entries(ingredientMap).forEach(([name, id]) => {
  const base = name.replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  ingredientMap[name] = { id, varName: 'v_ing_' + base, varName2: 'v_ing2_' + base };
});

Object.values(ingredientMap).forEach(({ varName, varName2 }) => {
  lines.push(`  ${varName} UUID;`);
  lines.push(`  ${varName2} UUID;`);
});
lines.push(`BEGIN`);
lines.push(`  SELECT id INTO v_giovanni_id FROM users WHERE email = ${q(giovanniEmail)} LIMIT 1;`);
lines.push(`  SELECT id INTO v_giovanna_id  FROM users WHERE email = ${q(giovannaEmail)} LIMIT 1;`);
lines.push(``);
function emitIngredients(userVar, varField) {
  Object.entries(ingredientMap).forEach(([name, entry]) => {
    const vn          = entry[varField];
    const displayName = fixName(name);
    const cat         = getCategory(name);
    const unit        = getDefaultUnit(name);
    const qty         = getDefaultQty(name);
    lines.push(`  ${vn} := gen_random_uuid();`);
    lines.push(`  INSERT INTO ingredients (id, "userId", name, category, "defaultUnit", "defaultQty", "createdAt", "updatedAt")`);
    lines.push(`  SELECT ${vn}, ${userVar}, ${q(displayName)}, ${q(cat)}, '${unit}', ${qty}, NOW(), NOW()`);
    lines.push(`  WHERE NOT EXISTS (SELECT 1 FROM ingredients WHERE "userId" = ${userVar} AND lower(name) = lower(${q(displayName)}));`);
    lines.push(`  SELECT id INTO ${vn} FROM ingredients WHERE "userId" = ${userVar} AND lower(name) = lower(${q(displayName)}) LIMIT 1;`);
    lines.push(``);
  });
}

lines.push(`  -- ─── INGREDIENTS (owned by Giovanni) ───────────────────────`);
emitIngredients('v_giovanni_id', 'varName');

lines.push(`  -- ─── INGREDIENTS (owned by Giovanna) ───────────────────────`);
emitIngredients('v_giovanna_id', 'varName2');

// ── menu helper ───────────────────────────────────────────────────────────────
function emitMenu(userVar, userEmail, days, ingVarField) {
  const menuId = uuid();
  lines.push(`  -- ─── WEEKLY MENU for ${userEmail} ──────────────────────────────`);
  lines.push(`  v_menu_id := gen_random_uuid();`);
  lines.push(`  INSERT INTO weekly_menus (id, "userId", "weekStart", "createdAt")`);
  lines.push(`  SELECT v_menu_id, ${userVar}, '${WEEK_START}', NOW()`);
  lines.push(`  WHERE NOT EXISTS (SELECT 1 FROM weekly_menus WHERE "userId" = ${userVar} AND "weekStart" = '${WEEK_START}');`);
  lines.push(`  SELECT id INTO v_menu_id FROM weekly_menus WHERE "userId" = ${userVar} AND "weekStart" = '${WEEK_START}' LIMIT 1;`);
  lines.push(``);

  const dayNames = ['','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato','Domenica'];
  for (let dow = 1; dow <= 7; dow++) {
    if (!days[dow]) continue;
    lines.push(`  -- ${dayNames[dow]}`);
    lines.push(`  v_day_id := gen_random_uuid();`);
    lines.push(`  INSERT INTO menu_days (id, "menuId", "dayOfWeek")`);
    lines.push(`  SELECT v_day_id, v_menu_id, ${dow}`);
    lines.push(`  WHERE NOT EXISTS (SELECT 1 FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = ${dow});`);
    lines.push(`  SELECT id INTO v_day_id FROM menu_days WHERE "menuId" = v_menu_id AND "dayOfWeek" = ${dow} LIMIT 1;`);
    lines.push(``);

    MEAL_TYPES.forEach(mt => {
      const items = days[dow][mt] || [];
      if (items.length === 0) return;
      lines.push(`  -- ${dayNames[dow]} ${mt}`);
      lines.push(`  v_meal_id := gen_random_uuid();`);
      lines.push(`  INSERT INTO meals (id, "dayId", "mealType")`);
      lines.push(`  SELECT v_meal_id, v_day_id, '${mt}'`);
      lines.push(`  WHERE NOT EXISTS (SELECT 1 FROM meals WHERE "dayId" = v_day_id AND "mealType" = '${mt}');`);
      lines.push(`  SELECT id INTO v_meal_id FROM meals WHERE "dayId" = v_day_id AND "mealType" = '${mt}' LIMIT 1;`);
      lines.push(``);

      items.forEach(({ name, qty, unit }) => {
        const entry = ingredientMap[name];
        if (!entry) {
          lines.push(`  -- WARN: ingredient not found: ${name}`);
          return;
        }
        const varName = entry[ingVarField];
        lines.push(`  INSERT INTO meal_items (id, "mealId", "ingredientId", quantity, unit)`);
        lines.push(`  SELECT gen_random_uuid(), v_meal_id, ${varName}, ${qty}, '${unit}'`);
        lines.push(`  WHERE NOT EXISTS (SELECT 1 FROM meal_items WHERE "mealId" = v_meal_id AND "ingredientId" = ${varName});`);
      });
      lines.push(``);
    });
  }
}

emitMenu('v_giovanni_id', giovanniEmail, giovanniDays, 'varName');
emitMenu('v_giovanna_id', giovannaEmail, giovannaDays, 'varName2');

lines.push(`END $$;`);
lines.push(``);
lines.push(`-- Seed complete.`);

const sql = lines.join('\n');
const outPath = path.join(__dirname, 'backend', 'seed.sql');
fs.writeFileSync(outPath, sql);
console.log(`Written ${sql.split('\n').length} lines to ${outPath}`);
console.log(`Ingredients: ${Object.keys(ingredientMap).length}`);
console.log(`Giovanni days: ${Object.keys(giovanniDays).length}`);
console.log(`Giovanna days: ${Object.keys(giovannaDays).length}`);
