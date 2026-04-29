# plan.md

## 1. Objectives
- Azərbaycan dilində VIN yoxlama xidməti üçün V1 sayt hazırlamaq (dark theme + qızılı aksentlər).
- Müştəri axını: VIN → məlumatlar → (mock) ödəniş → sifariş yaradılır → status izləmə.
- Admin axını: login → sifarişləri görmək/idarə etmək → nəticə əlavə etmək → Email/Telegram ilə göndərmək (inteqrasiya hazır, konfiq sonradan).
- Tənzimləmələr: qiymət (default 15 AZN), sayt mətnləri, rənglər/logo/banner.
- React + FastAPI + MongoDB ilə tam CRUD və minimal, işlək MVP.

## 2. Implementation Steps

### Phase 1: Core Flow POC (Skipped)
- Bu tətbiq hazırda **CRUD + sadə auth** və **real** xarici inteqrasiya tələb etmir (PayPal/Telegram/SMTP hələ konfiq deyil), ona görə ayrıca POC mərhələsi **yoxdur**.

### Phase 2: V1 App Development (MVP)
**User stories (V1)**
1. Müştəri kimi VIN kodunu daxil edib 15 AZN-lik xidmət üçün sifariş yaratmaq istəyirəm.
2. Müştəri kimi Email və ya Telegram seçib nəticənin hansı kanalla gələcəyini müəyyən etmək istəyirəm.
3. Müştəri kimi ödənişdən sonra sifarişimin “gözləyir/yoxlanılır/göndərildi” statusunu izləmək istəyirəm.
4. Admin kimi yeni gələn sifarişləri paneldə görüb prioritetləşdirmək istəyirəm.
5. Admin kimi VIN nəticəsini əlavə edib müştəriyə göndərmək və göndərildiyini qeydə almaq istəyirəm.
6. Admin kimi saytın qiymətini və əsas mətnlərini dəyişmək istəyirəm.

**Backend (FastAPI + MongoDB)**
- Data model:
  - `Order`: vin, carModel, name, phone, email, telegram, deliveryMethod, priceAZN, paymentStatus(mock), status(waiting/checking/sent), resultText, createdAt, updatedAt, sentAt.
  - `Settings`: priceAZN(15), siteTexts (hero, buttons), design (primaryGold, logoUrl, bannerUrl), notification config placeholders (smtp, telegramToken/chatId).
  - `AdminSession` (simple JWT) for `/admin/*`.
- API endpoints (MVP):
  - Public: create order (with mock payment), get order by `orderId` + tracking code, list minimal order status.
  - Admin: login, list orders (filters by status), view order, update status, add result, trigger “send” (email/telegram via placeholder), manage settings.
- Mock payment:
  - Endpoint simulates PayPal success/fail; store `paymentStatus=PAID/FAILED`.
  - Ensure real PayPal can be swapped later (service layer interface).
- Notifications:
  - Telegram: implement sender service reading token/chatId from settings/env; if missing → no-op + log.
  - Email: SMTP sender reading from settings/env; if missing → no-op + log.

**Frontend (React)**
- Theme/UI:
  - Dark background, gold/yellow CTA, typography similar to screenshot (“AVTOVIN YOXLAMA”).
  - Responsive layout; form validations (VIN 17 simvol, telefon, email).
- Pages:
  - Home: hero + “VIN Yoxla” CTA + form section.
  - Order page: Standart (15 AZN) seçili; form fields; delivery method toggle (Email/Telegram).
  - Payment page: PayPal placeholder UI + “Ödənişi təsdiqlə (Mock)” button.
  - Confirmation: orderId/trackingCode göstər; status link.
  - Tracking: trackingCode ilə status və tarixçə.
  - Admin: login, dashboard (table), order detail modal/page, settings page.

**Admin Panel (V1 scope)**
- Default credentials: `admin / admin123` (sonradan dəyişmə üçün settings).
- Sifariş idarəsi:
  - Status dəyişmə: gözləyir → yoxlanılır → göndərildi.
  - Nəticə mətni əlavə et + “Göndər” düyməsi.
- Settings (minimal): priceAZN, hero text, primary color, logo/banner URL.

**Testing (end-to-end V1)**
- E2E yoxlama checklist:
  - VIN order create → mock pay success → order created.
  - Tracking page status shows correct.
  - Admin login works → sees order → updates status → adds result → send action marks sent.
  - Settings updates reflect on public UI and price.

### Phase 3: Add More Features (Production hardening)
**User stories (Phase 3)**
1. Admin kimi ödənişlərin siyahısını ayrıca görmək istəyirəm.
2. Admin kimi müştərilər siyahısından təkrar sifarişləri izləmək istəyirəm.
3. Admin kimi sifariş tarixçəsində filter/sort/export etmək istəyirəm.
4. Müştəri kimi sifariş statusu dəyişəndə email/telegram bildirişi almaq istəyirəm.
5. Admin kimi dizayn elementlərini (rəng palitrası, button stili) paneldən idarə etmək istəyirəm.

- Payments list & history views.
- Customer list (email/phone/telegram üzrə dedup).
- Better audit log: status changes + sender attempts.
- Real SMTP/Telegram config UI + test-send buttons.
- Refactor: service modules, env validation, error handling.
- Testing: regression suite for all flows.

### Phase 4: Real Integrations + Security (after user approval)
**User stories (Phase 4)**
1. Müştəri kimi PayPal ilə real ödəniş edib avtomatik təsdiq almaq istəyirəm.
2. Admin kimi PayPal webhook-lar ilə ödəniş statusunun avtomatik yenilənməsini istəyirəm.
3. Admin kimi admin parolunu dəyişib daha təhlükəsiz idarə etmək istəyirəm.
4. Admin kimi rol əsaslı icazələr (admin/operator) əlavə etmək istəyirəm.
5. Müştəri kimi sifariş linkini itirsəm belə email vasitəsilə bərpa etmək istəyirəm.

- PayPal sandbox → prod inteqrasiyası (orders API + webhook).
- Webhook verification & idempotency.
- Auth hardening: password change, rate limit, secure cookies.
- Optional: operator roles.
- Final full E2E tests.

## 3. Next Actions
1. Repo skeleti: `/frontend` React, `/backend` FastAPI, MongoDB bağlantısı.
2. Backend models + endpoints (orders/settings/admin auth) + mock payment service.
3. Frontend UI (Home/Order/Payment/Confirm/Track/Admin) + API wiring.
4. One-pass styling: dark + gold theme, AZ locale strings.
5. E2E test: core flow + admin flow + settings.

## 4. Success Criteria
- Müştəri VIN sifarişini yaradıb mock ödənişlə “PAID” statusuna gətirə bilir.
- Tracking səhifəsi statusları düzgün göstərir: gözləyir/yoxlanılır/göndərildi.
- Admin paneldə login, sifariş baxışı, status update, nəticə əlavə etmə və “send” əməliyyatı işləyir.
- Email/Telegram göndərmə mexanizmi token/SMTP yoxdursa qırılmır (no-op), konfiq veriləndə işləməyə hazırdır.
- Qiymət default 15 AZN-dir və settings-dən dəyişəndə UI/backend-də əks olunur.
- UI Azərbaycan dilindədir və dark+gold dizayna uyğundur.
