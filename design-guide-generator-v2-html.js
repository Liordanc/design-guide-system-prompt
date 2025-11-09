// design-guide-generator-v2-html.js
// ----------------------------------------------------------
// קורא example-design-guide.json
// מייצר:
//  - out/design-tokens.css
//  - out/theme-inline.css
//  - out/tailwind.config.js
//  - out/dashboard.html (אם קיים DashboardSummaryWithChart_v1)
//  - out/form.html      (אם קיים StandardForm_v1)
//  - out/settings.html  (אם קיים SettingsWithSidebar_v1)
// ----------------------------------------------------------

const fs = require("fs");
const path = require("path");

// סקאלת מרווחים חוקיים (חייבת להתאים ל-design_guide)
const ALLOWED_SPACING_PX = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48];

function assertValidSpacing(px) {
  if (!ALLOWED_SPACING_PX.includes(px)) {
    throw new Error(`Invalid spacing value: ${px}px (not in allowed scale)`);
  }
}

// ==========================================================
// 1. CSS :root + .dark
// ==========================================================

function generateCssRoot(designGuide) {
  const varsLight = designGuide.tokens.css_root_variables;
  if (!varsLight) {
    throw new Error("designGuide.tokens.css_root_variables is missing");
  }

  const varsDark = designGuide.tokens.css_dark_variables || null;

  const linesRoot = [];
  Object.entries(varsLight).forEach(([name, value]) => {
    linesRoot.push(`  ${name}: ${value};`);
  });

  const cssLines = [];
  cssLines.push(":root {");
  cssLines.push(...linesRoot);
  cssLines.push("}");

  if (varsDark) {
    const linesDark = [];
    Object.entries(varsDark).forEach(([name, value]) => {
      linesDark.push(`  ${name}: ${value};`);
    });
    cssLines.push("");
    cssLines.push(".dark {");
    cssLines.push(...linesDark);
    cssLines.push("}");
  }

  return cssLines.join("\n");
}

// ==========================================================
// 2. @theme inline – mapping קבוע מהטוקנים ל-Tailwind
// ==========================================================

function generateInlineTheme() {
  const css = `
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);

  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);

  --radius-sm: var(--radius-sm);
  --radius-md: var(--radius-md);
  --radius-lg: var(--radius-lg);
  --radius-xl: var(--radius-xl);

  --shadow-2xs: var(--shadow-2xs);
  --shadow-xs: var(--shadow-xs);
  --shadow-sm: var(--shadow-sm);
  --shadow: var(--shadow);
  --shadow-md: var(--shadow-md);
  --shadow-lg: var(--shadow-lg);
  --shadow-xl: var(--shadow-xl);
  --shadow-2xl: var(--shadow-2xl);
}
`.trim();

  return css;
}

// ==========================================================
// 3. tailwind.config.js – מבוסס על spacing_scale_px + tokens
// ==========================================================

function generateTailwindConfig(designGuide) {
  const spacingScale = designGuide.tokens.spacing_scale_px;
  if (!Array.isArray(spacingScale)) {
    throw new Error("designGuide.tokens.spacing_scale_px is missing or not array");
  }

  const spacingMap = {};
  spacingScale.forEach((px) => {
    assertValidSpacing(px);
    const key =
      px === 0 ? "0" :
      px === 4 ? "1" :
      px === 8 ? "2" :
      px === 12 ? "3" :
      px === 16 ? "4" :
      px === 20 ? "5" :
      px === 24 ? "6" :
      px === 32 ? "8" :
      px === 40 ? "10" :
      px === 48 ? "12" :
      null;

    if (key === null) {
      throw new Error(`Unsupported spacing px in mapping: ${px}`);
    }
    spacingMap[key] = `${px}px`;
  });

  const config = `
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './out/**/*.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '16px',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '960px',
        xl: '1280px'
      }
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        serif: ['var(--font-serif)'],
        mono: ['var(--font-mono)']
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)'
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)'
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)'
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)'
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)'
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)'
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)'
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          primaryForeground: 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          accentForeground: 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)'
        },
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)'
        }
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)'
      },
      boxShadow: {
        '2xs': 'var(--shadow-2xs)',
        xs: 'var(--shadow-xs)',
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)'
      },
      spacing: ${JSON.stringify(spacingMap, null, 2)}
    }
  },
  plugins: []
};
`.trim();

  return config;
}

// ==========================================================
// 4. HTML מלא לכל Pattern מרכזי
//    HTML כולל:
//    - DOCTYPE
//    - <html lang="he" dir="rtl">
//    - <head> עם קישורים ל-design-tokens.css, theme-inline.css, styles.css
//    - <body> עם מבנה Tailwind מלא
//    styles.css = CSS שנבנה ע"י Tailwind לפי הקונפיג
// ==========================================================

