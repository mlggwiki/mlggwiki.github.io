// MLGG Wiki: reads data/wiki.json (py -m wikitool export) and draws the pages: Characters (unit tiles,
// the unit page), Find Memoria (a finder: which memoria help a unit / a party slot), Maze relics and
// Percentile ranking (from the menu under the title, which also holds the language).
"use strict";

const UI = {
  en: { search: "Search name or title…", filter: "Filter", clear: "Clear filters",
        skills: "Skills", stats: "Stats", profile: "Profile", history: "History", anim: "Animation",
        level: "Skill level", osNote: "Levels 11–15 need the unit's OS (LR).", pin: "Pin the filter panel",
        type: "Type", attribute: "Attribute", role: "Role", position: "Position", rarity: "Rarity",
        school: "School", team: "Team", cost: { 1: "AP", 2: "PP", 3: "EX" }, cd: "CD",
        cdUnit: { 1: "turns", 2: "actions" }, hp: "HP", atk: "ATK", def: "DEF", spd: "SPD", crt: "CRT",
        birthday: "Birthday", height: "Height", hobby: "Hobby", birthplace: "Birthplace", favorite: "Favorite",
        pick: "Pick a unit on the left.", nothing: "No unit matches these filters.",
        data: "Game data", ap: "AP", pp: "PP", charactersTab: "Characters", memoriaTab: "Find Memoria",
        nothingMemoria: "No memoria matches.", enemy: "Enemy side", slots: "Slots",
        buff: "Buff", debuff: "Debuff / ailment", other: "Trait / target", char: "Character", slot: "Position",
        offense: "Offense", survival: "Survival", others: "Others", debuffOnly: "Debuff", ailment: "Ailment",
        range: "Targets", priority: "Priority", attacks: "Attacks", tabs: { ally: "Allies", enemy: "Enemies" },
        slotNames: { 1: "Front left", 2: "Front centre", 4: "Front right", 8: "Back left", 16: "Back centre", 32: "Back right" },
        tagFilter: "Show only what has this tag (click again to stop)", removeFilter: "Remove this filter",
        verNote: { official: "English: the official English of the game's global version where it has it, else AI translation",
          aimtl: "English: AI translation (Claude Opus and Sonnet)" },
        variant: "Variant", variants: "Units of this character", close: "Close", released: "Released",
        launch: "Launch unit", sinceBy: { gacha: "first gacha banner", login: "login bonus" },
        // menu
        menuTip: "Menu: pages and language", menu: { list: "Characters / Memoria", maze: "Maze relics",
          ranking: "Percentile ranking" }, language: "Language", japanese: "日本語 (JP)",
        verNames: { aimtl: "AI", official: "Official" },
        // unit page
        findMemoria: "Find memoria", findMemoriaTip: "The Memoria page with this unit picked",
        compareWith: "Compare with", allUnits: "All units", maxValues: "Max values", rankTip: "Rank among the units compared",
        pctTip: "Higher than or equal to {p}% of the other {n} units",
        statsNote: "Max values, as on the game's unit screen (AP/PP with the highest rarity). Percentile: among the units compared.",
        histKind: { release: "Release", rerun: "Rerun", limited: "Limited pickup", limitedRerun: "Limited rerun",
          extra: "Extra pickup", attribute: "Attribute pickup (standard gacha)", premium: "Premium pickup (guaranteed unowned)",
          login: "Login bonus" },
        histPaid: "DMM POINT banner only", histFrom: "From", histTo: "Until", histWhat: "Banner",
        histNote: "The game reuses a banner for a rerun and overwrites its dates, so the wiki keeps every date it has seen; reruns from before September 2026 may be missing.",
        histNone: "Launch unit: no banner or login bonus for it in the game data.",
        animLoading: "Loading the animation…", animFail: "The animation could not be loaded.",
        animNote: "The card art as the game animates it (from the scene player). Buttons: the camera moves, then the idle loop.",
        animNames: { IdlingLoop: "Idle loop", FirstCameraIn: "Camera 1", SecondCameraIn: "Camera 2", ThirdCameraIn: "Camera 3" },
        // memoria finder
        posHead: "Position", lfTip: "Show / hide the filter",
        everyone: "Every ally", oneAlly: "One ally", matchTip: "{n} of this memoria's skills apply", applies: "Applies",
        inSlots: "Only in these slots",
        notApplies: "Does not apply", thisVersion: "only this version", everyVersion: "every version",
        finderHint: "Pick an attribute, role, school or team, or search a character, to list the units.",
        searchChar: "Search character…", searchMemoria: "Search memoria…",
        xTip: { 2: "Only memoria where both skills apply", 1: "Only memoria where one skill applies" },
        openMemoria: "Open this memoria",
        // ranking
        rankTitle: "Percentile ranking", unit: "Unit",
        rankNote: "Percentiles among the units shown (filter by attribute and role). Max values; AP/PP with the highest rarity. Click a column to sort.",
        mazeSw: "Maze effect", mazeSwOpts: { include: "Include", exclude: "Exclude", only: "Only" },
        mazeSwTip: "Which effects the effect filters look at: skill 1 + 2 and the maze effect (UR only), the skills only, or the maze effect only",
        mazeKind: "Maze",
        mazeTitle: "Maze relics", mazeSearch: "Search relics…",         mazeNote: "The cards picked up in the maze (a roguelike mode). Click a rarity to see its effect.",
  },
  ja: { search: "名前・称号で検索…", filter: "絞り込み", clear: "解除",
        skills: "スキル", stats: "ステータス", profile: "プロフィール", history: "履歴", anim: "アニメーション",
        level: "スキルレベル", osNote: "Lv11〜15は専用OS（LR）が必要です。", pin: "絞り込みを固定",
        type: "タイプ", attribute: "属性", role: "ロール", position: "ポジション", rarity: "レアリティ",
        school: "校舎", team: "チーム", cost: { 1: "AP", 2: "PP", 3: "EX" }, cd: "CT",
        cdUnit: { 1: "ターン", 2: "行動" }, hp: "HP", atk: "攻撃力", def: "防御力", spd: "行動速度", crt: "会心率",
        birthday: "誕生日", height: "身長", hobby: "趣味", birthplace: "出身", favorite: "好きなもの",
        pick: "左からユニットを選んでください。", nothing: "該当するユニットがありません。",
        data: "ゲームデータ", ap: "AP", pp: "PP", charactersTab: "キャラクター", memoriaTab: "メモリア検索",
        nothingMemoria: "該当するメモリアがありません。", enemy: "敵側", slots: "配置",
        buff: "バフ", debuff: "デバフ・状態異常", other: "特性・対象", char: "キャラクター", slot: "ポジション",
        offense: "攻撃", survival: "生存", others: "その他", debuffOnly: "デバフ", ailment: "状態異常",
        range: "対象範囲", priority: "優先対象", attacks: "攻撃効果", tabs: { ally: "味方", enemy: "敵" },
        slotNames: { 1: "前衛左", 2: "前衛中央", 4: "前衛右", 8: "後衛左", 16: "後衛中央", 32: "後衛右" },
        tagFilter: "このタグで絞り込む（もう一度クリックで解除）", removeFilter: "この条件を外す",
        verNote: { official: "英語：グローバル版の公式英語（あるもの）、ほかはAI翻訳",
          aimtl: "英語：AI翻訳（Claude Opus・Sonnet）" },
        variant: "バリエーション", variants: "このキャラクターのユニット", close: "閉じる", released: "実装",
        launch: "リリース時から", sinceBy: { gacha: "初ピックアップガチャ", login: "ログインボーナス" },
        menuTip: "メニュー：ページと言語", menu: { list: "キャラクター / メモリア", maze: "迷宮レリック",
          ranking: "パーセンタイル順位" }, language: "言語", japanese: "日本語 (JP)",
        verNames: { aimtl: "AI", official: "Official" },
        findMemoria: "メモリアを探す", findMemoriaTip: "このユニットを選んだ状態でメモリアのページへ",
        compareWith: "比較対象", allUnits: "全ユニット", maxValues: "最大値", rankTip: "比較対象の中での順位",
        pctTip: "他の{n}ユニットのうち{p}%以上を上回る（同値を含む）",
        statsNote: "最大値（ゲームのユニット画面と同じ。AP/PPは最高レアリティ込み）。パーセンタイルは比較対象の中での順位。",
        histKind: { release: "実装", rerun: "復刻", limited: "限定ピックアップ", limitedRerun: "限定復刻",
          extra: "EXTRAピックアップ", attribute: "属性ピックアップ（スタンダード）", premium: "未所持確定プレミアム",
          login: "ログインボーナス" },
        histPaid: "DMM POINT限定のみ", histFrom: "開始", histTo: "終了", histWhat: "ガチャ",
        histNote: "ゲームは復刻でガチャのデータを使い回して日付を上書きするため、Wikiは見た日付をすべて残します。2026年9月より前の復刻は抜けている場合があります。",
        histNone: "リリース時からのユニット：ゲームデータにガチャ・ログインボーナスがありません。",
        animLoading: "アニメーションを読み込み中…", animFail: "アニメーションを読み込めませんでした。",
        animNote: "ゲームのカードアニメーション（シーンプレイヤーより）。ボタン：カメラの動き、その後待機ループ。",
        animNames: { IdlingLoop: "待機ループ", FirstCameraIn: "カメラ1", SecondCameraIn: "カメラ2", ThirdCameraIn: "カメラ3" },
        posHead: "ポジション", lfTip: "フィルターの表示 / 非表示",
        everyone: "味方全員", oneAlly: "味方1人", matchTip: "このメモリアのスキル{n}個が対象", applies: "対象",
        inSlots: "この配置のみ",
        notApplies: "対象外", thisVersion: "このユニットのみ", everyVersion: "全バリエーション",
        finderHint: "属性・ロール・校舎・チームを選ぶか、キャラクターを検索するとユニットが表示されます。",
        searchChar: "キャラクターを検索…", searchMemoria: "メモリアを検索…",
        xTip: { 2: "スキル2つとも対象のメモリアのみ", 1: "スキル1つが対象のメモリアのみ" },
        openMemoria: "このメモリアを開く",
        rankTitle: "パーセンタイル順位", unit: "ユニット",
        rankNote: "表示中のユニットの中でのパーセンタイル（属性・ロールで絞り込み）。最大値、AP/PPは最高レアリティ込み。列をクリックで並べ替え。",
        mazeSw: "迷宮効果", mazeSwOpts: { include: "含める", exclude: "除く", only: "のみ" },
        mazeSwTip: "効果フィルターの対象：スキル1・2と迷宮効果（URのみ）、スキルのみ、迷宮効果のみ",
        mazeKind: "迷宮",
        mazeTitle: "迷宮レリック", mazeSearch: "レリックを検索…",         mazeNote: "迷宮（ローグライク）で獲得するカード。レアリティをクリックするとその効果を表示します。",
  },
};

// filter groups per list (owner's order). Picks inside a group = any of them (OR), groups combine with AND;
// nothing picked in a group = everything. `dd` groups are drop-down lists (logos, tags or names).
const GROUPS = {
  // units, the Filter panel: two tabs (owner 2026-10-01), Allies = what helps our side (offense / survival /
  // others), Enemies = debuff, ailment, targets (range / priority, enemy side only), attacks (counter, follow-up,
  // extra attack, damage link, traits). The tabs only show / hide groups: picks in both combine (AND). The
  // unit's own data is on the left: UNIT_LEFT
  units: [{ field: "offense", dd: true, tab: "ally" }, { field: "survival", dd: true, tab: "ally" },
    { field: "others", dd: true, tab: "ally" },
    { field: "debuff", dd: true, label: "debuffOnly", tab: "enemy" }, { field: "ailment", dd: true, tab: "enemy" },
    { field: "range", dd: true, tab: "enemy" }, { field: "priority", dd: true, tab: "enemy" },
    { field: "attacks", dd: true, tab: "enemy" }],
  // memoria: rarity (one pick, memoria rarities), the maze switch, then the effect tags (the unit and the position
  // are picked on the left), in the owner's groups
  // owner's layout: [rarity | type] side by side (`row`), then attribute; attribute / type = memoria with an effect
  // for it (a skill's condition, or the maze effect's name)
  memoria: [{ field: "rarity", one: true, mrar: true, row: "top" }, { field: "mtype", one: true, label: "type", section: "types", row: "top" },
    { field: "mattr", one: true, label: "attribute", section: "attributes" },
    { field: "mazesw", sw: true }, { field: "offense", dd: true }, { field: "survival", dd: true }, { field: "debuff", dd: true, label: "debuffOnly" }, { field: "others", dd: true }],
};
// units, the left filter under the funnel button (owner, like the Monmusu wiki): the unit's own data, one pick
// per group; position = Front / Back / Both (the unit's row), not the party slots
const UNIT_LEFT = [{ field: "attribute", section: "attributes" }, { field: "role", section: "roles" },
  { field: "type", section: "types" }, { field: "position", section: "positions" },
  { field: "school", section: "schools", dd: true }, { field: "team", section: "teams", dd: true }];
// tag filters: which tag categories each one lists (ailments are a kind of debuff in the game's help)
// which tags a tag filter lists: Characters (2026-09-30) and Memoria (2026-09-29, owner) = offense / survival /
// debuff / ailment / others (whatever is not in the others: SPD up, traits, targets, …); the Maze relics page =
// buff / debuff / ailment / other (trait, target, link)
const OFFENSE = new Set(["atk_up", "crt_up", "crtdmg_up", "dmg_up", "sure_crit"]);
const SURVIVAL = new Set(["hp_up", "def_up", "dmg_taken_down", "guard", "heal", "heal_up", "regen", "shield", "en_shield",
  "endure", "dmg_immune", "lifesteal"]);
