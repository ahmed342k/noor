document.addEventListener('DOMContentLoaded', ()=>{
  xrApplyTheme();
  renderHeader();
  document.getElementById('pageTitle').textContent = document.body.dataset.title || 'XR';
  updateHeaderTexts();
});
