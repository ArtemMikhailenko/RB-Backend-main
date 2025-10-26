# Швидкий старт для Render

## Що потрібно зробити (5 хвилин):

### 1️⃣ Створіть безкоштовну MySQL базу

**Варіант A: Railway (РЕКОМЕНДУЮ - 100% безкоштовно на старт)**

```bash
# 1. Зайдіть на https://railway.app
# 2. Sign up через GitHub
# 3. New Project → Deploy MySQL
# 4. Після створення клікніть на MySQL сервіс
# 5. Variables → знайдіть DATABASE_URL
# 6. Скопіюйте повністю
```

Приклад того що скопіюєте:
```
mysql://root:password123@containers-us-west-1.railway.app:6543/railway
```

**Варіант B: Aiven (безкоштовно)**

```bash
# 1. https://aiven.io/mysql
# 2. Sign up
# 3. Create service → MySQL
# 4. План: Free (EU/US)
# 5. Після створення: Overview → скопіюйте Connection info
# 6. Формат: mysql://user:pass@host:port/defaultdb?ssl-mode=REQUIRED
```

**Варіант C: FreeSQLDatabase (дуже простий)**

```bash
# 1. https://www.freesqldatabase.com
# 2. Sign up безкоштовно
# 3. Create Database
# 4. Отримаєте:
#    Host: sql123.freesqldatabase.com
#    Port: 3306
#    Username: sql123_user
#    Password: xxxxxxx
#    Database: sql123_db
# 5. Складіть URL:
#    mysql://sql123_user:xxxxxxx@sql123.freesqldatabase.com:3306/sql123_db
```

---

### 2️⃣ Створіть Gmail App Password

```bash
# 1. https://myaccount.google.com/security
# 2. Увімкніть "2-Step Verification"
# 3. https://myaccount.google.com/apppasswords
# 4. Створіть пароль для "RealEstate Backend"
# 5. Скопіюйте 16-символьний код (без пробілів)
```

---

### 3️⃣ Згенеруйте JWT Secret

У терміналі:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Приклад виводу:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

### 4️⃣ Додайте змінні на Render

**Render Dashboard → Ваш Service → Settings → Environment**

Натисніть **"Add Environment Variable"** та додайте:

```
DATABASE_URL
[paste your PlanetScale URL here]

DB_SSL
true

PORT
3000

JWT_SECRET
[paste generated secret here]

APP_BASE_URL
https://your-service-name.onrender.com

FRONTEND_URL
https://your-frontend.com

MAIL_USER
your-email@gmail.com

MAIL_PASS
[paste your 16-char app password]
```

---

### 5️⃣ Збережіть та чекайте деплой

1. Натисніть **Save Changes**
2. Render автоматично передеплоїть
3. Через 2-3 хвилини перевірте логи
4. Має з'явитися: `🚀 Server running on http://localhost:3000`

---

## Перевірка

Відкрийте в браузері:
```
https://your-service-name.onrender.com
```

Має показати: **"Hello World!"**

---

## Якщо щось не працює

### ECONNREFUSED помилка:
✅ Перевірте що `DATABASE_URL` правильно скопійована  
✅ Перевірте що `DB_SSL=true`  
✅ Спробуйте видалити і додати знову змінну

### No open ports:
✅ Перевірте що `PORT=3000`  
✅ Перевірте що ВСІ 8 змінних додані

### Інші помилки:
📝 Скопіюйте помилку з логів та напишіть мені

---

## Список всіх 8 обов'язкових змінних

- [ ] `DATABASE_URL` (з PlanetScale)
- [ ] `DB_SSL` (true)
- [ ] `PORT` (3000)
- [ ] `JWT_SECRET` (згенерований)
- [ ] `APP_BASE_URL` (ваш Render URL)
- [ ] `FRONTEND_URL` (ваш фронтенд)
- [ ] `MAIL_USER` (Gmail)
- [ ] `MAIL_PASS` (App Password)

Готово! 🎉