// Characters, Enemies tab: how the unit attacks (owner 2026-10-01: traits here too)
const ATTACKS = new Set(["counter", "follow_up", "extra_attack", "dmg_link"]);
const isAttack = (t) => ATTACKS.has(t) || tagCat(t) === "trait";
const isDebuff = (t) => tagCat(t) === "debuff";                  // ailments have their own list (owner)
const TAG_GROUPS = {
  buff: (t) => tagCat(t) === "buff", debuff: isDebuff, ailment: (t) => tagCat(t) === "ailment",
  other: (t) => ["trait", "target", "link"].includes(tagCat(t)),
  offense: (t) => OFFENSE.has(t), survival: (t) => SURVIVAL.has(t),
  range: (t) => tagCat(t) === "range", priority: (t) => tagCat(t) === "priority", attacks: isAttack,
  others: (t) => !OFFENSE.has(t) && !SURVIVAL.has(t) && !isDebuff(t) && !isAttack(t) &&
    !["ailment", "range", "priority"].includes(tagCat(t)),
};
const MEMORIA_FRAME = { 1: "sr", 2: "ssr", 3: "ur", 4: "lr" };             // MemoryRarities -> frame picture
const SHORT = { attribute: { 1: "Ag", 2: "Sm", 3: "Sh", 4: "Cu", 5: "Co", 6: "Cl" } };   // letters until the icons are there
const SLOTS = [1, 2, 4, 8, 16, 32];                                       // party slots: front L/C/R, back L/C/R
const STAT_KEYS = ["hp", "atk", "def", "crt", "spd", "ap", "pp"];
const RANK_KEYS = ["hp", "atk", "def", "crt", "spd"];                    // percentiles: no AP / PP (owner)
const MODES = ["units", "memoria", "ranking", "maze"];
const FULL = (mode) => mode === "ranking" || mode === "maze";   // full pages: no list tabs

const state = { lang: "en", ver: null, mode: "units", lastList: "units", unit: null, tab: "skills", level: 10,
  picksBy: { units: {}, memoria: {} }, ftab: "ally", mazeSw: "exclude", lf: true, pinned: false, statScope: "all",
  finder: { unit: null, slot: 0, x: 0, attr: new Set(), role: new Set(), school: new Set(), team: new Set() },
  rank: { attr: new Set(), role: new Set(), sort: "atk", dir: -1 },
  maze: { q: "", rarity: 0, tags: {}, shown: {} } };
const picks = () => state.picksBy[state.mode] || {};           // filter picks of the list on show ({field: Set})
const groups = () => GROUPS[state.mode] || [];
let VALUES = { units: new Map(), memoria: new Map() };          // id -> {field: [values as strings]}, computed once
let D = null;                                   // the data file
let CHARS = {}, UNITS = new Map(), STATV = new Map(), CONDS = new Map();
let TILES = new Map();                          // unit id -> its tile (built once per language)
let FTILES = new Map();                         // unit id -> its tile in the memoria finder
const $ = (sel) => document.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const fill = (s, vars) => String(s).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
const store = {
  get(k, d) { try { return localStorage.getItem(k) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* private window */ } },
};

// ---- text -------------------------------------------------------------------------------
const ui = (k) => UI[state.lang][k];
// English of the version picked: AI (id aimtl) = text.en; Official = its own line where it differs, else
// text.en. No English: Japanese.
const enText = (key) => { const v = D.text.versions?.[state.ver]; return v && key in v ? v[key] : D.text.en[key] || ""; };
const text = (key) => (state.lang === "en" ? enText(key) : D.text.ja[key]) || D.text.ja[key] || "";
function look(section, id) {                    // lookup tables: names, schools, types, …
  const row = (D.lookup[section] || {})[id];
  if (!row) return "";
  const en = (state.ver === "official" && row.official) || row.en;    // official school / team names: Official only
  return (state.lang === "en" ? en : row.ja) || en || row.ja || "";
}
const charName = (cid) => look("characters", cid);
const unitTitle = (u) => text(`unit.${u.id}.title`);
const num = (v) => (v == null ? "?" : Number.isInteger(v) ? v.toLocaleString("en") : String(Math.round(v * 100) / 100));
const pct = (v) => `${Math.round(v * 1000) / 10}%`;
const bits = (flags) => [...Array(8).keys()].filter((i) => flags & (1 << i)).map((i) => i + 1);   // flag bit n = value n+1

// a game icon (site/img/icons, py -m wikitool images); the letter shows until it is there
const ICON_OF = { type: "type", mtype: "type", attribute: "attribute", mattr: "attribute", role: "role", rarity: "rarity", team: "team", school: "school" };
function icon(name, letter, cls = "") {
  return `<span class="ic ${cls}"><img src="img/icons/${esc(name)}.png" alt="" ` +
    `onload="this.parentNode.classList.add('img')" onerror="this.remove()">${esc(letter)}</span>`;
}
// a picture at its own width (rarity logos, school/team logos); the text shows until it is there
function logo(name, text, cls = "", title = "") {
  return `<span class="logo ${cls}"${title ? ` title="${esc(title)}"` : ""}><img src="img/icons/${esc(name)}.png" alt="" ` +
    `onload="this.parentNode.classList.add('img')" onerror="this.remove()"><span class="alt">${esc(text)}</span></span>`;
}
const rarityLogo = (r, cls = "") => logo(`rarity-${r}`, D.rarity[r], `rar ${cls}`, D.rarity[r]);
const attrIcon = (v) => icon(`attribute-${v}`, SHORT.attribute[v] || "?");
const roleIcon = (v) => icon(`role-${v}`, (look("roles", v) || "?").slice(0, 1));
// position (front / back row) as a small picture of the two rows
function positionIcon(p, title) {
  const front = p === 1 || p === 3, back = p === 2 || p === 3;
  // (the game's img_chara_about_* are help illustrations with Japanese text, not icons)
  return `<span class="posic"${title ? ` title="${esc(title)}"` : ""}><svg viewBox="0 0 20 20" aria-hidden="true">` +
    `<rect x="2" y="2" width="16" height="7" rx="2" class="${front ? "on" : ""}"/>` +
    `<rect x="2" y="11" width="16" height="7" rx="2" class="${back ? "on" : ""}"/></svg></span>`;
}
function slotsIcon(flags, title = ui("slots")) {
  // party slots: front row 1/2/4 (left, centre, right), back row 8/16/32
  const cells = [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${2 + (i % 3) * 7}" y="${i < 3 ? 2 : 11}" width="5.5" height="7" rx="1.5" ` +
    `class="${flags & (1 << i) ? "on" : ""}"/>`).join("");
  return `<span class="posic"${title ? ` title="${esc(title)}"` : ""}><svg viewBox="0 0 24 20" aria-hidden="true">${cells}</svg></span>`;
}
const slotTitle = (flags) => SLOTS.filter((s) => flags & s).map((s) => ui("slotNames")[s]).join(", ");

function pic(u, size) {
  const initial = esc((charName(u.char) || "?").slice(0, 1));
  return `<div class="pic t${u.type}${size ? " " + size : ""}">${initial}` +
    `<img src="img/units/${esc(u.asset)}.png" alt="" loading="lazy" onerror="this.remove()"></div>`;
}

// ---- filters ----------------------------------------------------------------------------
// The panel is built once per language and list; a click only switches classes, so nothing reloads or jumps.
let TAGCAT = new Map(), SKILLTAGS = new Map();  // tag -> category; skill -> {field: [tags]} (made once)
const tagCat = (id) => TAGCAT.get(id);
function tagsOf(sid) {
  let out = SKILLTAGS.get(String(sid));
  if (!out) {
    const tags = D.tags.skills[sid] || [];
    out = Object.fromEntries(Object.entries(TAG_GROUPS).map(([f, has]) => [f, tags.filter(has)]));
    SKILLTAGS.set(String(sid), out);
  }
  return out;
}
function skillTags(skillIds, field) {
  return [...new Set(skillIds.flatMap((s) => tagsOf(s)[field]))];
}

function unitValues(u) {
  const c = CHARS[u.char] || {};
  const out = {};
  for (const { field } of [...UNIT_LEFT, ...GROUPS.units]) {
    if (TAG_GROUPS[field]) out[field] = skillTags(u.skills, field);
    else if (field === "attribute") out[field] = [u.attribute, u.attribute2].filter((v) => v != null).map(String);
    else if (field === "team" || field === "school") out[field] = c[field] != null ? [String(c[field])] : [];
    else out[field] = u[field] != null ? [String(u[field])] : [];
  }
  return out;
}

// memoria filter values: the rarity and the effect tags of the whole memoria. Which effects the tags come from
// is the maze switch (owner, default exclude): include = skill 1 + 2 + the maze effect (UR only), exclude = the
// skills, only = the maze effect. VALUES.memoria = include (the lists of options); MEMV[switch] = what is matched.
const mazeTags = (m) => [...new Set((m.relics || []).flatMap((r) => D.maze?.relics?.[r]?.tags || []))];
const mazeMarks = (m, kind) => (m.relics || []).flatMap((r) => D.maze?.relics?.[r]?.[kind] || []);
function memoriaValues(m, sw = "include") {
  const skills = sw === "only" ? [] : m.skills, maze = sw === "exclude" ? [] : mazeTags(m);
  const relics = sw === "exclude" ? [] : m.relics || [], conds = skills.flatMap((sid) => skillConds(m, sid));
  const marks = (flag, kind) => [...new Set([...conds.flatMap((c) => bits(c[flag] || 0)),
    ...mazeMarks({ relics }, kind)].map(String))];
  return { rarity: [String(m.rarity)], mattr: marks("attributes", "attributes"), mtype: marks("types", "types"),
    ...Object.fromEntries(Object.entries(TAG_GROUPS).map(([f, has]) => [f, [...new Set([...skillTags(skills, f), ...maze.filter(has)])]])) };
}
let MEMV = {};

function computeValues() {
  VALUES = { units: new Map(D.units.map((u) => [u.id, unitValues(u)])),
    memoria: new Map(D.memoria.map((m) => [m.id, memoriaValues(m)])) };
  MEMV = Object.fromEntries(["include", "exclude", "only"].map((sw) => [sw, new Map(D.memoria.map((m) => [m.id, memoriaValues(m, sw)]))]));
}

function tagOf(id) { return D.tags.list.find((t) => t.id === id); }

function label(g, v) {
  if (g.field === "rarity") return D.rarity[g.mrar ? D.memoriaRarity[v] : v];
  if (TAG_GROUPS[g.field]) { const t = tagOf(v); return t ? (state.lang === "ja" ? t.ja : t.label) : v; }
  if (g.field === "char") return charName(v);
  if (g.field === "slot") return ui("slotNames")[v];
  return look(g.section, v);
}

function values(g, mode = state.mode) {
  const all = new Set();
  for (const vals of VALUES[mode].values()) (vals[g.field] || []).forEach((v) => all.add(v));
  const list = [...all];
  if (TAG_GROUPS[g.field]) {
    const order = D.tags.list.map((t) => t.id);
    return list.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  }
  if (g.field === "team") return list.sort(byTeamSchool);
  list.sort((a, b) => a - b);
  return g.field === "rarity" ? list.reverse() : list;        // owner: SSR, SR, R
}

// teams in school order (owner: a school's teams side by side), then by id
let TEAM_SCHOOL = {};
const byTeamSchool = (a, b) => (TEAM_SCHOOL[a] ?? 99) - (TEAM_SCHOOL[b] ?? 99) || a - b;

function optionInner(g, v) {
  const name = label(g, v);
  if (g.field === "rarity") return rarityLogo(g.mrar ? D.memoriaRarity[v] : v);
  if (g.field === "team" || g.field === "school") return logo(`${g.field}-${v}`, name, "org");
  if (g.field === "position") return positionIcon(+v, "");
  if (TAG_GROUPS[g.field]) return `<span class="tag ${esc(tagOf(v)?.cat || "")}">${esc(name)}</span>`;
  return icon(`${ICON_OF[g.field] || g.field}-${v}`, (SHORT[ICON_OF[g.field] || g.field] || {})[v] || (name || "?").slice(0, 1),
    ICON_OF[g.field] === "type" ? `t${v}` : "");
}

function buildFilters() {
  const parts = groups().map((g) => {
    if (g.sw) return `<div class="fgroup mzsw" data-group="${g.field}" title="${esc(ui("mazeSwTip"))}"><h4>${esc(ui("mazeSw"))}</h4>` +
      `<div class="seg">${Object.entries(ui("mazeSwOpts")).map(([k, name]) => `<button class="segb" data-mzsw="${k}">${esc(name)}</button>`).join("")}</div></div>`;
    const vals = values(g);
    if (!vals.length) return "";
    const opts = vals.map((v) => {
      const name = label(g, v);
      return `<button class="opt" data-field="${g.field}" data-value="${esc(v)}" title="${esc(name)}" aria-label="${esc(name)}">` +
        `${optionInner(g, v)}${g.dd ? '<span class="ocnt"></span>' : ""}</button>`;
    }).join("");
    if (g.dd) {
      // like the Monmusu wiki: the name inside the box; the pick replaces it (owner)
      return `<div class="fgroup dd dd-${g.field}-g" data-group="${g.field}">
        <button class="dd-btn" data-dd="${g.field}"><span class="dd-lbl">${esc(ui(g.label || g.field))}</span><span class="dd-val"></span><span class="caret">▾</span></button>
        <div class="dd-list dd-${g.field}" hidden>${opts}</div></div>`;
    }
    // no heading text (owner: the icons / logos say what the group is; the name is in each option's tooltip)
    return `<div class="fgroup" data-group="${g.field}" title="${esc(ui(g.label || g.field))}"><div class="opts">${opts}</div></div>`;
  });
  // groups with the same `row` sit side by side
  const html = parts.map((part, i) => {
    const row = groups()[i].row, prev = groups()[i - 1]?.row, next = groups()[i + 1]?.row;
    return (row && row !== prev ? '<div class="frow">' : "") + part + (row && row !== next ? "</div>" : "");
  });
  // Characters: the Allies | Enemies tabs, each a box of its groups (switching only shows / hides: no bounce)
  const tabs = [...new Set(groups().map((g) => g.tab).filter(Boolean))];
  $("#groups").innerHTML = !tabs.length ? html.join("") :
    `<div class="ftabs">${tabs.map((t) => `<button class="ftab-btn" data-ftab="${t}">${esc(ui("tabs")[t])}<b></b></button>`).join("")}</div>` +
    tabs.map((t) => `<div class="ftab" data-tab="${t}">${html.filter((_, i) => groups()[i].tab === t).join("")}</div>`).join("");
  updateFilterUI();
}

