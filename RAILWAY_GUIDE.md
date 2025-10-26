# 🚀 Найпростіший спосіб: Railway (100% безкоштовно)

## За 3 хвилини отримаєте DATABASE_URL

### Крок 1: Створіть акаунт (30 сек)
1. Відкрийте https://railway.app
2. Натисніть **"Login"** → **"Login with GitHub"**
3. Авторизуйте Railway

### Крок 2: Створіть MySQL (1 хв)
1. Після входу натисніть **"New Project"**
2. Виберіть **"Deploy MySQL"**
3. Чекайте 20-30 секунд

### Крок 3: Скопіюйте DATABASE_URL (30 сек)
1. Клікніть на MySQL сервіс (фіолетовий блок)
2. Перейдіть на вкладку **"Variables"**
3. Знайдіть **DATABASE_URL**
4. Натисніть кнопку "Copy" справа від значення

Приклад що скопіюється:
```
mysql://root:bKx9fL2mPqR8vN@containers-us-west-56.railway.app:7432/railway
```

### Крок 4: Вставте на Render (1 хв)
1. Render Dashboard → ваш сервіс → Settings → Environment
2. Add Environment Variable:
   - Key: `DATABASE_URL`
   - Value: [вставте скопійоване]
3. Додайте ще одну змінну:
   - Key: `DB_SSL`
   - Value: `true`

**Готово! Railway база працює безкоштовно ($5 кредиту щомісяця).**

---

## Інші обов'язкові змінні для Render:

```
PORT=3000
JWT_SECRET=[згенеруйте: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
APP_BASE_URL=https://your-service.onrender.com
FRONTEND_URL=https://your-frontend.com
MAIL_USER=your@gmail.com
MAIL_PASS=[Gmail App Password]
```

---

## Gmail App Password (1 хв):

1. https://myaccount.google.com/apppasswords
2. Create → назвіть "Backend"
3. Скопіюйте 16 символів

---

## JWT Secret (10 сек):

Виконайте у терміналі:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Чеклист ✅

- [ ] Railway: створив MySQL, скопіював DATABASE_URL
- [ ] Render: додав DATABASE_URL та DB_SSL=true
- [ ] Render: додав PORT=3000
- [ ] Згенерував JWT_SECRET та додав
- [ ] Додав APP_BASE_URL та FRONTEND_URL
- [ ] Створив Gmail App Password та додав MAIL_USER + MAIL_PASS
- [ ] Натиснув Save Changes на Render

**Після цього Render передеплоїть і все запрацює!** 🎉
