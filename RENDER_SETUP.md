# Інструкція з налаштування на Render

## Крок 1: Створіть базу даних MySQL (БЕЗКОШТОВНО)

### Варіант A: Railway ⭐ РЕКОМЕНДУЮ

**Чому Railway:**
- ✅ 100% безкоштовно для початку ($5 кредиту щомісяця)
- ✅ Дуже простий в налаштуванні
- ✅ Автоматично створює DATABASE_URL
- ✅ SSL вже налаштовано

**Інструкція:**

1. Зайдіть на https://railway.app
2. Натисніть **"Start a New Project"**
3. Авторизуйтесь через GitHub
4. Виберіть **"Deploy MySQL"**
5. Чекайте 30 секунд поки створюється
6. Клікніть на MySQL сервіс (фіолетовий блок)
7. Перейдіть на вкладку **"Variables"**
8. Знайдіть змінну **`DATABASE_URL`**
9. Натисніть на неї та скопіюйте повністю

Приклад того що скопіюєте:
```
mysql://root:abcd1234efgh@containers-us-west-123.railway.app:6789/railway
```

**Важливо для Railway:**
- Використовуйте `DB_SSL=true` на Render
- URL вже містить всю інформацію

---

### Варіант B: Aiven

**Чому Aiven:**
- ✅ Безкоштовний план навсегда
- ✅ 1 база даних на акаунт
- ✅ Підтримка SSL

**Інструкція:**

1. Зайдіть на https://aiven.io
2. Натисніть **"Sign Up"** → через GitHub або email
3. Після реєстрації: **"Create Service"**
4. Виберіть **MySQL**
5. План: **"Free-1"** (EU або US регіон)
6. Натисніть **"Create Service"**
7. Чекайте 2-3 хвилини поки статус стане "Running"
8. Перейдіть на вкладку **"Overview"**
9. Прокрутіть до **"Connection information"**
10. Знайдіть **"Service URI"** або складіть вручну:

```
mysql://avnadmin:[PASSWORD]@mysql-xxxxx.aivencloud.com:12345/defaultdb?ssl-mode=REQUIRED
```

**Важливо для Aiven:**
- Host закінчується на `.aivencloud.com`
- Завжди використовуйте `DB_SSL=true`
- База називається `defaultdb`

---

### Варіант C: FreeSQLDatabase (найпростіший)

**Чому FreeSQLDatabase:**
- ✅ Реєстрація за 1 хвилину
- ✅ Без кредитної картки
- ✅ Просто та швидко

**Інструкція:**

1. Зайдіть на https://www.freesqldatabase.com
2. Натисніть **"Sign Up"**
3. Заповніть email та пароль
4. Підтвердіть email
5. **"Create Database"**
6. Отримаєте credentials:
   ```
   Host: sql123.freesqldatabase.com
   Database Name: sql123_database
   Username: sql123_user
   Password: xxxxxxxx
   Port: 3306
   ```

7. Складіть DATABASE_URL самостійно:
```
mysql://sql123_user:xxxxxxxx@sql123.freesqldatabase.com:3306/sql123_database
```

**Формат:**
```
mysql://[Username]:[Password]@[Host]:[Port]/[Database Name]
```

---

### Варіант D: Render PostgreSQL → MySQL альтернатива

**Якщо готові використати PostgreSQL замість MySQL:**

Render надає безкоштовний PostgreSQL (але потрібно буде трохи змінити код).

Я можу допомогти адаптувати проект під PostgreSQL якщо хочете - це теж безкоштовно на Render.

---

## Порівняння безкоштовних варіантів:

| Провайдер | Складність | Ліміти | SSL |
|-----------|------------|--------|-----|
| **Railway** ⭐ | Дуже легко | $5/місяць кредиту | Авто |
| **Aiven** | Середньо | 1 база, 1GB | Так |
| **FreeSQLDatabase** | Легко | Обмежені запити | Опціонально |
| Render PostgreSQL | Легко | 90 днів безкоштовно | Так |

**Рекомендую Railway** - найпростіше та надійніше.

---

## Крок 2: Налаштування Gmail для відправки листів

