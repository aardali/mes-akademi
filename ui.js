'use strict';
/* MES Akademi — core/ui */
/* ---------- MODAL ---------- */
function modal(title,fields,ok){const d=document.createElement('div');d.className='ov';d.innerHTML=`<div class="md"><h3>${title}</h3>${fields.map(f=>`<label>${f.l}</label>${f.o?`<select id="f_${f.n}">${f.o.map(o=>`<option ${o==f.v?'selected':''}>${o}</option>`)}</select>`:`<input id="f_${f.n}" type="${f.t||'text'}" value="${f.v==null?'':f.v}">`}`).join('')}
 <div class="bar" style="margin-top:12px"><button class="p" id="mok">Kaydet</button><button id="mc">İptal</button></div></div>`;document.body.appendChild(d);
 $('#mc').onclick=()=>d.remove();$('#mok').onclick=()=>{const v={};fields.forEach(f=>{let x=$('#f_'+f.n).value;v[f.n]=f.t=='number'?parseFloat(x):x});const e=ok(v);if(e)toast(e);else{d.remove();save();go()}}}
function guard(m,x){if(!can(m,x)){toast('Bu işlem için yetkiniz yok ('+PERM[x]+').');return false}return true}
