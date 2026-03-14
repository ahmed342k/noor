function applyLoginTexts(){
  const t = getText();
  document.getElementById('loginTitle').textContent = t.loginTitle;
  document.getElementById('userField').placeholder = t.username;
  document.getElementById('passField').placeholder = t.password;
  document.getElementById('loginBtn').textContent = t.loginBtn;
  document.getElementById('loginHint').textContent = t.loginHint;
  document.getElementById('themeToggle').textContent = xrGetTheme()==='dark' ? t.themeLight : t.themeDark;
  document.getElementById('langToggle').textContent = t.lang;
}
function doLogin(e){
  e.preventDefault();
  const user = document.getElementById('userField').value.trim();
  const pass = document.getElementById('passField').value.trim();
  if(user === 'xradmin' && pass === '123456'){
    localStorage.setItem('xr-admin-auth','1');
    location.href='admin.html';
  } else alert(getText().wrongLogin);
}
document.addEventListener('DOMContentLoaded', ()=>{
  xrApplyTheme();
  applyLoginTexts();
  document.getElementById('themeToggle').onclick = ()=>{ xrToggleTheme(); applyLoginTexts(); };
  document.getElementById('langToggle').onclick = ()=>{ xrSetLang(xrGetLang()==='ar'?'ku':'ar'); location.reload(); };
  document.getElementById('loginForm').addEventListener('submit', doLogin);
});
