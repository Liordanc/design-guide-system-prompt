#!/usr/bin/env bash
set -euo pipefail

# שימוש:
#   bash setup-design-system.sh
# או:
#   bash setup-design-system.sh my-design-system
#
# ברירת מחדל: יוצר תיקייה בשם "design-system"

PROJECT_DIR="${1:-design-system}"

echo "▶ Creating project directory: $PROJECT_DIR"
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

echo "▶ Checking Node.js and npm..."
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js לא מותקן. התקן Node ואז הרץ שוב."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm לא מותקן. התקן npm ואז הרץ שוב."
  exit 1
fi

# ---------------------------------------------------------
# 1. יצירת package.json בסיסי (אם אין)
# ---------------------------------------------------------
if [ ! -f package.json ]; then
  echo "▶ Initializing npm (package.json)..."
  npm init -y >/dev/null 2>&1
else
  echo "ℹ package.json כבר קיים - אשמור גיבוי ב-package.json.bak ואדרוס אותו בתבנית שלנו."
  cp package.json package.json.bak
fi

# ---------------------------------------------------------
# 2. יצירת מבנה תיקיות בסיסי
# ---------------------------------------------------------
echo "▶ Creating src/ and out/ directories..."
mkdir -p src
mkdir -p out

# ---------------------------------------------------------
# 3. יצירת קובץ קלט לטיילוינד: src/tailwind-input.css
# ---------------------------------------------------------
if [ ! -f src/tailwind-input.css ]; then
  echo "▶ Creating src/tailwind-input.css..."
  cat > src/tailwind-input.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF
else
  echo "ℹ src/tailwind-input.css כבר קיים – לא נוגע בו."
fi

# ---------------------------------------------------------
# 4. יצירת package.json עם סקריפטים build
#    (נשענים על design-guide-generator-v2-html.js שתשים כאן)
# ---------------------------------------------------------
echo "▶ Writing package.json with build scripts..."

cat > package.json << 'EOF'
{
  "name": "design-system-generator",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build:design": "node design-guide-generator-v2-html.js",
    "build:css": "npx tailwindcss -i ./src/tailwind-input.css -o ./out/styles.css --config ./out/tailwind.config.js",
    "build": "npm run build:design && npm run build:css"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0"
  }
}
EOF

# ---------------------------------------------------------
# 5. התקנת Tailwind לפי ה-package.json
# ---------------------------------------------------------
echo "▶ Installing TailwindCSS (npm install)..."
npm install >/dev/null 2>&1

# ---------------------------------------------------------
# 6. יצירת קבצי placeholder אם חסרים
#    (כדי שיהיה ברור מה צריך לשים איפה)
# ---------------------------------------------------------

if [ ! -f design-guide-generator-v2-html.js ]; then
  echo "▶ Creating placeholder design-guide-generator-v2-html.js (תצטרך להדביק כאן את הקוד המלא שלך)..."
  cat > design-guide-generator-v2-html.js << 'EOF'
// design-guide-generator-v2-html.js
// ----------------------------------------------------------
// PLACEHOLDER ONLY
// ----------------------------------------------------------
// כאן צריך להדביק את הקוד המלא של הגנרטור
// שקיבלתי מהעוזר (הגרסה שמייצרת:
//  - out/design-tokens.css
//  - out/theme-inline.css
//  - out/tailwind.config.js
//  - out/dashboard.html / out/form.html / out/settings.html)
//
// אחרי שתדביק כאן את הגרסה המלאה – אפשר למחוק את ההערות האלה.
console.log("❗ design-guide-generator-v2-html.js הוא placeholder. הדבק כאן את הקוד המלא של הגנרטור.");
process.exit(1);
EOF
else
  echo "ℹ design-guide-generator-v2-html.js כבר קיים – לא יצרתי placeholder."
fi

if [ ! -f example-design-guide.json ]; then
  echo "▶ Creating placeholder example-design-guide.json (תוכל להחליף בקובץ המלא שלך)..."
  cat > example-design-guide.json << 'EOF'
{
  "design_guide_id": "PLACEHOLDER",
  "tokens": {
    "css_root_variables": {},
    "css_dark_variables": {},
    "typography_scale": {},
    "spacing_scale_px": []
  },
  "guidelines": {},
  "patterns": [],
  "code": {}
}
EOF
else
  echo "ℹ example-design-guide.json כבר קיים – לא יצרתי placeholder."
fi

# ---------------------------------------------------------
# 7. סיום
# ---------------------------------------------------------
echo ""
echo "✅ Setup הושלם."
echo "   תיקייה: $(pwd)"
echo ""
echo "שלבים הבאים:"
echo "1. פתח את הקובץ design-guide-generator-v2-html.js והדבק בו את הקוד המלא של הגנרטור."
echo "2. פתח את example-design-guide.json והדבק בו את ה-design_guide המלא שלך."
echo "3. הרץ:"
echo "     npm run build"
echo "   זה יבנה:"
echo "     - out/design-tokens.css"
echo "     - out/theme-inline.css"
echo "     - out/tailwind.config.js"
echo "     - out/styles.css (Tailwind build)"
echo "     - out/*.html (Dashboard / Form / Settings לפי הפטרנים)"
echo ""
echo "4. פתח בדפדפן את:"
echo "     out/dashboard.html"
echo "     out/form.html"
echo "     out/settings.html"
echo ""
EOF
