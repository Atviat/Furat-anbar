'use strict';

/* =====================================================================
   FURAT | فُرات — Anbar smart map (web)
   Data: OpenStreetMap (Overpass for places, Nominatim for search,
   OSRM for routing). All free public services, no API keys.
   ===================================================================== */

const ANBAR_BBOX = { s: 30.0, w: 38.8, n: 34.7, e: 44.5 };

/* ---------- i18n ---------- */
const I18N = {
  ar: {
    dir: 'rtl', lang_btn: 'EN', lang_aria: 'English',
    nav_map: 'الخريطة', nav_search: 'بحث', nav_favorites: 'المفضلة',
    search_hint: 'ابحث عن مدينة أو قرية أو مكان', clear: 'مسح',
    no_results: 'لا توجد نتائج مطابقة.', no_favorites: 'لم تضف أي مكان إلى المفضلة بعد.',
    my_location: 'موقعي',
    loc_denied: 'لم يتم منح إذن الموقع. فعّله من إعدادات Safari ثم حاول مجددًا.',
    loc_unavailable: 'تعذّر تحديد موقعك حاليًا.',
    loc_unsupported: 'المتصفح لا يدعم تحديد الموقع.',
    loc_timeout: 'انتهت مهلة تحديد الموقع، حاول مجددًا.',
    offline: 'لا يوجد اتصال بالإنترنت. قد لا تظهر أجزاء من الخريطة.',
    add_fav: 'إضافة إلى المفضلة', remove_fav: 'إزالة من المفضلة',
    back: 'رجوع', details: 'التفاصيل', show_on_map: 'عرض على الخريطة',
    open_in_maps: 'فتح في خرائط آبل', place_not_found: 'المكان غير موجود.',
    coords: 'الإحداثيات', source_osm: 'المصدر: OpenStreetMap',
    map_fail: 'تعذّر تحميل الخريطة. تحقق من الإنترنت ثم أعد تحميل الصفحة.',
    // types
    type_city: 'مدينة', type_town: 'بلدة', type_village: 'قرية', type_hamlet: 'قرية صغيرة',
    type_suburb: 'حيّ', type_neighbourhood: 'حيّ', type_landmark: 'معلم', type_pin: 'نقطة على الخريطة',
    type_poi: 'مكان', type_online: 'نتيجة بحث',
    pin_name: 'نقطة على الخريطة',
    // load
    loading_places: 'جارٍ تحميل أماكن الأنبار…',
    places_loaded: (n) => `تم تحميل ${n} مكانًا في الأنبار`,
    places_failed: 'تعذّر تحميل كل الأماكن الآن. تظهر الأماكن الأساسية فقط.',
    places_count: (n) => `${n} مكان في قاعدة بيانات الأنبار`,
    // search
    explore: 'استكشف الخدمات القريبة',
    online_search: 'ابحث في كل خرائط الأنبار',
    online_loading: 'جارٍ البحث…',
    online_none: 'لا نتائج إضافية.',
    online_fail: 'تعذّر البحث عبر الإنترنت.',
    // poi
    poi_loading: 'جارٍ تحميل النتائج…',
    poi_zoom: 'قرّب الخريطة إلى المنطقة المطلوبة أولًا.',
    poi_none: 'لا توجد نتائج في هذه المنطقة.',
    poi_fail: 'تعذّر تحميل الخدمات الآن.',
    poi_result: (label, n) => `${label}: ${n}`,
    // route
    directions: 'المسار', start_nav: 'ابدأ', end_nav: 'إنهاء',
    car: 'سيارة', foot: 'مشي',
    route_to: 'إلى', steps: 'الخطوات', hide_steps: 'إخفاء الخطوات',
    route_loading: 'جارٍ حساب المسار…',
    route_fail: 'تعذّر حساب المسار. قد لا تتوفر طرق مرسومة لهذه الوجهة.',
    route_none: 'لا يوجد مسار بين النقطتين بهذا النمط.',
    pick_start: 'تعذّر تحديد موقعك. اضغط على الخريطة لاختيار نقطة البداية.',
    cancel: 'إلغاء',
    arrived: 'وصلت إلى وجهتك',
    rerouting: 'جارٍ إعادة حساب المسار…',
    mute: 'كتم الصوت', unmute: 'تشغيل الصوت', recenter: 'العودة لموقعي',
    eta: 'الوصول', remaining: 'المتبقي',
    min: 'د', hr: 'س', km: 'كم', m: 'م',
    route_note: 'المسار من بيانات OpenStreetMap وقد لا يعكس إغلاق الطرق أو حالتها.',
    gps_wait: 'بانتظار إشارة الموقع…',
    voice_lang: 'ar-SA',
  },
  en: {
    dir: 'ltr', lang_btn: 'عربي', lang_aria: 'العربية',
    nav_map: 'Map', nav_search: 'Search', nav_favorites: 'Favorites',
    search_hint: 'Search for a city, village or place', clear: 'Clear',
    no_results: 'No matching results.', no_favorites: "You haven't added any places to favorites yet.",
    my_location: 'My location',
    loc_denied: 'Location permission was not granted. Enable it in Safari settings and try again.',
    loc_unavailable: 'Your location could not be determined right now.',
    loc_unsupported: 'This browser does not support geolocation.',
    loc_timeout: 'Locating timed out. Try again.',
    offline: 'No internet connection. Parts of the map may not appear.',
    add_fav: 'Add to favorites', remove_fav: 'Remove from favorites',
    back: 'Back', details: 'Details', show_on_map: 'Show on map',
    open_in_maps: 'Open in Apple Maps', place_not_found: 'Place not found.',
    coords: 'Coordinates', source_osm: 'Source: OpenStreetMap',
    map_fail: 'The map could not be loaded. Check your connection and reload.',
    type_city: 'City', type_town: 'Town', type_village: 'Village', type_hamlet: 'Hamlet',
    type_suburb: 'Neighbourhood', type_neighbourhood: 'Neighbourhood', type_landmark: 'Landmark', type_pin: 'Dropped pin',
    type_poi: 'Place', type_online: 'Search result',
    pin_name: 'Dropped pin',
    loading_places: 'Loading Anbar places…',
    places_loaded: (n) => `${n} places in Anbar loaded`,
    places_failed: 'Could not load all places right now. Showing the main places only.',
    places_count: (n) => `${n} places in the Anbar database`,
    explore: 'Explore nearby services',
    online_search: 'Search all of Anbar on the map',
    online_loading: 'Searching…',
    online_none: 'No additional results.',
    online_fail: 'Online search failed.',
    poi_loading: 'Loading results…',
    poi_zoom: 'Zoom the map to the area you want first.',
    poi_none: 'No results in this area.',
    poi_fail: 'Could not load services right now.',
    poi_result: (label, n) => `${label}: ${n}`,
    directions: 'Route', start_nav: 'Start', end_nav: 'End',
    car: 'Car', foot: 'Walk',
    route_to: 'To', steps: 'Steps', hide_steps: 'Hide steps',
    route_loading: 'Calculating route…',
    route_fail: 'Could not calculate the route. Roads may not be mapped for this destination.',
    route_none: 'No route between these points for this mode.',
    pick_start: 'Could not get your location. Tap the map to choose a starting point.',
    cancel: 'Cancel',
    arrived: 'You have arrived',
    rerouting: 'Recalculating route…',
    mute: 'Mute voice', unmute: 'Unmute voice', recenter: 'Recenter',
    eta: 'Arrival', remaining: 'Remaining',
    min: 'min', hr: 'h', km: 'km', m: 'm',
    route_note: 'Routes come from OpenStreetMap data and may not reflect closures or road conditions.',
    gps_wait: 'Waiting for GPS…',
    voice_lang: 'en-US',
  },
};

