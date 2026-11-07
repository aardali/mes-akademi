'use strict';
/* MES Akademi — modules/audit */
P.logs=function(){const m=S.u.role=='admin'?null:S.u.role=='op'?'own':1;const L=DB.logs.filter(l=>S.u.role=='admin'||(S.u.role=='op'?l.un==S.u.un:can(l.mod,'l')||S.u.role=='mgr'));
 return table('lg',[{k:'id',h:'No'},{k:'mod',h:'Modül',f:x=>MODS[x.mod]||x.mod},{k:'pg',h:'Sayfa'},{k:'type',h:'İşlem'},{k:'user',h:'Kullanıcı'},{k:'role',h:'Rol'},{k:'t',h:'Tarih',f:x=>fd(x.t)},{k:'rec',h:'Kayıt'},{k:'old',h:'Önceki'},{k:'nw',h:'Yeni'},{k:'desc',h:'Açıklama'}],L,{})};