// how many results there would be with V added to FIELD's picks (the count next to each option in a list);
// one = a one-pick group: V instead of its pick
function countWith(field, v, one = false) {
  const base = picks(), set = new Set(one ? [] : base[field] || []);
  set.add(v);
  const all = { ...base, [field]: set };
  if (state.mode === "memoria") {
    const f = state.finder;
    return finderMatches(UNITS.get(f.unit) || null, f.slot, all, query()).length;
  }
  return filtered(all).length;
}

function updateFilterUI() {
  let n = 0;
  for (const g of groups()) {
    const group = $(`#groups [data-group="${g.field}"]`);
    if (!group) continue;
    const picked = picks()[g.field] || new Set();
    n += picked.size;
    group.classList.toggle("has-picks", picked.size > 0);
    $$(".opt", group).forEach((b) => {
      const on = picked.has(b.dataset.value);
      // drop-down lists (Monmusu wiki): the count of results with this pick; 0 = greyed out, can't be picked
      const count = g.dd || g.one ? countWith(g.field, b.dataset.value, g.one) : null, off = count != null && !on && count === 0;   // a boolean: toggle(x, undefined) flips
      if (g.dd) b.querySelector(".ocnt").textContent = count;
      b.classList.toggle("on", on);
      b.classList.toggle("zero", off);
      b.disabled = off;
    });
    if (g.dd) {
      // a list where no option would give a result (and nothing is picked) is greyed out as a whole (owner)
      const dead = !picked.size && $$(".opt", group).every((b) => b.disabled);
      group.classList.toggle("dead", dead);
      group.querySelector(".dd-btn").disabled = dead;
      group.querySelector(".dd-val").innerHTML = picked.size
        ? [...picked].map((v) => ddChip(g.field, v, optionInner(g, v))).join("") : `<span class="dd-none">---</span>`;
    }
  }
  $$("#groups [data-mzsw]").forEach((b) => b.classList.toggle("on", b.dataset.mzsw === state.mazeSw));
  // the tabs: the one shown is lit; each says how many picks it holds (a pick in the hidden tab still counts)
  $$("#groups [data-ftab]").forEach((b) => {
    const t = b.dataset.ftab;
    b.classList.toggle("on", t === state.ftab);
    b.querySelector("b").textContent = groups().filter((g) => g.tab === t).reduce((k, g) => k + (picks()[g.field]?.size || 0), 0) || "";
  });
  $$("#groups .ftab").forEach((box) => { box.hidden = box.dataset.tab !== state.ftab; });
  $("#filterCount").textContent = n || "";
  showActive();
}

// a pick inside a drop-down's box: the logo / tag and an x that removes it
const ddChip = (field, v, inner) => `<span class="ddchip">${inner}<span class="ddx" data-ddx="${esc(field)}" data-value="${esc(v)}"` +
  ` title="${esc(ui("removeFilter"))}">×</span></span>`;

function closeDropdowns(except) {
  $$(".dd-list").forEach((l) => { if (l !== except) l.hidden = true; });
}

function openDropdown(list, bounds = $(".filter-body")) {
  if (list.closest("#groups, #mazeGroups")) {    // a filter panel (Monmusu wiki): a list to the left of the panel
    list.classList.add("fly");
    list.style.maxHeight = "";
    list.hidden = false;
    const panel = list.closest(".filter-body").getBoundingClientRect(), btn = list.previousElementSibling.getBoundingClientRect();
    const maxH = innerHeight - 24, h = Math.min(list.scrollHeight, maxH);
    list.style.maxHeight = `${maxH}px`;
    list.style.left = `${panel.left - list.offsetWidth}px`;
    list.style.top = `${Math.max(12, Math.min(btn.top, innerHeight - 12 - h))}px`;
    return;
  }
  // below its button, or above it when there is more room there; as tall as the room allows (it scrolls
  // inside itself when longer: the panel never scrolls)
  list.classList.remove("up");
  list.style.maxHeight = "";
  list.hidden = false;
  const panel = bounds.getBoundingClientRect();
  const btn = list.previousElementSibling.getBoundingClientRect();
  const below = panel.bottom - btn.bottom - 12, above = btn.top - panel.top - 12;
  const up = list.scrollHeight > below && above > below;
  list.classList.toggle("up", up);
  list.style.maxHeight = `${Math.max(120, up ? above : below)}px`;
}

// memoria (owner): tags belong to the memoria (both skills), and every tag picked must be on it (AND,
// also inside a group: ATK Up + CRT Up = memoria with both)
function hasAllTags(vals, all) {
  for (const [field, set] of Object.entries(all)) for (const v of set) if (!(vals[field] || []).includes(v)) return false;
  return true;
}

// does an item pass every group with picks? (OR inside a group, AND across groups)
function passes(vals, all = picks()) {
  for (const [field, set] of Object.entries(all)) {
    if (set.size && !(vals[field] || []).some((v) => set.has(v))) return false;
  }
  return true;
}

// a tag clicked in a skill: show only what has it (the other tag filters are cleared)
function filterByTag(id) {
  const t = tagOf(id);
  const group = t && groups().find((g) => TAG_GROUPS[g.field]?.(id)), field = group?.field;
  if (!field) return;
  if (group.tab) state.ftab = group.tab;                         // the tab holding it comes up
  const already = picks()[field]?.has(id);
  for (const f of Object.keys(TAG_GROUPS)) delete picks()[f];
  if (!already) picks()[field] = new Set([id]);                // clicking the active tag again turns it off
  applyFilters();
}

// the tags picked in the filters are lit in the skills (no bar of picks above the tiles: owner 2026-09-30)
function showActive() {
  const on = new Set(Object.keys(TAG_GROUPS).flatMap((f) => [...(picks()[f] || [])]));
  $$("#detail [data-tag], #mdlg [data-tag]").forEach((b) => b.classList.toggle("on", on.has(b.dataset.tag)));
}

function filtered(all = picks()) {
  const q = charQuery();
  return D.units.filter((u) => passes(VALUES.units.get(u.id), all) && unitMatches(u, q));
}

// ---- Characters, the left filter (owner, like the Monmusu wiki: the funnel button shows / hides it): laid out
// like the Find Memoria page's, [attribute | role] over [school, team | type, position]; one pick per
// group (another pick replaces it, the lit one clears it); an option that would leave no unit is greyed out ----
function buildUnitFilter() {
  const g = Object.fromEntries(UNIT_LEFT.map((x) => [x.field, x]));
  const opts = (field) => values(g[field], "units").map((v) => `<button class="opt" data-uf="${field}" data-value="${esc(v)}" ` +
    `title="${esc(label(g[field], v))}">${optionInner(g[field], v)}</button>`).join("");
  const box = (field, cls = "fbox") => `<div class="fgroup ${cls}" data-ug="${field}"><div class="opts">${opts(field)}</div></div>`;
  const dd = (field) => `<div class="fgroup dd fdd dd-${field}-g" data-ug="${field}">
      <button class="dd-btn"><span class="dd-lbl">${esc(ui(field))}</span><span class="dd-val"></span><span class="dd-end"></span><span class="caret">▾</span></button>
      <div class="dd-list" hidden>${opts(field)}</div></div>`;
  $("#ufilter").innerHTML = `<div class="ftop">${box("attribute")}${box("role")}
      <div class="fcol">${dd("school")}${dd("team")}</div>
      <div class="fbox ustack">${box("type", "")}${box("position", "")}</div></div>`;
  $$("#ufilter .dd-list").forEach((l) => $$(".opt", l).forEach((o, i) => { o.dataset.order = i; }));
}

function updateUnitFilterUI() {
  let n = 0;
  for (const { field } of UNIT_LEFT) {
    const group = $(`#ufilter [data-ug="${field}"]`), picked = picks()[field] || new Set();
    if (!group) continue;
    n += picked.size;
    group.classList.toggle("has-picks", picked.size > 0);
    $$(".opt", group).forEach((b) => {
      const v = b.dataset.value, on = picked.has(v);
      const zero = !on && !filtered({ ...picks(), [field]: new Set([v]) }).length;
      b.classList.toggle("on", on);
      b.classList.toggle("zero", zero);
      b.disabled = zero;
    });
    if (!group.classList.contains("dd")) continue;
    // school / team (one pick): [logo ....... x] (owner), the ones you can pick first (school order kept);
    // a list whose options would all leave no unit is greyed out as a whole
    const dead = !picked.size && $$(".opt", group).every((b) => b.disabled);
    group.classList.toggle("dead", dead);
    group.querySelector(".dd-btn").disabled = dead;
    group.querySelector(".dd-val").innerHTML = picked.size ? [...picked].map((v) => logo(`${field}-${v}`, look(`${field}s`, v), "org")).join("")
      : `<span class="dd-none">---</span>`;
    group.querySelector(".dd-end").innerHTML = picked.size ? `<span class="ddx" data-ddx="${field}" data-value="${esc([...picked][0])}" ` +
      `title="${esc(ui("removeFilter"))}">×</span>` : "";
    const list = group.querySelector(".dd-list"), os = $$(".opt", list);
    os.sort((a, b) => a.classList.contains("zero") - b.classList.contains("zero") || a.dataset.order - b.dataset.order);
    if (os.some((o, i) => o !== list.children[i])) os.forEach((o) => list.appendChild(o));
  }
  $("#listFilterCount").textContent = n || "";
  $("#listFilterBtn").classList.toggle("has", n > 0);
}

// ---- unit tiles: built once per language, filters only show/hide them -------------------------
function buildTiles() {
  $("#units").innerHTML = D.units.map((u) =>
    `<button class="tile rf${u.rarity}" data-unit="${u.id}" title="${esc(D.rarity[u.rarity])} ${esc(charName(u.char))} ${esc(unitTitle(u))}">
      ${pic(u)}<span class="nm">${esc(charName(u.char))}</span></button>`).join("") +
    `<div class="empty" hidden>${esc(ui("nothing"))}</div>`;
  TILES = new Map($$("#units .tile").map((el) => [+el.dataset.unit, el]));
  buildUnitFilter();
  buildFinder();
  applyFilters();
}

// memoria picture: the card (img/memoria/small/<art>.png, 300x168) under the game's film frame; big = the
// artwork (img/memoria/<art>.jpg), no frame. Missing: the unit picture when the art is a unit, else a letter.
function memoriaPic(m, cls = "") {
  const big = cls.includes("big");
  const first = big ? `img/memoria/${m.art}.jpg` : `img/memoria/small/${m.art}.png`;
  const second = big ? `img/memoria/small/${m.art}.png` : `img/units/${m.art}.png`;
  return `<div class="mpic ${cls}"><span class="ph">${esc((text(`memoria.${m.id}.name`) || "?").slice(0, 1))}</span>` +
    `<img class="art" src="${esc(first)}" alt=""${big ? "" : ` loading="lazy"`} ` +
    `onerror="if(!this.dataset.f){this.dataset.f=1;this.src='${esc(second)}'}else this.remove()">` +
    (big ? "" : `<img class="frm" src="img/frames/icon_frm_memory_${MEMORIA_FRAME[m.rarity] || "sr"}.png" alt="" onerror="this.remove()">`) +
    `</div>`;
}

function applyFilters() {
  if (FULL(state.mode)) return;
  $("#units").hidden = state.mode !== "units";
  $("#finder").hidden = state.mode !== "memoria";
  $(".pane.units").classList.toggle("finder-mode", state.mode === "memoria");
  $("#layout").classList.toggle("mode-memoria", state.mode === "memoria");
  $("#listFilterBtn").hidden = state.mode !== "units";
  $("#listFilterBtn").classList.toggle("open", state.lf);
  $("#ufilter").hidden = state.mode !== "units" || !state.lf;
  // Find Memoria: the top box searches characters, the advanced filter's top row is the memoria search
  $("#search").placeholder = ui(state.mode === "memoria" ? "searchChar" : "search");
  $("#msearch").hidden = state.mode !== "memoria";
  $("#fheadLbl").hidden = state.mode === "memoria";
  if (state.mode === "memoria") {
    updateFinderUI();
    drawFinder();
    updateFilterUI();
    return;
  }
  const okIds = new Set(filtered().map((u) => u.id));
  let shown = 0;
  for (const u of D.units) {
    const show = okIds.has(u.id);
    TILES.get(u.id).hidden = !show;
    if (show) shown++;
  }
  $("#units .empty").hidden = shown > 0;
  $("#count").textContent = shown;
  markSelected();
  updateUnitFilterUI();
  updateFilterUI();
}

function markSelected() {
  for (const [id, el] of TILES) el.classList.toggle("sel", id === state.unit);
}

// ---- memoria: who each skill helps ---------------------------------------------------------
// A skill's conditions come from MemoryHighlight (unit, character, team, role / attribute / type flags, party
// slots, or the enemy side). Skills without a highlight (18 memoria) say it with their display targets:
// all allies, one ally, rows / columns, types. Flags: bit n = value n+1.
function rangeSlots(range) {
  // display range (4 front, 8 back, 16 right, 32 left, 64 centre column) -> party slots; none of a kind = all of it
  const rows = ((range & 4 ? 7 : 0) | (range & 8 ? 56 : 0)) || 63;
  const cols = ((range & 32 ? 9 : 0) | (range & 64 ? 18 : 0) | (range & 16 ? 36 : 0)) || 63;
  return rows & cols;
}

