function renderCart(){
  const t = getText();
  document.getElementById('cartTitle').textContent = t.cart;
  document.getElementById('continueBtn').textContent = t.continue;
  const cart = xrGetCart();
  const products = xrGetProducts();
  const box = document.getElementById('cartBox');
  if(!cart.length){ box.innerHTML = `<div class="card empty">${t.emptyCart}</div>`; document.getElementById('cartTotal').textContent = `$0.00`; return; }
  let total = 0;
  box.innerHTML = `
    <div class="card p16 table-wrap">
      <table>
        <thead><tr><th>${t.productName}</th><th>${t.price}</th><th>${t.qty}</th><th>${t.total}</th><th>${t.actions}</th></tr></thead>
        <tbody>
          ${cart.map(item=>{
            const p = products.find(x=>x.id===item.id); if(!p) return '';
            const name = xrGetLang()==='ar'?p.name_ar:p.name_ku;
            const rowTotal = p.price*item.qty; total += rowTotal;
            return `<tr>
              <td>${name}</td>
              <td>$${p.price.toFixed(2)}</td>
              <td>
                <div class="row">
                  <button class="chip" onclick="changeQty(${p.id},-1)">-</button>
                  <span>${item.qty}</span>
                  <button class="chip" onclick="changeQty(${p.id},1)">+</button>
                </div>
              </td>
              <td>$${rowTotal.toFixed(2)}</td>
              <td><button class="btn btn-danger" onclick="removeItem(${p.id})">${t.remove}</button></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
  document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
}
function changeQty(id, diff){
  let cart = xrGetCart();
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += diff;
  cart = cart.filter(x=>x.qty>0);
  xrSaveCart(cart); renderCart(); updateHeaderTexts();
}
function removeItem(id){ let cart=xrGetCart().filter(x=>x.id!==id); xrSaveCart(cart); renderCart(); updateHeaderTexts(); }

document.addEventListener('DOMContentLoaded', ()=>{ xrApplyTheme(); renderHeader(); renderCart(); });
