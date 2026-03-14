function xrGetLang(){ return localStorage.getItem('xr-lang') || 'ar'; }
function xrSetLang(lang){ localStorage.setItem('xr-lang', lang); }
function xrGetTheme(){ return localStorage.getItem('xr-theme') || 'light'; }
function xrApplyTheme(){ if(xrGetTheme()==='dark') document.body.classList.add('dark'); else document.body.classList.remove('dark'); }
function xrToggleTheme(){ const next = xrGetTheme()==='dark' ? 'light' : 'dark'; localStorage.setItem('xr-theme', next); xrApplyTheme(); updateHeaderTexts?.(); }
function xrGetProducts(){
  const saved = localStorage.getItem('xr-products');
  if(saved){ try { return JSON.parse(saved); } catch(e){} }
  localStorage.setItem('xr-products', JSON.stringify(XR_DEFAULT_PRODUCTS));
  return [...XR_DEFAULT_PRODUCTS];
}
function xrSaveProducts(products){ localStorage.setItem('xr-products', JSON.stringify(products)); }
function xrGetCart(){ const c = localStorage.getItem('xr-cart'); return c ? JSON.parse(c) : []; }
function xrSaveCart(cart){ localStorage.setItem('xr-cart', JSON.stringify(cart)); updateCartCount?.(); }
function xrAddToCart(id){
  const cart = xrGetCart();
  const item = cart.find(x => x.id === id);
  if(item) item.qty += 1; else cart.push({id, qty:1});
  xrSaveCart(cart);
  alert(getText().addedToCart);
}
function xrGetTextSet(){
  return {
    ar: {
      brandSub:'متجر متعدد للإكسسوارات والأجهزة البسيطة', home:'الرئيسية', about:'من نحن', contact:'اتصل بنا', privacy:'الخصوصية', terms:'الشروط', admin:'الإدارة', login:'تسجيل الدخول',
      heroBadge:'متجر XR المتنوع', heroTitle:'واجهة متجر فخمة لبيع الإكسسوارات والأجهزة البسيطة', heroText:'من مبردات الهاتف إلى الكفرات والسماعات والشواحن، متجر XR مصمم بشكل أنيق وسهل التطوير.',
      shopNow:'تسوق الآن', latest:'وصل حديثاً', categories:'الأقسام', products:'المنتجات', filters:'الفلاتر', all:'الكل', search:'بحث عن منتج...',
      minPrice:'أقل سعر', minRating:'أقل تقييم', sort:'الترتيب', sortDefault:'الأحدث', sortPriceAsc:'الأرخص', sortPriceDesc:'الأغلى', sortRating:'الأعلى تقييماً',
      add:'أضف للسلة', details:'التفاصيل', addedToCart:'تمت إضافة المنتج إلى السلة', noProducts:'لا توجد منتجات مطابقة.',
      bestSelling:'الأكثر مبيعاً', newArrival:'وصل حديثاً', whyXR:'لماذا XR؟', whyXRText:'تصميم حديث، فلاتر، لغتان، وضع ليلي، وسهولة تطوير إلى متجر حقيقي.',
      freeShipping:'شحن منظم', secure:'واجهة مرتبة', support:'دعم أساسي',
      productFeatures:'المميزات', sizes:'المقاسات', similar:'منتجات مشابهة', rating:'التقييم', price:'السعر',
      cart:'السلة', total:'المجموع', emptyCart:'السلة فارغة حالياً.', remove:'حذف', qty:'الكمية', continue:'متابعة التسوق',
      loginTitle:'تسجيل دخول الإدارة', username:'اسم المستخدم', password:'كلمة السر', loginBtn:'دخول', loginHint:'بيانات التجربة الافتراضية: xradmin / 123456', wrongLogin:'اسم المستخدم أو كلمة السر غير صحيحين',
      dashboard:'لوحة تحكم XR', logout:'تسجيل خروج', addProduct:'إضافة منتج', edit:'تعديل', delete:'حذف', save:'حفظ', cancel:'إلغاء', image:'رابط الصورة', category:'القسم', description:'وصف بسيط',
      featuresField:'المميزات (افصل بين كل ميزة بفاصلة)', sizesField:'المقاسات إن وجدت', ratingField:'التقييم', actions:'الإجراءات', productName:'اسم المنتج', statsProducts:'المنتجات', statsCart:'عناصر السلة', statsAvg:'متوسط السعر', statsTop:'أعلى تقييم',
      seo:'صفحات أساسية لثقة الموقع', seoText:'تم تضمين صفحات من نحن واتصل بنا والخصوصية والشروط وملفات robots.txt و sitemap.xml.',
      footer:'XR Store - واجهة متجر متعددة قابلة للتطوير',
      lang:'العربية / کوردی', themeDark:'🌙 الوضع الليلي', themeLight:'☀️ الوضع النهاري'
    },
    ku: {
      brandSub:'فرۆشگایەکی هەمەجۆر بۆ ئاکسسوار و ئامێری سادە', home:'سەرەکی', about:'دەربارەی ئێمە', contact:'پەیوەندی', privacy:'تایبەتمەندی', terms:'مەرجەکان', admin:'ئیدارە', login:'چوونەژوورەوە',
      heroBadge:'فرۆشگای هەمەجۆری XR', heroTitle:'ڕووکاری فرۆشگایەکی لوکس بۆ ئاکسسوار و ئامێری سادە', heroText:'لە ساردکەرەوەی مۆبایل تا کاڤەر و گوێگرە و شارجەر، XR بە شێوەیەکی جوان و ئاسان بۆ پەرەپێدان دیزاین کراوە.',
      shopNow:'دەستپێکردنی کڕین', latest:'نوێ هاتوو', categories:'بەشەکان', products:'بەرهەمەکان', filters:'فلتەرەکان', all:'هەموو', search:'گەڕان بە دوای بەرهەم...',
      minPrice:'کەمترین نرخ', minRating:'کەمترین هەڵسەنگاندن', sort:'ڕیزکردن', sortDefault:'نوێترین', sortPriceAsc:'هەرزانترین', sortPriceDesc:'گرانترین', sortRating:'بەرزترین هەڵسەنگاندن',
      add:'زیادکردن بۆ سەبەتە', details:'وردەکاری', addedToCart:'بەرهەمەکە زیادکرا بۆ سەبەتە', noProducts:'هیچ بەرهەمێکی گونجاو نییە.',
      bestSelling:'زۆرترین فرۆشراو', newArrival:'نوێ هاتوو', whyXR:'بۆچی XR؟', whyXRText:'دیزاینی نوێ، فلتەر، دوو زمان، دۆخی شەو، و ئاسانی پەرەپێدان بۆ فرۆشگایەکی ڕاستەقینە.',
      freeShipping:'گواستنەوەی ڕێکوپێک', secure:'ڕووکاری ڕێکخراو', support:'یارمەتی بنەڕەتی',
      productFeatures:'تایبەتمەندییەکان', sizes:'قەبارەکان', similar:'بەرهەمی هاوشێوە', rating:'هەڵسەنگاندن', price:'نرخ',
      cart:'سەبەتە', total:'کۆی گشتی', emptyCart:'سەبەتەکە بەتاڵە.', remove:'سڕینەوە', qty:'ژمارە', continue:'بەردەوامبوون لە کڕین',
      loginTitle:'چوونەژوورەوەی ئیدارە', username:'ناوی بەکارهێنەر', password:'وشەی نهێنی', loginBtn:'چوونەژوورەوە', loginHint:'زانیارییەکانی تاقیکردنەوە: xradmin / 123456', wrongLogin:'ناوی بەکارهێنەر یان وشەی نهێنی هەڵەیە',
      dashboard:'داشبۆردی XR', logout:'چوونەدەرەوە', addProduct:'زیادکردنی بەرهەم', edit:'دەستکاریکردن', delete:'سڕینەوە', save:'پاشەکەوت', cancel:'هەڵوەشاندنەوە', image:'لینکی وێنە', category:'بەش', description:'وەسفی کورت',
      featuresField:'تایبەتمەندییەکان (بە کۆما جیا بکەرەوە)', sizesField:'قەبارەکان ئەگەر هەبوو', ratingField:'هەڵسەنگاندن', actions:'کردارەکان', productName:'ناوی بەرهەم', statsProducts:'بەرهەمەکان', statsCart:'توخمەکانی سەبەتە', statsAvg:'ناوەندی نرخ', statsTop:'بەرزترین هەڵسەنگاندن',
      seo:'لاپەڕە بنەڕەتییەکان بۆ متمانەی وێبگە', seoText:'لاپەڕەکانی دەربارەی ئێمە، پەیوەندی، تایبەتمەندی و مەرجەکان لەگەڵ robots.txt و sitemap.xml دانراون.',
      footer:'XR Store - ڕووکاری فرۆشگایەکی هەمەجۆر و ئامادە بۆ پەرەپێدان',
      lang:'العربية / کوردی', themeDark:'🌙 دۆخی شەو', themeLight:'☀️ دۆخی ڕۆژ'
    }
  };
}
function getText(){ return xrGetTextSet()[xrGetLang()]; }
function xrStars(r){
  const rounded = Math.round(r);
  return '★'.repeat(rounded) + '☆'.repeat(5-rounded);
}
function xrCategoryLabel(key){ const lang = xrGetLang(); return XR_CATEGORIES[key]?.[lang] || key; }
function updateHeaderTexts(){
  const t = getText();
  const themeBtn = document.getElementById('themeToggle');
  const langBtn = document.getElementById('langToggle');
  if(themeBtn) themeBtn.textContent = xrGetTheme()==='dark' ? t.themeLight : t.themeDark;
  if(langBtn) langBtn.textContent = t.lang;
  const cartBtn = document.getElementById('cartToggle');
  if(cartBtn) cartBtn.innerHTML = `🛒 ${t.cart} (<span id="cartCount">${xrGetCart().reduce((a,b)=>a+b.qty,0)}</span>)`;
}
function updateCartCount(){
  const el = document.getElementById('cartCount');
  if(el) el.textContent = xrGetCart().reduce((a,b)=>a+b.qty,0);
}
function renderHeader(active='home'){
  const t = getText();
  document.getElementById('siteHeader').innerHTML = `
    <div class="container nav">
      <div class="brand">
        <div class="logo">XR</div>
        <div class="brand-copy">
          <h1>XR</h1>
          <p>${t.brandSub}</p>
        </div>
      </div>
      <div class="nav-links">
        <a class="nav-link" href="index.html">${t.home}</a>
        <a class="nav-link" href="about.html">${t.about}</a>
        <a class="nav-link" href="contact.html">${t.contact}</a>
        <a class="nav-link" href="login.html">${t.login}</a>
      </div>
      <div class="nav-actions">
        <button class="icon-btn" id="langToggle"></button>
        <button class="icon-btn" id="themeToggle"></button>
        <a class="btn btn-primary" id="cartToggle" href="cart.html"></a>
      </div>
    </div>`;
  document.getElementById('themeToggle').onclick = xrToggleTheme;
  document.getElementById('langToggle').onclick = ()=>{ xrSetLang(xrGetLang()==='ar'?'ku':'ar'); location.reload(); };
  updateHeaderTexts();
}
function productCard(product){
  const lang = xrGetLang(); const t = getText();
  const name = lang==='ar' ? product.name_ar : product.name_ku;
  const desc = lang==='ar' ? product.description_ar : product.description_ku;
  return `
    <article class="card product">
      <div class="product-media"><img src="${product.image}" alt="${name}"></div>
      <div class="product-body">
        <div class="product-top">
          <strong>${name}</strong>
          <span class="price">$${Number(product.price).toFixed(2)}</span>
        </div>
        <div class="rating">${xrStars(product.rating)} <span class="muted small">(${product.rating})</span></div>
        <div class="product-desc">${desc}</div>
        <div class="actions">
          <button class="btn btn-primary" onclick="xrAddToCart(${product.id})">${t.add}</button>
          <a class="btn" href="product.html?id=${product.id}">${t.details}</a>
        </div>
      </div>
    </article>`;
}
function ensureAdminAuth(){ if(localStorage.getItem('xr-admin-auth') !== '1') location.href = 'login.html'; }
