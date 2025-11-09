# Design Guide Generator – מערכת מדריך עיצוב + קוד

## מטרת הפרויקט

הפרויקט נועד ליצור **צינור עבודה מלא** שבו:

1. מודל שפה (LLM) מקבל **brief** עיצובי (design_request) ומפיק:
   - מדריך עיצוב מלא (Design Guide)
   - מערכת טוקנים (Design Tokens)
   - תיאור מסכים (Patterns)
2. קובץ JSON אחד מרכז את כל המידע הזה: `design_guide`  
3. סקריפט ג׳אווהסקריפט אחד ממיר את ה־`design_guide` ל:
   - CSS עם משתני :root ו־`.dark`
   - קובץ `@theme inline` לטיילוינד
   - קובץ `tailwind.config.js`
   - קומפוננטות React לדוגמה (Dashboard, Form, Settings וכו’)

המטרה: לקבל **מערכת עיצוב שלמה, קונסיסטנטית ומדויקת**, שנולדה מטקסט (brief) של משתמש דרך מודל שפה – ועד לקוד מוכן להרצה.



## מבנה הפרויקט

```text
design-system/
  SystemPrompt.xml                 ← ה־System Prompt למודל השפה (לא חובה בקוד, אבל מומלץ לשמור)
  example-design-guide.json        ← פלט לדוגמה ממודל השפה (design_guide מלא)
  design-guide-generator-v1.js     ← הסקריפט שממיר design_guide לקוד

  out/                             ← תיקיית פלט (נוצרת אוטומטית ע"י הסקריפט)
    design-tokens.css              ← :root + .dark עם כל ה־CSS Variables
    theme-inline.css               ← @theme inline לטיילוינד
    tailwind.config.js             ← קובץ קונפיגורציה ל־Tailwind
    DashboardSummaryWithChart.jsx  ← קומפוננטת React לדשבורד
    StandardForm.jsx               ← קומפוננטת React לטופס
    SettingsWithSidebar.jsx        ← קומפוננטת React לעמוד הגדרות + Sidebar
    (אופציונלי) LoginPage.jsx     ← אם יתווסף Pattern מתאים
    (אופציונלי) DataTablePage.jsx ← אם יתווסף Pattern מתאים
    (אופציונלי) ModalConfirm.jsx  ← אם יתווסף Pattern מתאים
````

---

## קבצים מרכזיים ומה תפקידם

### 1. `SystemPrompt.xml`

* מסמך XML שמגדיר למודל השפה:

  * מה התפקיד שלו (מחולל מדריך עיצוב וקוד).
  * איך נראה **קלט** (design_request – brief של המשתמש).
  * איך חייב להיראות **פלט** (design_guide – JSON + code).
  * אילו טוקנים מותרים (שמות משתנים כמו `--background`, `--primary`, וכו’).
  * אילו סקאלות מותרות (מרווחים: 0,4,8,12,16,20,24,32,40,48; גדלי פונטים; רדיוסים).
  * Workflow ברור: ParseRequest → DefineTokens → DefineComponents → DefinePatterns → GenerateCode → Validate.

את הקובץ הזה נותנים למודל כשורת מערכת (System Prompt), כדי שכל הפלט שלו יהיה:

* חד־משמעי
* שלם (לא חלקי)
* עקבי עם הטוקנים והסקאלה

### 2. `example-design-guide.json`

* זהו אובייקט `design_guide` מלא לדוגמה, בפורמט שהמודל אמור להחזיר.
* כולל:

  * `tokens` – כל ה־CSS Variables, סקאלת טיפוגרפיה, סקאלת מרווחים.
  * `guidelines` – הסבר מילולי (בעברית) על טיפוגרפיה, מרווחים, קומפוננטות ו־Patterns.
  * `patterns` – תיאור מדויק של מסכים:

    * `DashboardSummaryWithChart_v1`
    * `StandardForm_v1`
    * `SettingsWithSidebar_v1`
    * (ניתן להוסיף: `LoginPage_v1`, `DataTable_v1`, `ModalConfirm_v1` וכו’)
  * `code` – שדות טקסטואליים שמסומנים כ"ימולא ע"י הגנרטור" (metadata בלבד).

את הקובץ הזה:

* אפשר ליצור ידנית (כמו בדוגמה),
* או לתת למודל השפה לייצר אוטומטית לפי `SystemPrompt.xml`.

### 3. `design-guide-generator-v1.js`

* סקריפט Node.js שמקבל את `example-design-guide.json` ומייצר קוד.
* התפקיד שלו:

  1. לקרוא את `example-design-guide.json`.
  2. להפיק:

     * `out/design-tokens.css` – בלוק :root ו־.dark עם כל המשתנים.
     * `out/theme-inline.css` – בלוק @theme inline שממפה את המשתנים ל־Tailwind.
     * `out/tailwind.config.js` – קונפיגורציה מלאה לטיילוינד (colors, spacing, radius, shadows).
     * קומפוננטות React בסיסיות לכל pattern שמופיע ב־`patterns[]`.

הסקריפט דטרמיניסטי:

* משתמש רק בטוקנים שהוגדרו.
* משתמש רק בסקאלת מרווחים המותרת.
* מייצר תמיד את אותו קוד עבור אותו קובץ JSON.

### 4. תיקיית `out/`

* נוצרת אוטומטית ע"י הסקריפט.
* מכילה את כל הקבצים שאפשר לחבר ישירות לפרויקט React / Next.js:

  * CSS של הטוקנים
  * @theme inline
  * tailwind.config.js
  * קומפוננטות example

---

## איך להריץ ולהשתמש

### דרישות מוקדמות

* Node.js מותקן (גרסה 16+ מומלץ)
* סביבת פרויקט בסיסית של React / Next.js (לא חובה רק בשביל ההרצה, אבל נדרש לשילוב בפועל)

### שלב 1 – הרצת הגנרטור

בתיקיית `design-system`:

```bash
node design-guide-generator-v1.js
```

אחרי הריצה תראה:

* תיקיית `out/` אם לא הייתה קיימת.
* קבצים:

  * `out/design-tokens.css`
  * `out/theme-inline.css`
  * `out/tailwind.config.js`
  * `out/DashboardSummaryWithChart.jsx`
  * `out/StandardForm.jsx`
  * `out/SettingsWithSidebar.jsx`

### שלב 2 – חיבור לפרויקט React / Next.js

1. מעתיקים את הקבצים המתאימים לפרויקט (למשל לתיקיות):

   ```text
   your-app/
     src/
       components/
         DashboardSummaryWithChart.jsx
         StandardForm.jsx
         SettingsWithSidebar.jsx
     styles/
       design-tokens.css
       theme-inline.css
     tailwind.config.js   ← מחליף או מתמזג עם המ-existing
   ```

2. ב־CSS הראשי של האפליקציה (למשל `src/styles/globals.css` או `src/index.css`) מייבאים:

   ```css
   @import "./design-tokens.css";
   @import "./theme-inline.css";
   ```

3. ב־`tailwind.config.js` של הפרויקט:

   * או מחליפים בקובץ שנוצר ב־`out/tailwind.config.js`
   * או ממזגים את ה־`theme.extend` עם הקונפיגורציה הקיימת.

4. משתמשים בקומפוננטות:

   ```jsx
   import { DashboardSummaryWithChart } from "@/components/DashboardSummaryWithChart";
   import { SettingsWithSidebar } from "@/components/SettingsWithSidebar";

   export default function Page() {
     return (
       <div className="min-h-screen bg-background text-foreground">
         <DashboardSummaryWithChart />
         {/* או */}
         {/* <SettingsWithSidebar /> */}
       </div>
     );
   }
   ```

---

## איך מודל השפה נכנס לתמונה

1. אתה נותן למודל השפה את `SystemPrompt.xml` כ־System Prompt.

2. המשתמש שולח **brief** בפורמט `design_request` (JSON או טקסט שהמודל מתרגם ל־JSON).

3. המודל מחזיר `design_guide` בפורמט כמו `example-design-guide.json`.

4. אתה שומר את הפלט כקובץ JSON, ומריץ:

   ```bash
   node design-guide-generator-v1.js
   ```

5. מתקבלים קבצי קוד מוכנים.

היתרון:
אין “בערך”. כל ערך, צורה, צבע ומרווח מגיעים מטוקנים וסקאלות מוגדרות מראש.
המודל מייצר מדריך עיצוב **שיטתי ושלם**, והסקריפט הופך אותו ליישום טכני.

---

## איך להוסיף Patterns חדשים

1. מוסיפים אובייקט חדש ל־`patterns[]` ב־`design_guide`:

   * למשל `LoginPage_v1`, `DataTable_v1`, `ModalConfirm_v1` (כבר הוגדרו כדוגמאות).

2. מעדכנים (אם רוצים) את `design-guide-generator-v1.js` כדי לייצר גם:

   * `LoginPage.jsx`
   * `DataTablePage.jsx`
   * `ModalConfirm.jsx`

3. מריצים שוב:

   ```bash
   node design-guide-generator-v1.js
   ```

4. הקומפוננטות החדשות יופיעו בתיקיית `out/`.

---

## סיכום

המערכת נותנת לך:

* **שפה אחידה למודל שפה** (System Prompt + סכמות JSON).
* **קובץ עיצוב יחיד** (`design_guide`) שמרכז את כל ההחלטות.
* **סקריפט דטרמיניסטי** שממיר את ההחלטות לקוד CSS/Tailwind/React.
* אפשרות להתרחב לכמות בלתי מוגבלת של דפוסי מסכים (Patterns) מבלי לשבור עקביות.

ניתן להשתמש בזה כבסיס ל:

* Design System גנרי עבור מוצרים שונים.
* כלי אוטומטי ליצירת מדריכי עיצוב ו־UI מותאמים למותג.
* תשתית לפיתוח כלי “AI Designer” שמייצר גם הנחיות וגם קוד בפועל.

```

::contentReference[oaicite:0]{index=0}
```