1. Увійдіть у ваш Gmail акаунт
2. Перейдіть на https://myaccount.google.com/security
3. Увімкніть "2-Step Verification" (якщо ще не ввімкнено)
4. Поверніться на https://myaccount.google.com/apppasswords
5. Створіть новий App Password:
   - Назвіть його "RealEstate Backend"
   - Скопіюйте згенерований пароль (16 символів без пробілів)
   - Це буде ваш `MAIL_PASS`

---

## Крок 3: Згенеруйте JWT_SECRET

У терміналі виконайте:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Або скопіюйте цей приклад (але краще згенеруйте свій):
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

---

## Крок 4: Додайте змінні оточення на Render

1. Зайдіть на https://dashboard.render.com
2. Виберіть ваш Web Service
3. Перейдіть в **Settings → Environment**
4. Натисніть **Add Environment Variable**
5. Додайте **ВСІ** ці змінні:

### Обов'язкові змінні:

```
DATABASE_URL=mysql://[скопійоване з кроку 1]
DB_SSL=true
PORT=3000
JWT_SECRET=[згенероване з кроку 3]
FRONTEND_URL=https://your-frontend-domain.com
APP_BASE_URL=https://your-backend.onrender.com
MAIL_USER=your-email@gmail.com
MAIL_PASS=[app password з кроку 2]
```

### Опціонально (Google OAuth - можна додати пізніше):

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/auth/google/redirect
```

---

## Крок 5: Конкретні значення для заповнення

Замініть ці значення на свої:

| Змінна | Що вписати | Приклад |
|--------|-----------|---------|
| `DATABASE_URL` | Connection string з PlanetScale/Railway | `mysql://user:pass@host.psdb.cloud/db?ssl=...` |
| `DB_SSL` | Завжди `true` для хмарних баз | `true` |
| `PORT` | Завжди `3000` | `3000` |
| `JWT_SECRET` | Згенерований 64-символьний ключ | `a1b2c3d4e5f6...` |
| `FRONTEND_URL` | URL вашого фронтенду | `https://myapp.vercel.app` |
| `APP_BASE_URL` | URL вашого бекенду на Render | `https://myapi.onrender.com` |
| `MAIL_USER` | Ваш Gmail | `myemail@gmail.com` |
| `MAIL_PASS` | 16-символьний app password | `abcd efgh ijkl mnop` (без пробілів) |

---

## Крок 6: Збережіть та задеплойте

1. Після додавання всіх змінних натисніть **Save Changes**
2. Render автоматично почне новий деплой
3. Перевірте логи - має з'явитися:
   ```
   🚀 Server running on http://localhost:3000
   ```

---

## Перевірка що все працює

### 1. Перевірте що сервер запустився:

Відкрийте в браузері:
```
https://your-backend.onrender.com
```

Має показати: `"Hello World!"` або подібне повідомлення.

### 2. Перевірте підключення до БД:

В логах Render має бути:
```
[TypeOrmModule] TypeOrmModule dependencies initialized
```

Без помилок ECONNREFUSED.

### 3. Перевірте API:

```
https://your-backend.onrender.com/profile
```

Має повернути 401 Unauthorized (це нормально - значить API працює).

---

## Troubleshooting

### Якщо все одно ECONNREFUSED:
- Перевірте що `DATABASE_URL` правильно скопійована (без зайвих пробілів)
- Перевірте що `DB_SSL=true` встановлено
- Спробуйте видалити та додати знову змінну `DATABASE_URL`

### Якщо "No open ports detected":
- Перевірте що `PORT=3000` встановлено
- Перевірте що всі обов'язкові змінні додані

### Якщо помилка з JWT:
- Перевірте що `JWT_SECRET` містить мінімум 32 символи

---

## Швидкий чеклист ✅

- [ ] Створив базу даних (PlanetScale/Railway/Aiven)
- [ ] Скопіював `DATABASE_URL`
- [ ] Створив Gmail App Password
- [ ] Згенерував `JWT_SECRET`
- [ ] Додав ВСІ 8 обов'язкових змінних на Render
- [ ] Зберіг зміни
- [ ] Перевірив логи - сервер запустився
- [ ] Відкрив URL в браузері - працює

---

## Потрібна допомога?

Напишіть мені що саме не виходить і я допоможу.
