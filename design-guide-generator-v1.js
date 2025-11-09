// design-guide-generator-v1.js
// ----------------------------------------------------------
// סקריפט ג'אווהסקריפט שמקבל design_guide.json
// בפורמט של example-design-guide.json
// ומפיק קבצי CSS / Tailwind / React לתיקיית ./out
// ----------------------------------------------------------

const fs = require("fs");
const path = require("path");

// סקאלת מרווחים חוקית
const ALLOWED_SPACING_PX = [0, 4, 8, 12, 16, 20, 24, 32, 40, 48];

function assertValidSpacing(px) {
  if (!ALLOWED_SPACING_PX.includes(px)) {
    throw new Error(`Invalid spacing value: ${px}px (not in allowed scale)`);
  }
}

// ----------------------------------------------------------
// 1. CSS :root ו-.dark מתוך tokens.css_root_variables + css_dark_variables
// ----------------------------------------------------------

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

// ----------------------------------------------------------
// 2. @theme inline – mapping קבוע מה-:root לטיילוינד
// ----------------------------------------------------------

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

// ----------------------------------------------------------
// 3. tailwind.config.js מתוך spacing_scale_px + הטוקנים
// ----------------------------------------------------------

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
    './index.html',
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

// ----------------------------------------------------------
// 4. קומפוננטות React מתוך pattern_id (לא משתמשים ב-spec בפועל,
//    אבל ה-spec הוא "הביצה" שהמודל לומד ממנה)
// ----------------------------------------------------------

function generateReactComponents(designGuide) {
  const patterns = designGuide.patterns || [];
  const out = {};

  // Dashboard
  if (patterns.find((p) => p.pattern_id === "DashboardSummaryWithChart_v1")) {
    out.DashboardSummaryWithChart = `import React from "react";

/**
 * DashboardSummaryWithChart
 * דשבורד עם 4 כרטיסי סיכום וכרטיס גרף.
 */
export function DashboardSummaryWithChart() {
  return (
    <main className="bg-background text-foreground min-h-screen flex justify-center">
      <div className="w-full max-w-[960px] px-6 py-6 space-y-6">
        {/* שורת כרטיסי סיכום */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4"
            >
              <div className="text-muted-foreground text-sm mb-1">
                Metric label
              </div>
              <div className="text-2xl font-semibold mb-1">0</div>
              <div className="text-muted-foreground text-sm">
                Secondary text
              </div>
            </div>
          ))}
        </section>

        {/* כרטיס גרף */}
        <section className="w-full">
          <div className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-base font-semibold">Chart title</div>
                <div className="text-sm text-muted-foreground">
                  Chart subtitle
                </div>
              </div>
              <button className="h-8 px-3 bg-card border border-border text-foreground rounded-md text-sm">
                Range
              </button>
            </div>
            <div className="mb-2 h-[260px] bg-muted rounded-md flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                Chart placeholder
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <div className="text-sm font-medium">Trend text</div>
              <div className="text-xs text-muted-foreground">
                Helper text
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
`;
  }

  // StandardForm
  if (patterns.find((p) => p.pattern_id === "StandardForm_v1")) {
    out.StandardForm = `import React from "react";

/**
 * StandardForm
 * טופס סטנדרטי עם כותרת, תיאור, שדות וכפתורי פעולה.
 */
export function StandardForm() {
  return (
    <form className="space-y-6">
      {/* Group: billing_details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Full name
          </label>
          <input
            className="h-10 w-full bg-card border border-input text-foreground rounded-md px-3 py-2"
            type="text"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Helper text (optional)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            className="h-10 w-full bg-card border border-input text-foreground rounded-md px-3 py-2"
            type="email"
          />
        </div>
      </div>

      {/* Group: payment_plan */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold">Payment plan</h2>
        <div>
          <label className="block text-sm font-medium mb-1">
            Plan type
          </label>
          <select className="h-10 w-full bg-card border border-input text-foreground rounded-md px-3 py-2">
            <option>Basic</option>
            <option>Pro</option>
            <option>Enterprise</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 mt-6">
        <button
          type="button"
          className="h-10 px-3 bg-secondary text-secondary-foreground rounded-md text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-10 px-4 bg-primary text-primary-foreground rounded-md text-sm"
        >
          Save
        </button>
      </div>
    </form>
  );
}
`;
  }

  // SettingsWithSidebar
  if (patterns.find((p) => p.pattern_id === "SettingsWithSidebar_v1")) {
    out.SettingsWithSidebar = `import React from "react";
import { StandardForm } from "./StandardForm";

/**
 * SettingsWithSidebar
 * עמוד הגדרות עם Sidebar וטופס תוכן.
 */
export function SettingsWithSidebar() {
  return (
    <main className="bg-background text-foreground min-h-screen flex justify-center">
      <div className="w-full max-w-[1200px] px-6 py-6">
        <div className="grid grid-cols-[260px,1fr] gap-6">
          {/* Sidebar */}
          <aside className="bg-sidebar text-sidebar-foreground border border-sidebar-border rounded-lg shadow-2xs p-4">
            <button className="w-full text-left text-sm font-medium px-3 py-2 rounded-md">
              Profile
            </button>
            <button className="w-full text-left text-sm font-medium px-3 py-2 rounded-md bg-sidebar-primary text-sidebar-primary-foreground mt-2">
              Billing
            </button>
            <button className="w-full text-left text-sm font-medium px-3 py-2 rounded-md mt-2">
              Notifications
            </button>
          </aside>

          {/* Content */}
          <section className="bg-card text-card-foreground border border-border rounded-lg shadow-sm p-6">
            <header className="mb-4">
              <h1 className="text-[22px] font-semibold mb-1">
                Billing settings
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your billing details and subscription.
              </p>
            </header>
            <StandardForm />
          </section>
        </div>
      </div>
    </main>
  );
}
`;
  }

  return out;
}

// ----------------------------------------------------------
// 5. MAIN – קריאת example-design-guide.json ויצירת ./out
// ----------------------------------------------------------

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
  const inlineTheme = generateInlineTheme(designGuide);
  fs.writeFileSync(path.join(outputDir, "theme-inline.css"), inlineTheme, "utf8");

  // tailwind.config.js
  const twConfig = generateTailwindConfig(designGuide);
  fs.writeFileSync(path.join(outputDir, "tailwind.config.js"), twConfig, "utf8");

  // React components
  const components = generateReactComponents(designGuide);
  Object.entries(components).forEach(([name, code]) => {
    const fileName = `${name}.jsx`;
    fs.writeFileSync(path.join(outputDir, fileName), code, "utf8");
  });

  console.log("✔ Generated design system files in ./out");
}

if (require.main === module) {
  main();
}
