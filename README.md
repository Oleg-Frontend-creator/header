# 🧭 Руководство по работе с меню

## 📋 Оглавление
- [Структура проекта](#-структура-проекта)
- [Архитектура меню](#-архитектура-меню)
- [Добавление/изменение пунктов](#-добавлениеизменение-пунктов)
- [Создание новых уровней](#-создание-новых-уровней)
- [Интеграция в проект](#-интеграция-меню-в-ванильный-JS-проект)
- [Безопасность и отладка](#-безопасность-и-отладка)
- [Частые вопросы](#-частые-вопросы)

## 📁 Структура проекта

```
project/
├── index.html (или header.html)
├── scripts/
│   ├── main.js
│   └── components/
│       └── header-component.js
├── styles/
│   └── header.css
└── assets/
    ├── fonts/
    └── images/
```

## 🏗️ Архитектура меню

### Уровни вложенности
```
┌─────────────────────────────────────┐
│  Уровень 1: Главное меню            │
│  • Продукция (catalog-link)         │
│  • О компании                       │
│  • Исследования (research-link)     │
│  • Подбор КПТД                      │
│  • Контакты                         │
└─────────────────┬───────────────────┘
                  │ (клик)
┌─────────────────▼───────────────────┐
│  Уровень 2: Первое боковое меню     │
│  • Весь каталог                     │
│  • КПТД-1 (data-kptd="1") ──────────┼──┐
│  • КПТД-2 (data-kptd="2")           │  │ (клик)
│  • КПТД-2М (data-kptd="3")          │  │
│  • КПТД-3 (data-kptd="4")           │  │
│  • КПТД-4 (data-kptd="5")           │  │
└─────────────────────────────────────┘  │
                                         ▼
┌─────────────────────────────────────────────────────┐
│  Уровень 3: Второе боковое меню (опционально)       │
│  • Каталог товаров КПТД-1                           │
│  • Подробнее о КПТД-1                               │
│  • Свойства и характеристики КПТД-1                 │
│  • Сравнительная таблица КПТД-1                     │
│  • Расчёт свойств КПТД-1                            │
│  • Применение КПТД-1                                │
│  • Ответы на вопросы о КПТД-1                       │
└─────────────────────────────────────────────────────┘
```

### HTML-структура
```html
<!-- Главное меню -->
<header class="header" id="header">...</header>
<div class="burger" id="burger">...</div>
<aside class="submenu-layout" id="submenu-layout">
    <!-- Уровень 1 (мобильное меню) -->
    <nav class="first-submenu header-mobile-menu" id="header-mobile-menu">...</nav>
    
    <!-- Уровень 2 (каталог) -->
    <nav class="first-submenu catalog-submenu" id="catalog-submenu">...</nav>
    
    <!-- Уровень 2 (исследования) -->
    <nav class="first-submenu research-submenu" id="research-submenu">...</nav>
    
    <!-- Уровень 3 (детализация каталога) -->
    <nav class="second-submenu" id="catalog-second-submenu">...</nav>
</aside>
<div class="overlay" id="overlay"></div>
```

## 🔧 Добавление/изменение пунктов

### 1. Добавить пункт в главное меню (десктоп)

**HTML:**
```html
<li class="menu-item">
    <a href="javascript:void(0)" class="common-link" id="new-section-link">
        Новый раздел
    </a>
</li>
```

**JavaScript (header-component.js):**
```javascript
// 1. Объявить переменную в начале функции initHeaderMenu()
const newSectionLinkEl = document.getElementById("new-section-link");
const newSectionSubmenuEl = document.getElementById("new-section-submenu");

// 2. Добавить обработчик в функцию initSubmenu()
newSectionLinkEl.addEventListener("click", () => {
    if (newSectionLinkEl.classList.contains("active")) {
        refreshMenu();
        return;
    }
    
    refreshMenu();
    overlayEl.classList.add("open");
    document.body.style.overflow = "hidden";
    
    newSectionLinkEl.classList.add("active");
    newSectionSubmenuEl.classList.add("open");
    submenuLayoutEl.classList.add("open");
});
```

### 2. Добавить пункт в боковое меню первого уровня

**HTML (внутри catalog-submenu):**
```html
<li class="submenu-item">
    <a class="common-link" href="javascript:void(0)" data-kptd="6">
        <span>КПТД-6 – новый материал</span>
        <svg class="link-arrow">...</svg>
    </a>
</li>
```

**HTML (добавить соответствующий блок для второго уровня):**
```html
<ul class="submenu-items" id="kptd-menu-list-6">
    <li class="submenu-item">
        <a class="common-link" href="/catalog/kptd-6">
            <span>Каталог товаров КПТД-6</span>
            <svg>...</svg>
        </a>
    </li>
    <!-- дополнительные пункты -->
</ul>
```

## 🚀 Создание новых уровней

### Механизм создания меню N-го уровня

#### Шаг 1: HTML-разметка
```html
<!-- Шаблон для уровня N -->
<nav class="nth-submenu" id="catalog-nth-submenu">
    <div class="submenu-item back-link">
        <a class="common-link" href="javascript:void(0)">
            <svg>...</svg>
            <span>Назад</span>
        </a>
    </div>
    <ul class="submenu-items" id="nth-menu-list-1">
        <!-- Пункты меню уровня N -->
    </ul>
</nav>
```

#### Шаг 2: CSS-стили
```css
/* header.css */
.submenu-layout {
    &.open {
        /* Добавить для каждого нового уровня */
        &.n-menus {
            width: calc(340px * n);
        }
    }
}

/* Стили для уровня N */
nav.nth-submenu {
    width: 340px;
    transform: translateX(calc(-340px * (n - 1))); /* Сдвиг */
    opacity: 0;
    transition: all 0.3s ease;
    display: none;
    
    &.open {
        transform: translateX(0);
        opacity: 1;
        display: block;
    }
}
```

#### Шаг 3: JavaScript-обработчики

```javascript
// header-component.js

// 1. Добавить переменные
const nthSubmenuEl = document.getElementById("catalog-nth-submenu");
const nthMenuListEls = document.querySelectorAll('.nth-submenu .submenu-items');
const prevLevelLinks = document.querySelectorAll('.previous-level .common-link[data-nth]');

// 2. Создать функцию инициализации
const initNthSubmenu = () => {
    prevLevelLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            if(link.classList.contains("active")) {
                link.classList.remove("active");
                nthSubmenuEl.classList.remove("open");
                submenuLayoutEl.classList.remove("n-menus");
                return;
            }
            
            // Сброс активных состояний
            prevLevelLinks.forEach(l => l.classList.remove("active"));
            nthMenuListEls.forEach(list => list.style.display = "none");
            
            // Активация текущего пункта
            link.classList.add('active');
            
            // Определяем режим (мобильный/десктоп)
            if(burgerMenuEl.classList.contains("open")) {
                // Мобильный: скрываем предыдущий уровень
                document.querySelector('.previous-level').classList.remove("open");
            } else {
                // Десктоп: расширяем область
                submenuLayoutEl.classList.add("n-menus");
            }
            
            // Показываем уровень N
            nthSubmenuEl.classList.add('open');
            
            // Показываем соответствующий список
            const itemId = link.dataset.nth;
            const targetList = document.getElementById(`nth-menu-list-${itemId}`);
            if(targetList) targetList.style.display = "flex";
        });
    });
};

// 3. Обновить refreshMenu()
const refreshMenu = () => {
    // ... существующий код ...
    nthSubmenuEl.classList.remove("open");
    submenuLayoutEl.classList.remove("n-menus");
    prevLevelLinks.forEach(link => link.classList.remove("active"));
    nthMenuListEls.forEach(list => list.style.display = "none");
};

// 4. Обновить initMobileSubmenu() для кнопки "Назад"
const initMobileSubmenu = () => {
    // ... существующий код ...
    
    backLinkEls.forEach(link => {
        link.addEventListener('click', () => {
            // ... существующая логика ...
            
            if (nthSubmenuEl.classList.contains('open')) {
                // Возврат на предыдущий уровень
                prevLevelLinks.forEach(l => l.classList.remove("active"));
                nthSubmenuEl.classList.remove("open");
                document.querySelector('.previous-level').classList.add("open");
            }
        });
    });
};

// 5. Вызвать в initHeaderMenu()
initNthSubmenu();
```

## 🚀 Интеграция меню в ванильный JS проект

## 📁 **СТРУКТУРА ПРОЕКТА**

### Создайте такую структуру папок:
```
ваш-проект/
├── index.html
├── styles/
│   └── header.css
├── scripts/
│   ├── main.js
│   └── components/
│       └── header-component.js
└── assets/
    ├── fonts/
    │   └── Nunito-Light.woff2
    └── images/
        └── logo.png
```

---

## 📝 **Шаг 1: Подготовка файлов**

### ✅ **Файл 1: styles/header.css**
- Файл header.css из архива положите в папку `ваш-проект/styles/`

### ✅ **Файл 2: scripts/components/header-component.js**
- Файл header-component.js из архива положите в папку `ваш-проект/scripts/components/`

### ✅ **Файл 3: scripts/main.js**
- Файл main.js из архива положите в папку `ваш-проект/scripts/`
- 
### ✅ **Файл 4: index.html**
- Файл index.html должен лежать в корне проекта`

---

## 🖼️ **Шаг 2: Подготовка изображений и шрифтов**

### 📁 **Папка assets/fonts/**
- Шрифт из архива положите в папку `ваш-проект/assets/fonts/Nunito-Light.woff2`

### 📁 **Папка assets/images/**
- Логотип из архива положите в папку `ваш-проект/assets/images/logo.png`

---

## 🌐 **Шаг 3: Вставка в index.html**

### ✂️ **Вставьте код ВНУТРИ тега `<body>`** в самое начало вашего шаблона html (index.html)
---

## 🔧 **Шаг 4: Подключение в `<head>` index.html**

### ✂️ **Вставьте в раздел `<head>`:**
```html
<!-- Подключение стилей меню -->
<link rel="stylesheet" href="styles/header.css">
```
 Если вы делаете сборку через entry-point, то подключаем файл header.css через import в главный файл (рекомендую подключать в критические ресурсы)

---

## 📦 **Шаг 5: Подключение скриптов**

### ✂️ **Вставьте перед закрывающим `</body>`:**
```html
<!-- Подключение скриптов меню -->
<script src="scripts/main.js" type="module"></script>
```
Если вы делаете сборку через entry-point, то подключаем файл header.js через import в главный файл (рекомендую подключать в асинхронные ресурсы для уменьшения размера файла скриптов, блокирующих рендер шаблона)

---

**Время интеграции**: ~10-15 минут

## ⚠️ Безопасность и отладка

### Контрольный список безопасности
1. **Управление overflow:**
    - Всегда сбрасывайте `document.body.style.overflow = "unset"` в `refreshMenu()`
    - Проверяйте, что body не остается заблокированным

2. **Z-index иерархия:**
   ```
   burger (мобильный): z-index: 4
   header, submenu-layout: z-index: 3
   overlay: z-index: 2
   основной контент: z-index: 1
   ```

### Тестирование на разных устройствах

| Устройство | Брейкпоинт | Особенности |
|------------|------------|-------------|
| Десктоп | > 996px | Меню слева, два уровня одновременно |
| Планшет | 500-996px | Бургер-меню, выезд справа |
| Мобильный | < 500px | Узкое меню (320px) |

## ❓ Частые вопросы

### Q: Как добавить третий уровень к существующему меню?
**A:** Следуйте паттерну выше. Пример для добавления третьего уровня к КПТД-1:
```html
<!-- В catalog-second-submenu добавьте ссылку с data-атрибутом -->
<a class="common-link" href="javascript:void(0)" data-third="1">
    <span>Подробные спецификации</span>
    <svg>...</svg>
</a>

<!-- Создайте контейнер для третьего уровня -->
<nav class="third-submenu" id="third-submenu">
    <!-- контент -->
</nav>
```

## Общие рекомендации

Для сложных структур меню рекомендуется:
- Использовать не более 3 уровней вложенности
- Оптимизировать количество пунктов (не более 10 на уровень)