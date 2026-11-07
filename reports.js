'use strict';
/* MES Akademi — modules/reports */
function oee(f){const rows=DB.machines.filter(m=>m.aktif&&(!f||f(m))).map(m=>{const pl=480,dn=Math.min(pl-1,DB.down.filter(d=>d.mak==m.kod).reduce((a,d)=>a+d.dk,0)),run=pl-dn,
 pr=DB.prod.filter(x=>x.mak==m.kod).reduce((a,x)=>a+x.qty,0),bd=DB.qc.filter(x=>{const o=DB.orders.find(o=>o.id==x.oid);return o&&o.mak==m.kod}).reduce((a,x)=>a+x.bad,0),th=run/60*m.kap;
 const A=run/pl,P=Math.min(1,th?pr/th:0),Q=pr?Math.max(0,(pr-bd)/pr):1;return{mak:m.kod,pl,dn,run,pr,bd,A:A*100,P:P*100,Q:Q*100,oee:A*P*Q*100}});return rows}


function dd(k){S.dd=S.dd==k?null:k;S.ddScroll=1;delete S.T.dd;go()}
function bar(a,kind){const mx=Math.max(1,...a.map(x=>x[1]));return`<div class="ch">${a.map(x=>`<div style="height:${Math.max(4,x[1]/mx*100)}%;cursor:pointer" ${kind?`onclick="dd('${kind}|${x[2]||x[0]}')"`:''} title="${x[0]}: ${Math.round(x[1])}">${Math.round(x[1])}</div>`).join('')}</div><div class="lb">${a.map(x=>`<span>${x[0]}</span>`).join('')}</div>`}
function ddView(){const k=S.dd;if(!k)return'';const[g,v]=k.split('|');
 const ob=[{k:'id',h:'Emir'},{k:'prod',h:'Ürün',f:x=>(prod(x.prod)||{}).ad},{k:'qty',h:'Plan'},{k:'u',h:'Üretilen',f:x=>done(x)},{k:'mak',h:'Makine'},{k:'op',h:'Operatör'},{k:'dur',h:'Durum'}];
 const pr=[{k:'id',h:'Kayıt'},{k:'oid',h:'Emir'},{k:'mak',h:'Makine'},{k:'op',h:'Operatör'},{k:'qty',h:'Miktar'},{k:'t',h:'Zaman',f:x=>fd(x.t)}];
 const mk=[{k:'kod',h:'Makine'},{k:'ad',h:'Ad'},{k:'tur',h:'Tür'},{k:'kap',h:'Kapasite/saat'},{k:'durum',h:'Durum'}];
 const qc=[{k:'id',h:'Kayıt'},{k:'oid',h:'Emir'},{k:'iyi',h:'Sağlam'},{k:'bad',h:'Hatalı'},{k:'tur',h:'Hata türü'},{k:'dur',h:'Karar'}];
 const dn=[{k:'id',h:'Kayıt'},{k:'mak',h:'Makine'},{k:'tur',h:'Tür'},{k:'dk',h:'Süre (dk)'},{k:'ack',h:'Açıklama'},{k:'bit',h:'Durum',f:x=>x.bit?'Tamamlandı':'Açık'}];
 const oc=[{k:'mak',h:'Makine'},{k:'dn',h:'Duruş (dk)'},{k:'pr',h:'Üretim'},{k:'bd',h:'Hatalı'},{k:'A',h:'Kullanılabilirlik %',f:x=>x.A.toFixed(1)},{k:'P',h:'Performans %',f:x=>x.P.toFixed(1)},{k:'Q',h:'Kalite %',f:x=>x.Q.toFixed(1)},{k:'oee',h:'OEE %',f:x=>x.oee.toFixed(1)}];
 const M={prod:['Üretim hareketleri',pr,DB.prod],plan:['Üretim emirleri',ob,DB.orders],aktif:['Aktif üretim emirleri',ob,DB.orders.filter(o=>['Üretimde','Duraklatıldı'].includes(o.dur))],cal:['Çalışan makineler',mk,DB.machines.filter(m=>m.durum=='Çalışıyor')],ariz:['Arızalı makineler',mk,DB.machines.filter(m=>m.durum=='Arızalı')],hata:['Hatalı ürün içeren kalite kayıtları',qc,DB.qc.filter(x=>x.bad>0)],oee:['Makine bazlı OEE',oc,oee()],
  m:['Makine '+v+' üretim hareketleri',pr,DB.prod.filter(x=>x.mak==v)],p:['Ürün '+v+' üretim hareketleri',pr,DB.prod.filter(x=>(DB.orders.find(o=>o.id==x.oid)||{}).prod==v)],h:['Saat '+v+' üretim hareketleri',pr,DB.prod.filter(x=>new Date(x.t).getHours()==parseInt(v))],o:['Makine '+v+' duruş kayıtları',dn,DB.down.filter(x=>x.mak==v)],po:['Açık satınalma siparişleri',PO_COLS,DB.po.filter(p=>p.durum=='Açık')],so:['Açık müşteri siparişleri',SO_COLS,DB.so.filter(s=>s.durum=='Açık')]}[g];
 if(!M)return'';return`<h3 id="ddt">▼ ${M[0]} <button onclick="dd(null)">Kapat</button></h3>`+table('dd',M[1],M[2],{})}
