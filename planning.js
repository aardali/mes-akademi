'use strict';
/* MES Akademi — modules/planning (üretim planlama) */
function isoWeek(d){d=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate()));const n=d.getUTCDay()||7;d.setUTCDate(d.getUTCDate()+4-n);const y=new Date(Date.UTC(d.getUTCFullYear(),0,1));return d.getUTCFullYear()+'-H'+String(Math.ceil(((d-y)/864e5+1)/7)).padStart(2,'0')}
P.planning=function(){const pl=S.pl=S.pl||{per:'gün',dim:'prod'},bt=(k,v,l)=>`<button class="${pl[k]==v?'p':''}" onclick="S.pl.${k}='${v}';go()">${l}</button>`;
 const per=o=>pl.per=='gün'?o.bas.slice(0,10):isoWeek(new Date(o.bas)),dim=o=>pl.dim=='prod'?((prod(o.prod)||{}).ad||o.prod):pl.dim=='mak'?o.mak:((DB.people.find(p=>p.no==o.op)||{}).vardiya||'-');
 const g={};DB.orders.forEach(o=>{const k=per(o)+'|'+dim(o);g[k]=g[k]||{don:per(o),ad:dim(o),pl:0,ger:0,n:0};g[k].pl+=o.qty;g[k].ger+=done(o);g[k].n++});
 const rows=Object.values(g).sort((a,b)=>a.don.localeCompare(b.don)).map(x=>({...x,fark:x.ger-x.pl,oran:x.pl?Math.round(x.ger/x.pl*100):0}));
 return`<div class="bar">Dönem: ${bt('per','gün','Günlük')}${bt('per','hafta','Haftalık')} &nbsp; Planlama bazı: ${bt('dim','prod','Ürün')}${bt('dim','mak','Makine')}${bt('dim','vardiya','Vardiya')}</div>`+table('pl',[{k:'don',h:pl.per=='gün'?'Gün':'Hafta'},{k:'ad',h:{prod:'Ürün',mak:'Makine',vardiya:'Vardiya'}[pl.dim]},{k:'n',h:'Emir sayısı'},{k:'pl',h:'Planlanan'},{k:'ger',h:'Gerçekleşen'},{k:'fark',h:'Fark'},{k:'oran',h:'Gerçekleşme %'}],rows,{exp:()=>can('planning','x')})};
