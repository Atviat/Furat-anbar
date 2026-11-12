'use strict';

/* ---------- i18n ---------- */
const I18N = {
  ar: {
    dir: 'rtl', lang_btn: 'EN', lang_aria: 'English',
    nav_map: 'الخريطة', nav_search: 'بحث', nav_favorites: 'المفضلة',
    search_hint: 'ابحث عن مدينة أو مكان', clear: 'مسح',
    no_results: 'لا توجد نتائج مطابقة.', no_favorites: 'لم تضف أي مكان إلى المفضلة بعد.',
    my_location: 'موقعي',
    loc_denied: 'لم يتم منح إذن الموقع، لذا لا يمكن عرض موقعك.',
    loc_unavailable: 'تعذّر تحديد موقعك حاليًا.',
    loc_unsupported: 'المتصفح لا يدعم تحديد الموقع.',
    loc_timeout: 'انتهت مهلة تحديد الموقع، حاول مجددًا.',
    offline: 'لا يوجد اتصال بالإنترنت. قد لا تظهر أجزاء من الخريطة.',
    add_fav: 'إضافة إلى المفضلة', remove_fav: 'إزالة من المفضلة',
    back: 'رجوع', details: 'التفاصيل', show_on_map: 'عرض على الخريطة',
    open_in_maps: 'فتح في تطبيق خرائط', place_not_found: 'المكان غير موجود.',
    city: 'مدينة', landmark: 'معلم', coords: 'الإحداثيات (تقريبية)',
    map_fail: 'تعذّر تحميل الخريطة. تحقق من الإنترنت ثم أعد تحميل الصفحة.',
  },
  en: {
    dir: 'ltr', lang_btn: 'عربي', lang_aria: 'العربية',
    nav_map: 'Map', nav_search: 'Search', nav_favorites: 'Favorites',
    search_hint: 'Search for a city or place', clear: 'Clear',
    no_results: 'No matching results.', no_favorites: "You haven't added any places to favorites yet.",
    my_location: 'My location',
    loc_denied: 'Location permission was not granted, so your position cannot be shown.',
    loc_unavailable: 'Your location could not be determined right now.',
    loc_unsupported: 'This browser does not support geolocation.',
    loc_timeout: 'Locating timed out. Try again.',
    offline: 'No internet connection. Parts of the map may not appear.',
    add_fav: 'Add to favorites', remove_fav: 'Remove from favorites',
    back: 'Back', details: 'Details', show_on_map: 'Show on map',
    open_in_maps: 'Open in a maps app', place_not_found: 'Place not found.',
    city: 'City', landmark: 'Landmark', coords: 'Coordinates (approximate)',
    map_fail: 'The map could not be loaded. Check your connection and reload.',
  },
};

