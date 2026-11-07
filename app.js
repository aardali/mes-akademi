'use strict';
/* MES Akademi — core/app */
document.documentElement.dataset.theme=S.th;window.onhashchange=()=>{if(S.u)go()};
['mousedown','touchstart'].forEach(e=>document.addEventListener(e,()=>S.md=1,true));['mouseup','touchend'].forEach(e=>document.addEventListener(e,()=>setTimeout(()=>S.md=0,60),true));
let tk=0;setInterval(()=>{tk++;const c=tick();clock();if(c||tk%5==0)save();const ae=document.activeElement&&document.activeElement.tagName;
 if(S.u&&DB.orders.some(o=>o.dur=='Üretimde')&&!S.md&&!document.querySelector('.ov')&&ae!='INPUT'&&ae!='SELECT'&&(S.pg=='live'||(c&&['dash','orders','stock','mat','scrap'].includes(S.pg))))go()},1000);
try{load();go()}catch(e){document.body.innerHTML='Hata: '+e}
