'use strict';
/* MES Akademi — core/table */
const TBL={},IMP={};
const esc=v=>String(v==null?'':v).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const txt=(x,c)=>String(c.f?c.f(x):(x[c.k]==null?'':x[c.k])).replace(/<[^>]*>/g,'');
const ISO=/^\d{4}-\d\d-\d\d/,PSZ=[5,10,20,30];
function table(id,cols,rows,o={}){
 const t=S.T[id]=S.T[id]||{k:null,d:1,p:1,q:'',fc:'',fv:'',d1:'',d2:'',ps:30,hide:JSON.parse(localStorage['mesCols_'+id]||'{}')};
 const dc=cols.find(c=>rows.length&&ISO.test(String(rows[0][c.k]||'')));
 let r=rows.slice().reverse();
 if(t.q)r=r.filter(x=>cols.some(c=>txt(x,c).toLowerCase().includes(t.q.toLowerCase())));
 if(t.fc&&t.fv){const c=cols.find(c=>c.k==t.fc);if(c)r=r.filter(x=>txt(x,c).toLowerCase().includes(t.fv.toLowerCase()))}
 if(dc&&t.d1)r=r.filter(x=>String(x[dc.k]).slice(0,10)>=t.d1);
 if(dc&&t.d2)r=r.filter(x=>String(x[dc.k]).slice(0,10)<=t.d2);
 if(t.k){const c=cols.find(c=>c.k==t.k);if(c)r.sort((a,b)=>{const x=c.f?c.f(a):a[c.k],y=c.f?c.f(b):b[c.k];return(typeof x=='number'&&typeof y=='number'?x-y:String(x).replace(/<[^>]*>/g,'').localeCompare(String(y).replace(/<[^>]*>/g,''),'tr',{numeric:true}))*t.d})}
 const ps=Math.min(30,t.ps),n=r.length,pc=Math.max(1,Math.ceil(n/ps));t.p=Math.min(Math.max(1,t.p),pc);const s=(t.p-1)*ps,vc=cols.filter(c=>!t.hide[c.k]);
 TBL[id]={cols,rows,r,vc,ps};
 const pn=[];for(let i=Math.max(1,t.p-2);i<=Math.min(pc,t.p+2);i++)pn.push(i);
 const X=o.exp&&o.exp();
 return `<div class="card"><div class="bar"><input placeholder="Ara..." value="${esc(t.q)}" onchange="tq('${id}',this.value)">
 <select onchange="tf('${id}','fc',this.value)"><option value="">Sütun filtresi…</option>${cols.map(c=>`<option value="${c.k}" ${t.fc==c.k?'selected':''}>${c.h}</option>`).join('')}</select><input placeholder="Filtre değeri" value="${esc(t.fv)}" onchange="tf('${id}','fv',this.value)" style="width:120px">
 ${dc?`<input type="date" value="${t.d1}" title="Başlangıç tarihi" onchange="tf('${id}','d1',this.value)"><input type="date" value="${t.d2}" title="Bitiş tarihi" onchange="tf('${id}','d2',this.value)">`:''}
 <select onchange="th2('${id}',this.value)"><option value="">Sütunlar…</option>${cols.map(c=>`<option value="${c.k}">${t.hide[c.k]?'☐':'☑'} ${c.h}</option>`).join('')}</select>
 <button onclick="tclr('${id}')">Filtreleri temizle</button>
 ${X?`<select onchange="xp('${id}',this.value)"><option value="">Dışa aktar…</option><option value="csv0">CSV – tüm kayıtlar</option><option value="csv1">CSV – filtreli kayıtlar</option><option value="xl0">Excel – tüm kayıtlar</option><option value="xl1">Excel – filtreli kayıtlar</option></select>`:''}
 ${IMP[id]&&can(S.pg,'i')?`<button onclick="impPick('${id}')">İçe aktar (CSV/Excel)</button>`:''}${o.add||''}</div>
 <div class="tw"><table><tr>${vc.map(c=>`<th onclick="ts('${id}','${c.k}')">${c.h}${t.k==c.k?(t.d>0?' ▲':' ▼'):''}</th>`).join('')}${o.act?'<th>İşlem</th>':''}</tr>
 ${r.slice(s,s+ps).map(x=>`<tr>${vc.map(c=>`<td>${c.f?c.f(x):esc(x[c.k])}</td>`).join('')}${o.act?`<td>${o.act(x)}</td>`:''}</tr>`).join('')||'<tr><td>Kayıt yok</td></tr>'}</table></div>
 <div class="bar" style="margin-top:8px"><button ${t.p<=1?'disabled':''} onclick="tp('${id}',1)">«</button><button ${t.p<=1?'disabled':''} onclick="tp('${id}',${t.p-1})">‹</button>${pn.map(i=>`<button class="${i==t.p?'p':''}" onclick="tp('${id}',${i})">${i}</button>`).join('')}<button ${t.p>=pc?'disabled':''} onclick="tp('${id}',${t.p+1})">›</button><button ${t.p>=pc?'disabled':''} onclick="tp('${id}',${pc})">»</button><span>${n?s+1:0}-${Math.min(s+ps,n)} / ${n} kayıt (Sayfa ${t.p}/${pc})</span><select onchange="tps('${id}',this.value)" title="Sayfa başına kayıt (en çok 30)">${PSZ.map(z=>`<option value="${z}" ${z==ps?'selected':''}>${z} / sayfa</option>`).join('')}</select></div></div>`}
