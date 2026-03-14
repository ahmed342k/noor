function getId(){ return Number(new URLSearchParams(location.search).get('id')); }
function renderProductPage(){
  const t = getText();
  const id = getId();
  const products = xrGetProducts();
  const product = products.find(p=>p.id===id) || products[0];
  const lang = xrGetLang();
  const name = lang==='ar'?product.name_ar:product.name_ku;
  const desc = lang==='ar'?product.description_ar:product.description_ku;
  const features = lang==='ar'?product.features_ar:product.features_ku;
  document.title = `XR - ${name}`;
  document.getElementById('pName').textContent = name;
  document.getElementById('pPrice').textContent = `$${Number(product.price).toFixed(2)}`;
  document.getElementById('pRating').innerHTML = `${xrStars(product.rating)} <span class="muted">(${product.rating})</span>`;
  document.getElementById('pDesc').textContent = desc;
  document.getElementById('pImage').src = product.image;
  document.getElementById('pImage').alt = name;
  document.getElementById('addBtn').textContent = t.add;
  document.getElementById('featuresTitle').textContent = t.productFeatures;
  document.getElementById('sizesTitle').textContent = t.sizes;
  document.getElementById('similarTitle').textContent = t.similar;
  document.getElementById('featuresList').innerHTML = features.map(f=>`<span class="tag">${f}</span>`).join('');
  document.getElementById('sizesText').textContent = product.sizes || '-';
  document.getElementById('addBtn').onclick = ()=> xrAddToCart(product.id);
  const similar = products.filter(p=>p.category===product.category && p.id!==product.id).slice(0,4);
  document.getElementById('similar').innerHTML = similar.map(productCard).join('');
}

document.addEventListener('DOMContentLoaded', ()=>{ xrApplyTheme(); renderHeader(); renderProductPage(); });