/* ---------- safe storage (Safari private mode can throw) ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ } },
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const ICONS = {
  map: '<svg viewBox="0 0 24 24"><path d="M9 4 3 6.5v13L9 17l6 3 6-2.5v-13L15 7 9 4z"/><path d="M9 4v13M15 7v13"/></svg>',
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5c0 6.1-8 11-8 11z"/></svg>',
  locate: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  back: '<svg viewBox="0 0 24 24"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  wifioff: '<svg viewBox="0 0 24 24"><path d="M2 8.8a15 15 0 0 1 4-2.3M22 8.8a15 15 0 0 0-9-3.7M5 12.5a10 10 0 0 1 3-1.8M19 12.5a10 10 0 0 0-4.5-2.4M8.5 16a5 5 0 0 1 7 0"/><circle cx="12" cy="19.5" r=".6"/><path d="M3 3l18 18"/></svg>',
};

/* ---------- state ---------- */
const state = {
  lang: store.get('lang', (navigator.language || 'ar').toLowerCase().startsWith('ar') ? 'ar' : (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'ar'),
  favs: new Set(store.get('favs', [])),
  selected: null,
  tab: 'map',
  detailsId: null,
  map: null,
  mapReady: false,
  userMarker: null,
};

const t = (k) => I18N[state.lang][k] || k;
const ar = () => state.lang === 'ar';
const pname = (p) => (ar() ? p.ar : p.en);
const pdesc = (p) => (ar() ? p.descAr : p.descEn);
const catLabel = (p) => t(p.cat);
const byId = (id) => PLACES.find((p) => p.id === id) || null;
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function normalize(s) {
  return String(s).trim().toLowerCase()
    .replace(/[ً-ْـ]/g, '')
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/[’'`]/g, '');
}
function searchPlaces(q) {
  const n = normalize(q);
  if (!n) return PLACES;
  return PLACES.filter((p) => normalize(p.ar).includes(n) || normalize(p.en).includes(n));
}

/* ---------- static i18n/icon application ---------- */
function applyStatic() {
  const d = I18N[state.lang];
  document.documentElement.lang = state.lang;
  document.documentElement.dir = d.dir;
  $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  $$('[data-i18n-ph]').forEach((el) => { el.setAttribute('placeholder', t(el.dataset.i18nPh)); });
  $$('[data-icon]').forEach((el) => { el.innerHTML = ICONS[el.dataset.icon] || ''; });
}

/* ---------- toast ---------- */
let toastTimer;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
}

/* ---------- favorites ---------- */
function toggleFav(id) {
  if (state.favs.has(id)) state.favs.delete(id); else state.favs.add(id);
  store.set('favs', Array.from(state.favs));
  renderAll();
}
function favBtn(id) {
  const on = state.favs.has(id);
  return `<button class="icon-btn fav ${on ? 'on' : ''}" data-fav="${esc(id)}" aria-label="${esc(t(on ? 'remove_fav' : 'add_fav'))}">${ICONS.heart}</button>`;
}

/* ---------- list rendering ---------- */
function rowHtml(p) {
  return `<div class="row" data-open="${esc(p.id)}">
    <span class="pin">${ICONS.pin}</span>
    <div class="grow"><div class="row-title">${esc(pname(p))}</div><div class="muted small">${esc(catLabel(p))}</div></div>
    ${favBtn(p.id)}
  </div>`;
}
function renderSearch() {
  const list = searchPlaces($('#q').value);
  $('#search-list').innerHTML = list.length ? list.map(rowHtml).join('') : `<div class="empty">${esc(t('no_results'))}</div>`;
  $('#q-clear').hidden = !$('#q').value;
}
function renderFavs() {
  const list = PLACES.filter((p) => state.favs.has(p.id));
  $('#favs-list').innerHTML = list.length ? list.map(rowHtml).join('') : `<div class="empty">${esc(t('no_favorites'))}</div>`;
}
function renderChips() {
  $('#chips').innerHTML = PLACES.map((p) =>
    `<button class="chip ${state.selected === p.id ? 'on' : ''}" data-chip="${esc(p.id)}">${esc(pname(p))}</button>`).join('');
}
function renderCard() {
  const card = $('#card');
  const p = byId(state.selected);
  if (!p) { card.hidden = true; card.innerHTML = ''; resizeMapSoon(); return; }
  card.hidden = false;
  card.innerHTML = `
    <div class="card-head">
      <div><div class="card-title">${esc(pname(p))}</div><div class="muted small">${esc(catLabel(p))}</div></div>
      ${favBtn(p.id)}
    </div>
    <p class="card-desc">${esc(pdesc(p))}</p>
    <div class="card-actions"><button class="btn primary" data-open="${esc(p.id)}">${esc(t('details'))}</button></div>`;
  resizeMapSoon();
}
function renderDetails() {
  const panel = $('#details');
  if (!state.detailsId) { panel.hidden = true; return; }
  const p = byId(state.detailsId);
  panel.hidden = false;
  $('#d-title').textContent = p ? pname(p) : t('details');
  $('#d-fav').innerHTML = p ? favBtn(p.id) : '';
  if (!p) { $('#d-body').innerHTML = `<div class="empty">${esc(t('place_not_found'))}</div>`; return; }
  const geo = `https://maps.apple.com/?ll=${p.lat},${p.lon}&q=${encodeURIComponent(p.en)}`;
  $('#d-body').innerHTML = `
    <span class="cat-pill">${esc(catLabel(p))}</span>
    <p class="d-desc">${esc(pdesc(p))}</p>
    <div class="coords"><div class="muted small">${esc(t('coords'))}</div><div class="v">${p.lat.toFixed(4)}, ${p.lon.toFixed(4)}</div></div>
    <div class="d-actions">
      <button class="btn primary block" data-show="${esc(p.id)}">${esc(t('show_on_map'))}</button>
      <a class="btn ghost block" href="${geo}" target="_blank" rel="noopener">${esc(t('open_in_maps'))}</a>
    </div>`;
}
function renderAll() {
  renderChips(); renderCard(); renderSearch(); renderFavs(); renderDetails();
  if (state.mapReady) updateSelectedRing();
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

/* ---------- map ---------- */
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
    { id: 'osm', type: 'raster', source: 'osm', paint: { 'raster-brightness-max': 0.85, 'raster-saturation': -0.2 } },
  ],
};