const POI_CATS = {
  hospital: { ar: 'مستشفيات وعيادات', en: 'Hospitals & clinics', q: '["amenity"~"^(hospital|clinic)$"]' },
  pharmacy: { ar: 'صيدليات', en: 'Pharmacies', q: '["amenity"="pharmacy"]' },
  fuel: { ar: 'محطات وقود', en: 'Fuel stations', q: '["amenity"="fuel"]' },
  food: { ar: 'مطاعم ومقاهي', en: 'Restaurants & cafés', q: '["amenity"~"^(restaurant|cafe|fast_food)$"]' },
  school: { ar: 'مدارس وجامعات', en: 'Schools & universities', q: '["amenity"~"^(school|university|college)$"]' },
  mosque: { ar: 'مساجد', en: 'Mosques', q: '["amenity"="place_of_worship"]["religion"="muslim"]' },
  bank: { ar: 'مصارف', en: 'Banks & ATMs', q: '["amenity"~"^(bank|atm)$"]' },
  hotel: { ar: 'فنادق', en: 'Hotels', q: '["tourism"~"^(hotel|guest_house|motel)$"]' },
  market: { ar: 'أسواق ومتاجر', en: 'Markets & shops', q: '["shop"~"^(supermarket|mall|convenience|marketplace)$"]' },
};

/* ---------- helpers ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
};
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ICONS = {
  map: '<svg viewBox="0 0 24 24"><path d="M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7 9 4z"/><path d="M9 4v13M15 7v13"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11z"/></svg>',
  locate: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  wifioff: '<svg viewBox="0 0 24 24"><path d="M2 8.8a15 15 0 0 1 4-2.3M22 8.8a15 15 0 0 0-9-3.7M5 12.5a10 10 0 0 1 3-1.8M19 12.5a10 10 0 0 0-4.5-2.4M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".6"/><path d="M3 3l18 18"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M12 20V5M6 11l6-6 6 6"/></svg>',
  round: '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 4v4h-4"/></svg>',
  car: '<svg viewBox="0 0 24 24"><path d="M5 16V11l2-5h10l2 5v5"/><path d="M3 16h18v3H3z"/><circle cx="7.5" cy="13.5" r=".8"/><circle cx="16.5" cy="13.5" r=".8"/></svg>',
  walk: '<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="M10 21l2-6-2.5-2 1-5 3 2 2.5 1M9 12l-2 3M12 15l3 6"/></svg>',
  sound: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 8.5a5 5 0 0 1 0 7"/></svg>',
  mute: '<svg viewBox="0 0 24 24"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>',
  nav: '<svg viewBox="0 0 24 24"><path d="M12 3 5 20l7-4 7 4-7-17z"/></svg>',
};

/* ---------- state ---------- */
function initialLang() {
  const saved = store.get('lang', null);
  if (saved === 'ar' || saved === 'en') return saved;
  const l = (navigator.language || 'ar').toLowerCase();
  return l.startsWith('en') ? 'en' : 'ar';
}

const state = {
  lang: initialLang(),
  favs: {},                 // id -> place snapshot
  selected: null,           // place object
  tab: 'map',
  detailsId: null,
  map: null, mapReady: false,
  userMarker: null, userPos: null,
  places: new Map(),        // id -> place (featured + settlements + temporary)
  settlements: [],          // place objects sorted for search
  poi: { key: null, items: [] },
  mode: 'browse',           // browse | route | nav
  profile: 'car',
  dest: null, start: null, pickStart: false,
  route: null, showSteps: false,
  nav: null,                // live navigation state
  voice: store.get('voice', true),
  placesLoaded: false,
};

const t = (k) => I18N[state.lang][k];
const ar = () => state.lang === 'ar';
const pname = (p) => (ar() ? (p.ar || p.en) : (p.en || p.ar)) || t('pin_name');
const pdesc = (p) => (ar() ? p.descAr : p.descEn) || '';
const catLabel = (p) => {
  if (p.cat === 'poi' && p.poi && POI_CATS[p.poi]) return POI_CATS[p.poi][state.lang];
  return t('type_' + p.cat) || p.cat;
};

/* Arabic-insensitive text normalisation for search */
function normalize(s) {
  return String(s || '').trim().toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/[’'`ʿʾ-]/g, '').replace(/\s+/g, ' ');
}

/* ---------- geometry ---------- */
function hav(a, b) {
  const R = 6371000, k = Math.PI / 180;
  const dLat = (b[1] - a[1]) * k, dLon = (b[0] - a[0]) * k;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * k) * Math.cos(b[1] * k) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(s)));
}
/** Distance (m) from point p to segment a-b and the projection fraction t. Points are [lon, lat]. */
function projectOnSegment(p, a, b) {
  const kx = Math.cos(p[1] * Math.PI / 180) * 111320, ky = 110540;
  const ax = (a[0] - p[0]) * kx, ay = (a[1] - p[1]) * ky;
  const bx = (b[0] - p[0]) * kx, by = (b[1] - p[1]) * ky;
  const dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
  let tt = L ? -(ax * dx + ay * dy) / L : 0;
  tt = Math.max(0, Math.min(1, tt));
  return { d: Math.hypot(ax + tt * dx, ay + tt * dy), t: tt };
}
function compass(deg) {
  const ar8 = ['الشمال', 'الشمال الشرقي', 'الشرق', 'الجنوب الشرقي', 'الجنوب', 'الجنوب الغربي', 'الغرب', 'الشمال الغربي'];
  const en8 = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];
  const i = Math.round((((deg % 360) + 360) % 360) / 45) % 8;
  return (ar() ? ar8 : en8)[i];
}

/* ---------- formatting ---------- */
function fmtDist(m) {
  if (m < 1000) return `${Math.max(10, Math.round(m / 10) * 10)} ${t('m')}`;
  return `${(m / 1000).toFixed(m < 10000 ? 1 : 0)} ${t('km')}`;
}
function fmtDur(s) {
  const min = Math.max(1, Math.round(s / 60));
  if (min < 60) return `${min} ${t('min')}`;
  const h = Math.floor(min / 60), r = min % 60;
  return r ? `${h} ${t('hr')} ${r} ${t('min')}` : `${h} ${t('hr')}`;
}
function fmtEta(sec) {
  try { return new Date(Date.now() + sec * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; }
}

/* ---------- toast ---------- */
let toastTimer;
function toast(msg, ms = 3800) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

/* ---------- network helpers ---------- */
async function fetchJson(url, opts = {}, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const r = await fetch(url, { ...opts, signal: ctrl.signal });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return await r.json();
  } finally { clearTimeout(to); }
}