// "SPD Shift" skills lower one slot's SPD and raise another's ('左列後衛の味方の行動速度を25低下させる。さらに
// 右列後衛の味方の…上昇させる'): only the raised slot is helped. null = not such a skill
const SLOT_COL = { 左: 9, 中央: 18, 右: 36 }, SLOT_ROW = { 前衛: 7, 後衛: 56 };
function shiftSlots(sid) {
  const t = D.text.ja[`skill.${sid}.desc.0`] || "";
  if (!/味方の[^。]*低下/.test(t)) return null;
  const up = t.split(/。|さらに/).find((x) => /味方の[^。]*上昇/.test(x)) || "";
  const m = up.match(/(左|中央|右)列(前衛|後衛)の味方/);
  return m ? SLOT_COL[m[1]] & SLOT_ROW[m[2]] : null;
}

function skillConds(m, sid) {
  const hs = m.highlights.filter((h) => h.skill === sid);
  if (hs.length) return hs.map((h) => ({ friendly: h.friendly, unit: h.unit, char: h.char, team: h.team,
    roles: h.roles || 0, attributes: h.attributes || 0, types: h.types || 0, slots: h.slots || 0,
    all: !h.unit && !h.char && !h.team && !h.roles && !h.attributes && !h.types && !h.slots }));
  const t = D.skills[sid]?.targets || {};
  const cats = new Set((D.tags.skills[sid] || []).map(tagCat));
  const enemy = !cats.has("buff") && (cats.has("debuff") || cats.has("ailment"));
  const range = t.range || 0;
  const slots = range & 3 ? 0 : range ? (shiftSlots(sid) ?? rangeSlots(range)) : 0;
  const types = t.type || 0, attributes = t.attribute || 0, roles = t.role || 0;
  return [{ friendly: !enemy, types, attributes, roles, slots, one: !!(range & 1),
    all: !slots && !types && !attributes && !roles }];
}

function condHolds(c, u, slot) {
  if (!c.friendly) return false;
  if (u) {
    if (c.unit && c.unit !== u.id) return false;
    if (c.char && c.char !== u.char) return false;
    if (c.team && CHARS[u.char]?.team !== c.team) return false;
    if (c.roles && !(c.roles & (1 << (u.role - 1)))) return false;
    if (c.types && !(c.types & (1 << (u.type - 1)))) return false;
    if (c.attributes && ![u.attribute, u.attribute2].some((a) => a && c.attributes & (1 << (a - 1)))) return false;
  }
  if (slot && c.slots && !(c.slots & slot)) return false;
  // a position alone (no unit): only the skills for that position or for every ally help it; one for a
  // unit, character, team or kind of unit depends on who stands there
  if (slot && !u && (c.unit || c.char || c.team || c.roles || c.attributes || c.types)) return false;
  // position aptitude (owner): a unit is placed in its own row (front 1-3 / back 4-6; both = either)
  if (slot && u && !fitsSlot(u, slot)) return false;
  return true;
}
const ROW_SLOTS = { 1: 7, 2: 56, 3: 63 };                // position 1 front, 2 back, 3 both -> the party slots
const fitsSlot = (u, slot) => !!((ROW_SLOTS[u.position] ?? 63) & slot);
// how specific a condition is (sorting: a memoria made for this unit before one for everyone)
const specific = (c) => (c.unit ? 5 : c.char ? 4 : c.team ? 3 : c.roles || c.attributes || c.types ? 2 : c.slots ? 1 : 0);

function computeConds() {
  CONDS = new Map(D.memoria.map((m) => [m.id, m.skills.map((sid) => ({ sid, conds: skillConds(m, sid) }))]));
}

// the memoria that help UNIT at SLOT (null / 0 = don't care): [{m, applies: [sid], score}]
function finderMatches(unit, slot, tagPicks = picks(), q = "", first = false, x = state.finder.x) {
  const any = !unit && !slot, out = [];
  const { rarity, ...tagOnly } = tagPicks, vals = MEMV[state.mazeSw];
  const tagged = Object.values(tagOnly).some((s) => s.size);
  for (const m of D.memoria) {
    const skills = CONDS.get(m.id);
    const hit = skills.filter((s) => s.conds.some((c) => condHolds(c, unit, slot)));
    if (!any && !hit.length) continue;
    const applies = hit.map((s) => s.sid);
    if (x && !any && applies.length !== x) continue;
    if (rarity?.size && !rarity.has(String(m.rarity))) continue;
    if (tagged && !hasAllTags(vals.get(m.id), tagOnly)) continue;
    if (q && ![text(`memoria.${m.id}.name`), D.text.ja[`memoria.${m.id}.name`], ...m.skills.map((s) => text(`skill.${s}.name`)),
      ...(m.relics || []).map((r) => { const rel = D.maze?.relics?.[r]; return rel ? relicName(r, rel.rarities, rel.rarity) : ""; })]
      .some((s) => s && s.toLowerCase().includes(q))) continue;         // names: memoria, skills, maze effect
    const score = Math.max(0, ...hit.flatMap((s) => s.conds.filter((c) => condHolds(c, unit, slot)).map(specific)));
    out.push({ m, applies, score });
    if (first) return out;                        // only "is there any?" (greying out options)
  }
  if (!any) out.sort((a, b) => b.applies.length - a.applies.length || b.score - a.score || b.m.rarity - a.m.rarity || b.m.id - a.m.id);
  return out;
}
// Find Memoria (owner): the advanced filter's box searches memoria, the top box characters (the unit tiles)
const query = () => $("#msearch").value.trim().toLowerCase();
const charQuery = () => $("#search").value.trim().toLowerCase();
function unitMatches(u, q) {
  if (!q) return true;
  const row = D.lookup.characters?.[u.char] || {};
  const hay = [row.ja, row.en, row.ruby, D.text.ja[`unit.${u.id}.title`], enText(`unit.${u.id}.title`)];
  return hay.some((s) => s && s.toLowerCase().includes(q));
}

// ---- memoria finder, left pane: position (2x3, like the party) + the unit, narrowed by attribute, role,
// school and team; built once per language, a click only switches classes ----------------------------
function unitPassesNarrow(u, f = state.finder) {
  const c = CHARS[u.char] || {};
  if (f.attr.size && ![u.attribute, u.attribute2].some((a) => a && f.attr.has(String(a)))) return false;
  if (f.role.size && !f.role.has(String(u.role))) return false;
  if (f.school.size && !f.school.has(String(c.school))) return false;
  if (f.team.size && !f.team.has(String(c.team))) return false;
  return true;
}

function finderOptions() {
  const set = (key) => [...new Set(D.units.flatMap((u) => {
    const c = CHARS[u.char] || {};
    if (key === "attr") return [u.attribute, u.attribute2].filter(Boolean);
    if (key === "role") return [u.role];
    return c[key] != null ? [c[key]] : [];
  }))].map(String).sort((a, b) => a - b);
  return { attr: set("attr"), role: set("role"), school: set("school"), team: set("team").sort(byTeamSchool) };
}

function buildFinder() {
  const o = finderOptions();
  const cell = (s, n) => `<button class="slotbox" data-slot="${s}" title="${esc(ui("slotNames")[s])}">${n}</button>`;
  const opt = (key, v, inner, name) => `<button class="opt" data-fg="${key}" data-value="${esc(v)}" title="${esc(name)}">${inner}</button>`;
  // school / team: the name inside the box, on the left (owner: no heading above it)
  const dd = (key, list) => `<div class="fgroup dd fdd dd-${key}-g" data-fgroup="${key}">
      <button class="dd-btn"><span class="dd-lbl">${esc(ui(key))}</span><span class="dd-val"></span><span class="dd-end"></span><span class="caret">▾</span></button>
      <div class="dd-list" hidden>${list.map((v, i) => opt(key, v, logo(`${key}-${v}`, look(`${key}s`, v), "org"), look(`${key}s`, v))
        .replace("<button ", `<button data-order="${i}" `)).join("")}</div></div>`;
  const bySchool = new Map();
  for (const u of D.units) {
    const s = CHARS[u.char]?.school ?? 0;
    if (!bySchool.has(s)) bySchool.set(s, []);
    bySchool.get(s).push(u);
  }
  const schools = [...bySchool.keys()].sort((a, b) => a - b);
  // owner's layout, one grid so the edges line up: [attribute | role] over [school, team | position 2x3 (small)]
  // (no Attribute / Role headings: owner), a line, then the units that match
  $("#finder").innerHTML = `
    <div class="ftop">
      <div class="fgroup fbox" data-fgroup="attr"><div class="opts">${o.attr.map((v) => opt("attr", v, attrIcon(v), look("attributes", v))).join("")}</div></div>
      <div class="fgroup fbox" data-fgroup="role"><div class="opts">${o.role.map((v) => opt("role", v, roleIcon(v), look("roles", v))).join("")}</div></div>
      <div class="fcol">${dd("school", o.school)}${dd("team", o.team)}</div>
      <div class="fpos fbox"><h4>${esc(ui("posHead"))}</h4>
        <div class="slotgrid">${cell(1, 1)}${cell(2, 2)}${cell(4, 3)}${cell(8, 4)}${cell(16, 5)}${cell(32, 6)}</div>
        <div class="xfilter">${[2, 1].map((n) => `<button class="xbtn x${n}" data-x="${n}" title="${esc(ui("xTip")[n])}">×${n}</button>`).join("")}</div></div>
    </div>
    <div class="funits">
      <p class="fhint">${esc(ui("finderHint"))}</p>
      <div class="upick">${schools.map((s) => `<div class="usch" data-school="${s}">
          <div class="usch-h">${s ? logo(`school-${s}`, look("schools", s), "org") : ""}${/^-+$/.test(look("schools", s)) ? "" : `<span>${esc(look("schools", s))}</span>`}</div>
          <div class="utiles">${bySchool.get(s).map((u) => `<button class="tile ftile rf${u.rarity}" data-funit="${u.id}"
              title="${esc(D.rarity[u.rarity])} ${esc(charName(u.char))} ${esc(unitTitle(u))}">${pic(u)}
              <span class="nm">${esc(charName(u.char))}<small>${esc(unitTitle(u))}</small></span></button>`).join("")}</div></div>`).join("")}</div>
    </div>`;
  FTILES = new Map($$("#finder [data-funit]").map((el) => [+el.dataset.funit, el]));
}

function updateFinderUI() {
  const f = state.finder, unit = UNITS.get(f.unit) || null, q = query();
  // positions: a slot that would leave no memoria is greyed out
  $$("#finder .slotbox").forEach((b) => {
    const s = +b.dataset.slot, on = f.slot === s;
    const zero = !on && !finderMatches(unit, s, picks(), q, true).length;
    b.classList.toggle("on", on);
    b.classList.toggle("zero", zero);
    b.disabled = zero;
  });
  // narrowing groups (one pick each): a pick that would leave no unit is greyed out
  for (const key of ["attr", "role", "school", "team"]) {
    const group = $(`#finder [data-fgroup="${key}"]`);
    if (!group) continue;
    group.classList.toggle("has-picks", f[key].size > 0);
    $$(".opt", group).forEach((b) => {
      const v = b.dataset.value, on = f[key].has(v);
      const zero = !on && !D.units.some((u) => unitPassesNarrow(u, { ...f, [key]: new Set([v]) }));
      b.classList.toggle("on", on);
      b.classList.toggle("zero", zero);
      b.disabled = zero;
    });
    const val = group.querySelector(".dd-val");
    // one pick: [logo ....... x] (owner): the logo alone, the x at the right end instead of the arrow
    if (val) val.innerHTML = f[key].size ? [...f[key]].map((v) => logo(`${key}-${v}`, look(`${key}s`, v), "org")).join("")
      : `<span class="dd-none">---</span>`;
    const end = group.querySelector(".dd-end");
    if (end) end.innerHTML = f[key].size ? `<span class="ddx" data-ddx="${key}" data-value="${esc([...f[key]][0])}" title="${esc(ui("removeFilter"))}">×</span>` : "";
    // the ones you can pick first, the greyed-out ones after (each part in school order: owner)
    const list = group.querySelector(".dd-list");
    if (list) {
      const opts = $$(".opt", list);
      opts.sort((a, b) => a.classList.contains("zero") - b.classList.contains("zero") || a.dataset.order - b.dataset.order);
      if (opts.some((o, i) => o !== list.children[i])) opts.forEach((o) => list.appendChild(o));
    }
  }
  // x2 / x1: only with a unit or a slot picked
  $("#finder .xfilter").classList.toggle("has-picks", !!f.x);
  $$("#finder [data-x]").forEach((b) => {
    const n = +b.dataset.x, on = f.x === n;
    const zero = !on && ((!unit && !f.slot) || !finderMatches(unit, f.slot, picks(), q, true, n).length);
    b.classList.toggle("on", on);
    b.classList.toggle("zero", zero);
    b.disabled = zero;
  });
  // units: only once attribute, role, school or team is picked (owner), then those that pass it; greyed out
  // when they would leave no memoria; the unit picked always shows
  const cq = charQuery(), narrowed = !!cq || ["attr", "role", "school", "team"].some((k) => f[k].size);
  $("#finder .fhint").hidden = narrowed;
  const shownSchools = new Set();
  for (const [id, el] of FTILES) {
    const u = UNITS.get(id), show = (narrowed && unitPassesNarrow(u) && unitMatches(u, cq)) || id === f.unit;
    el.hidden = !show;
    el.classList.toggle("sel", id === f.unit);
    const zero = show && id !== f.unit && !finderMatches(u, f.slot, picks(), q, true).length;
    el.classList.toggle("zero", zero);
    el.disabled = zero;
    if (show) shownSchools.add(el.closest(".usch").dataset.school);
  }
  $$("#finder .usch").forEach((s) => { s.hidden = !shownSchools.has(s.dataset.school); });
}

