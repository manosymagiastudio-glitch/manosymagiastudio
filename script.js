/* =========================================================
   Manos & Magia Studio — script.js
   - Carga datos desde /data (si no están, usa fallbacks)
   - Pinta Productos, Combos y (opcional) Galería
   - Setea links/textos del hero y footer
   - A prueba de IDs faltantes (no rompe)
   ========================================================= */

// RUTAS (relativas, sin "/" al inicio)
const DATA = {
  settings: 'data/texts.json',
  products: 'data/products.json',
  combos:   'data/combos.json',
  gallery:  'data/gallery.json',
};

// ---------- Helpers de DOM seguros ----------
const $id     = (id) => document.getElementById(id);
const setHref = (id, href) => { const el = $id(id); if (el && href) el.href = href; };
const setHTML = (id, html) => { const el = $id(id); if (el && html != null) el.innerHTML = html; };
const setText = (id, txt)  => { const el = $id(id); if (el && txt  != null) el.textContent = txt; };
const el      = (tag, cls) => { const n = document.createElement(tag); if (cls) n.className = cls; return n; };

// ---------- Carga JSON con fallback ----------
async function getJSON(url, fallback = null){
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    console.warn('[MM] No se pudo cargar', url, '→ uso fallback.', e);
    return fallback;
  }
}

// ---------- Fallbacks (por si no existen archivos /data) ----------
const DEFAULTS = {
  settings: {
    whatsapp_link: 'https://wa.me/5491167286443',
    instagram: 'https://www.instagram.com/manosymagia_studio',
    email: 'manosymagiastudio@gmail.com',
    hero_title: 'Decoración <span class="resaltado">100% personalizada</span> para tu fiesta',
    hero_sub: 'Papelería creativa, toppers con luz, piñatas, letras 3D, bolsitas y souvenirs. Hecho con amor desde el alma 💫'
  },
  products: [
    { title:'Topper con luz',      price:'$8.900',  tags:['Personalizado','LED'],        image:'img/sample-topper.jpg'   },
    { title:'Letras 3D',           price:'$12.500', tags:['Decoración','Personalizado'], image:'img/sample-letras3d.jpg' },
    { title:'Bolsitas golosineras',price:'$6.800',  tags:['Souvenir'],                   image:'img/sample-bolsitas.jpg' }
  ],
  combos: [
    { title:'Combo Cumple Básico',  price:'$19.900', tags:['Topper','10 bolsitas'],                   image:'img/sample-combo1.jpg' },
    { title:'Combo Cumple Premium', price:'$39.900', tags:['Topper LED','Letras 3D','20 bolsitas'],  image:'img/sample-combo2.jpg' }
  ],
  gallery: [
    // { image:'img/gal-01.jpg', alt:'Trabajo 1' },
    // { image:'img/gal-02.jpg', alt:'Trabajo 2' }
  ]
};

// ---------- Render genérico de tarjetas ----------
function renderCards(container, items){
  if (!container) {
    console.warn('[MM] Contenedor no encontrado al renderizar tarjetas.');
    return;
  }
  container.innerHTML = '';

  if (!items || !items.length){
    const p = el('p', 'nota');
    p.textContent = 'Pronto subimos más productos ✨';
    container.appendChild(p);
    return;
  }

  items.forEach(it => {
    const card = el('article', 'card');
    const imgW = el('div', 'card-img');
    const info = el('div', 'card-info');
    const acts = el('div', 'card-actions');

    const img = el('img');
    img.loading = 'lazy';
    img.src = it.image || 'img/hero-placeholder.svg';
    img.alt = it.title || 'Producto';
    imgW.appendChild(img);

    const h3  = el('h3');
    h3.textContent = it.title || 'Producto';
    const meta = el('p', 'card-meta');
    const metaTags = (it.tags || []).join(' · ');
    meta.textContent = metaTags + (it.price ? (metaTags ? ' · ' : '') + it.price : '');

    const btn = el('a', 'btn');
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.href = it.whatsapp || ('https://wa.me/5491167286443?text=' + encodeURIComponent('Hola! Me interesa: ' + (it.title || 'un producto')));
    btn.textContent = 'Pedir por WhatsApp';

    info.appendChild(h3);
    info.appendChild(meta);
    acts.appendChild(btn);

    card.appendChild(imgW);
    card.appendChild(info);
    card.appendChild(acts);
    container.appendChild(card);
  });
}

// ---------- Render específicos ----------
function renderProducts(items){
  renderCards($id('products'), items);
}
function renderCombos(items){
  renderCards($id('combos-list'), items);
}
function renderGallery(items){
  const wrap = $id('gallery');
  if (!wrap || !items || !items.length) return;
  wrap.innerHTML = '';
  items.forEach(it => {
    const fig = el('figure', 'gal-item');
    const img = el('img');
    img.loading = 'lazy';
    img.src = it.image;
    img.alt = it.alt || 'Trabajo';
    fig.appendChild(img);
    if (it.alt){
      const cap = el('figcaption');
      cap.textContent = it.alt;
      fig.appendChild(cap);
    }
    wrap.appendChild(fig);
  });
}

// ---------- Boot principal ----------
async function boot(){
  const [
    settings = DEFAULTS.settings,
    products = DEFAULTS.products,
    combos   = DEFAULTS.combos,
    gallery  = DEFAULTS.gallery
  ] = await Promise.all([
    getJSON(DATA.settings, DEFAULTS.settings),
    getJSON(DATA.products, DEFAULTS.products),
    getJSON(DATA.combos,   DEFAULTS.combos),
    getJSON(DATA.gallery,  DEFAULTS.gallery)
  ]);

  // Links y textos (con chequeos de existencia)
  setHref('cta-whatsapp', settings.whatsapp_link);
  setHref('cta-instagram', settings.instagram);
  setHref('footer-whatsapp', settings.whatsapp_link);

  const emailEl = $id('footer-email');
  if (emailEl && settings.email){
    emailEl.href = `mailto:${settings.email}`;
    if (!emailEl.textContent.trim()) emailEl.textContent = settings.email;
  }
  setHref('footer-ig', settings.instagram);

  setHTML('hero-title', settings.hero_title);
  setText('hero-sub',  settings.hero_sub);

  // Render
  renderProducts(products);
  renderCombos(combos);
  renderGallery(gallery);

  // Tracking simple de clics (opcional)
  ['cta-whatsapp','footer-whatsapp'].forEach(id=>{
    const a = $id(id);
    if (a) a.addEventListener('click', ()=> {
      if (window.gtag) gtag('event','click', {event_category:'cta', event_label:id});
    });
  });
  const ig = $id('cta-instagram');
  if (ig) ig.addEventListener('click', ()=> {
    if (window.gtag) gtag('event','click', {event_category:'cta', event_label:'cta-instagram'});
  });
}

// Ejecutar cuando el DOM esté listo (por si quitan "defer" del script)
if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