function placesGeoJson() {
  return {
    type: 'FeatureCollection',
    features: PLACES.map((p) => ({
      type: 'Feature',
      properties: { id: p.id, color: p.cat === 'city' ? '#D4AF37' : '#B39DDB' },
      geometry: { type: 'Point', coordinates: [p.lon, p.lat] },
    })),
  };
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
    map.addSource('places', { type: 'geojson', data: placesGeoJson() });
    map.addLayer({ id: 'halo', type: 'circle', source: 'places',
      paint: { 'circle-radius': 16, 'circle-color': ['get', 'color'], 'circle-opacity': 0.28 } });
    map.addLayer({ id: 'dot', type: 'circle', source: 'places',
      paint: { 'circle-radius': 7, 'circle-color': ['get', 'color'], 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 1.5 } });
    map.addLayer({ id: 'sel', type: 'circle', source: 'places', filter: ['==', ['get', 'id'], ''],
      paint: { 'circle-radius': 13, 'circle-opacity': 0, 'circle-stroke-color': '#ffffff', 'circle-stroke-width': 3 } });
    state.mapReady = true;
    updateSelectedRing();
    map.on('click', 'halo', (e) => {
      const f = e.features && e.features[0];
      if (f) select(f.properties.id, false);
    });
    map.on('mouseenter', 'halo', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'halo', () => { map.getCanvas().style.cursor = ''; });
  });
  map.on('click', (e) => {
    const hit = map.getLayer('halo') ? map.queryRenderedFeatures(e.point, { layers: ['halo'] }) : [];
    if (!hit.length) select(null, false);
  });
  map.on('error', () => { /* tile errors are expected offline; the offline banner covers it */ });
}

function updateSelectedRing() {
  const m = state.map;
  if (!m || !m.getLayer('sel')) return;
  m.setFilter('sel', ['==', ['get', 'id'], state.selected || '']);
}
function resizeMapSoon() {
  requestAnimationFrame(() => { if (state.map) state.map.resize(); });
}
function select(id, fly) {
  state.selected = id;
  renderChips(); renderCard();
  if (state.mapReady) updateSelectedRing();
  const p = byId(id);
  if (fly && p && state.map) {
    state.map.flyTo({ center: [p.lon, p.lat], zoom: p.cat === 'city' ? 11 : 12, duration: 900 });
  }
  const chip = $(`.chip[data-chip="${id}"]`);
  if (chip && chip.scrollIntoView) chip.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
}

/* ---------- location ---------- */
function locate() {
  if (!('geolocation' in navigator)) { toast(t('loc_unsupported')); return; }
  const btn = $('#locate');
  btn.classList.add('busy');
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      btn.classList.remove('busy');
      const ll = [pos.coords.longitude, pos.coords.latitude];
      if (!state.map) return;
      if (!state.userMarker) {
        const el = document.createElement('div');
        el.className = 'me';
        state.userMarker = new maplibregl.Marker({ element: el }).setLngLat(ll).addTo(state.map);
      } else {
        state.userMarker.setLngLat(ll);
      }
      state.map.flyTo({ center: ll, zoom: 12, duration: 900 });
    },
    (err) => {
      btn.classList.remove('busy');
      if (err.code === 1) toast(t('loc_denied'));
      else if (err.code === 3) toast(t('loc_timeout'));
      else toast(t('loc_unavailable'));
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 },
  );
}

/* ---------- connectivity ---------- */
function updateOnline() { $('#offline').hidden = navigator.onLine !== false; }

/* ---------- events ---------- */
document.addEventListener('click', (e) => {
  const fav = e.target.closest('[data-fav]');
  if (fav) { e.stopPropagation(); toggleFav(fav.dataset.fav); return; }
  const show = e.target.closest('[data-show]');
  if (show) {
    const id = show.dataset.show;
    setTab('map');
    select(id, true);
    return;
  }
  const open = e.target.closest('[data-open]');
  if (open) { state.detailsId = open.dataset.open; renderDetails(); return; }
  const chip = e.target.closest('[data-chip]');
  if (chip) { select(chip.dataset.chip, true); return; }
  const tab = e.target.closest('.tab');
  if (tab) { setTab(tab.dataset.tab); return; }
});
$('#back').addEventListener('click', () => { state.detailsId = null; renderDetails(); });
$('#locate').addEventListener('click', locate);
$('#q').addEventListener('input', renderSearch);
$('#q-clear').addEventListener('click', () => { $('#q').value = ''; renderSearch(); $('#q').focus(); });
$('#lang').addEventListener('click', () => {
  state.lang = ar() ? 'en' : 'ar';
  store.set('lang', state.lang);
  applyStatic(); renderAll(); resizeMapSoon();
});
window.addEventListener('online', updateOnline);
window.addEventListener('offline', updateOnline);
window.addEventListener('resize', resizeMapSoon);
window.addEventListener('orientationchange', resizeMapSoon);

/* ---------- boot ---------- */
applyStatic();
renderAll();
updateOnline();
initMap();
