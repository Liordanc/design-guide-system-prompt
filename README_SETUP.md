**`README_SETUP.md`** באותה תיקייה עם הסקריפט `setup-design-system.sh`.

---


# 🧩 מדריך התקנה והפעלה – Design System Generator

## 🎯 מטרת הסקריפט

הסקריפט `setup-design-system.sh` נועד להקים אוטומטית סביבה מלאה לפרויקט **Design System Generator**, הכוללת:

- התקנת `Node.js` ו־`TailwindCSS` (אם אינם קיימים)
- יצירת מבנה תיקיות מלא (`src`, `out`)
- יצירת קובץ קלט לטיילוינד
- יצירת `package.json` עם סקריפטי build מוכנים
- הכנת קבצי Placeholder ל:
  - `design-guide-generator-v2-html.js`
  - `example-design-guide.json`

לאחר מכן תוכל להריץ את פקודת **`npm run build`** שתבצע:
1. הפקת קבצי עיצוב ו־HTML מה־generator  
2. יצירת Build מלא של TailwindCSS (`styles.css`)  
3. פתיחה פשוטה של קבצי HTML מוכנים בדפדפן.

---

## 📁 מבנה הפרויקט שנוצר

לאחר הרצת הסקריפט, תיווצר תיקייה בסגנון:

```

design-system/
├── example-design-guide.json
├── design-guide-generator-v2-html.js
├── package.json
├── src/
│   └── tailwind-input.css
├── out/             ← יווצר אוטומטית ע"י ה-build
│   ├── design-tokens.css
│   ├── theme-inline.css
│   ├── tailwind.config.js
│   ├── styles.css
│   ├── dashboard.html
│   ├── form.html
│   └── settings.html
└── node_modules/

````

---

## ⚙️ התקנה והרצה

### שלב 1 – הפעלת הסקריפט

1. שמור את הקובץ `setup-design-system.sh` בתיקייה לבחירתך.  
2. פתח טרמינל (Command Prompt / PowerShell / Bash).  
3. הרץ את הפקודה:

```bash
bash setup-design-system.sh
````

אם תרצה ליצור פרויקט בשם אחר:

```bash
bash setup-design-system.sh my-design-system
```

---

### שלב 2 – השלמת קבצי התוכן

לאחר שהסקריפט סיים, גש לתיקיית הפרויקט ופתח:

1. **`design-guide-generator-v2-html.js`**
   הדבק כאן את הקוד המלא של הסקריפט הגנרטור שייצר HTML + Tailwind.

2. **`example-design-guide.json`**
   הדבק כאן את קובץ ה־`design_guide` המלא שלך
   (עם ה־tokens, ה־patterns וה־guidelines).

---

### שלב 3 – בנייה והרצה

בתיקיית הפרויקט, הרץ:

```bash
npm run build
```

מה שקורה מאחורי הקלעים:

1. `npm run build:design` → מפעיל את ה־generator שלך ומייצר את קבצי העיצוב וה־HTML.
2. `npm run build:css` → מריץ את Tailwind ובונה את הקובץ `out/styles.css` לפי ה־config שנוצר.

---

### שלב 4 – צפייה בתוצאה

לאחר סיום הבנייה, פתח בתיקייה `out/`:

* `dashboard.html`
* `form.html`
* `settings.html`

כל קובץ HTML כבר כולל את כל ה־CSS הנדרש:

```html
<link rel="stylesheet" href="./design-tokens.css" />
<link rel="stylesheet" href="./theme-inline.css" />
<link rel="stylesheet" href="./styles.css" />
```

פשוט לחץ עליו פעמיים או גרור לדפדפן כדי לראות את הממשק המעוצב.

---

## 🧠 סקריפטים זמינים

| פקודה                  | תיאור                                                                        |
| ---------------------- | ---------------------------------------------------------------------------- |
| `npm run build:design` | מריץ את הסקריפט `design-guide-generator-v2-html.js` ומייצר HTML + CSS Tokens |
| `npm run build:css`    | מריץ Tailwind ובונה `out/styles.css` לפי ה־config שנוצר                      |
| `npm run build`        | מריץ את שניהם ברצף (בנייה מלאה)                                              |

---

## 💡 טיפים להרחבה

* ניתן להוסיף פטרנים חדשים ב־`example-design-guide.json`
  (כמו `LoginPage_v1`, `DataTable_v1`, `ModalConfirm_v1`)
  ולהוסיף את התמיכה בהם ב־`design-guide-generator-v2-html.js`.

* אם תרצה **שרת פיתוח חי (watch mode)** — אפשר להוסיף בהמשך:

  ```json
  "scripts": {
    "dev": "npx tailwindcss -i ./src/tailwind-input.css -o ./out/styles.css --config ./out/tailwind.config.js --watch"
  }
  ```

  ואז להריץ:

  ```bash
  npm run dev
  ```

---

## 🧱 דרישות מערכת

* Node.js 16 ומעלה
* npm (מותקן עם Node)
* Bash או PowerShell (Windows Subsystem for Linux נתמך)

---

## ✅ סיכום

לאחר ההתקנה תוכל:

1. לייצר **Design System מלא** ממודל שפה (LLM) או מקובץ JSON.
2. לראות תוצאה ויזואלית מלאה בדפדפן.
3. להרחיב בקלות את הקונפיגורציה והפטרנים.

---

**מאת:**
🧠 ליאור זיני – Design System Generator Automation (GPT-5)

```
--- 

הקובץ הזה ישמש כ־README ראשי שיסביר לכל מי שמוריד את הפרויקט איך להתקין, להריץ ולהרחיב את המערכת שלך בפקודה אחת.
```
