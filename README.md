# MES Akademi

MYO öğrencileri için Türkçe, tarayıcıda çalışan MES (Manufacturing Execution System) eğitim simülasyonu.
Backend yok; veriler `localStorage` içinde tutulur. **Eğitim amaçlıdır**: gerçek ortamda kimlik doğrulama,
yetkilendirme ve değiştirilemez audit log sunucu tarafında olmalıdır.

## Çalıştırma
`index.html` dosyasını tarayıcıda açın (sunucu gerekmez). Demo hesaplar (şifre `1234`):
`admin`, `mudur`, `planlama`, `uretim`, `kalite`, `bakim`, `op1`, `op3`, `rapor`.
Excel (XLSX) içe/dışa aktarma ilk kullanımda cdnjs'den SheetJS yükler (internet gerekir); CSV her zaman çalışır.

## Yapı
- `js/core/` — state (roller, yetki, log), seed (demo/boş veri), table (ortak tablo, içe/dışa aktarma), ui, shell, app
- `js/modules/` — permissions, inventory, master-data, partners, trade, production, quality, scrap, planning, maintenance, reports, audit, users, training
- `tests/run.js` — Node ile mantık testleri: `node tests/run.js`

## Yeni modül ekleme
1. `js/modules/xxx.js` oluşturun ve `P.xxx=function(){ return '<html>' }` ile sayfayı tanımlayın.
2. `js/core/state.js` içindeki `MODS` listesine ad, `ROLES` içine izinleri ekleyin.
3. `index.html` içine script etiketini ekleyin (shell.js'den önce).
4. Tabloları `table(id, kolonlar, satırlar, {exp, add, act})` ile çizin; sıralama, filtre, sayfalama (en çok 30) ve dışa aktarma otomatik gelir.
5. Veri değiştiren her işlemde `log(modül, sayfa, tür, kayıtNo, eski, yeni, açıklama)` çağırın.
Şema değişirse `seed()` içindeki `ver` değerini artırın (eski tarayıcı verisi otomatik yeniden yüklenir).
