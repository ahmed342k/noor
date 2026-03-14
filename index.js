let state = { category:'all', search:'', minPrice:'', minRating:'', sort:'default' };

function applyTexts(){
  const t = getText();
  document.title = 'XR Store';
  document.getElementById('heroBadge').textContent = t.heroBadge;
  document.getElementById('heroTitle').textContent = t.heroTitle;
  document.getElementById('heroText').textContent = t.heroText;
  document.getElementById('shopBtn').textContent = t.shopNow;
  document.getElementById('latestBtn').textContent = t.latest;
  document.getElementById('bestTitle').textContent = t.bestSelling;
  document.getElementById('bestText').textContent = t.whyXRText;
  document.getElementById('secTitle').textContent = t.products;
  document.getElementById('secSub').textContent = t.filters;
  document.getElementById('searchInput').placeholder = t.search;
  document.getElementById('minPrice').placeholder = t.minPrice;
  document.getElementById('minRating').placeholder = t.minRating;
  document.getElementById('sortBy').innerHTML = `
    <option value="default">${t.sortDefault}</option>
    <option value="price-asc">${t.sortPriceAsc}</option>
    <option value="price-desc">${t.sortPriceDesc}</option>
    <option value="rating">${t.sortRating}</option>`;
  document.getElementById('seoTitle').textContent = t.seo;
  document.getElementById('seoText').textContent = t.seoText;
  document.getElementById('ft1').textContent = t.freeShipping;
  document.getElementById('ft2').textContent = t.secure;
  document.getElementById('ft3').textContent = t.support;
  document.getElementById('footerText').textContent = t.footer;
}

function renderCategories(){
  const wrap = document.getElementById('categories');
  wrap.innerHTML = Object.keys(XR_CATEGORIES).map(key =>
    `<button class="chip ${state.category===key?'active':''}" onclick="setCategory('${key}')">${xrCategoryLabel(key)}</button>`
  ).join('');
}
function setCategory(key){ state.category = key; renderCategories(); renderProducts(); }

function renderProducts(){
  const t = getText();
  let products = xrGetProducts();
  const q = state.search.trim().toLowerCase();
  const lang = xrGetLang();
  products = products.filter(p => {
    const name = (lang==='ar'?p.name_ar:p.name_ku).toLowerCase();
    const desc = (lang==='ar'?p.description_ar:p.description_ku).toLowerCase();
    return (state.category==='all'||p.category===state.category)
      && (!q || name.includes(q) || desc.includes(q))
      && (!state.minPrice || Number(p.price) >= Number(state.minPrice))
      && (!state.minRating || Number(p.rating) >= Number(state.minRating));
  });
  if(state.sort==='price-asc') products.sort((a,b)=>a.price-b.price);
  if(state.sort==='price-desc') products.sort((a,b)=>b.price-a.price);
  if(state.sort==='rating') products.sort((a,b)=>b.rating-a.rating);
  const box = document.getElementById('products');
  box.innerHTML = products.length ? products.map(productCard).join('') : `<div class="card empty">${t.noProducts}</div>`;
}

document.addEventListener('DOMContentLoaded', ()=>{
  xrApplyTheme();
  renderHeader();
  applyTexts();
  renderCategories();
  renderProducts();
  document.getElementById('searchInput').addEventListener('input', e=>{ state.search=e.target.value; renderProducts(); });
  document.getElementById('minPrice').addEventListener('input', e=>{ state.minPrice=e.target.value; renderProducts(); });
  document.getElementById('minRating').addEventListener('input', e=>{ state.minRating=e.target.value; renderProducts(); });
  document.getElementById('sortBy').addEventListener('change', e=>{ state.sort=e.target.value; renderProducts(); });
  document.getElementById('shopBtn').onclick=()=>document.getElementById('productsSection').scrollIntoView({behavior:'smooth'});
  document.getElementById('latestBtn').onclick=()=>{ state.sort='default'; document.getElementById('sortBy').value='default'; renderProducts(); document.getElementById('productsSection').scrollIntoView({behavior:'smooth'}); };
});