const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
async function overpass(query, timeoutMs = 45000) {
  let lastErr;
  for (const url of OVERPASS) {
    try {
      return await fetchJson(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'data=' + encodeURIComponent(query),
      }, timeoutMs);
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

/* =====================================================================
   PLACES
   ===================================================================== */
const TYPE_RANK = { city: 0, town: 1, village: 2, suburb: 3, neighbourhood: 3, hamlet: 4 };
const HAS_AR = /[؀-ۿ]/;

function featuredPlaces() {
  return PLACES.map((p) => ({
    id: p.id, ar: p.ar, en: p.en, cat: p.cat === 'city' ? 'city' : 'landmark',
    lat: p.lat, lon: p.lon, descAr: p.descAr, descEn: p.descEn, src: 'featured',
  }));
}

function registerPlaces(list) {
  for (const p of list) state.places.set(p.id, p);
}

function ingestSettlements(rows) {
  const feat = featuredPlaces();
  const featNames = feat.map((f) => ({ n: normalize(f.ar), lat: f.lat, lon: f.lon }));
  const out = [];
  for (const r of rows) {
    const [id, nar, nen, type, lat, lon] = r;
    const n = normalize(nar);
    if (n && featNames.some((f) => f.n === n && Math.abs(f.lat - lat) < 0.15 && Math.abs(f.lon - lon) < 0.15)) continue;
    out.push({ id, ar: nar, en: nen, cat: type, lat, lon, src: 'osm' });
  }
  for (const p of out) state.places.set(p.id, p);
  state.settlements = out;
}

function parseOverpassPlaces(json) {
  const rows = [];
  for (const e of json.elements || []) {
    const tg = e.tags || {};
    if (!tg.name && !tg['name:ar'] && !tg['name:en']) continue;
    const lat = e.lat != null ? e.lat : e.center && e.center.lat;
    const lon = e.lon != null ? e.lon : e.center && e.center.lon;
    if (lat == null || lon == null) continue;
    let nar = tg['name:ar'] || (HAS_AR.test(tg.name || '') ? tg.name : '');
    let nen = tg['name:en'] || tg.int_name || (tg.name && !HAS_AR.test(tg.name) ? tg.name : '');
    if (!nar && !nen) { nar = tg.name || ''; }
    rows.push([(e.type ? e.type[0] : 'n') + e.id, nar, nen, tg.place || 'village', +lat.toFixed(5), +lon.toFixed(5)]);
  }
  return rows;
}

const SETTLE_Q = (areaDef) => `[out:json][timeout:90];${areaDef}->.a;node(area.a)["place"~"^(city|town|village|hamlet|suburb|neighbourhood)$"]["name"];out;`;
const AREA_ISO = 'area["ISO3166-2"="IQ-AN"]';
const AREA_NAME = 'area["admin_level"="4"]["name:en"~"Anbar",i]';

async function loadSettlements() {
  const cached = store.get('settle_v1', null);
  const fresh = cached && cached.rows && Date.now() - cached.t < 7 * 86400000;
  if (cached && cached.rows && cached.rows.length) {
    ingestSettlements(cached.rows);
    state.placesLoaded = true;
    refreshAfterPlaces();
    if (fresh) return;
  } else {
    setLoadBar(t('loading_places'));
  }
  try {
    let rows = parseOverpassPlaces(await overpass(SETTLE_Q(AREA_ISO), 90000));
    if (rows.length < 20) rows = parseOverpassPlaces(await overpass(SETTLE_Q(AREA_NAME), 90000));
    if (rows.length < 20) throw new Error('too few');
    store.set('settle_v1', { t: Date.now(), rows });
    ingestSettlements(rows);
    state.placesLoaded = true;
    refreshAfterPlaces();
    setLoadBar(t('places_loaded')(rows.length), 4000);
  } catch (e) {
    if (!state.placesLoaded) setLoadBar(t('places_failed'), 7000); else setLoadBar('');
  }
}

let loadBarTimer;
function setLoadBar(msg, ms) {
  const el = $('#loadbar');
  clearTimeout(loadBarTimer);
  if (!msg) { el.hidden = true; return; }
  el.hidden = false; el.textContent = msg;
  if (ms) loadBarTimer = setTimeout(() => { el.hidden = true; }, ms);
}

function refreshAfterPlaces() {
  if (state.mapReady) updatePlacesSource();
  renderSearch();
}

function allPlacesForMap() {
  return featuredPlaces().concat(state.settlements);
}
function tierOf(p) {
  if (p.src === 'featured') return 'f';
  if (p.cat === 'city' || p.cat === 'town') return 'major';
  if (p.cat === 'village') return 'village';
  return 'minor';
}
function colorOf(p) {
  if (p.src === 'featured') return p.cat === 'city' ? '#D4AF37' : '#B39DDB';
  if (p.cat === 'city' || p.cat === 'town') return '#D4AF37';
  if (p.cat === 'village') return '#E6C65C';
  return '#B39DDB';
}

/* ---------- search ---------- */
function searchLocal(q) {
  const n = normalize(q);
  const feat = featuredPlaces();
  const pool = feat.concat(state.settlements);
  let res;
  if (!n) {
    res = feat.concat(state.settlements.filter((p) => (TYPE_RANK[p.cat] ?? 9) <= 1));
  } else {
    res = pool.map((p) => {
      const a = normalize(p.ar), e = normalize(p.en);
      let score = -1;
      if (a === n || e === n) score = 0;
      else if (a.startsWith(n) || e.startsWith(n)) score = 1;
      else if (a.includes(n) || e.includes(n)) score = 2;
      return score < 0 ? null : { p, score };
    }).filter(Boolean).sort((x, y) =>
      x.score - y.score ||
      (x.p.src === 'featured' ? 0 : 1) - (y.p.src === 'featured' ? 0 : 1) ||
      (TYPE_RANK[x.p.cat] ?? 9) - (TYPE_RANK[y.p.cat] ?? 9)).map((x) => x.p);
  }
  return res.slice(0, 80);
}

async function searchOnline(q) {
  const box = $('#search-online');
  box.innerHTML = `<div class="empty small">${esc(t('online_loading'))}</div>`;
  try {
    const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=15&addressdetails=0' +
      `&viewbox=${ANBAR_BBOX.w},${ANBAR_BBOX.n},${ANBAR_BBOX.e},${ANBAR_BBOX.s}&bounded=1` +
      `&accept-language=${state.lang}&q=${encodeURIComponent(q)}`;
    const data = await fetchJson(url, {}, 15000);
    const items = (data || []).map((r) => {
      const name = (r.name || (r.display_name || '').split(',')[0] || '').trim();
      const full = (r.display_name || '').split(',').slice(0, 3).join('،').trim();
      return {
        id: 'o' + r.osm_type[0] + r.osm_id, ar: ar() ? name : '', en: ar() ? '' : name,
        cat: 'online', lat: +r.lat, lon: +r.lon, descAr: full, descEn: full, src: 'online',
      };
    });
    if (!items.length) { box.innerHTML = `<div class="empty small">${esc(t('online_none'))}</div>`; return; }
    registerPlaces(items);
    box.innerHTML = items.map(rowHtml).join('');
  } catch (e) {
    box.innerHTML = `<div class="empty small">${esc(t('online_fail'))}</div>`;
  }
}

/* ---------- POI categories (Overpass, current map view) ---------- */
async function loadPoi(key) {
  const cat = POI_CATS[key];
  if (!cat || !state.map) return;
  setTab('map');
  const map = state.map;
  if (map.getZoom() < 10) {
    const c = state.userPos ? [state.userPos.lon, state.userPos.lat]
      : state.selected ? [state.selected.lon, state.selected.lat] : [43.2994, 33.4258];
    map.jumpTo({ center: c, zoom: 12 });
  }
  const b = map.getBounds();
  const bbox = `${b.getSouth().toFixed(5)},${b.getWest().toFixed(5)},${b.getNorth().toFixed(5)},${b.getEast().toFixed(5)}`;
  setPoiBar(t('poi_loading'), false);
  try {
    const json = await overpass(`[out:json][timeout:30];nwr${cat.q}(${bbox});out center tags 250;`, 35000);
    const items = [];
    for (const e of json.elements || []) {
      const lat = e.lat != null ? e.lat : e.center && e.center.lat;
      const lon = e.lon != null ? e.lon : e.center && e.center.lon;
      if (lat == null || lon == null) continue;
      const tg = e.tags || {};
      let nar = tg['name:ar'] || (HAS_AR.test(tg.name || '') ? tg.name : '');
      let nen = tg['name:en'] || (tg.name && !HAS_AR.test(tg.name) ? tg.name : '');
      items.push({
        id: 'p' + e.type[0] + e.id, ar: nar || (!nen ? cat.ar : ''), en: nen || (!nar ? cat.en : ''),
        cat: 'poi', poi: key, lat: +lat, lon: +lon, src: 'poi',
      });
    }
    state.poi = { key, items };
    registerPlaces(items);
    updatePoiSource();
    if (!items.length) { setPoiBar(t('poi_none'), true); return; }
    setPoiBar(t('poi_result')(cat[state.lang], items.length), true);
  } catch (e) {
    state.poi = { key: null, items: [] };
    updatePoiSource();
    setPoiBar(t('poi_fail'), true, 5000);
  }
}
let poiBarTimer;
function setPoiBar(msg, clearable, autoHideMs) {
  const el = $('#poibar');
  clearTimeout(poiBarTimer);
  if (!msg) { el.hidden = true; return; }
  el.hidden = false;
  el.innerHTML = `<span>${esc(msg)}</span>${clearable ? `<button class="icon-btn sm" data-act="clear-poi" aria-label="${esc(t('clear'))}">${ICONS.close}</button>` : ''}`;
  if (autoHideMs) poiBarTimer = setTimeout(() => { el.hidden = true; }, autoHideMs);
}
function clearPoi() {
  state.poi = { key: null, items: [] };
  updatePoiSource();
  setPoiBar('');
}

/* =====================================================================
   FAVORITES
   ===================================================================== */
function loadFavs() {
  let favs = store.get('favs2', null);
  if (!favs) {
    favs = {};
    const old = store.get('favs', []);
    if (Array.isArray(old)) {
      for (const id of old) { const p = featuredPlaces().find((x) => x.id === id); if (p) favs[id] = p; }
    }
  }
  state.favs = favs;
}
function toggleFav(id) {
  if (state.favs[id]) delete state.favs[id];
  else { const p = state.places.get(id) || (state.selected && state.selected.id === id ? state.selected : null); if (p) state.favs[id] = { ...p }; }
  store.set('favs2', state.favs);
  renderAll();
}
function favBtn(id) {
  const on = !!state.favs[id];
  return `<button class="icon-btn fav ${on ? 'on' : ''}" data-fav="${esc(id)}" aria-label="${esc(t(on ? 'remove_fav' : 'add_fav'))}">${ICONS.heart}</button>`;
}

/* =====================================================================
   RENDERING (lists, chips, details, sheet)
   ===================================================================== */
function applyStatic() {
  const d = I18N[state.lang];
  document.documentElement.lang = state.lang;
  document.documentElement.dir = d.dir;
  $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  $$('[data-i18n-ph]').forEach((el) => { el.setAttribute('placeholder', t(el.dataset.i18nPh)); });
  $$('[data-icon]').forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ''; });
}