// the chips saying whom a memoria skill helps; ok = the unit / slot picked meets it
function whoChips(c) {
  const out = [];
  if (!c.friendly) out.push(`<span class="tag debuff">${esc(ui("enemy"))}</span>`);
  if (c.unit) {
    const u = UNITS.get(c.unit);
    if (u) out.push(`<button class="who" data-goto="${u.id}" title="${esc(unitTitle(u))} · ${esc(ui("thisVersion"))}">${pic(u, "tiny")}` +
      `<span>${esc(charName(u.char))}<small>${esc(ui("thisVersion"))}</small></span></button>`);
  }
  if (c.char) {
    const u = D.units.find((x) => x.char === c.char);          // the newest unit of that character
    out.push(u ? `<button class="who" data-goto="${u.id}" title="${esc(ui("everyVersion"))}">${pic(u, "tiny")}<span>${esc(charName(c.char))}` +
        `<small>${esc(ui("everyVersion"))}</small></span></button>`
      : `<span class="chip">${esc(charName(c.char))}</span>`);
  }
  if (c.team) out.push(logo(`team-${c.team}`, look("teams", c.team), "org small", `${ui("team")}: ${look("teams", c.team)}`));
  for (const v of bits(c.types || 0)) out.push(mark("type", v, look("types", v)));
  for (const v of bits(c.attributes || 0)) out.push(mark("attribute", v, look("attributes", v)));
  for (const v of bits(c.roles || 0)) out.push(mark("role", v, look("roles", v)));
  if (c.slots) out.push(slotsIcon(c.slots, `${ui("slots")}: ${slotTitle(c.slots)}`));
  if (c.friendly && c.all) out.push(`<span class="chip">${esc(ui(c.one ? "oneAlly" : "everyone"))}</span>`);
  return out.join("");
}

// the effect: name row (RIGHT at its right end: the tags and whom it helps, owner) and text
// one paragraph (owner, 2026-09-30): name – text, then RIGHT (the tags, whom it helps) at its end; no skill-kind
// icon or Passive Skill badge
function memoriaEffect(sid, right = "") {
  const s = D.skills[sid];
  if (!s) return "";
  // the name without its trailing [target] / 【対象】: the icons at the end say whom it helps (owner; display only,
  // the data keeps the whole name)
  const name = text(`skill.${sid}.name`).replace(/\s*[\[【][^\]】]*[\]】]\s*$/, "");
  return `<div class="mline"><span class="name">${esc(name)}</span><span class="dash"> – </span>` +
    `<span class="desc">${describe(sid, s, s.maxLv).trim()}</span>${right}</div>`;
}

// one line: the tags, then whom it helps (no "For" label, owner)
function memoriaMeta(m, sid) {
  const conds = (CONDS.get(m.id).find((s) => s.sid === +sid) || {}).conds || [];
  return `<div class="mmeta">${tagsHtml(sid)}${conds.map(whoChips).join("")}</div>`;
}

