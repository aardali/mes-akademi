'use strict';
/* MES Akademi — modules/permissions */
const LV=['Yetkisiz','Eğitimde','Yetkili','Uzman'];
function check(opn,mk,oid){const p=DB.people.find(x=>x.no==opn),m=DB.machines.find(x=>x.kod==mk);
 if(!p||!p.aktif)return opn+' aktif bir personel değildir.';if(!m||!m.aktif)return mk+' makinesi pasiftir.';
 const a=DB.auth[opn+'|'+mk];if(!a||a.lvl<2)return opn+', '+mk+' makinesinde çalışma yetkisine sahip değildir'+(a&&a.lvl==1?' (eğitimde)':'')+'. Lütfen yetkili operatör seçiniz.';
 const d=now().slice(0,10);if(a.bts<d||a.bit>d)return opn+' için '+mk+' yetki tarihi geçerli değildir.';
 const b=DB.orders.find(o=>o.mak==mk&&o.id!=oid&&['Üretimde','Duraklatıldı'].includes(o.dur));if(b)return mk+' makinesi '+b.id+' üretim emrinde meşgul.';return''}
P.matrix=function(){const ed=can('matrix','e');return`<div class="card"><div class="tw"><table><tr><th>Personel</th>${DB.machines.map(m=>`<th>${m.kod}</th>`).join('')}</tr>${DB.people.map(p=>`<tr><td>${p.no}</td>${DB.machines.map(m=>{const a=DB.auth[p.no+'|'+m.kod];return`<td>${ed?`<select onchange="setAuth('${p.no}','${m.kod}',this.value)">${LV.map((l,i)=>`<option value="${i}" ${a.lvl==i?'selected':''}>${l}</option>`)}</select><button title="Detay" onclick="authDet('${p.no}','${m.kod}')">ⓘ</button>`:LV[a.lvl]}</td>`}).join('')}</tr>`).join('')}</table></div></div>
 <div class="card"><b>Rapor:</b> Makine başına yetkili/uzman operatör sayısı: ${DB.machines.map(m=>m.kod+'='+DB.people.filter(p=>DB.auth[p.no+'|'+m.kod].lvl>=2).length).join(', ')}<br>Eğitimde: ${DB.people.map(p=>p.no+': '+DB.machines.filter(m=>DB.auth[p.no+'|'+m.kod].lvl==1).map(m=>m.kod).join('/')).filter(s=>!s.endsWith(': ')).join(' · ')}</div>`};
function setAuth(p,m,l){if(!guard('matrix','e'))return;const a=DB.auth[p+'|'+m],o=a.lvl;a.lvl=+l;log('matrix','Yetki Matrisi','Kayıt güncelleme',p+'|'+m,LV[o],LV[a.lvl],p+' / '+m+' yetkisi değişti');toast('Yetki güncellendi.',1)}

function authDet(p,m){if(!guard('matrix','e'))return;const a=DB.auth[p+'|'+m];modal(p+' / '+m+' yetki kaydı',[{n:'l',l:'Yetkinlik seviyesi',o:LV,v:LV[a.lvl]},{n:'b',l:'Yetki başlangıç',t:'date',v:a.bit},{n:'s',l:'Yetki bitiş',t:'date',v:a.bts},{n:'e',l:'Eğitimi veren',v:a.egt},{n:'c',l:'Sertifika bilgisi',v:a.ser},{n:'k',l:'Açıklama',v:a.ack}],v=>{if(v.b&&v.s&&v.s<v.b)return'Bitiş tarihi başlangıçtan önce olamaz.';const old={...a};Object.assign(a,{lvl:LV.indexOf(v.l),bit:v.b,bts:v.s,egt:v.e,ser:v.c,ack:v.k});log('matrix','Yetki Matrisi','Kayıt güncelleme',p+'|'+m,old,a,'Yetki detayı güncellendi')})}
function authReports(){const t=now().slice(0,10),E=Object.entries(DB.auth).map(([k,a])=>({p:k.split('|')[0],m:k.split('|')[1],a}));
 const none=DB.people.filter(p=>!E.some(e=>e.p==p.no&&e.a.lvl>=2)).map(p=>p.no),tr=DB.people.map(p=>[p.no,E.filter(e=>e.p==p.no&&e.a.lvl==1).map(e=>e.m)]).filter(x=>x[1].length),ex=E.filter(e=>e.a.lvl>=1&&e.a.bts&&e.a.bts<t).map(e=>e.p+'/'+e.m);
 return`<div class="card"><b>Yetkinlik raporları</b><p>Hiçbir makinede çalışma yetkisi olmayan personel: ${none.join(', ')||'—'}</p><p>Eğitimde olanlar: ${tr.map(x=>x[0]+' ('+x[1].join(', ')+')').join(' · ')||'—'}</p><p>Yetki süresi dolanlar: ${ex.join(', ')||'—'}</p><small>Hücredeki ⓘ düğmesiyle tarih, eğitmen ve sertifika bilgisi girilir.</small></div>`}
const matrix0=P.matrix;P.matrix=function(){return matrix0()+authReports()};