function rowHtml(p) {
  return `<div class="row" data-open="${esc(p.id)}">
    <span class="pin">${ICONS.pin}</span>
    <div class="grow"><div class="row-title">${esc(pname(p))}</div><div class="muted small">${esc(catLabel(p))}</div></div>
    ${favBtn(p.id)}
  </div>`;
}

function renderSearch() {
  const q = $('#q').value;
  const list = searchLocal(q);
  $('#search-list').innerHTML = list.length ? list.map(rowHtml).join('') : `<div class="empty small">${esc(t('no_results'))}</div>`;
  $('#q-clear').hidden = !q;
  const online = q.trim().length >= 2
    ? `<div class="online-wrap"><button class="btn ghost block" data-act="online">${ICONS.search}&nbsp;${esc(t('online_search'))}</button></div>` : '';
  const holder = $('#search-online');
  if (!holder.dataset.q || holder.dataset.q !== q.trim()) { holder.innerHTML = online; holder.dataset.q = ''; }
  const total = state.settlements.length + PLACES.length;
  $('#search-count').textContent = state.placesLoaded ? t('places_count')(total) : '';
}
function renderCats() {
  $('#poi-cats').innerHTML = Object.keys(POI_CATS).map((k) =>
    `<button class="cat-chip" data-poi="${k}">${esc(POI_CATS[k][state.lang])}</button>`).join('');
}
function renderFavs() {
  const list = Object.values(state.favs);
  $('#favs-list').innerHTML = list.length ? list.map(rowHtml).join('') : `<div class="empty">${esc(t('no_favorites'))}</div>`;
}
function renderChips() {
  const sel = state.selected && state.selected.id;
  $('#chips').innerHTML = PLACES.map((p) =>
    `<button class="chip ${sel === p.id ? 'on' : ''}" data-chip="${esc(p.id)}">${esc(ar() ? p.ar : p.en)}</button>`).join('');
}

function renderDetails() {
  const panel = $('#details');
  if (!state.detailsId) { panel.hidden = true; return; }
  const p = state.places.get(state.detailsId) || (state.selected && state.selected.id === state.detailsId ? state.selected : null);
  panel.hidden = false;
  $('#d-title').textContent = p ? pname(p) : t('details');
  $('#d-fav').innerHTML = p && p.id !== 'pin' ? favBtn(p.id) : '';
  if (!p) { $('#d-body').innerHTML = `<div class="empty">${esc(t('place_not_found'))}</div>`; return; }
  const apple = `https://maps.apple.com/?ll=${p.lat},${p.lon}&q=${encodeURIComponent(p.en || p.ar || 'FURAT')}`;
  const desc = pdesc(p) || (p.src === 'osm' || p.src === 'poi' ? t('source_osm') : '');
  $('#d-body').innerHTML = `
    <span class="cat-pill">${esc(catLabel(p))}</span>
    ${desc ? `<p class="d-desc">${esc(desc)}</p>` : ''}
    <div class="coords"><div class="muted small">${esc(t('coords'))}</div><div class="v">${p.lat.toFixed(5)}, ${p.lon.toFixed(5)}</div></div>
    <div class="d-actions">
      <button class="btn primary block" data-act="route" data-id="${esc(p.id)}">${ICONS.nav}&nbsp;${esc(t('directions'))}</button>
      <button class="btn ghost block" data-show="${esc(p.id)}">${esc(t('show_on_map'))}</button>
      <a class="btn ghost block" href="${apple}" target="_blank" rel="noopener">${esc(t('open_in_maps'))}</a>
    </div>`;
}