// ---- memoria finder, right pane: what the picks match, best first ----------------------------------
// ✓ applies / ✓ only in these slots (no position picked and only a slot condition holds) / does not apply
function verdictOf(m, sid, applies, unit, slot) {
  if (!applies.includes(sid)) return false;
  const held = CONDS.get(m.id).find((s) => s.sid === sid).conds.filter((c) => condHolds(c, unit, slot));
  return !slot && held.every((c) => c.slots) ? "slot" : true;
}
// relics (the Maze relics page): rarity names and frame colours
const RELIC_RARITY = { 1: "N", 2: "R", 3: "SR", 4: "SSR", 5: "UR", 6: "LR" };
const RELIC_RF = { 1: 1, 2: 1, 3: 3, 4: 5, 5: 7, 6: 9 };            // relic rarity -> the unit rarity frame colours
// a relic text with the game's own colours (<color=#hex>…</color>: orange = up, teal = down, green = heal)
const relicText = (key) => esc(text(key)).replace(/&lt;color=(#[0-9a-fA-F]{6})&gt;(.*?)&lt;\/color&gt;/g, '<span class="rc" style="color:$1">$2</span>');
// the name at rarity R, else the relic's first name (upgrades often keep their name)
const relicName = (id, rarities, r) => text(`relic.${id}.name.${r}`) || text(`relic.${id}.name.${rarities[0]}`);

// a UR memoria's maze effect (a maze relic at its base rarity, like the game's memoria preview): a row under
// both skills
function mazeRow(m) {
  return (m.relics || []).map((id) => {
    const rel = D.maze?.relics?.[id];
    if (!rel) return "";
    const r = rel.rarity;
    // the attribute / type it is for (from its name at update time: rel.attributes / rel.types), like the skills'
    // icons; the name then drops its bracket (owner)
    const marks = [...(rel.types || []).map((v) => mark("type", v, look("types", v))),
      ...(rel.attributes || []).map((v) => mark("attribute", v, look("attributes", v)))].join("");
    const tags = (rel.tags || []).map((t) => { const o = tagOf(t); return o ? `<button class="tag ${esc(o.cat)}" data-tag="${esc(t)}" ` +
      `title="${esc(ui("tagFilter"))}">${esc(state.lang === "ja" ? o.ja : o.label)}</button>` : ""; }).join("");
    // like the skills: [Maze] name – text [tags] in one paragraph (no relic picture: owner)
    return `<div class="mres-skill mres-maze"><div class="mres-eff"><div class="mline">` +
      `<span class="kind km">${esc(ui("mazeKind"))}</span><span class="name">${esc(relicName(id, rel.rarities, r).replace(/\s*[（(][^）)]*[）)]\s*$/, ""))}</span>` +
      `<span class="dash"> – </span><span class="desc">${relicText(`relic.${id}.desc.${r}`)}</span><div class="mmeta">${tags}${marks}</div></div></div></div>`;
  }).join("");
}

let CARDS = null;                               // memoria id -> its result card (built once per language)
function buildCards() {
  const box = document.createElement("div");
  box.className = "mresults";
  // owner's layout: [rarity name / picture] | [skill 1 | skill 2] (tags on the name line), the maze effect (UR)
  // under both skills; the verdict at the bottom of each skill once a unit or a position is picked
  box.innerHTML = D.memoria.map((m) => `<div class="card mres${m.skills.length > 1 ? "" : " one"}${m.relics?.length ? " maze" : ""}" data-card="${m.id}">
      <div class="mres-side">
        <div class="mres-title"><button class="mres-name" data-mopen="${m.id}">${esc(text(`memoria.${m.id}.name`))}</button></div>
        <button class="mres-pic" data-mopen="${m.id}" title="${esc(ui("openMemoria"))}">${memoriaPic(m)}<span class="xbadge" hidden></span></button></div>
      ${m.skills.slice(0, 2).map((sid, i) => `<div class="mres-skill c${i}" data-sid="${sid}"><div class="mres-eff">${memoriaEffect(sid, memoriaMeta(m, sid))}</div>` +
        `<div class="mfoot"><span class="verdict" hidden></span></div></div>`).join("")}${mazeRow(m)}</div>`).join("") +
    `<div class="empty" hidden>${esc(ui("nothingMemoria"))}</div>`;
  CARDS = { box, lang: state.lang, ver: state.ver, map: new Map($$("[data-card]", box).map((el) => [+el.dataset.card, el])) };
}

function drawFinder() {
  const f = state.finder, unit = UNITS.get(f.unit) || null;
  const list = finderMatches(unit, f.slot, picks(), query());
  $("#count").textContent = list.length;
  const any = !unit && !f.slot;
  if (!CARDS || CARDS.lang !== state.lang || CARDS.ver !== state.ver) buildCards();
  if (CARDS.box.parentNode !== $("#detail")) { $("#detail").innerHTML = ""; $("#detail").appendChild(CARDS.box); }
  const shown = new Set();
  for (const { m, applies } of list) {
    const el = CARDS.map.get(m.id), x = applies.length, badge = el.querySelector(".xbadge");
    shown.add(m.id);
    badge.hidden = any;
    badge.className = `xbadge x${x}`;
    badge.textContent = `×${x}`;
    badge.title = fill(ui("matchTip"), { n: x });
    $$(".mres-skill[data-sid]", el).forEach((col) => {       // the skill rows (the maze row has no verdict)
      const v = any ? null : verdictOf(m, +col.dataset.sid, applies, unit, f.slot), said = col.querySelector(".verdict");
      col.classList.toggle("off", v === false);
      said.hidden = v == null;
      said.className = `verdict ${v === "slot" ? "slot" : v ? "yes" : "no"}`;
      said.textContent = v === "slot" ? "✓ " + ui("inSlots") : v ? "✓ " + ui("applies") : ui("notApplies");
    });
    el.hidden = false;
    CARDS.box.appendChild(el);                     // in the order of the list (moving a node keeps its pictures)
  }
  for (const [id, el] of CARDS.map) if (!shown.has(id)) el.hidden = true;
  const empty = CARDS.box.querySelector(".empty");
  empty.hidden = list.length > 0;
  CARDS.box.appendChild(empty);
  showActive();
}

// a memoria's picture in full (owner: the details are on its card already): a viewer over the page
function openMemoria(id) {
  const m = D.memoria.find((x) => x.id === id);
  if (!m) return;
  const d = $("#mdlg");
  d.innerHTML = `<button class="dlg-close view-x" data-close="1" title="${esc(ui("close"))}">×</button>
    <img class="view-img" src="img/memoria/${esc(m.art)}.jpg" alt="" onerror="this.src='img/memoria/small/${esc(m.art)}.png'">
    <div class="view-cap">${rarityLogo(D.memoriaRarity[m.rarity])}<b>${esc(text(`memoria.${m.id}.name`))}</b></div>`;
  if (!d.open) d.showModal();
  if (!ROUTING && location.hash !== `#memoria/${id}`) { go(`#memoria/${id}`); DIALOG_PUSHED = true; }
  showActive();
}

// ---- unit page ------------------------------------------------------------------------------
// summary: icons only, the name in the tooltip
function mark(kind, id, title, fallback) {
  if (id == null || !title) return "";
  return `<span class="mark" title="${esc(ui(kind))}: ${esc(title)}">${icon(`${kind}-${id}`, fallback || (title || "?").slice(0, 1),
    kind === "type" ? `t${id}` : "")}</span>`;
}

function summary(u) {
  const c = CHARS[u.char] || {};
  const row = D.lookup.characters?.[u.char] || {};
  const ruby = state.lang === "ja" && row.ruby ? `<span class="ruby">${esc(row.ruby)}</span>` : "";
  const siblings = D.units.filter((x) => x.char === u.char);
  const variant = siblings.length > 1 ? `<button id="variantBtn" class="variant-btn" title="${esc(ui("variants"))}">` +
    `${esc(ui("variant"))} <b>${siblings.length}</b></button>` : "";
  const school = look("schools", c.school), team = c.team ? look("teams", c.team) : "";
  return `<div class="summary rf${u.rarity}">${pic(u, "big")}<div class="sum-main">
    <div class="title-row"><h2>${esc(charName(u.char))}${ruby}</h2>${variant}
      <button id="findBtn" class="find-btn" title="${esc(ui("findMemoriaTip"))}">${esc(ui("findMemoria"))} →</button></div>
    <div class="sub">${esc(unitTitle(u))}</div>
    <div class="marks">${rarityLogo(u.rarity, "big")}
      ${mark("type", u.type, look("types", u.type))}${mark("attribute", u.attribute, look("attributes", u.attribute))}
      ${u.attribute2 ? mark("attribute", u.attribute2, look("attributes", u.attribute2)) : ""}
      ${mark("role", u.role, look("roles", u.role))}
      ${u.position ? positionIcon(u.position, `${ui("position")}: ${look("positions", u.position)}`) : ""}
      ${school ? logo(`school-${c.school}`, school, "org", `${ui("school")}: ${school}`) : ""}
      ${team ? logo(`team-${c.team}`, team, "org", `${ui("team")}: ${team}`) : ""}</div></div></div>`;
}

function variantsDialog(u) {
  const siblings = D.units.filter((x) => x.char === u.char);
  const d = $("#variants");
  d.innerHTML = `<div class="dlg-head"><b>${esc(charName(u.char))}</b><span>${esc(ui("variants"))}</span>
      <button class="dlg-close" data-close="1" title="${esc(ui("close"))}">×</button></div>
    <div class="dlg-list">${siblings.map((x) => `<button class="vrow rf${x.rarity}${x.id === u.id ? " on" : ""}" data-unit="${x.id}">
      ${pic(x, "small")}${rarityLogo(x.rarity)}<span class="vt">${esc(unitTitle(x))}</span>
      <small>${esc(x.since || ui("launch"))}</small></button>`).join("")}</div>`;
  d.showModal();
  placeNear(d, $("#variantBtn"));
}

// a dialog as a pop-up next to its button (below it, else above), kept inside the window
function placeNear(d, anchor) {
  if (!anchor) return;
  const r = anchor.getBoundingClientRect(), gap = 6, edge = 12;
  const w = d.offsetWidth, h = d.offsetHeight;
  const left = Math.max(edge, Math.min(r.left, innerWidth - w - edge));
  let top = r.bottom + gap;
  if (top + h > innerHeight - edge) top = Math.max(edge, Math.min(r.top - gap - h, innerHeight - h - edge));
  d.style.left = `${left}px`;
  d.style.top = `${top}px`;
}

const variantOf = (skill, lv) => skill.descFrom.reduce((best, from, k) => (from <= lv ? k : best), 0);
const valueAt = (series, lv) => num(series[Math.min(lv, series.length) - 1]);

function describe(sid, skill, lv) {
  return esc(text(`skill.${sid}.desc.${variantOf(skill, lv)}`)).replace(/\{(\d+)\}/g, (m, k) => {
    const series = skill.params[+k];
    return series ? `<b data-k="${k}">${esc(valueAt(series, lv))}</b>` : m;
  });
}

function tagsHtml(sid) {
  return (D.tags.skills[sid] || []).map((id) => {
    const t = tagOf(id);
    return t ? `<button class="tag ${esc(t.cat)}" data-tag="${esc(id)}" title="${esc(ui("tagFilter"))}">` +
      `${esc(state.lang === "ja" ? t.ja : t.label)}</button>` : "";
  }).join("");
}

function skillHtml(sid) {
  const s = D.skills[sid];
  if (!s) return "";
  const lv = Math.min(state.level, s.maxLv);
  const cost = s.cost ? `${ui("cost")[s.type]} ${s.cost}` : "";
  const cd = s.cd ? (s.cd >= 99 ? `${ui("cd")} ∞` : `${ui("cd")} ${s.cd} ${ui("cdUnit")[s.cdTiming] || ""}`) : "";
  return `<div class="card skill" data-sid="${sid}" data-variant="${variantOf(s, lv)}"><div class="head">
      ${icon(`skillkind-${s.kind}`, "", "kindic")}<span class="kind k${s.type}">${esc(look("skillTypes", s.type))}</span>
      <span class="name">${esc(text(`skill.${sid}.name`))}</span>
      <span class="meta">${esc([cost, cd].filter(Boolean).join(" · "))}${cost || cd ? " · " : ""}<span class="slv">Lv ${lv}/${s.maxLv}</span></span></div>
    <div class="desc">${describe(sid, s, lv)}</div><div class="chips">${tagsHtml(sid)}</div></div>`;
}

function skillsTab(u) {
  return `<div id="skills">${u.skills.map(skillHtml).join("")}</div>`;
}

// stat pictures for the Stats card (the game's own are not among its named UI pictures)
const STAT_SVG = {
  hp: '<path d="M10 17s-6-3.8-6-8.2A3.3 3.3 0 0 1 10 6.6a3.3 3.3 0 0 1 6 2.2C16 13.2 10 17 10 17z"/>',
  atk: '<path d="M4 4l8 8M4 4h3l7 7-3 3-7-7zM12 16l4-4M14 14l3 3"/>',
  def: '<path d="M10 3l6 2v5c0 4-3 6.5-6 7.5C7 16.5 4 14 4 10V5z"/>',
  crt: '<path d="M10 2l1.6 5.4L17 9l-5.4 1.6L10 16l-1.6-5.4L3 9l5.4-1.6z"/>',
  spd: '<path d="M3 6h7M2 10h9M3 14h7M12 5l5 5-5 5"/>',
  ap: '<path d="M10 3l7 7-7 7-7-7z M10 7l3 3-3 3-3-3z"/>',
  pp: '<path d="M10 3l7 7-7 7-7-7z M7 10h6"/>',
};

// the numbers the Stats card shows (max values; AP/PP with the highest rarity's additions), per unit, once
function statValues(u) {
  const top = (u.rarities || []).reduce((best, r) => (r.rarity > (best?.rarity ?? 0) ? r : best), null);
  return { hp: u.stats[0][1], atk: u.stats[1][1], def: u.stats[2][1], crt: u.crit[1], spd: u.stats[3][1],
    ap: u.ap + (top?.ap || 0), pp: u.pp + (top?.pp || 0) };
}
const statText = (k, v) => (k === "crt" ? pct(v) : num(v));
const hasAttr = (u, a) => String(u.attribute) === a || String(u.attribute2) === a;
// percentile of V among UNITS (the unit itself left out): the share of the others it is higher than or equal to
// and the rank: 1 + how many are higher (ties share a rank)
function percentile(k, v, units, self) {
  const others = units.filter((u) => u.id !== self);
  const rank = 1 + others.filter((u) => STATV.get(u.id)[k] > v).length;
  if (!others.length) return { p: 100, n: 0, rank, of: 1 };
  const le = others.filter((u) => STATV.get(u.id)[k] <= v).length;
  return { p: Math.round((le / others.length) * 100), n: others.length, rank, of: others.length + 1 };
}
const bar = (p) => `<span class="pbar"><i style="width:${p}%"></i></span>`;

function statsTab(u) {
  // like the game's unit screen: max value and grade per stat, then the percentile among the units compared
  const grade = (g) => `<span class="sgrade">${icon(`grade-${g}`, D.grades[g] || "—", "gradeic")}</span>`;
  const own = [u.attribute, u.attribute2].filter(Boolean).map(String);
  if (state.statScope !== "all" && !own.includes(state.statScope)) state.statScope = "all";
  const scope = state.statScope === "all" ? D.units : D.units.filter((x) => hasAttr(x, state.statScope));
  const vals = STATV.get(u.id);
  const grades = { hp: u.grades[0], atk: u.grades[1], def: u.grades[2], crt: u.grades[4], spd: u.grades[3], ap: 0, pp: 0 };
  const row = (k) => `<div class="srow"><svg class="sic" viewBox="0 0 20 20" aria-hidden="true">${STAT_SVG[k]}</svg>
      <span class="sname">${esc(ui(k))}</span><span class="sval">${statText(k, vals[k])}</span>${grade(grades[k])}</div>`;
  const prow = (k) => {
    if (!RANK_KEYS.includes(k)) return `<div class="prow empty"></div>`;          // AP / PP: no percentile (owner)
    const { p, n, rank, of } = percentile(k, vals[k], scope, u.id);
    return `<div class="prow" title="${esc(fill(ui("pctTip"), { p, n }))}">${bar(p)}<b>${p}%</b>` +
      `<span class="prank" title="${esc(ui("rankTip"))}">#${rank} <small>/ ${of}</small></span></div>`;
  };
  const attrs = [...new Set(D.units.flatMap((x) => [x.attribute, x.attribute2]).filter(Boolean))].sort((a, b) => a - b).map(String);
  const chip = (v, inner, name) => {
    const off = v !== "all" && !own.includes(v);
    return `<button class="opt scope${state.statScope === v ? " on" : ""}${off ? " zero" : ""}" data-scope="${esc(v)}" title="${esc(name)}"` +
      `${off ? " disabled" : ""}>${inner}</button>`;
  };
  return `<div class="statwrap">
      <div class="card statcard"><div class="shead">${esc(ui("maxValues"))}</div>${STAT_KEYS.map(row).join("")}</div>
      <div class="card pctcard"><div class="shead scope-row"><span class="lbl">${esc(ui("compareWith"))}</span>
          ${chip("all", icon("attribute-all", "ALL"), ui("allUnits"))}
          ${attrs.filter((a) => own.includes(a)).map((a) => chip(a, attrIcon(a), look("attributes", a))).join("")}</div>
        ${STAT_KEYS.map(prow).join("")}</div></div>
    <p class="note-line stats-note">${esc(ui("statsNote"))}</p>`;
}

function profileTab(u) {
  const c = CHARS[u.char] || {};
  const field = (k, v) => (v ? `<dt>${esc(ui(k))}</dt><dd>${esc(v)}</dd>` : "");
  const birthday = c.birthday && c.birthday[0] ? `${c.birthday[0]}/${c.birthday[1]}` : "";
  const since = u.since ? `${u.since} (${ui("sinceBy")[u.sinceBy] || ""})` : ui("launch");
  return `<div class="card profile"><dl>
      ${field("released", since)}${field("team", c.team ? look("teams", c.team) : "")}${field("school", look("schools", c.school))}
      ${field("birthday", birthday)}${field("height", c.height ? `${c.height} cm` : text(`char.${u.char}.height`))}
      ${field("hobby", text(`char.${u.char}.hobby`))}${field("birthplace", text(`char.${u.char}.birthplace`))}
      ${field("favorite", text(`char.${u.char}.favorite`))}</dl>
      <p>${esc(text(`char.${u.char}.description`))}</p>
      ${c.team ? `<p class="note-line">${esc(text(`team.${c.team}.description`))}</p>` : ""}</div>`;
}

// every banner / login bonus with the unit, oldest first; the first release banner is the release, later
// pickups of the same kind are reruns
function historyTab(u) {
  const h = u.history || [];
  if (!h.length) return `<div class="card"><p class="note-line">${esc(ui("histNone"))}</p></div>`;
  const kinds = ui("histKind"), seen = new Set();
  const rows = h.map((e) => {
    let kind = e.kind;
    const release = e.from === u.since && ["pickup", "limited", "extra", "login"].includes(e.kind) && !seen.size;
    if (e.kind === "pickup") kind = release ? "release" : "rerun";
    else if (e.kind === "limited") kind = release ? "limited" : "limitedRerun";
    if (release) seen.add(e.from);
    return `<tr class="${release ? "first" : ""}"><td>${esc(e.from)}</td><td>${esc(e.to || "")}</td>
      <td><span class="hk k-${esc(e.kind)}">${esc(kinds[kind] || e.kind)}</span>${e.paid ? ` <small class="muted">${esc(ui("histPaid"))}</small>` : ""}</td></tr>`;
  }).join("");
  return `<div class="card histcard"><table class="htable"><thead><tr><th>${esc(ui("histFrom"))}</th><th>${esc(ui("histTo"))}</th>
      <th>${esc(ui("histWhat"))}</th></tr></thead><tbody>${rows}</tbody></table>
    <p class="note-line">${esc(ui("histNote"))}</p></div>`;
}

const hasAnim = (u) => (D.cardanim || []).includes(u.asset);
function animTab(u) {
  return `<div class="card animcard"><div id="animHost" class="anim-host"><span class="muted">${esc(ui("animLoading"))}</span></div>
    <div id="animBtns" class="anim-btns"></div><p class="note-line">${esc(ui("animNote"))}</p></div>`;
}
async function startAnim(u) {
  const host = $("#animHost");
  try {
    const names = await CardAnim.show(host, `img/cardanim/${u.asset}/`, u.asset);
    if (!names || !host.isConnected) return;
    host.querySelector(".muted")?.remove();
    const nice = ui("animNames");
    $("#animBtns").innerHTML = names.map((n) => `<button class="opt anim-btn" data-anim="${esc(n)}" title="${esc(n)}">${esc(nice[n] || n)}</button>`).join("");
  } catch (e) {
    if (host.isConnected) host.innerHTML = `<span class="muted">${esc(ui("animFail"))}</span>`;
  }
}

// ---- detail: summary + tab row (with the skill level slider) + the tab's body --------------------
function unitTabs(u) {
  return ["skills", "stats", "profile", "history", ...(hasAnim(u) ? ["anim"] : [])];
}

function drawDetail() {
  if (state.mode === "memoria") return drawFinder();
  if (FULL(state.mode)) return drawPage();
  const u = UNITS.get(state.unit);
  if (!u) {
    $("#detail").innerHTML = `<div class="empty">${esc(ui("pick"))}</div>`;
    return;
  }
  const top = Math.max(1, ...u.skills.map((s) => D.skills[s]?.maxLv || 1));
  state.level = Math.min(state.level, top);
  if (!unitTabs(u).includes(state.tab)) state.tab = "skills";
  const tab = (id) => `<button data-tab="${id}">${esc(ui(id))}</button>`;
  $("#detail").innerHTML = summary(u) + `<div class="tabs">${unitTabs(u).map(tab).join("")}
      <div class="level" title="${esc(ui("osNote"))}"><span>${esc(ui("level"))}</span>
        <input id="lv" type="range" min="1" max="${top}" value="${state.level}"><span class="lv">Lv ${state.level}</span></div></div>
    <div id="tabBody"></div>`;
  drawTab(u);
}

function drawTab(u = UNITS.get(state.unit)) {
  if (!u) return;
  $$("#detail .tabs [data-tab]").forEach((b) => b.classList.toggle("on", b.dataset.tab === state.tab));
  $("#detail .level").hidden = state.tab !== "skills";
  if (state.tab !== "anim") CardAnim.stop();
  $("#tabBody").innerHTML = { skills: skillsTab, stats: statsTab, profile: profileTab, history: historyTab, anim: animTab }[state.tab](u);
  if (state.tab === "anim") startAnim(u);
  showActive();
}

// the level slider only changes numbers: the cards stay, their values are updated in place
function updateLevel() {
  const lvText = $("#detail .level .lv");
  if (lvText) lvText.textContent = `Lv ${state.level}`;
  $$("#skills .skill[data-sid]").forEach((card) => {
    const sid = card.dataset.sid, s = D.skills[sid];
    const lv = Math.min(state.level, s.maxLv);
    const variant = variantOf(s, lv);
    if (String(variant) !== card.dataset.variant) {             // another description from this level on
      card.dataset.variant = variant;
      card.querySelector(".desc").innerHTML = describe(sid, s, lv);
    } else {
      card.querySelectorAll(".desc b[data-k]").forEach((b) => {
        const value = valueAt(s.params[+b.dataset.k], lv);
        if (b.textContent !== value) b.textContent = value;
      });
    }
    const slv = card.querySelector(".slv");
    if (slv) slv.textContent = `Lv ${lv}/${s.maxLv}`;
  });
}

// ---- full pages (menu): Percentile ranking, Maze relics --------------------------------------
function drawPage() {
  $("#pageTitle").textContent = ui(state.mode === "maze" ? "mazeTitle" : "rankTitle");
  $("#pageFilters").hidden = state.mode !== "maze";
  if (state.mode === "maze") drawMaze();
  else drawRanking();
}

// ---- Maze relics (menu, full page): cards like the game's; a filter bar on top ------------------------------
const MATERIAL = (id) => Math.floor(id / 1000) === 7;                  // crystals: upgrade material, no effect
// the type / attribute a relic's effect is limited to (its text names it: 物理タイプの味方, アグレッシブ属性の味方)
function relicCond(id, k) {
  const ja = D.text.ja[`relic.${id}.desc.${k}`] || "", out = [];
  for (const [v, row] of Object.entries(D.lookup.types || {})) if (row.ja && ja.includes(row.ja)) out.push(mark("type", v, look("types", v)));
  for (const [v, row] of Object.entries(D.lookup.attributes || {})) if (row.ja && ja.includes(`${row.ja}属性`)) out.push(mark("attribute", v, look("attributes", v)));
  return out.join("");
}

// one row: [picture] name [R][SR][SSR]… effect (of the rarity picked: click to switch) [condition]
function relicRow(id) {
  const rel = D.maze.relics[id], shown = state.maze.shown[id] || rel.rarities[0];
  const asset = rel.assets[shown] || Object.values(rel.assets)[0] || "";
  const btns = rel.rarities.map((k) => `<button class="rbtn r${RELIC_RF[k] || 1}${k === shown ? " on" : ""}" data-rr="${id}:${k}">${RELIC_RARITY[k]}</button>`).join("");
  return `<div class="rrowl" id="relic-${id}"><div class="rpic"><img src="img/relics/${esc(asset)}.png" alt="" loading="lazy" onerror="this.remove()"></div>
    <span class="rtitle">${esc(relicName(id, rel.rarities, shown))}</span><div class="rbtns">${btns}</div>
    <div class="rtext">${relicText(`relic.${id}.desc.${shown}`)}</div><div class="rcond">${relicCond(id, shown)}</div></div>`;
}

function drawMaze() {
  const z = state.maze, q = z.q.trim().toLowerCase();
  const ids = Object.keys(D.maze?.relics || {}).filter((id) => !MATERIAL(+id));
  const list = ids.filter((id) => {
    const rel = D.maze.relics[id];
    if (z.rarity && !rel.rarities.includes(z.rarity)) return false;
    if (Object.values(z.tags).some((t) => t && !(rel.tags || []).includes(t))) return false;
    if (!q) return true;
    return rel.rarities.some((k) => [text(`relic.${id}.name.${k}`), text(`relic.${id}.desc.${k}`), D.text.ja[`relic.${id}.name.${k}`]]
      .some((s) => s && s.toLowerCase().includes(q)));
  });
  const rar = [...new Set(ids.flatMap((id) => D.maze.relics[id].rarities))].sort((a, b) => a - b);
  const chip = (v, lbl) => `<button class="opt mz${z.rarity === v ? " on" : ""}" data-mz="${v}">${esc(lbl)}</button>`;
  if (!$("#pageBody .maze-bar")) {                // the bar is built once, so typing in the search keeps its focus
    $("#pageBody").className = "page-body maze-page";
    $("#pageBody").innerHTML = `<div class="maze-wrap"><div class="maze-bar"><input id="mazeSearch" type="search" autocomplete="off">
        <span class="rank-count"></span><p class="note-line"></p></div><div class="rgrid"></div></div>`;
  }
  $("#mazeSearch").placeholder = ui("mazeSearch");
  if ($("#mazeSearch").value !== z.q) $("#mazeSearch").value = z.q;
  $("#pageBody .maze-bar .rank-count").textContent = list.length;
  $("#mazeFilterCount").textContent = (z.rarity ? 1 : 0) + Object.values(z.tags).filter(Boolean).length || "";
  // effect tags in drop-downs like the other pages (Buff / Debuff / Ailment / Trait; one pick each, a count per
  // option, 0 = greyed out)
  const open = $("#mazeGroups .dd-list:not([hidden])")?.closest("[data-mfield]")?.dataset.mfield;
  const count = (field, v) => list.filter((id) => (D.maze.relics[id].tags || []).includes(v) || z.tags[field] === v).length;
  $("#mazeGroups").innerHTML = `<div class="fgroup${z.rarity ? " has-picks" : ""}"><h4>${esc(ui("rarity"))}</h4><div class="opts mz-rar">` +
    rar.map((k) => chip(k, RELIC_RARITY[k])).join("") + `</div></div>` + ["buff", "debuff", "ailment", "other"].map((field) => {
    const has = TAG_GROUPS[field], tags = D.tags.list.filter((t) => has(t.id) && ids.some((id) => (D.maze.relics[id].tags || []).includes(t.id)));
    if (!tags.length) return "";
    const g = { field }, picked = z.tags[field];
    const opts = tags.map((t) => {
      const n = count(field, t.id), off = !n && picked !== t.id;
      return `<button class="opt${picked === t.id ? " on" : ""}${off ? " zero" : ""}" data-mtag="${field}:${esc(t.id)}"${off ? " disabled" : ""}>` +
        `${optionInner(g, t.id)}<span class="ocnt">${n}</span></button>`;
    }).join("");
    return `<div class="fgroup dd dd-${field}-g${picked ? " has-picks" : ""}" data-mfield="${field}">
      <button class="dd-btn"><span class="dd-lbl">${esc(ui(field === "debuff" ? "debuffOnly" : field))}</span><span class="dd-val">${picked
        ? ddChip(`m:${field}`, picked, optionInner(g, picked)) : '<span class="dd-none">---</span>'}</span><span class="caret">▾</span></button>
      <div class="dd-list" hidden>${opts}</div></div>`;
  }).join("");
  if (open) openDropdown($(`#mazeGroups [data-mfield="${open}"] .dd-list`));
  $("#pageBody .maze-bar .note-line").textContent = ui("mazeNote");
  $("#pageBody .rgrid").innerHTML = list.map((id) => relicRow(id)).join("");
}

// Percentile ranking: one clean body, the filters on top of the table; percentiles among the units shown
function rankUnits() {
  const r = state.rank;
  return D.units.filter((u) => (!r.attr.size || [...r.attr].some((a) => hasAttr(u, a))) && (!r.role.size || r.role.has(String(u.role))));
}

function rankFilters() {
  const r = state.rank;
  const attrs = [...new Set(D.units.flatMap((x) => [x.attribute, x.attribute2]).filter(Boolean))].sort((a, b) => a - b).map(String);
  const roles = [...new Set(D.units.map((x) => x.role))].sort((a, b) => a - b).map(String);
  const opt = (key, v, inner, name) => {
    const on = r[key].has(v);
    const zero = !on && !D.units.some((u) => (key === "attr" ? hasAttr(u, v) : String(u.role) === v)
      && (key === "attr" ? !r.role.size || r.role.has(String(u.role)) : !r.attr.size || [...r.attr].some((a) => hasAttr(u, a))));
    return `<button class="opt${on ? " on" : ""}${zero ? " zero" : ""}" data-rank="${key}" data-value="${esc(v)}" title="${esc(name)}"${zero ? " disabled" : ""}>${inner}</button>`;
  };
  return `<div class="rank-bar">
      <div class="fgroup${r.attr.size ? " has-picks" : ""}"><h4>${esc(ui("attribute"))}</h4><div class="opts">${attrs.map((a) => opt("attr", a, attrIcon(a), look("attributes", a))).join("")}</div></div>
      <div class="fgroup${r.role.size ? " has-picks" : ""}"><h4>${esc(ui("role"))}</h4><div class="opts">${roles.map((v) => opt("role", v, roleIcon(v), look("roles", v))).join("")}</div></div>
      <button id="rankClear" class="btn">${esc(ui("clear"))}</button>
      <span class="rank-count">${rankUnits().length}</span>
      <p class="note-line">${esc(ui("rankNote"))}</p></div>`;
}

function drawRanking() {
  const r = state.rank, list = rankUnits();
  const pcts = new Map(list.map((u) => [u.id, Object.fromEntries(RANK_KEYS.map((k) => [k, percentile(k, STATV.get(u.id)[k], list, u.id).p]))]));
  const rows = [...list].sort((a, b) => r.dir * (STATV.get(a.id)[r.sort] - STATV.get(b.id)[r.sort]) || b.rarity - a.rarity || a.id - b.id);
  // each stat: its value column (the header sorts) and its % column (no header, owner)
  const head = RANK_KEYS.map((k) => `<th class="num stat${r.sort === k ? " on" : ""}" data-sort="${k}">` +
    `${esc(ui(k))}${r.sort === k ? (r.dir < 0 ? " ▼" : " ▲") : ""}</th><th class="pcth"></th>`).join("");
  const body = rows.map((u, i) => `<tr data-unit="${u.id}"><td class="rk">${i + 1}</td>
      <td><div class="ru">${pic(u, "rpic")}<span><span class="rn">${esc(charName(u.char))}</span><small>${esc(unitTitle(u))}</small></span></div></td>
      <td class="ricons">${attrIcon(u.attribute)}${u.attribute2 ? attrIcon(u.attribute2) : ""}</td><td class="ricons">${roleIcon(u.role)}</td>
      ${RANK_KEYS.map((k) => {
        const on = r.sort === k ? " on" : "", p = pcts.get(u.id)[k];
        return `<td class="num rv${on}">${statText(k, STATV.get(u.id)[k])}</td><td class="num rpct${on}">${p}%</td>`;
      }).join("")}</tr>`).join("");
  $("#pageBody").className = "page-body rank-page";
  $("#pageBody").innerHTML = `<div class="rank-wrap">${rankFilters()}
    <div class="card rankcard"><table class="rtable"><thead><tr><th>#</th><th>${esc(ui("unit"))}</th><th>${esc(ui("attribute"))}</th>
      <th>${esc(ui("role"))}</th>${head}</tr></thead><tbody>${body}</tbody></table></div></div>`;
  // the box as wide as the table (+ its scrollbar), so the table sits in the middle of the page (owner)
  const wrap = $(".rank-wrap"), card = $(".rankcard"), table = $(".rtable");
  wrap.style.width = `${Math.min(table.offsetWidth + card.offsetWidth - card.clientWidth, $("#pageBody").clientWidth - 40)}px`;
}

// ---- browser history (owner): each view is a hash (#unit/<id>, #memoria, #memoria/<id>, #maze, #ranking);
// a new view is pushed, so the browser's Back / Forward show the view before / after ------------------
let ROUTING = false;                              // true while Back / Forward is being shown: nothing is pushed
let DIALOG_PUSHED = false;                        // the memoria dialog pushed its own entry (closing it = Back)
function go(hash) {
  if (ROUTING || location.hash === hash || (hash === "#" && !location.hash)) return;
  history.pushState(null, "", hash);
}
function route() {
  const m = location.hash.match(/^#(unit|memoria|ranking|maze)(?:\/(\d+))?/);
  const mode = m ? (m[1] === "unit" ? "units" : m[1]) : "units";
  const dialog = m && m[1] === "memoria" && m[2] ? +m[2] : null;
  ROUTING = true;
  try {
    if ($("#mdlg").open && dialog == null) { DIALOG_PUSHED = false; $("#mdlg").close(); }
    if (mode === "units" && m && m[2]) state.unit = +m[2];
    if (mode !== state.mode || mode === "units") setMode(mode);
    if (dialog != null) openMemoria(dialog);
  } finally {
    ROUTING = false;
  }
}

// ---- events -----------------------------------------------------------------------------
function select(id) {
  state.unit = id;
  if (state.mode !== "units") return setMode("units");
  go(`#unit/${id}`);
  markSelected();
  drawDetail();
}

// the Memoria page with UNIT picked (the unit page's Find memoria button): its narrowing and slot are cleared
function findMemoriaFor(id) {
  const f = state.finder, c = CHARS[UNITS.get(id)?.char] || {};
  f.unit = id;
  f.slot = 0;
  f.x = 0;
  for (const k of ["attr", "role", "school", "team"]) f[k].clear();
  // the unit's school and team are filled in, so its classmates are listed next to it (owner)
  if (c.school != null) f.school.add(String(c.school));
  if (c.team != null) f.team.add(String(c.team));
  setMode("memoria");
}

function showLayout() {
  const full = FULL(state.mode);
  $("#layout").hidden = full;
  $("#page").hidden = !full;
}

function setMode(mode) {
  state.mode = MODES.includes(mode) ? mode : "units";
  if (!FULL(state.mode)) state.lastList = state.mode;
  $$(".modes button").forEach((b) => b.classList.toggle("on", b.dataset.mode === state.mode));
  CardAnim.stop();
  go(state.mode === "units" ? (state.unit != null ? `#unit/${state.unit}` : "#") : `#${state.mode}`);
  showLayout();
  if (FULL(state.mode)) {
    drawPage();
    $("#pageBody").scrollTop = 0;
  } else {
    buildFilters();
    applyFilters();
    drawDetail();
    $("#detail").scrollTop = 0;
  }
  buildMenu();
}

// ---- the menu under the title: pages, then the language: AI | Official | JP (owner 2026-10-01) -----------
function buildMenu() {
  const on = (m) => (m === "list" ? !FULL(state.mode) : state.mode === m);
  // the Maze relics page is hidden from the menu (owner 2026-09-30; its code and #maze stay: add "maze" back to show it)
  const pages = ["list", "ranking"].map((m) => `<button class="mi${on(m) ? " on" : ""}" data-go="${m}">${esc(ui("menu")[m])}</button>`).join("");
  const en = verIds().map((id) => `<button class="ml${state.lang === "en" && state.ver === id ? " on" : ""}" data-lang="en" ` +
    `data-ver="${esc(id)}" title="${esc(ui("verNote")[id] || "")}">${esc(ui("verNames")[id] || id)}</button>`).join("");
  const langs = `<div class="lang-row">${en}<button class="ml${state.lang === "ja" ? " on" : ""}" data-lang="ja" ` +
    `title="${esc(ui("japanese"))}">JP</button></div>`;
  $("#menu").innerHTML = `${pages}<div class="menu-sep"></div><div class="menu-lbl">${esc(ui("language"))}</div>${langs}`;
}

// the English choices, the first = what a new visitor gets (AI = text.en, owner 2026-10-01; id "aimtl" kept: saved choices)
const verIds = () => ["aimtl", ...(D.versions || []).map((v) => v.id)];

function setLang(lang, ver) {
  state.lang = lang;
  store.set("lang", lang);
  const ids = verIds();
  if (ver && ids.includes(ver)) state.ver = ver;
  if (!ids.includes(state.ver)) state.ver = ids[0];
  store.set("ver", state.ver || "");
  document.documentElement.lang = lang === "ja" ? "ja" : "en";
  $$("[data-t]").forEach((el) => { el.textContent = ui(el.dataset.t); });
  $("#search").placeholder = ui(state.mode === "memoria" ? "searchChar" : "search");
  $("#msearch").placeholder = ui("searchMemoria");
  $("#pinBtn").title = ui("pin");
  $("#reset").title = ui("clear");
  $("#listFilterBtn").title = ui("lfTip");
  $("#title").title = `${ui("menuTip")} · ${lang === "ja" ? "JP" : ui("verNames")[state.ver]} · ${ui("data")} ${D.version || ""}`;
  $$(".modes button").forEach((b) => b.classList.toggle("on", b.dataset.mode === state.mode));
  buildMenu();
  buildFilters();
  buildTiles();
  drawDetail();
}

function pin(on) {
  state.pinned = on;
  store.set("pinned", on ? "1" : "0");
  $("#layout").classList.toggle("pinned", on);
  $("#pinBtn").setAttribute("aria-pressed", String(on));
  $("#pinBtn").classList.toggle("on", on);
}

function wire() {
  $("#pinBtn").addEventListener("click", () => pin(!state.pinned));
  $("#filters").addEventListener("mouseleave", () => closeDropdowns());
  $("#search").addEventListener("input", applyFilters);
  // each side clears only itself (owner): the reset icon = the top search + the left filter; Clear filters = the
  // advanced filter (+ its memoria search)
  const resetLeft = () => {
    $("#search").value = "";
    if (state.mode === "memoria") {
      const f = state.finder;
      f.unit = null; f.slot = 0; f.x = 0;
      for (const k of ["attr", "role", "school", "team"]) f[k].clear();
    } else for (const { field } of UNIT_LEFT) delete picks()[field];
    closeDropdowns();
    applyFilters();
  };
  const resetRight = () => {
    if (state.mode === "memoria") {
      state.picksBy.memoria = {};
      state.mazeSw = "exclude";
      $("#msearch").value = "";
    } else for (const { field } of GROUPS.units) delete picks()[field];
    closeDropdowns();
    applyFilters();
  };
  $("#clear").addEventListener("click", resetRight);
  $("#reset").addEventListener("click", resetLeft);
  $("#msearch").addEventListener("input", applyFilters);
  $("#groups").addEventListener("click", (e) => {
    const tab = e.target.closest("[data-ftab]");               // Characters: Allies | Enemies
    if (tab) { state.ftab = tab.dataset.ftab; closeDropdowns(); return updateFilterUI(); }
    const sw = e.target.closest("[data-mzsw]");                // the maze switch (Memoria)
    if (sw) { state.mazeSw = sw.dataset.mzsw; return applyFilters(); }
    const x = e.target.closest("[data-ddx]");
    if (x) { picks()[x.dataset.ddx]?.delete(x.dataset.value); closeDropdowns(); return applyFilters(); }
    const dd = e.target.closest(".dd-btn");
    if (dd) {
      const list = dd.nextElementSibling;
      closeDropdowns(list);
      if (list.hidden) openDropdown(list); else list.hidden = true;
      return;
    }
    const opt = e.target.closest(".opt");
    if (!opt || opt.disabled) return;
    const set = picks()[opt.dataset.field] ||= new Set();
    const v = opt.dataset.value;
    if (groups().find((g) => g.field === opt.dataset.field)?.one) {   // one pick at a time (memoria rarity: owner)
      const had = set.has(v);
      set.clear();
      if (!had) set.add(v);
    } else set.has(v) ? set.delete(v) : set.add(v);
    closeDropdowns();                                 // a list closes after a pick (open it again to add one)
    applyFilters();
  });
  // Characters, the left filter: one pick per group; the funnel button shows / hides it (owner)
  $("#ufilter").addEventListener("click", (e) => {
    const x = e.target.closest("[data-ddx]");
    if (x) { picks()[x.dataset.ddx]?.delete(x.dataset.value); closeDropdowns(); return applyFilters(); }
    const dd = e.target.closest(".dd-btn");
    if (dd) {
      const list = dd.nextElementSibling;
      closeDropdowns(list);
      if (list.hidden) openDropdown(list, $(".pane.units")); else list.hidden = true;
      return;
    }
    const opt = e.target.closest("[data-uf]");
    if (!opt || opt.disabled) return;
    const set = picks()[opt.dataset.uf] ||= new Set(), had = set.has(opt.dataset.value);
    set.clear();
    if (!had) set.add(opt.dataset.value);
    closeDropdowns();
    applyFilters();
  });
  $("#listFilterBtn").addEventListener("click", () => { state.lf = !state.lf; applyFilters(); });
  // the menu under the title
  $$("[data-menu]").forEach((t) => t.addEventListener("click", () => {
    const menu = $("#menu"), wrap = t.closest(".menu-wrap");
    if (menu.parentNode !== wrap) { wrap.appendChild(menu); menu.hidden = false; } else menu.hidden = !menu.hidden;
  }));
  $("#menu").addEventListener("click", (e) => {
    const b = e.target.closest("[data-go], [data-lang]");
    if (!b) return;
    $("#menu").hidden = true;
    if (b.dataset.go) setMode(b.dataset.go === "list" ? state.lastList : b.dataset.go);
    else setLang(b.dataset.lang, b.dataset.ver);
  });
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dd")) closeDropdowns();
    if (!e.target.closest(".menu-wrap")) $("#menu").hidden = true;
  });
  $("#units").addEventListener("click", (e) => {
    const tile = e.target.closest("[data-unit]");
    if (tile) select(+tile.dataset.unit);
  });
  // memoria finder: slots, narrowing, the unit
  $("#finder").addEventListener("click", (e) => {
    const f = state.finder;
    const x = e.target.closest("[data-ddx]");
    if (x) { f[x.dataset.ddx].delete(x.dataset.value); closeDropdowns(); applyFilters(); $("#detail").scrollTop = 0; return; }
    const dd = e.target.closest(".dd-btn");
    if (dd) {
      const list = dd.nextElementSibling;
      closeDropdowns(list);
      if (list.hidden) openDropdown(list, $("#finder").closest(".pane")); else list.hidden = true;
      return;
    }
    const redraw = () => { applyFilters(); $("#detail").scrollTop = 0; };
    const slot = e.target.closest("[data-slot]");
    if (slot && !slot.disabled) { f.slot = f.slot === +slot.dataset.slot ? 0 : +slot.dataset.slot; return redraw(); }
    const xb = e.target.closest("[data-x]");
    if (xb && !xb.disabled) { f.x = f.x === +xb.dataset.x ? 0 : +xb.dataset.x; return redraw(); }
    const opt = e.target.closest("[data-fg]");
    if (opt && !opt.disabled) {                                  // one pick per group (owner): another one replaces it
      const set = f[opt.dataset.fg], had = set.has(opt.dataset.value);
      set.clear();
      if (!had) set.add(opt.dataset.value);
      closeDropdowns();
      return redraw();
    }
    const tile = e.target.closest("[data-funit]");
    if (tile && !tile.disabled) { f.unit = f.unit === +tile.dataset.funit ? null : +tile.dataset.funit; redraw(); }
  });
  // the Maze relics Filter panel: rarity, the effect lists, their x, Clear filters
  $("#pageFilters").addEventListener("click", (e) => {
    const z = state.maze;
    if (e.target.closest("#mazeClear")) { z.rarity = 0; z.tags = {}; closeDropdowns(); return drawMaze(); }
    const x = e.target.closest("[data-ddx^='m:']");
    if (x) { delete z.tags[x.dataset.ddx.slice(2)]; return drawMaze(); }
    const ddb = e.target.closest(".dd-btn");
    if (ddb) { const l = ddb.nextElementSibling; closeDropdowns(l); if (l.hidden) openDropdown(l); else l.hidden = true; return; }
    const mt = e.target.closest("[data-mtag]");
    if (mt && !mt.disabled) {
      const [field, v] = mt.dataset.mtag.split(":");
      if (z.tags[field] === v) delete z.tags[field]; else z.tags[field] = v;
      closeDropdowns();
      return drawMaze();
    }
    const mz = e.target.closest("[data-mz]");
    if (mz) { z.rarity = z.rarity === +mz.dataset.mz ? 0 : +mz.dataset.mz; return drawMaze(); }
  });
  $("#pageFilters").addEventListener("mouseleave", () => closeDropdowns());
  $("#pageBody").addEventListener("input", (e) => {
    if (e.target.id === "mazeSearch") { state.maze.q = e.target.value; drawMaze(); }
  });
  $("#pageBody").addEventListener("click", (e) => {
    const rr = e.target.closest("[data-rr]");
    if (rr) { const [id, k] = rr.dataset.rr.split(":"); state.maze.shown[id] = +k; return drawMaze(); }
    const opt = e.target.closest("[data-rank]");
    if (opt && !opt.disabled) {
      const set = state.rank[opt.dataset.rank], had = set.has(opt.dataset.value);   // one pick per group (owner)
      set.clear();
      if (!had) set.add(opt.dataset.value);
      return drawRanking();
    }
    if (e.target.closest("#rankClear")) { state.rank.attr.clear(); state.rank.role.clear(); return drawRanking(); }
    const sort = e.target.closest("[data-sort]");
    if (sort) {
      const r = state.rank;
      r.dir = r.sort === sort.dataset.sort ? -r.dir : -1;
      r.sort = sort.dataset.sort;
      return drawRanking();
    }
    const row = e.target.closest("tr[data-unit]");                // a ranking row: that unit's page
    if (row) return select(+row.dataset.unit);
  });
  $$(".modes button").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));
  $("#detail").addEventListener("click", (e) => {
    const tab = e.target.closest("[data-tab]");
    if (tab) { state.tab = tab.dataset.tab; drawTab(); return; }
    if (e.target.closest("#variantBtn")) return variantsDialog(UNITS.get(state.unit));
    if (e.target.closest("#findBtn")) return findMemoriaFor(state.unit);
    if (e.target.closest("[data-fclear]")) { state.finder.unit = null; applyFilters(); $("#detail").scrollTop = 0; return; }
    const scope = e.target.closest("[data-scope]");
    if (scope && !scope.disabled) { state.statScope = scope.dataset.scope; drawTab(); return; }
    const anim = e.target.closest("[data-anim]");
    if (anim) return CardAnim.play(anim.dataset.anim);
    const open = e.target.closest("[data-mopen]");
    if (open) return openMemoria(+open.dataset.mopen);
    const who = e.target.closest("[data-goto]");                  // a unit named by a memoria skill
    if (who) return select(+who.dataset.goto);
    const tag = e.target.closest("[data-tag]");                   // a skill's tag: filter the list by it
    if (tag) filterByTag(tag.dataset.tag);
  });
  let frame = 0;
  $("#detail").addEventListener("input", (e) => {
    if (e.target.id !== "lv") return;
    state.level = +e.target.value;
    if (!frame) frame = requestAnimationFrame(() => { frame = 0; updateLevel(); });
  });
  $("#variants").addEventListener("click", (e) => {
    const d = $("#variants");
    const row = e.target.closest("[data-unit]");
    if (row) { d.close(); select(+row.dataset.unit); return; }
    if (e.target === d || e.target.closest("[data-close]")) d.close();     // backdrop or ×
  });
  $("#mdlg").addEventListener("click", (e) => {
    const d = $("#mdlg");
    const who = e.target.closest("[data-goto]");
    if (who) { d.close(); select(+who.dataset.goto); return; }
    const tag = e.target.closest("[data-tag]");
    if (tag) { d.close(); if (state.mode !== "memoria") setMode("memoria"); filterByTag(tag.dataset.tag); return; }
    // backdrop, x, or the picture itself (owner: a click on the artwork closes it too)
    if (e.target === d || e.target.closest("[data-close], .view-img")) d.close();
  });
  // closing the dialog: Back when it pushed its own entry, else the page's own hash
  $("#mdlg").addEventListener("close", () => {
    if (ROUTING || !/^#memoria\/\d+/.test(location.hash)) return;
    if (DIALOG_PUSHED) { DIALOG_PUSHED = false; history.back(); } else history.replaceState(null, "", state.mode === "memoria" ? "#memoria" : `#unit/${state.unit}`);
  });
  addEventListener("popstate", route);
  addEventListener("resize", () => { if ($("#variants").open) $("#variants").close(); });
}