const ts=(i,k)=>{const t=S.T[i];t.d=t.k==k?-t.d:1;t.k=k;go()},tp=(i,p)=>{S.T[i].p=p;go()},tq=(i,v)=>{S.T[i].q=v;S.T[i].p=1;go()},tf=(i,f,v)=>{S.T[i][f]=v;S.T[i].p=1;go()},tps=(i,v)=>{S.T[i].ps=Math.min(30,+v);S.T[i].p=1;go()},tclr=i=>{Object.assign(S.T[i],{q:'',fc:'',fv:'',d1:'',d2:'',p:1,k:null});go()};
function th2(i,k){if(!k)return;const t=S.T[i];t.hide[k]=!t.hide[k];localStorage['mesCols_'+i]=JSON.stringify(t.hide);go()}
function rowsFor(id,f){const T=TBL[id];return[T.vc.map(c=>c.h)].concat((f?T.r:T.rows).map(x=>T.vc.map(c=>txt(x,c))))}
function loadXLSX(cb){if(window.XLSX)return cb();const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=cb;s.onerror=()=>toast('Excel kütüphanesi yüklenemedi (internet gerekir). CSV kullanın.');document.head.appendChild(s)}
function xp(id,v){if(!v)return;if(!can(S.pg,'x')){toast('Dışa aktarma yetkiniz yok.');return go()}const a=rowsFor(id,v.endsWith('1'));
 if(v.startsWith('csv')){const c='\ufeff'+a.map(l=>l.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(';')).join('\n'),e=document.createElement('a');e.href=URL.createObjectURL(new Blob([c],{type:'text/csv'}));e.download=id+'.csv';e.click()}
 else loadXLSX(()=>{const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(a),'Veri');XLSX.writeFile(wb,id+'.xlsx')});
 log(S.pg,MODS[S.pg],'Veri dışa aktarma','-',null,null,id+' '+v+' ('+(a.length-1)+' satır, görünür sütunlar)');go()}