/* Bottom sheet: selected-place card, route preview, navigation bar */
function renderSheet() {
  const card = $('#card');
  const app = $('#app');
  app.classList.toggle('navmode', state.mode === 'nav');
  $('#navtop').hidden = state.mode !== 'nav';

  if (state.pickStart) {
    card.hidden = false;
    card.innerHTML = `<div class="route-head"><div class="grow">${esc(t('pick_start'))}</div>
      <button class="btn ghost" data-act="cancel">${esc(t('cancel'))}</button></div>`;
    resizeMapSoon(); return;
  }

  if (state.mode === 'browse') {
    const p = state.selected;
    if (!p) { card.hidden = true; card.innerHTML = ''; resizeMapSoon(); return; }
    card.hidden = false;
    const desc = pdesc(p);
    card.innerHTML = `
      <div class="card-head">
        <div class="grow"><div class="card-title">${esc(pname(p))}</div><div class="muted small">${esc(catLabel(p))}</div></div>
        ${p.id !== 'pin' ? favBtn(p.id) : ''}
        <button class="icon-btn" data-act="close" aria-label="${esc(t('clear'))}">${ICONS.close}</button>
      </div>
      ${desc ? `<p class="card-desc">${esc(desc)}</p>` : ''}
      <div class="card-actions">
        <button class="btn ghost" data-open="${esc(p.id)}">${esc(t('details'))}</button>
        <button class="btn primary" data-act="route" data-id="${esc(p.id)}">${ICONS.nav}&nbsp;${esc(t('directions'))}</button>
      </div>`;
    resizeMapSoon(); return;
  }

  if (state.mode === 'route') {
    card.hidden = false;
    const r = state.route;
    const dest = state.dest;
    const modes = ['car', 'foot'].map((m) =>
      `<button class="seg ${state.profile === m ? 'on' : ''}" data-act="mode" data-m="${m}">${ICONS[m === 'car' ? 'car' : 'walk']}<span>${esc(t(m))}</span></button>`).join('');
    let body;
    if (state.routeLoading) body = `<div class="route-sum muted">${esc(t('route_loading'))}</div>`;
    else if (!r) body = `<div class="route-sum muted">${esc(state.routeError || t('route_fail'))}</div>`;
    else {
      body = `<div class="route-sum"><b>${esc(fmtDur(r.dur))}</b><span class="muted"> · ${esc(fmtDist(r.dist))}</span></div>
        <div class="card-actions between">
          <button class="btn ghost" data-act="steps">${esc(state.showSteps ? t('hide_steps') : t('steps'))}</button>
          <button class="btn primary" data-act="start">${ICONS.nav}&nbsp;${esc(t('start_nav'))}</button>
        </div>
        ${state.showSteps ? `<div class="steps">${r.steps.map((s) => `<div class="step"><span class="sarrow">${arrowSvg(s.m)}</span><span class="grow">${esc(maneuverText(s.m, s.name))}</span><span class="muted small">${s.dist ? esc(fmtDist(s.dist)) : ''}</span></div>`).join('')}<div class="muted small note">${esc(t('route_note'))}</div></div>` : ''}`;
    }
    card.innerHTML = `
      <div class="route-head"><div class="grow"><span class="muted small">${esc(t('route_to'))}</span> <b class="gold">${esc(pname(dest))}</b></div>
        <button class="icon-btn" data-act="cancel" aria-label="${esc(t('cancel'))}">${ICONS.close}</button></div>
      <div class="segs">${modes}</div>${body}`;
    resizeMapSoon(); return;
  }

  if (state.mode === 'nav') {
    card.hidden = false;
    updateHud();
    resizeMapSoon(); return;
  }
}

function renderAll() {
  renderChips(); renderSheet(); renderSearch(); renderFavs(); renderDetails(); renderCats();
  if (state.mapReady) { updateSelSource(); }
}

/* ---------- tabs ---------- */
function setTab(tab) {
  state.tab = tab;
  state.detailsId = null;
  $$('.tab').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
  $('#panel-search').hidden = tab !== 'search';
  $('#panel-favs').hidden = tab !== 'favs';
  renderDetails();
  if (tab === 'map') resizeMapSoon();
  if (tab === 'search') renderSearch();
  if (tab === 'favs') renderFavs();
}

/* =====================================================================
   MAP
   ===================================================================== */
const OSM_STYLE = {
  version: 8,
  sources: {
    osm: {
      type: 'raster', tileSize: 256, maxzoom: 19,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    { id: 'bg', type: 'background', paint: { 'background-color': '#0A0710' } },
    { id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-brightness-max': 0.88, 'raster-saturation': -0.15 } },
  ],
};
const EMPTY_FC = { type: 'FeatureCollection', features: [] };
const HIT_LAYERS = ['a-major', 'a-village', 'a-minor', 'poi-dot'];

function pointFeature(p, props) {
  return { type: 'Feature', properties: props, geometry: { type: 'Point', coordinates: [p.lon, p.lat] } };
}

function initMap() {
  if (typeof maplibregl === 'undefined') { toast(t('map_fail')); return; }
  let map;
  try {
    map = new maplibregl.Map({
      container: 'map', style: OSM_STYLE, center: [42.0, 33.45], zoom: 5.2, minZoom: 3,
      attributionControl: { compact: true }, dragRotate: false, pitchWithRotate: false,
    });
  } catch (e) { toast(t('map_fail')); return; }
  map.touchZoomRotate.disableRotation();
  state.map = map;

  map.on('load', () => {
    map.addSource('places', { type: 'geojson', data: EMPTY_FC });
    map.addSource('poi', { type: 'geojson', data: EMPTY_FC });
    map.addSource('sel', { type: 'geojson', data: EMPTY_FC });
    map.addSource('route', { type: 'geojson', data: EMPTY_FC });

    map.addLayer({ id: 'route-casing', type: 'line', source: 'route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#FFFFFF', 'line-width': 10, 'line-opacity': 0.95 } });
    map.addLayer({ id: 'route-line', type: 'line', source: 'route',
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': '#2F7BFF', 'line-width': 6 } });

    map.addLayer({ id: 'a-halo', type: 'circle', source: 'places', filter: ['in', ['get', 'tier'], ['literal', ['f', 'major']]],
      paint: { 'circle-radius': 15, 'circle-color': ['get', 'color'], 'circle-opacity': 0.25 } });
    map.addLayer({ id: 'a-minor', type: 'circle', source: 'places', minzoom: 11, filter: ['==', ['get', 'tier'], 'minor'],
      paint: { 'circle-radius': 4.5, 'circle-color': ['get', 'color'], 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1 } });
    map.addLayer({ id: 'a-village', type: 'circle', source: 'places', minzoom: 8.5, filter: ['==', ['get', 'tier'], 'village'],
      paint: { 'circle-radius': 5, 'circle-color': ['get', 'color'], 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1.2 } });
    map.addLayer({ id: 'a-major', type: 'circle', source: 'places', filter: ['in', ['get', 'tier'], ['literal', ['f', 'major']]],
      paint: { 'circle-radius': 7, 'circle-color': ['get', 'color'], 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1.5 } });
    map.addLayer({ id: 'poi-dot', type: 'circle', source: 'poi',
      paint: { 'circle-radius': 7, 'circle-color': '#FF6B6B', 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 2 } });
    map.addLayer({ id: 'sel-ring', type: 'circle', source: 'sel',
      paint: { 'circle-radius': 14, 'circle-opacity': 0, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 3 } });
    map.addLayer({ id: 'sel-pin', type: 'circle', source: 'sel', filter: ['==', ['get', 'pin'], 1],
      paint: { 'circle-radius': 8, 'circle-color': '#FF3B5C', 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 3 } });

    state.mapReady = true;
    updatePlacesSource(); updatePoiSource(); updateSelSource();
    if (state.route) drawRoute();

    map.on('click', onMapClick);
    map.on('dragstart', () => { if (state.nav) { state.nav.follow = false; renderNavFab(); } });
  });
  map.on('error', () => { /* tile errors are expected offline; the offline banner covers it */ });
}

function updatePlacesSource() {
  const src = state.map && state.map.getSource('places');
  if (!src) return;
  src.setData({ type: 'FeatureCollection', features: allPlacesForMap().map((p) => pointFeature(p, { id: p.id, tier: tierOf(p), color: colorOf(p) })) });
}
function updatePoiSource() {
  const src = state.map && state.map.getSource('poi');
  if (!src) return;
  src.setData({ type: 'FeatureCollection', features: state.poi.items.map((p) => pointFeature(p, { id: p.id })) });
}
function updateSelSource() {
  const src = state.map && state.map.getSource('sel');
  if (!src) return;
  const p = state.mode === 'route' || state.mode === 'nav' ? state.dest : state.selected;
  if (!p) { src.setData(EMPTY_FC); return; }
  const pinLike = p.src === 'pin' || p.src === 'poi' || p.src === 'online' || state.mode !== 'browse';
  src.setData({ type: 'FeatureCollection', features: [pointFeature(p, { id: p.id, pin: pinLike ? 1 : 0 })] });
}
function resizeMapSoon() {
  requestAnimationFrame(() => { if (state.map) state.map.resize(); });
}

function pickFeatureId(point) {
  const map = state.map;
  const layers = HIT_LAYERS.filter((l) => map.getLayer(l));
  const feats = map.queryRenderedFeatures([[point.x - 16, point.y - 16], [point.x + 16, point.y + 16]], { layers });
  let best = null, bd = Infinity;
  for (const f of feats) {
    const pp = map.project(f.geometry.coordinates);
    const d = Math.hypot(pp.x - point.x, pp.y - point.y);
    if (d < bd) { bd = d; best = f; }
  }
  return best ? best.properties.id : null;
}

function onMapClick(e) {
  if (state.mode === 'nav') return;
  if (state.pickStart) { setStartPoint(e.lngLat.lng, e.lngLat.lat); return; }
  if (state.mode === 'route') return;
  const id = pickFeatureId(e.point);
  const p = id && state.places.get(id);
  if (p) { selectPlace(p, false); return; }
  dropPin(e.lngLat.lng, e.lngLat.lat);
}

function dropPin(lon, lat) {
  const p = { id: 'pin', ar: t('pin_name'), en: I18N.en.pin_name, cat: 'pin', lat, lon, src: 'pin' };
  state.places.set('pin', p);
  selectPlace(p, false);
}

function selectPlace(p, fly) {
  state.selected = p;
  if (!state.places.has(p.id)) state.places.set(p.id, p);
  renderChips(); renderSheet();
  updateSelSource();
  if (fly && state.map) {
    state.map.flyTo({ center: [p.lon, p.lat], zoom: p.cat === 'city' ? 11 : p.cat === 'landmark' ? 12 : 13, duration: 900 });
  }
  const chip = $(`.chip[data-chip="${p.id}"]`);
  if (chip && chip.scrollIntoView) chip.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
}
function deselect() {
  state.selected = null;
  renderChips(); renderSheet(); updateSelSource();
}

/* ---------- location ---------- */
function setUserMarker(lon, lat) {
  if (!state.map) return;
  if (!state.userMarker) {
    const el = document.createElement('div');
    el.className = 'me';
    state.userMarker = new maplibregl.Marker({ element: el }).setLngLat([lon, lat]).addTo(state.map);
  } else state.userMarker.setLngLat([lon, lat]);
}
function getPosition(opts) {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) { reject({ code: 0 }); return; }
    navigator.geolocation.getCurrentPosition(resolve, reject, opts);
  });
}
function geoErrorToast(err) {
  if (!err || err.code === 0) toast(t('loc_unsupported'));
  else if (err.code === 1) toast(t('loc_denied'));
  else if (err.code === 3) toast(t('loc_timeout'));
  else toast(t('loc_unavailable'));
}
async function locate() {
  const btn = $('#locate');
  if (state.nav) { // during navigation the button recenters
    state.nav.follow = true; renderNavFab();
    if (state.userPos) followCamera(state.userPos, true);
    return;
  }
  btn.classList.add('busy');
  try {
    const pos = await getPosition({ enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 });
    state.userPos = { lon: pos.coords.longitude, lat: pos.coords.latitude, acc: pos.coords.accuracy, t: Date.now() };
    setUserMarker(state.userPos.lon, state.userPos.lat);
    if (state.map) state.map.flyTo({ center: [state.userPos.lon, state.userPos.lat], zoom: 13, duration: 900 });
  } catch (err) { geoErrorToast(err); } finally { btn.classList.remove('busy'); }
}