async function main() {
  try {
    D = await (await fetch("data/wiki.json")).json();
  } catch (e) {
    $("#detail").innerHTML = `<div class="empty">data/wiki.json could not be loaded: run py -m wikitool export</div>`;
    return;
  }
  CHARS = Object.fromEntries(D.characters.map((c) => [c.id, c]));
  TAGCAT = new Map(D.tags.list.map((t) => [t.id, t.cat]));
  for (const c of D.characters) if (c.team != null && TEAM_SCHOOL[c.team] == null) TEAM_SCHOOL[c.team] = c.school;
  // newest first (first release: the date the unit came out, never a rerun); launch units (no date) after them, SSR first
  D.units.sort((a, b) => (b.since || "").localeCompare(a.since || "") || b.rarity - a.rarity || a.id - b.id);
  UNITS = new Map(D.units.map((u) => [u.id, u]));
  STATV = new Map(D.units.map((u) => [u.id, statValues(u)]));
  // memoria: UR first, then newest (highest id) first; no release dates for them
  D.memoria.sort((a, b) => b.rarity - a.rarity || b.id - a.id);
  computeValues();
  computeConds();
  const m = location.hash.match(/^#(unit|memoria|ranking|maze)(?:\/(\d+))?/);
  state.mode = m ? (m[1] === "unit" ? "units" : m[1]) : "units";
  state.unit = m && m[1] === "unit" && m[2] ? +m[2] : D.units[0]?.id ?? null;
  wire();
  pin(store.get("pinned", "0") === "1");
  state.ver = store.get("ver", "") || null;
  if (!FULL(state.mode)) state.lastList = state.mode;
  showLayout();
  setLang(store.get("lang", "en") === "ja" ? "ja" : "en");
  if (m && m[1] === "memoria" && m[2]) openMemoria(+m[2]);
}

main();