P.dash=function(){const e=oee(),t=DB.prod.reduce((a,x)=>a+x.qty,0),b=DB.qc.reduce((a,x)=>a+x.bad,0),pl=DB.orders.reduce((a,o)=>a+o.qty,0),ao=DB.orders.filter(o=>['Üretimde','Duraklatıldı'].includes(o.dur)).length;
 const avg=e.length?e.reduce((a,x)=>a+x.oee,0)/e.length:0,K=(v,l,key)=>`<div class="card k" onclick="dd('${key}')"><b>${v}</b><span>${l} ▾</span></div>`;
 const byM=DB.machines.map(m=>[m.kod,DB.prod.filter(x=>x.mak==m.kod).reduce((a,x)=>a+x.qty,0)]),byP=DB.prods.map(p=>[p.ad.slice(0,9),DB.prod.filter(x=>(DB.orders.find(o=>o.id==x.oid)||{}).prod==p.kod).reduce((a,x)=>a+x.qty,0),p.kod]);
 const hr=Array.from({length:8},(_,i)=>{const h=(new Date().getHours()-7+i+24)%24;return[h+':00',DB.prod.filter(x=>new Date(x.t).getHours()==h).reduce((a,x)=>a+x.qty,0),h]});
 return`<div class="grid">${K(t,'Üretilen miktar','prod')}${K(pl,'Planlanan','plan')}${K('%'+(pl?t/pl*100:0).toFixed(1),'Gerçekleşme','plan')}${K(ao,'Aktif üretim emri','aktif')}${K(DB.machines.filter(m=>m.durum=='Çalışıyor').length,'Çalışan makine','cal')}${K(DB.machines.filter(m=>m.durum=='Arızalı').length,'Arızalı makine','ariz')}${K('%'+(t?b/t*100:0).toFixed(1),'Hata oranı','hata')}${K(b,'Fire (adet)','hata')}${K(DB.po.filter(p=>p.durum=='Açık').length,'Açık satınalma','po')}${K(DB.so.filter(s=>s.durum=='Açık').length,'Açık müşteri siparişi','so')}${K('%'+avg.toFixed(1),'Genel OEE','oee')}</div>
 <p><small>Kartlara ve grafik çubuklarına tıklayın; ilgili kayıtlar aşağıda listelenir.</small></p><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(280px,1fr))"><div class="card"><h4>Saatlik üretim</h4>${bar(hr,'h')}</div><div class="card"><h4>Makine bazlı üretim</h4>${bar(byM,'m')}</div><div class="card"><h4>Ürün bazlı üretim</h4>${bar(byP,'p')}</div><div class="card"><h4>OEE karşılaştırması (%)</h4>${bar(e.map(x=>[x.mak,x.oee]),'o')}</div></div>`+ddView()};