function buildHtmlShell(title, bodyContent) {
  return [
    '<!DOCTYPE html>',
    '<html lang="he" dir="rtl">',
    '<head>',
    '  <meta charset="UTF-8" />',
    `  <title>${title}</title>`,
    '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    '  <!-- design tokens -->',
    '  <link rel="stylesheet" href="./design-tokens.css" />',
    '  <link rel="stylesheet" href="./theme-inline.css" />',
    '  <!-- styles.css צריך להיות CSS שנבנה מטיילוינד לפי tailwind.config.js -->',
    '  <link rel="stylesheet" href="./styles.css" />',
    '</head>',
    '<body class="bg-background text-foreground min-h-screen">',
    bodyContent,
    '',
    '</body>',
    '</html>'
  ].join("\n");
}

// Dashboard HTML
function generateDashboardHtml() {
  const body = `
<main class="min-h-screen flex justify-center">
  <div class="w-full max-w-[960px] px-6 py-6 space-y-6">
    <!-- שורת כרטיסי סיכום -->
    <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div class="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4">
        <div class="text-muted-foreground text-sm mb-1">Metric label</div>
        <div class="text-2xl font-semibold mb-1">0</div>
        <div class="text-muted-foreground text-sm">Secondary text</div>
      </div>
      <div class="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4">
        <div class="text-muted-foreground text-sm mb-1">Metric label</div>
        <div class="text-2xl font-semibold mb-1">0</div>
        <div class="text-muted-foreground text-sm">Secondary text</div>
      </div>
      <div class="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4">
        <div class="text-muted-foreground text-sm mb-1">Metric label</div>
        <div class="text-2xl font-semibold mb-1">0</div>
        <div class="text-muted-foreground text-sm">Secondary text</div>
      </div>
      <div class="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4">
        <div class="text-muted-foreground text-sm mb-1">Metric label</div>
        <div class="text-2xl font-semibold mb-1">0</div>
        <div class="text-muted-foreground text-sm">Secondary text</div>
      </div>
    </section>

    <!-- כרטיס גרף -->
    <section class="w-full">
      <div class="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4">
        <div class="flex items-center justify-between mb-4">
          <div>
            <div class="text-base font-semibold">Chart title</div>
            <div class="text-sm text-muted-foreground">Chart subtitle</div>
          </div>
          <button class="h-8 px-3 bg-card border border-border text-foreground rounded-md text-sm">
            Range
          </button>
        </div>
        <div class="mb-2 h-[260px] bg-muted rounded-md flex items-center justify-center">
          <span class="text-muted-foreground text-sm">
            Chart placeholder
          </span>
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="text-sm font-medium">Trend text</div>
          <div class="text-xs text-muted-foreground">Helper text</div>
        </div>
      </div>
    </section>
  </div>
</main>
`.trim();

  return buildHtmlShell("Dashboard", body);
}

// Form HTML
function generateFormHtml() {
  const body = `
<main class="min-h-screen flex justify-center">
  <div class="w-full max-w-[720px] px-6 py-6 space-y-6">
    <header>
      <h1 class="text-[22px] font-semibold mb-2">FORM_TITLE</h1>
      <p class="text-sm text-muted-foreground mb-4">
        FORM_DESCRIPTION
      </p>
    </header>

    <section class="space-y-6">
      <!-- Group: billing_details -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">
            Full name
          </label>
          <input
            class="h-10 w-full bg-card border border-input text-foreground rounded-md px-3 py-2"
            type="text"
          />
          <p class="mt-1 text-xs text-muted-foreground">
            Helper text (optional)
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            class="h-10 w-full bg-card border border-input text-foreground rounded-md px-3 py-2"
            type="email"
          />
        </div>
      </div>

      <!-- Group: payment_plan -->
      <div class="space-y-4">
        <h2 class="text-base font-semibold">Payment plan</h2>
        <div>
          <label class="block text-sm font-medium mb-1">
            Plan type
          </label>
          <select class="h-10 w-full bg-card border border-input text-foreground rounded-md px-3 py-2">
            <option>Basic</option>
            <option>Pro</option>
            <option>Enterprise</option>
          </select>
        </div>
      </div>
    </section>

    <footer class="flex justify-end gap-2 mt-6">
      <button class="h-10 px-3 bg-secondary text-secondary-foreground rounded-md text-sm">
        Cancel
      </button>
      <button class="h-10 px-4 bg-primary text-primary-foreground rounded-md text-sm">
        Save
      </button>
    </footer>
  </div>
</main>
`.trim();

  return buildHtmlShell("Form", body);
}

