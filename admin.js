let editingId = null;
function adminTexts(){
  const t = getText();
  document.getElementById('dashTitle').textContent = t.dashboard;
  document.getElementById('logoutBtn').textContent = t.logout;
  document.getElementById('formTitle').textContent = editingId ? t.edit : t.addProduct;
  document.getElementById('nameAr').placeholder = t.productName + ' (AR)';
  document.getElementById('nameKu').placeholder = t.productName + ' (KU)';
  document.getElementById('price').placeholder = t.price;
  document.getElementById('image').placeholder = t.image;
  document.getElementById('descAr').placeholder = t.description + ' (AR)';
  document.getElementById('descKu').placeholder = t.description + ' (KU)';
  document.getElementById('featuresAr').placeholder = t.featuresField + ' (AR)';
  document.getElementById('featuresKu').placeholder = t.featuresField + ' (KU)';
  document.getElementById('sizes').placeholder = t.sizesField;
  document.getElementById('rating').placeholder = t.ratingField;
  document.getElementById('saveBtn').textContent = editingId ? t.save : t.addProduct;
  document.getElementById('cancelBtn').textContent = t.cancel;
  document.getElementById('themeToggle').textContent = xrGetTheme()==='dark' ? t.themeLight : t.themeDark;
  document.getElementById('langToggle').textContent = t.lang;
}
function categoryOptions(selected='coolers'){
  return Object.entries(XR_CATEGORIES).filter(([k])=>k!=='all').map(([k,v])=>`<option value="${k}" ${selected===k?'selected':''}>${v[xrGetLang()]}</option>`).join('');
}
function renderStats(){
  const products = xrGetProducts();
  const cart = xrGetCart();
  const avg = products.length ? products.reduce((a,b)=>a+Number(b.price),0)/products.length : 0;
  const top = products.length ? Math.max(...products.map(x=>Number(x.rating))) : 0;
  const t = getText();
  document.getElementById('kpis').innerHTML = `
    <div class="kpi"><strong>${products.length}</strong><span>${t.statsProducts}</span></div>
    <div class="kpi"><strong>${cart.reduce((a,b)=>a+b.qty,0)}</strong><span>${t.statsCart}</span></div>
    <div class="kpi"><strong>$${avg.toFixed(2)}</strong><span>${t.statsAvg}</span></div>
    <div class="kpi"><strong>${top.toFixed(1)}</strong><span>${t.statsTop}</span></div>`;
}
function renderTable(){
  const products = xrGetProducts();
  const t = getText();
  document.getElementById('productsTable').innerHTML = `
    <div class="card p16 table-wrap">
      <table>
        <thead><tr><th>ID</th><th>${t.productName}</th><th>${t.category}</th><th>${t.price}</th><th>${t.rating}</th><th>${t.actions}</th></tr></thead>
        <tbody>
          ${products.map(p=>`<tr>
            <td>${p.id}</td>
            <td>${xrGetLang()==='ar'?p.name_ar:p.name_ku}</td>
            <td>${xrCategoryLabel(p.category)}</td>
            <td>$${Number(p.price).toFixed(2)}</td>
            <td>${p.rating}</td>
            <td>
              <div class="row">
                <button class="btn" onclick="startEdit(${p.id})">${t.edit}</button>
                <button class="btn btn-danger" onclick="deleteProduct(${p.id})">${t.delete}</button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}
function resetForm(){
  editingId = null;
  document.getElementById('productForm').reset();
  document.getElementById('category').innerHTML = categoryOptions();
  adminTexts();
}
function startEdit(id){
  const p = xrGetProducts().find(x=>x.id===id); if(!p) return;
  editingId = id;
  document.getElementById('nameAr').value = p.name_ar;
  document.getElementById('nameKu').value = p.name_ku;
  document.getElementById('category').innerHTML = categoryOptions(p.category);
  document.getElementById('price').value = p.price;
  document.getElementById('image').value = p.image;
  document.getElementById('descAr').value = p.description_ar;
  document.getElementById('descKu').value = p.description_ku;
  document.getElementById('featuresAr').value = p.features_ar.join(', ');
  document.getElementById('featuresKu').value = p.features_ku.join(', ');
  document.getElementById('sizes').value = p.sizes;
  document.getElementById('rating').value = p.rating;
  adminTexts();
  window.scrollTo({top:0, behavior:'smooth'});
}
function deleteProduct(id){
  const products = xrGetProducts().filter(x=>x.id!==id);
  xrSaveProducts(products); renderTable(); renderStats(); if(editingId===id) resetForm();
}
function saveProduct(e){
  e.preventDefault();
  const data = {
    id: editingId || Date.now(),
    name_ar: document.getElementById('nameAr').value.trim(),
    name_ku: document.getElementById('nameKu').value.trim(),
    category: document.getElementById('category').value,
    price: Number(document.getElementById('price').value),
    image: document.getElementById('image').value.trim(),
    description_ar: document.getElementById('descAr').value.trim(),
    description_ku: document.getElementById('descKu').value.trim(),
    features_ar: document.getElementById('featuresAr').value.split(',').map(x=>x.trim()).filter(Boolean),
    features_ku: document.getElementById('featuresKu').value.split(',').map(x=>x.trim()).filter(Boolean),
    sizes: document.getElementById('sizes').value.trim(),
    rating: Number(document.getElementById('rating').value || 4)
  };
  const products = xrGetProducts();
  const idx = products.findIndex(x=>x.id===data.id);
  if(idx>-1) products[idx]=data; else products.unshift(data);
  xrSaveProducts(products);
  resetForm(); renderTable(); renderStats();
}

document.addEventListener('DOMContentLoaded', ()=>{
  ensureAdminAuth(); xrApplyTheme(); renderHeader();
  document.getElementById('category').innerHTML = categoryOptions();
  document.getElementById('logoutBtn').onclick = ()=>{ localStorage.removeItem('xr-admin-auth'); location.href='login.html'; };
  document.getElementById('themeToggle').onclick = ()=>{ xrToggleTheme(); adminTexts(); };
  document.getElementById('langToggle').onclick = ()=>{ xrSetLang(xrGetLang()==='ar'?'ku':'ar'); location.reload(); };
  document.getElementById('productForm').addEventListener('submit', saveProduct);
  document.getElementById('cancelBtn').addEventListener('click', resetForm);
  resetForm(); renderTable(); renderStats();
});
