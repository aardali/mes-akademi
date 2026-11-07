'use strict';
/* MES Akademi — core/state */
const $=s=>document.querySelector(s),LS='mes_db_v1';
const MODS={guide:'Kullanım Kılavuzu',dash:'Gösterge Paneli',master:'Ana Veriler',partners:'Tedarikçi / Müşteri',trade:'Satınalma ve Satış',planning:'Üretim Planlama',scrap:'Fire ve Hurda',orders:'Üretim Emirleri',live:'Canlı Üretim',quality:'Kalite Kontrol',down:'Arıza ve Duruş',machines:'Makineler',people:'Personel',matrix:'Yetki Matrisi',stock:'Stok',mat:'Malzeme ve BOM',oee:'OEE Raporu',logs:'İşlem Geçmişi',users:'Kullanıcı ve Roller',train:'Eğitim Senaryoları'};
const PERM={v:'Görüntüleme',a:'Ekleme',e:'Düzenleme',d:'Silme',o:'Onaylama',i:'İçe aktarma',x:'Dışa aktarma',l:'İşlem geçmişi'};
const ALL='vaedoixl';
const ROLES={
 admin:{n:'Sistem Yöneticisi',p:Object.fromEntries(Object.keys(MODS).map(m=>[m,ALL]))},
 mgr:{n:'Fabrika Müdürü',p:Object.fromEntries(Object.keys(MODS).map(m=>[m,'vxl']))},
 plan:{n:'Üretim Planlama Sorumlusu',p:{dash:'v',orders:'vaeox',machines:'v',people:'v',matrix:'v',stock:'v',mat:'v',oee:'vx',train:'v',logs:'v'}},
 sup:{n:'Üretim Sorumlusu',p:{dash:'v',orders:'vaeoxl',live:'vaeoxl',quality:'v',down:'v',machines:'v',people:'v',matrix:'v',stock:'vax',mat:'v',oee:'vx',train:'v',logs:'vl'}},
 qc:{n:'Kalite Kontrol Sorumlusu',p:{dash:'v',orders:'v',quality:'vaeodxl',oee:'v',train:'v',logs:'vl'}},
 mnt:{n:'Bakım Sorumlusu',p:{dash:'v',machines:'ve',down:'vaedoxl',oee:'v',train:'v',logs:'vl'}},
 op:{n:'Operatör',p:{dash:'v',orders:'v',live:'ve',quality:'v',down:'va',train:'v',logs:'l'}},
 rep:{n:'Raporlama Yetkilisi',p:{dash:'v',oee:'vx',orders:'vx',stock:'vx',train:'v'}}};
const can=(m,x)=>{const u=S.u;if(!u)return false;const ex=(u.ek||{})[m+x];if(ex===0)return false;if(ex===1)return true;return(ROLES[u.role].p[m]||'').includes(x)};
let DB,S={u:null,pg:'dash',T:{},th:localStorage.mesTheme||'light',sp:+localStorage.mesSp||10,mt:'mat'};
const save=()=>localStorage.setItem(LS,JSON.stringify(DB));
const nid=p=>p+String(++DB.seq).padStart(5,'0');
const now=()=>new Date().toISOString();
const fd=t=>t?new Date(t).toLocaleString('tr-TR'):'';
const toast=(m,ok)=>{const d=document.createElement('div');d.className='msg';d.style.background=ok?'var(--ok)':'var(--er)';d.textContent=m;document.body.appendChild(d);setTimeout(()=>d.remove(),4200)};
function log(mod,pg,type,rec,old,nw,desc){DB.logs.push({id:nid('LG'),mod,pg,type,user:S.u?S.u.ad+' ('+S.u.un+')':'sistem',un:S.u?S.u.un:'',role:S.u?ROLES[S.u.role].n:'-',t:now(),rec,old:old==null?'':JSON.stringify(old),nw:nw==null?'':JSON.stringify(nw),desc});save()}

const P={};
Object.values(ROLES).forEach(r=>r.p.guide='v');
Object.assign(ROLES.plan.p,{master:'vaex',partners:'vaexl',trade:'vaeoxl',planning:'vaexl',scrap:'v'});
Object.assign(ROLES.sup.p,{master:'v',partners:'v',trade:'v',planning:'vx',scrap:'vaxl'});
Object.assign(ROLES.qc.p,{master:'v',scrap:'vaexl'});ROLES.mnt.p.master='v';
Object.assign(ROLES.rep.p,{master:'vx',partners:'vx',trade:'vx',planning:'vx',scrap:'vx'});
