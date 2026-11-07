const fs=require('fs'),vm=require('vm');const order=[...fs.readFileSync(__dirname+'/../index.html','utf8').matchAll(/js\/([^"]+)\.js/g)].map(m=>m[1]).filter(k=>k!='core/app');
const store={};global.localStorage=new Proxy(store,{get(t,k){if(k==='removeItem')return a=>delete t[a];if(k==='setItem')return(a,b)=>t[a]=b;return t[k]},set(t,k,v){t[k]=v;return true}});
const root={innerHTML:''};
global.document={documentElement:{dataset:{}},querySelector:s=>s=='#root'?root:null,getElementById:()=>null,createElement:()=>({style:{},remove(){}}),body:{appendChild(){}},head:{appendChild(){}}};
global.window={};global.location={hash:''};global.confirm=()=>true;global.alert=()=>{};
vm.runInThisContext(order.map(k=>fs.readFileSync(__dirname+'/../js/'+k+'.js','utf8')).join('\n'));
const T=s=>vm.runInThisContext(s);let fails=0;const ok=(c,m)=>{if(!c){fails++;console.log('FAIL',m)}};
T('load();S.u=DB.users[0]');
// all pages render + pagination clicks via real onclick strings
const pages=T('Object.keys(P)');
for(const k of pages){T(`S.pg='${k}';S.T={}`);for(const key of Object.keys(T('TBL')))T(`delete TBL['${key}']`);
 try{T('go()')}catch(e){ok(false,'render '+k+' '+e.message);continue}
 if(root.innerHTML.includes('Sayfa hatası'))ok(false,'sayfa hatası '+k+': '+root.innerHTML.match(/Sayfa hatası[^<]*/)[0]);
 for(const id of Object.keys(T('TBL'))){const n=T(`TBL['${id}'].r.length`);T(`S.T['${id}'].ps=5;S.T['${id}'].p=1`);T('go()');
  const btns=[...root.innerHTML.matchAll(/onclick="(tp\('[^']+',\d+\))"/g)].map(m=>m[1]);
  if(n>5){ok(btns.length>0,k+'/'+id+' sayfa düğmesi yok');const nx=btns.find(b=>b.endsWith(',2)'));T(nx);const m=root.innerHTML.match(/(\d+)-(\d+) \/ (\d+) kayıt/);ok(m&&m[1]=='6','sayfa 2 aralığı '+k+'/'+id+' '+(m&&m[0]));
   T(`S.T['${id}'].ps=30;S.T['${id}'].p=1`)}
  else if(n>0){const m=root.innerHTML.match(/(\d+)-(\d+) \/ (\d+) kayıt/);ok(m&&m[1]=='1','tek sayfa '+id)}
  console.log('ok',k+'/'+id,n+' kayıt')}}
// warehouse hierarchy
T('S.u=DB.users[0]');ok(T("subtree('Merkez Depo').length")==8,'depo ağacı '+T("subtree('Merkez Depo').length"));ok(T("subtree('Hammadde Deposu').join()").includes('Hammadde Raf A'),'alt depo');
ok(T("wOrder()[0]")=='Merkez Depo','kök sırası');
// stock consistency
ok(T("DB.mats.every(m=>Math.abs(m.stok-DB.bal.filter(b=>b.mat==m.kod).reduce((a,b)=>a+b.qty,0))<.01)"),'stok=bakiye toplamı');
// transfer / out / negative
ok(T("transferDo({m:'HM-001',f:'Hammadde Raf A',t:'Hammadde Raf B',q:10})")=='','transfer');ok(T("transferDo({m:'HM-001',f:'Hammadde Raf A',t:'Hammadde Raf A',q:1})").includes('aynı'),'aynı depo');
ok(T("outDo({m:'HM-001',d:'Hammadde Raf A',tur:'Fire çıkışı',q:99999})").includes('yeterli'),'negatif stok engeli');
ok(T("stockInDo({m:'HM-001',d:'Hammadde Raf A',q:5,l:''})").includes('lot'),'lot zorunlu');
ok(T("stockInDo({m:'HM-001',d:'Hammadde Raf A',q:5,l:'L-9',ted:'TED-001',irs:'IR1'})")=='','stok girişi');
// PO / SO
const po=T("DB.po.find(p=>p.durum=='Açık')"),before=T(`mat('${po.mat}').stok`);ok(T(`poReceiveDo('${po.id}',{d:'Hammadde Raf A',l:'L-77',irs:'X1'})`)=='','PO teslim');ok(T(`mat('${po.mat}').stok`)>before,'PO stok arttı');ok(T(`poReceiveDo('${po.id}',{d:'Hammadde Raf A',l:'L'})`).includes('açık değil'),'PO ikinci teslim engeli');
const so=T("DB.so.find(s=>s.durum=='Açık'&&mat(s.prod).stok>=s.qty)");T(`DB.so.find(s=>s.id=='${so.id}').qty=5`);
ok(T(`soShipDo('${so.id}','Mamul Deposu')`)=='','SO sevk');ok(T(`DB.so.find(s=>s.id=='${so.id}').durum`)=='Sevk edildi','SO durum');
const big=T("DB.so.find(s=>s.durum=='Açık')");T(`DB.so.find(s=>s.id=='${big.id}').qty=9999`);ok(T(`soShipDo('${big.id}','Mamul Deposu')`).includes('Yeterli mamul stok'),'yetersiz mamul');
// scrap rule
const o=T("DB.orders.find(o=>bad(o)>0)");ok(T(`scrapDo({o:'${o.id}',t:'Fire',q:99999,n:'x'})`).includes('aşamaz'),'fire limiti');
// production flow with depot-level consumption + return
T("S.u=DB.users.find(u=>u.un=='uretim')");T("DB.orders.push({id:'UE-77',prod:'MM-001',qty:10,mak:'CNC-01',op:'Personel 001',bas:now(),pri:'Normal',dur:'Planlandı',so:''});need('MM-001',10).forEach(n=>mat(n.k).rez+=n.q)");
const hm=T("mat('HM-001').stok");T("lv('UE-77','start')");ok(T("DB.orders.find(o=>o.id=='UE-77').dur")=='Üretimde','başlatıldı '+T("DB.orders.find(o=>o.id=='UE-77').dur"));ok(T("mat('HM-001').stok")<hm,'tüketim');
ok(T("DB.mov.some(m=>m.oid=='UE-77'&&m.tur=='Üretime çıkış'&&m.dep.startsWith('Hammadde Raf'))"),'depo bazlı çıkış');
T("S.sp=60");for(let i=0;i<5;i++)T('tick()');T("lv('UE-77','end')");ok(T("DB.mov.some(m=>m.oid=='UE-77'&&m.tur=='Üretimden iade')")||T("done(DB.orders.find(o=>o.id=='UE-77'))>=10"),'iade/tamamlama');
ok(T("DB.mats.every(m=>Math.abs(m.stok-DB.bal.filter(b=>b.mat==m.kod).reduce((a,b)=>a+b.qty,0))<.01)"),'stok=bakiye (üretim sonrası)');
// oee dims, import check, filters
for(const d of ['mak','prod','vardiya','tarih']){const r=T(`oeeBy('${d}')`);ok(r.length>0&&r.every(x=>isFinite(x.oee)),'oee '+d)}
T("S.pg='logs';S.T={};go()");T("S.T.lg.fc='type';S.T.lg.fv='Onay';go()");ok(/Onaylama/.test(root.innerHTML),'log sütun filtresi');
T("S.T.lg.fc='';S.T.lg.fv='';S.T.lg.d1='2999-01-01';go()");ok(/Kayıt yok/.test(root.innerHTML),'tarih filtresi');
const imp=T(`impCheck('mdm',csvParse('Kod;Ad;Tür;Birim;Min;Kritik;Maks;Birim maliyet\\nhm-900;Yeni;Hammadde;kg;10;2;500;3,5\\nHM-001;Var;Hammadde;kg;1;1;1;1\\nX;Bad;Yok;kg;a;1;1;1\\n'))`);ok(imp.ok.length==1&&imp.dup.length==1&&imp.errs.length==1,'csv içe aktarma doğrulama '+JSON.stringify([imp.ok.length,imp.dup.length,imp.errs.length]));
// empty system
T("S.u=DB.users.find(u=>u.un=='admin')||DB.users[0];seedEmpty();S.u=DB.users[0];S.pg='dash'");
for(const k of pages){T(`S.pg='${k}';S.T={}`);try{T('go()')}catch(e){ok(false,'boş '+k+e.message)}if(root.innerHTML.includes('Sayfa hatası'))ok(false,'boş sayfa hatası '+k+' '+root.innerHTML.match(/Sayfa hatası[^<]*/)[0])}
T("S.pg='dash'");T('go()');ok(!/NaN/.test(root.innerHTML),'boş NaN yok');
console.log(fails?'FAILS '+fails:'ALL OK');process.exit(0);