function csvParse(t){t=t.replace(/^\ufeff/,'');const l=t.split('\n')[0],d=(l.match(/;/g)||[]).length>=(l.match(/,/g)||[]).length?';':',',rows=[];let row=[],cur='',q=false;for(let i=0;i<t.length;i++){const c=t[i];if(q){if(c=='"'){if(t[i+1]=='"'){cur+='"';i++}else q=false}else cur+=c}else if(c=='"')q=true;else if(c==d){row.push(cur);cur=''}else if(c=='\n'||c=='\r'){if(c=='\r'&&t[i+1]=='\n')i++;row.push(cur);rows.push(row);row=[];cur=''}else cur+=c}if(cur||row.length){row.push(cur);rows.push(row)}return rows.filter(r=>r.some(x=>String(x).trim()))}
function impPick(id){if(!guard(S.pg,'i'))return;const i=document.createElement('input');i.type='file';i.accept='.csv,.xlsx,.xls';i.onchange=()=>{const f=i.files[0];if(!f)return;const r=new FileReader();if(/\.csv$/i.test(f.name)){r.onload=()=>impRun(id,csvParse(r.result));r.readAsText(f,'utf-8')}else loadXLSX(()=>{r.onload=()=>{const wb=XLSX.read(r.result,{type:'array'});impRun(id,XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{header:1,defval:''}))};r.readAsArrayBuffer(f)})};i.click()}
function impCheck(id,rows){const sp=IMP[id];if(!rows.length)return{err:'Dosya boş.'};const hd=rows[0].map(h=>String(h).trim().toLowerCase()),idx=sp.fields.map(f=>hd.findIndex(h=>h==f.h.toLowerCase()||h==f.k.toLowerCase()));
 const miss=sp.fields.filter((f,i)=>f.req&&idx[i]<0);if(miss.length)return{err:'Zorunlu sütun eksik: '+miss.map(f=>f.h).join(', ')+'. Beklenen sütunlar: '+sp.fields.map(f=>f.h).join(', ')};
 const errs=[],ok=[],dup=[],seen=new Set();
 rows.slice(1).forEach((r,n)=>{const o={};let e='';sp.fields.forEach((f,i)=>{let v=idx[i]<0||r[idx[i]]==null?'':String(r[idx[i]]).trim();if(f.num){if(v==='')v=f.def==null?'':f.def;else{v=parseFloat(v.replace(',','.'));if(isNaN(v))e+=f.h+' sayısal olmalı; '}}if(f.up&&typeof v=='string')v=v.toUpperCase();if(f.req&&(v===''||v==null))e+=f.h+' boş olamaz; ';if(f.opts&&v!==''&&!f.opts.includes(v))e+=f.h+' geçersiz ('+f.opts.join('/')+'); ';o[f.k]=v});
  if(e)return errs.push('Satır '+(n+2)+': '+e);const key=String(o[sp.key]);if(seen.has(key))return errs.push('Satır '+(n+2)+': dosyada mükerrer anahtar '+key);seen.add(key);(sp.get(key)?dup:ok).push(o)});
 return{ok,dup,errs}}
function impRun(id,rows){const sp=IMP[id],c=impCheck(id,rows);if(c.err)return toast(c.err);const{ok,dup,errs}=c;
 modal('İçe aktarma önizleme',[{n:'x',l:`<b>${ok.length}</b> yeni, <b>${dup.length}</b> mükerrer (sistemde var), <b>${errs.length}</b> hatalı satır.<br><small>${errs.slice(0,8).map(esc).join('<br>')}${errs.length>8?'<br>…':''}</small><br>Mükerrer kayıtlar için işlem (hatalı satırlar alınmaz):`,o:['Atla (üzerine yazma)','Üzerine yaz (onaylıyorum)']}],v=>{const ow=v.x.startsWith('Üzerine');ok.forEach(o=>sp.add(o));if(ow)dup.forEach(o=>sp.upd(sp.get(String(o[sp.key])),o));log(S.pg,MODS[S.pg],'Veri içe aktarma','-',null,{yeni:ok.length,mükerrer:dup.length,hata:errs.length},id+' içe aktarıldı; mükerrer '+(ow?'üzerine yazıldı':'atlandı'))})}