function oeeBy(dim){const od=id=>DB.orders.find(o=>o.id==id)||{},pp=n=>DB.people.find(p=>p.no==n)||{};
 const kO=o=>dim=='mak'?o.mak:dim=='prod'?o.prod:dim=='vardiya'?pp(o.op).vardiya:'';const G={},gr=k=>G[k]=G[k]||{ad:k,ms:{},pr:0,bd:0};
 if(dim=='mak')DB.machines.filter(m=>m.aktif).forEach(m=>gr(m.kod).ms[m.kod]=0);
 DB.prod.forEach(r=>{const k=dim=='tarih'?r.t.slice(0,10):kO({...od(r.oid),mak:r.mak,op:r.op});if(!k)return;const g=gr(k);g.pr+=r.qty;g.ms[r.mak]=g.ms[r.mak]||0});
 DB.qc.forEach(q=>{const k=dim=='tarih'?q.t.slice(0,10):kO(od(q.oid));if(k)gr(k).bd+=q.bad});
 DB.down.forEach(d=>{if(dim=='tarih'){const g=gr(d.bas.slice(0,10));g.ms[d.mak]=(g.ms[d.mak]||0)+d.dk;return}Object.values(G).forEach(g=>{if(dim=='mak'?g.ad==d.mak:d.mak in g.ms)g.ms[d.mak]+=d.dk})});
 return Object.values(G).map(g=>{const ms=Object.keys(g.ms),pl=480*ms.length;let dn=0,run=0,th=0;ms.forEach(m=>{const d=Math.min(479,g.ms[m]),cap=(DB.machines.find(x=>x.kod==m)||{kap:0}).kap;dn+=d;run+=480-d;th+=cap*(480-d)/60});
  const A=pl?run/pl:0,Pf=th?Math.min(1,g.pr/th):0,Q=g.pr?Math.max(0,(g.pr-g.bd)/g.pr):1;return{ad:g.ad,pl,dn,run,pr:g.pr,bd:g.bd,A:A*100,P:Pf*100,Q:Q*100,oee:A*Pf*Q*100}}).sort((a,b)=>String(a.ad).localeCompare(String(b.ad)))}
P.oee=function(){const d=S.od||'mak',L={mak:'Makine',prod:'Ürün',vardiya:'Vardiya',tarih:'Tarih'},e=oeeBy(d),a=e.length?e.reduce((s,x)=>s+x.oee,0)/e.length:0;
 return`<div class="card">OEE = Kullanılabilirlik × Performans × Kalite &nbsp;|&nbsp; Ortalama: <b>%${a.toFixed(1)}</b></div><div class="bar">Karşılaştırma bazı: ${Object.keys(L).map(k=>`<button class="${k==d?'p':''}" onclick="S.od='${k}';go()">${L[k]}</button>`).join('')}</div>`+table('oe'+d,[{k:'ad',h:L[d]},{k:'pl',h:'Planlanan (dk)'},{k:'dn',h:'Duruş (dk)'},{k:'run',h:'Çalışma (dk)'},{k:'pr',h:'Üretim'},{k:'bd',h:'Hatalı'},{k:'A',h:'Kullanılabilirlik %',f:x=>x.A.toFixed(1)},{k:'P',h:'Performans %',f:x=>x.P.toFixed(1)},{k:'Q',h:'Kalite %',f:x=>x.Q.toFixed(1)},{k:'oee',h:'OEE %',f:x=>'<b>'+x.oee.toFixed(1)+'</b>'}],e,{exp:()=>can('oee','x')})};
