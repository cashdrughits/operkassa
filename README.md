# Деплой ОперКасса на сервер

## Структура проекта

```
operkassa/
├── index.html              ← фронтенд сайта
├── assets/
│   └── globals.css
├── scripts/
│   └── javascript.js       ← теперь грузит /api/rates
├── admin/
│   ├── app.py              ← Flask-приложение
│   ├── init_db.py          ← первичная инициализация БД
│   ├── requirements.txt
│   ├── rates.db            ← создаётся автоматически
│   └── templates/
│       ├── login.html
│       └── dashboard.html
├── operkassa.service       ← systemd-unit
└── nginx.conf              ← конфиг nginx
```

---

## Установка на Ubuntu/Debian сервер

### 1. Клонировать репозиторий

Папку можно выбрать любую — `/var/www/operkassa`, `/opt/operkassa`, `/home/ubuntu/operkassa` и т.д.
Пример с `/opt`:

```bash
git clone https://github.com/твой-юзер/твой-репо.git /opt/operkassa
```

> Если репо приватное, настрой deploy key:
> `ssh-keygen -t ed25519 -f ~/.ssh/deploy_key` → добавь публичный ключ в GitHub → Settings → Deploy keys.

### 2. Виртуальное окружение и зависимости

```bash
cd /opt/operkassa
python3 -m venv venv
source venv/bin/activate
pip install -r admin/requirements.txt
```

### 3. Инициализировать БД и создать первого admin

```bash
cd /opt/operkassa/admin

# Дефолтный пароль admin123 (смените после входа!)
python init_db.py

# Или сразу с нужным паролем:
ADMIN_PASSWORD=ВашПароль python init_db.py
```

### 4. Отредактировать и установить systemd-сервис

Открой `operkassa.service` и замени пути если выбрал не `/var/www`:

```bash
nano /opt/operkassa/operkassa.service
```

Поменяй строки:
```ini
WorkingDirectory=/opt/operkassa/admin
ExecStart=/opt/operkassa/venv/bin/gunicorn \
```

Также **обязательно** замени `SECRET_KEY` на случайную строку:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Затем установи сервис:

```bash
cp /opt/operkassa/operkassa.service /etc/systemd/system/
mkdir -p /var/log/operkassa
chown -R $USER:$USER /opt/operkassa   # или www-data если нужно

systemctl daemon-reload
systemctl enable operkassa
systemctl start operkassa
systemctl status operkassa
```

### 5. Настроить nginx

```bash
cp /opt/operkassa/nginx.conf /etc/nginx/sites-available/operkassa
ln -s /etc/nginx/sites-available/operkassa /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 6. SSL через certbot

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d operkassa.online
```
После этого раскомментируйте HTTPS-блок в nginx.conf.

### 7. Обновление сайта в будущем

```bash
cd /opt/operkassa
git pull
systemctl restart operkassa
```

---

## Использование

| URL | Что |
|-----|-----|
| `https://operkassa.online/` | Публичный сайт |
| `https://operkassa.online/api/rates` | JSON с курсами (для сайта) |
| `https://operkassa.online/admin` | Вход в панель управления |
| `https://operkassa.online/admin/logout` | Выход |

### Как менять курсы

1. Зайти на `/admin`
2. Ввести логин/пароль
3. Изменить покупку/продажу, переключить «В наличии» или «Показывать»
4. Нажать **«Сохранить курсы»**

Сайт подхватит изменения мгновенно (JS опрашивает `/api/rates` каждые 60 секунд).

### Переменные окружения (в operkassa.service)

| Переменная | Описание |
|---|---|
| `SECRET_KEY` | Ключ сессий Flask — случайная строка, **обязательно смените** |
| `ADMIN_PASSWORD` | Только для `init_db.py`, после инициализации не нужна |
| `PORT` | Порт gunicorn (по умолчанию 5000) |

---

## Быстрая генерация SECRET_KEY

```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```