/* =====================================================================
   ROUTING (OSRM)
   ===================================================================== */
const ROUTERS = {
  car: ['https://routing.openstreetmap.de/routed-car/route/v1/driving/', 'https://router.project-osrm.org/route/v1/driving/'],
  foot: ['https://routing.openstreetmap.de/routed-foot/route/v1/driving/'],
};

async function fetchRoute(from, to, profile) {
  const coords = `${from.lon.toFixed(6)},${from.lat.toFixed(6)};${to.lon.toFixed(6)},${to.lat.toFixed(6)}`;
  const qs = '?overview=full&geometries=geojson&steps=true&alternatives=false';
  let lastErr;
  for (const base of ROUTERS[profile] || ROUTERS.car) {
    try {
      const json = await fetchJson(base + coords + qs, {}, 20000);
      if (json.code === 'NoRoute') { lastErr = new Error('NoRoute'); continue; }
      if (json.code && json.code !== 'Ok') throw new Error(json.code);
      return buildRoute(json, profile);
    } catch (e) { lastErr = e; }
  }
  throw lastErr || new Error('route');
}

function buildRoute(json, profile) {
  const r = json.routes && json.routes[0];
  if (!r) throw new Error('NoRoute');
  const coords = r.geometry.coordinates;
  const cum = [0];
  for (let i = 1; i < coords.length; i++) cum.push(cum[i - 1] + hav(coords[i - 1], coords[i]));
  const scale = cum[cum.length - 1] > 0 ? r.distance / cum[cum.length - 1] : 1;
  for (let i = 0; i < cum.length; i++) cum[i] *= scale;
  const steps = [];
  let acc = 0;
  for (const leg of r.legs) {
    for (const s of leg.steps) {
      steps.push({ startDist: acc, dist: s.distance, dur: s.duration, m: s.maneuver, name: s.name || '' });
      acc += s.distance;
    }
  }
  if (steps.length) steps[steps.length - 1].startDist = r.distance;
  return { coords, cum, steps, dist: r.distance, dur: r.duration, profile };
}

function drawRoute() {
  const src = state.map && state.map.getSource('route');
  if (!src) return;
  if (!state.route) { src.setData(EMPTY_FC); return; }
  src.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: state.route.coords } });
}
function fitRoute() {
  const r = state.route;
  if (!r || !state.map) return;
  let w = 180, s = 90, e = -180, n = -90;
  for (const c of r.coords) { w = Math.min(w, c[0]); e = Math.max(e, c[0]); s = Math.min(s, c[1]); n = Math.max(n, c[1]); }
  state.map.fitBounds([[w, s], [e, n]], { padding: { top: 120, bottom: 120, left: 40, right: 40 }, duration: 800, maxZoom: 16 });
}