// Settings HTML
function generateSettingsHtml() {
  const body = `
<main class="min-h-screen flex justify-center">
  <div class="w-full max-w-[1200px] px-6 py-6">
    <div class="grid grid-cols-[260px,1fr] gap-6">
      <!-- Sidebar -->
      <aside class="bg-sidebar text-sidebar-foreground border border-sidebar-border rounded-lg shadow-2xs p-4">
        <button class="w-full text-right text-sm font-medium px-3 py-2 rounded-md">
          Profile
        </button>
        <button class="w-full text-right text-sm font-medium px-3 py-2 rounded-md bg-sidebar-primary text-sidebar-primary-foreground mt-2">
          Billing
        </button>
        <button class="w-full text-right text-sm font-medium px-3 py-2 rounded-md mt-2">
          Notifications
        </button>
      </aside>

      <!-- Content -->
      <section class="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6">
        <header class="mb-4">
          <h1 class="text-[22px] font-semibold mb-1">
            Billing settings
          </h1>
          <p class="text-sm text-muted-foreground">
            Manage your billing details and subscription.
          </p>
        </header>

        <!-- כאן אנו ממחישים שימוש בטופס הסטנדרטי -->
        <form class="space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">
                Full name
              </label>
              <input
                class="h-10 w-full bg-card border border-input text-foreground rounded-md px-3 py-2"
                type="text"
              />
              <p class="mt-1 text-xs text-muted-foreground">
                Helper text (optional)
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1">
                Email
              </label>
              <input
                class="h-10 w-full bg-card border border-input text-foreground rounded-md px-3 py-2"
                type="email"
              />
            </div>
          </div>

          <div class="space-y-4">
            <h2 class="text-base font-semibold">Payment plan</h2>
            <div>
              <label class="block text-sm font-medium mb-1">
                Plan type
              </label>
              <select class="h-10 w-full bg-card border border-input text-foreground rounded-md px-3 py-2">
                <option>Basic</option>
                <option>Pro</option>
                <option>Enterprise</option>
              </select>
            </div>
          </div>

          <div class="flex justify-end gap-2 mt-6">
            <button class="h-10 px-3 bg-secondary text-secondary-foreground rounded-md text-sm" type="button">
              Cancel
            </button>
            <button class="h-10 px-4 bg-primary text-primary-foreground rounded-md text-sm" type="submit">
              Save
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</main>
`.trim();

  return buildHtmlShell("Settings", body);
}

// ==========================================================
// 5. MAIN – קריאת example-design-guide.json וכתיבה ל-out/
// ==========================================================

function main() {
  const inputPath = path.join(__dirname, "example-design-guide.json");
  const outputDir = path.join(__dirname, "out");

  if (!fs.existsSync(inputPath)) {
    console.error("example-design-guide.json not found. Please create it first.");
    process.exit(1);
  }

  const designGuide = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // CSS :root + .dark
  const cssRoot = generateCssRoot(designGuide);
  fs.writeFileSync(path.join(outputDir, "design-tokens.css"), cssRoot, "utf8");

  // @theme inline
  const inlineTheme = generateInlineTheme();
  fs.writeFileSync(path.join(outputDir, "theme-inline.css"), inlineTheme, "utf8");

  // tailwind.config.js
  const twConfig = generateTailwindConfig(designGuide);
  fs.writeFileSync(path.join(outputDir, "tailwind.config.js"), twConfig, "utf8");

  const patterns = designGuide.patterns || [];
  const hasDashboard = patterns.some(
    (p) => p.pattern_id === "DashboardSummaryWithChart_v1"
  );
  const hasForm = patterns.some((p) => p.pattern_id === "StandardForm_v1");
  const hasSettings = patterns.some(
    (p) => p.pattern_id === "SettingsWithSidebar_v1"
  );

  // HTML Dashboard
  if (hasDashboard) {
    const html = generateDashboardHtml();
    fs.writeFileSync(path.join(outputDir, "dashboard.html"), html, "utf8");
  }

  // HTML Form
  if (hasForm) {
    const html = generateFormHtml();
    fs.writeFileSync(path.join(outputDir, "form.html"), html, "utf8");
  }

  // HTML Settings
  if (hasSettings) {
    const html = generateSettingsHtml();
    fs.writeFileSync(path.join(outputDir, "settings.html"), html, "utf8");
  }

  console.log("✔ Generated CSS, Tailwind config and HTML files in ./out");
}

if (require.main === module) {
  main();
}
