// Carga de datos desde /data y render dinámico
const DATA = {
  settings: '/data/texts.json',
  products: '/data/products.json',
  combos: '/data/combos.json',
  gallery: '/data/gallery.json'
};

async function getJSON(url){
  const res = await fetch(url, { cache: 'no-store' });
  return res.json();
}

function el(tag, attrs={}, children=[]){
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k,v]) => {
    if (k === 'class') n.className = v;
    else if (k === 'html') n.innerHTML = v;
    else n.setAttribute(k, v);
  });
  (Array.isArray(children) ? children : [children]).forEach(c => {
    if (!c) return;
    if (typeof c === 'string') n.appendChild(document.createTextNode(c));
    else n.appendChild(c);
  });
  return n;
}

function renderProducts(data){
  const list = Array.isArray(data) ? data : (data?.items || []);
  const wrap = document.getElementById('products');
  wrap.innerHTML = '';
  list.forEach(p => {
    wrap.appendChild(
      el('article', {class:'card'}, [
        el('img', {src: p.image || 'img/card-topper.svg', alt: p.title || 'Producto'}),
        el('h3', {}, p.title || 'Producto'),
        el('p', {}, p.description || ''),
        el('p', {class:'desde'}, `Desde ${p.price_from ? '$ ' + p.price_from : '$ —'}`)
      ])
    );
  });
}

function renderCombos(data){
  const list = Array.isArray(data) ? data : (data?.items || []);
  const wrap = document.getElementById('combos-list');
  wrap.innerHTML = '';
  list.forEach(c => {
    wrap.appendChild(
      el('article', {class:'card'}, [
        el('img', {src: c.image || 'img/card-bags.svg', alt: c.title || 'Combo'}),
        el('h3', {}, c.title || 'Combo'),
        el('ul', {}, (c.items || []).map(i => el('li', {}, typeof i === 'string' ? i : String(i)))),
        el('p', {class:'desde'}, `Precio ${c.price ? '$ ' + c.price : 'consultar'}`)
      ])
    );
  });
}

function renderGallery(data){
  const list = Array.isArray(data) ? data : (data?.items || []);
  const wrap = document.getElementById('gallery');
  wrap.innerHTML = '';
  list.forEach(g => {
    wrap.appendChild(el('img', {src: g.src, alt: g.alt || 'Galería'}));
  });
}

async function boot(){
  const [settings, products, combos, gallery] = await Promise.all([
    getJSON(DATA.settings),
    getJSON(DATA.products),
    getJSON(DATA.combos),
    getJSON(DATA.gallery)
  ]);

  // Links y textos
  document.getElementById('cta-whatsapp').href = settings.whatsapp_link;
  document.getElementById('cta-instagram').href = settings.instagram;
  document.getElementById('footer-whatsapp').href = settings.whatsapp_link;
  document.getElementById('footer-email').href = `mailto:${settings.email}`;
  document.getElementById('footer-ig').href = settings.instagram;

  if (settings.hero_title) document.getElementById('hero-title').innerHTML = settings.hero_title;
  if (settings.hero_sub) document.getElementById('hero-sub').textContent = settings.hero_sub;

  renderProducts(products);
  renderCombos(combos);
  renderGallery(gallery);
}

document.addEventListener('DOMContentLoaded', boot);