async function startRoute(dest) {
  state.mode = 'route';
  state.dest = dest;
  state.route = null; state.routeError = ''; state.showSteps = false;
  state.pickStart = false; state.start = null;
  setTab('map');
  updateSelSource(); drawRoute(); renderSheet();
  state.routeLoading = true; renderSheet();
  let from = state.userPos && Date.now() - state.userPos.t < 120000 ? state.userPos : null;
  if (!from) {
    try {
      const pos = await getPosition({ enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
      from = { lon: pos.coords.longitude, lat: pos.coords.latitude, acc: pos.coords.accuracy, t: Date.now() };
      state.userPos = from; setUserMarker(from.lon, from.lat);
    } catch (err) {
      state.routeLoading = false;
      geoErrorToast(err);
      state.pickStart = true; renderSheet();
      return;
    }
  }
  state.start = from;
  await computeRoute();
}

async function computeRoute() {
  if (!state.dest || !state.start) return;
  state.routeLoading = true; state.route = null; state.routeError = ''; drawRoute(); renderSheet();
  try {
    state.route = await fetchRoute(state.start, state.dest, state.profile);
  } catch (e) {
    state.route = null;
    state.routeError = e && e.message === 'NoRoute' ? t('route_none') : t('route_fail');
  }
  state.routeLoading = false;
  drawRoute(); renderSheet(); fitRoute();
}

function setStartPoint(lon, lat) {
  state.pickStart = false;
  state.start = { lon, lat, acc: 0, t: Date.now() };
  setUserMarker(lon, lat);
  computeRoute();
}

function cancelRoute() {
  if (state.nav) stopNav(false);
  state.mode = 'browse'; state.dest = null; state.route = null; state.pickStart = false; state.routeLoading = false;
  drawRoute(); renderSheet(); updateSelSource();
}

/* ---------- maneuver text ---------- */
const DIR = {
  ar: { left: 'يسارًا', right: 'يمينًا', 'slight left': 'قليلًا نحو اليسار', 'slight right': 'قليلًا نحو اليمين', 'sharp left': 'بحدّة نحو اليسار', 'sharp right': 'بحدّة نحو اليمين', straight: 'للأمام', uturn: 'للخلف' },
  en: { left: 'left', right: 'right', 'slight left': 'slightly left', 'slight right': 'slightly right', 'sharp left': 'sharply left', 'sharp right': 'sharply right', straight: 'straight', uturn: 'around' },
};
function maneuverText(m, name) {
  const L = state.lang, d = DIR[L][m.modifier] || '';
  const type = m.type;
  const side = m.modifier || '';
  if (L === 'ar') {
    const on = name ? ` إلى ${name}` : '';
    switch (type) {
      case 'depart': return 'انطلق' + (name ? ` على ${name}` : '');
      case 'arrive': return 'وصلت إلى وجهتك' + (side === 'left' ? ' (على يسارك)' : side === 'right' ? ' (على يمينك)' : '');
      case 'roundabout': case 'rotary': return (m.exit ? `ادخل الدوّار وخذ المخرج رقم ${m.exit}` : 'ادخل الدوّار') + on;
      case 'roundabout turn': return `عند الدوّار انعطف ${d}` + on;
      case 'exit roundabout': case 'exit rotary': return 'اخرج من الدوّار' + on;
      case 'merge': return 'ادمج' + (d ? ' ' + d : '') + on;
      case 'on ramp': return 'خذ المنحدر' + (d ? ' ' + d : '') + on;
      case 'off ramp': return 'خذ المخرج' + (d ? ' ' + d : '') + on;
      case 'fork': return 'خذ المسار ' + (side.includes('left') ? 'الأيسر' : side.includes('right') ? 'الأيمن' : '') + on;
      case 'new name': case 'continue': return 'استمر للأمام' + on;
      default:
        if (side === 'straight') return 'استمر للأمام' + on;
        if (side === 'uturn') return 'قم بالدوران للخلف';
        return `انعطف ${d}` + on;
    }
  }
  const on = name ? ` onto ${name}` : '';
  switch (type) {
    case 'depart': return 'Head out' + (name ? ` on ${name}` : '');
    case 'arrive': return 'You have arrived' + (side === 'left' ? ' (on your left)' : side === 'right' ? ' (on your right)' : '');
    case 'roundabout': case 'rotary': return (m.exit ? `Enter the roundabout and take exit ${m.exit}` : 'Enter the roundabout') + on;
    case 'roundabout turn': return `At the roundabout turn ${d}` + on;
    case 'exit roundabout': case 'exit rotary': return 'Exit the roundabout' + on;
    case 'merge': return 'Merge' + (d ? ' ' + d : '') + on;
    case 'on ramp': return 'Take the ramp' + (d ? ' ' + d : '') + on;
    case 'off ramp': return 'Take the exit' + (d ? ' ' + d : '') + on;
    case 'fork': return 'Keep ' + (side.includes('left') ? 'left' : side.includes('right') ? 'right' : 'straight') + on;
    case 'new name': case 'continue': return 'Continue straight' + on;
    default:
      if (side === 'straight') return 'Continue straight' + on;
      if (side === 'uturn') return 'Make a U-turn';
      return `Turn ${d}` + on;
  }
}
const ROT = { straight: 0, 'slight right': 45, right: 90, 'sharp right': 135, uturn: 180, 'sharp left': -135, left: -90, 'slight left': -45 };
function arrowSvg(m) {
  if (m.type === 'arrive') return ICONS.pin;
  if (m.type === 'roundabout' || m.type === 'rotary' || m.type === 'roundabout turn') return ICONS.round;
  const rot = ROT[m.modifier] != null ? ROT[m.modifier] : 0;
  return `<span class="rot" style="display:inline-flex;transform:rotate(${rot}deg)">${ICONS.arrow}</span>`;
}

/* =====================================================================
   NAVIGATION (live GPS along the route)
   ===================================================================== */
function speak(text) {
  if (!state.voice || !('speechSynthesis' in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = t('voice_lang'); u.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch (e) { /* voice is optional */ }
}

async function startNav() {
  const r = state.route;
  if (!r) return;
  state.mode = 'nav';
  state.nav = { watchId: null, follow: true, lastIdx: 0, along: 0, off: 0, lastReroute: 0, voiced: {}, wake: null, lastPos: null, arrived: false };
  if (state.userMarker) state.userMarker.getElement().classList.add('moving');
  renderSheet(); renderNavFab();
  speak(maneuverText(r.steps[0].m, r.steps[0].name));
  try { if ('wakeLock' in navigator) state.nav.wake = await navigator.wakeLock.request('screen'); } catch (e) { /* optional */ }
  if (!('geolocation' in navigator)) { toast(t('loc_unsupported')); return; }
  setNavHudWaiting();
  state.nav.watchId = navigator.geolocation.watchPosition(onFix, (err) => {
    if (err.code === 1) { toast(t('loc_denied')); stopNav(false); cancelRoute(); }
  }, { enableHighAccuracy: true, maximumAge: 1000, timeout: 20000 });
  if (state.userPos) followCamera(state.userPos, true);
}

function stopNav(arrived) {
  const nav = state.nav;
  if (nav) {
    if (nav.watchId != null && navigator.geolocation) navigator.geolocation.clearWatch(nav.watchId);
    try { if (nav.wake) nav.wake.release(); } catch (e) { /* ignore */ }
  }
  state.nav = null;
  try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) { /* ignore */ }
  if (state.userMarker) state.userMarker.getElement().classList.remove('moving');
  if (state.map) state.map.easeTo({ bearing: 0, pitch: 0, duration: 500 });
  renderNavFab();
  if (arrived) {
    toast(t('arrived'), 6000);
    state.mode = 'browse'; state.route = null; drawRoute();
    state.selected = state.dest; state.dest = null;
    renderChips(); renderSheet(); updateSelSource();
  } else if (state.mode === 'nav') {
    state.mode = 'route'; renderSheet();
  }
}

function progressOnRoute(route, p, hint) {
  const c = route.coords, cum = route.cum;
  const scan = (from, to) => {
    let best = { d: Infinity, i: 0, t: 0 };
    for (let i = Math.max(0, from); i < Math.min(c.length - 1, to); i++) {
      const pr = projectOnSegment(p, c[i], c[i + 1]);
      if (pr.d < best.d) best = { d: pr.d, i, t: pr.t };
    }
    return best;
  };
  let best = scan(hint - 10, hint + 600);
  if (best.d > 120) { const full = scan(0, c.length - 1); if (full.d < best.d) best = full; }
  const segLen = cum[best.i + 1] - cum[best.i];
  return { off: best.d, idx: best.i, along: cum[best.i] + best.t * segLen };
}

function currentManeuver(route, along) {
  const st = route.steps;
  let i = 0;
  for (let k = 0; k < st.length; k++) { if (st[k].startDist <= along + 1) i = k; else break; }
  const nextIdx = Math.min(i + 1, st.length - 1);
  return { nextIdx, distTo: Math.max(0, st[nextIdx].startDist - along), step: st[nextIdx] };
}

function onFix(pos) {
  const nav = state.nav, route = state.route;
  if (!nav || !route || nav.arrived) return;
  const p = [pos.coords.longitude, pos.coords.latitude];
  state.userPos = { lon: p[0], lat: p[1], acc: pos.coords.accuracy, t: Date.now() };
  setUserMarker(p[0], p[1]);
  nav.lastPos = pos;

  const pr = progressOnRoute(route, p, nav.lastIdx);
  const tol = Math.max(60, Math.min(pos.coords.accuracy || 0, 150));
  if (pr.off > tol) {
    nav.off++;
    if ((nav.off >= 3 || pr.off > 250) && Date.now() - nav.lastReroute > 10000) { reroute(p); return; }
  } else {
    nav.off = 0; nav.lastIdx = pr.idx; nav.along = pr.along;
  }

  const remaining = route.dist - nav.along;
  if (remaining < 25 || hav(p, [state.dest.lon, state.dest.lat]) < 25) {
    nav.arrived = true; speak(t('arrived')); stopNav(true); return;
  }

  const cur = currentManeuver(route, nav.along);
  const k = cur.nextIdx;
  const v = nav.voiced[k] || (nav.voiced[k] = {});
  const text = maneuverText(cur.step.m, cur.step.name);
  if (cur.distTo <= 45 && !v.near) { v.near = true; v.far = true; speak(text); }
  else if (cur.distTo <= 260 && !v.far && route.steps[k].startDist - route.steps[Math.max(0, k - 1)].startDist > 300) {
    v.far = true; speak(ar() ? `بعد ${fmtDist(cur.distTo)}، ${text}` : `In ${fmtDist(cur.distTo)}, ${text}`);
  }
  nav.cur = cur;
  updateHud();
  if (nav.follow) followCamera(state.userPos, false, pos.coords.heading, pos.coords.speed);
}

function followCamera(u, jump, heading, speed) {
  const map = state.map;
  if (!map) return;
  const opts = { center: [u.lon, u.lat], zoom: Math.max(map.getZoom(), 16), duration: jump ? 0 : 800 };
  if (heading != null && !isNaN(heading) && speed != null && speed > 1.5) opts.bearing = heading;
  map.easeTo(opts);
}

async function reroute(p) {
  const nav = state.nav;
  if (!nav) return;
  nav.lastReroute = Date.now(); nav.off = 0;
  toast(t('rerouting'), 3000);
  speak(t('rerouting'));
  try {
    const r = await fetchRoute({ lon: p[0], lat: p[1] }, state.dest, state.profile);
    if (!state.nav) return;
    state.route = r; nav.lastIdx = 0; nav.along = 0; nav.voiced = {}; nav.cur = null;
    drawRoute(); updateHud();
  } catch (e) { /* keep the old route; try again on the next fix */ }
}

function setNavHudWaiting() {
  $('#navtop').innerHTML = `<div class="nav-main"><span class="narrow">${ICONS.nav}</span><div class="grow"><div class="nav-text">${esc(t('gps_wait'))}</div></div></div>`;
}

function updateHud() {
  const nav = state.nav, route = state.route;
  if (!nav || !route) return;
  const cur = nav.cur || currentManeuver(route, nav.along);
  const remaining = Math.max(0, route.dist - nav.along);
  const remDur = route.dist ? route.dur * (remaining / route.dist) : 0;
  $('#navtop').innerHTML = `<div class="nav-main"><span class="narrow">${arrowSvg(cur.step.m)}</span>
    <div class="grow"><div class="nav-dist">${esc(fmtDist(cur.distTo))}</div><div class="nav-text">${esc(maneuverText(cur.step.m, cur.step.name))}</div></div></div>`;
  $('#card').innerHTML = `<div class="nav-bar">
    <div class="grow"><b>${esc(fmtDur(remDur))}</b> <span class="muted">· ${esc(fmtDist(remaining))}</span><div class="muted small">${esc(t('eta'))} ${esc(fmtEta(remDur))}</div></div>
    <button class="icon-btn" data-act="voice" aria-label="${esc(t(state.voice ? 'mute' : 'unmute'))}">${ICONS[state.voice ? 'sound' : 'mute']}</button>
    <button class="btn danger" data-act="end">${esc(t('end_nav'))}</button></div>`;
}
function renderNavFab() {
  const b = $('#locate');
  b.classList.toggle('attn', !!(state.nav && !state.nav.follow));
}

/* =====================================================================
   EVENTS
   ===================================================================== */
const ACTIONS = {
  route(el) { const p = state.places.get(el.dataset.id) || state.selected; if (p) startRoute(p); },
  start() { startNav(); },
  end() { stopNav(false); cancelRoute(); },
  cancel() { cancelRoute(); },
  close() { deselect(); },
  steps() { state.showSteps = !state.showSteps; renderSheet(); },
  mode(el) { if (state.profile !== el.dataset.m) { state.profile = el.dataset.m; computeRoute(); } },
  voice() { state.voice = !state.voice; store.set('voice', state.voice); if (!state.voice) { try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } } updateHud(); },
  online() { const q = $('#q').value.trim(); if (q.length >= 2) { $('#search-online').dataset.q = q; searchOnline(q); } },
  'clear-poi'() { clearPoi(); },
};

document.addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]');
  if (act && ACTIONS[act.dataset.act]) { e.stopPropagation(); ACTIONS[act.dataset.act](act); return; }
  const fav = e.target.closest('[data-fav]');
  if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav); return; }
  const show = e.target.closest('[data-show]');
  if (show) {
    const p = state.places.get(show.dataset.show);
    setTab('map');
    if (p) selectPlace(p, true);
    return;
  }
  const poi = e.target.closest('[data-poi]');
  if (poi) { loadPoi(poi.dataset.poi); return; }
  const open = e.target.closest('[data-open]');
  if (open) { state.detailsId = open.dataset.open; renderDetails(); return; }
  const chip = e.target.closest('[data-chip]');
  if (chip) { const p = state.places.get(chip.dataset.chip); if (p) selectPlace(p, true); return; }
  const tab = e.target.closest('.tab');
  if (tab) { setTab(tab.dataset.tab); return; }
});
$('#back').addEventListener('click', () => { state.detailsId = null; renderDetails(); });
$('#locate').addEventListener('click', locate);
$('#q').addEventListener('input', renderSearch);
$('#search-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const q = $('#q').value.trim();
  $('#q').blur();
  if (q.length >= 2) { $('#search-online').dataset.q = q; searchOnline(q); }
});
$('#q-clear').addEventListener('click', () => { $('#q').value = ''; $('#search-online').dataset.q = ''; renderSearch(); $('#q').focus(); });
$('#lang').addEventListener('click', () => {
  state.lang = ar() ? 'en' : 'ar';
  store.set('lang', state.lang);
  applyStatic(); renderAll(); resizeMapSoon();
});
function updateOnline() { $('#offline').hidden = navigator.onLine !== false; }
window.addEventListener('online', updateOnline);
window.addEventListener('offline', updateOnline);
window.addEventListener('resize', resizeMapSoon);
window.addEventListener('orientationchange', resizeMapSoon);

/* ---------- boot ---------- */
registerPlaces(featuredPlaces());
loadFavs();
applyStatic();
renderAll();
updateOnline();
initMap();
loadSettlements();

// Exposed for automated tests only.
window.__furat = { state, progressOnRoute, currentManeuver, buildRoute, maneuverText, onFix, startNav, startRoute, normalize, searchLocal, parseOverpassPlaces, ingestSettlements };
