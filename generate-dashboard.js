// -------------------------------------------------------
//  Utility maps – px → Tailwind spacing
//  חייב להתאים במדויק לסקאלה: 0,4,8,12,16,20,24,32,40,48
// -------------------------------------------------------
const spacingPxToScale = {
  0: "0",
  4: "1",
  8: "2",
  12: "3",
  16: "4",
  20: "5",
  24: "6",
  32: "8",
  40: "10",
  48: "12"
};

// px -> "p-4", "mb-6" וכו'
function pxToSpacingClass(prefix, px) {
  if (px == null) return "";
  const scale = spacingPxToScale[px];
  if (scale === undefined) {
    throw new Error(`Unsupported spacing value: ${px}px`);
  }
  return `${prefix}-${scale}`;
}

// -------------------------------------------------------
//  Tokens → Tailwind classes
//  משתמשים בשמות בסגנון shadcn:
//  --card → bg-card, --card-foreground → text-card-foreground,
//  --border → border-border, --ring → ring-ring
// -------------------------------------------------------
function bgFromToken(token) {
  if (!token) return "";
  const name = token.replace(/^--/, "");
  return `bg-${name}`;
}

function textFromToken(token) {
  if (!token) return "";
  const name = token.replace(/^--/, "");
  // foreground מיוחד (כמו card-foreground)
  if (name.includes("foreground")) return `text-${name}`;
  return `text-${name}`;
}

function borderFromToken(token) {
  if (!token) return "";
  const name = token.replace(/^--/, "");
  return `border-${name}`;
}

function ringFromToken(token) {
  if (!token) return "";
  const name = token.replace(/^--/, "");
  return `ring-${name}`;
}

function radiusFromToken(token) {
  // --radius-sm/md/lg/xl → rounded-sm/md/lg/xl
  if (!token) return "";
  const name = token.replace(/^--radius-?/, "");
  return `rounded-${name}`;
}

function shadowFromToken(token) {
  // --shadow-sm/md/lg → shadow-sm/md/lg
  if (!token) return "";
  const name = token.replace(/^--shadow-?/, "");
  return name === "" ? "shadow" : `shadow-${name}`;
}

// -------------------------------------------------------
//  HTML helpers
// -------------------------------------------------------
function attrs(obj) {
  return Object.entries(obj)
    .filter(([, v]) => v && v.length > 0)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
}

// Escape בסיסי לטקסט
function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// -------------------------------------------------------
//  Render: Summary Cards Row
// -------------------------------------------------------
function renderSummaryCardsRow(section) {
  const layout = section.layout;

  const baseClasses = ["grid"];
  // grid-cols לפי breakpoints
  const cols = layout.columns_by_breakpoint || {};
  if (cols.sm) baseClasses.push(`grid-cols-${cols.sm}`);
  if (cols.md) baseClasses.push(`md:grid-cols-${cols.md}`);
  if (cols.lg) baseClasses.push(`lg:grid-cols-${cols.lg}`);

  baseClasses.push(pxToSpacingClass("gap-x", layout.column_gap_px));
  baseClasses.push(pxToSpacingClass("gap-y", layout.row_gap_px));

  const mbClass = pxToSpacingClass("mb", section.margin_bottom_px);
  if (mbClass) baseClasses.push(mbClass);

  const cardsHtml = section.cards.map((card, index) => {
    const base = section.cards[0];
    const def = card.same_as === base.card_id ? base : card;

    const classes = [
      bgFromToken(def.background_color_token),
      textFromToken(def.text_color_token),
      borderFromToken(def.border_color_token),
      "border",
      radiusFromToken(def.border_radius_token),
      shadowFromToken(def.shadow_token),
      pxToSpacingClass("p", def.padding_all_px)
    ].join(" ");

    const c = def.content;
    const title = c.title;
    const value = c.value;
    const subtext = c.subtext;

    const titleMb = pxToSpacingClass("mb", title.margin_bottom_px);
    const valueMb = pxToSpacingClass("mb", value.margin_bottom_px);

    return `
      <div class="${classes}">
        <div class="${textFromToken(title.color_token)} text-[${title.font_size_px}px] font-${title.font_weight === 500 ? "medium" : "normal"} ${titleMb}">
          ${esc(title.text_role || "Title")}
        </div>
        <div class="${textFromToken(value.color_token)} text-[${value.font_size_px}px] font-${value.font_weight === 600 ? "semibold" : "normal"} ${valueMb}">
          0
        </div>
        <div class="${textFromToken(subtext.color_token)} text-[${subtext.font_size_px}px] font-${subtext.font_weight === 400 ? "normal" : "medium"}">
          ${esc(subtext.text_role || "Secondary text")}
        </div>
      </div>
    `;
  });

  return `<section ${attrs({ class: baseClasses.join(" ") })}>
${cardsHtml.join("\n")}
</section>`;
}

// -------------------------------------------------------
//  Render: Chart Card
// -------------------------------------------------------
function renderChartCard(section) {
  const card = section.card;
  const c = section.content;

  const cardClasses = [
    bgFromToken(card.background_color_token),
    textFromToken(card.text_color_token),
    borderFromToken(card.border_color_token),
    "border",
    radiusFromToken(card.border_radius_token),
    shadowFromToken(card.shadow_token),
    pxToSpacingClass("p", card.padding_all_px)
  ].join(" ");

  // Header
  const headerMb = pxToSpacingClass("mb", c.header.layout.margin_bottom_px);
  const headerClasses = [
    "flex",
    "items-center",
    "justify-between",
    headerMb
  ].join(" ");

  const headerTitle = c.header.title;
  const headerSubtitle = c.header.subtitle;

  const headerHtml = `
    <div class="${headerClasses}">
      <div>
        <div class="${textFromToken(headerTitle.color_token)} text-[${headerTitle.font_size_px}px] font-${headerTitle.font_weight === 600 ? "semibold" : "normal"}">
          ${esc(headerTitle.text_role || "Title")}
        </div>
        <div class="${textFromToken(headerSubtitle.color_token)} text-[${headerSubtitle.font_size_px}px]">
          ${esc(headerSubtitle.text_role || "Subtitle")}
        </div>
      </div>
      ${
        c.header.actions
          ? `<button class="h-[${c.header.actions.control_height_px}px] ${pxToSpacingClass(
              "px",
              c.header.actions.horizontal_padding_px
            )} ${bgFromToken(
              c.header.actions.background_color_token
            )} ${borderFromToken(
              c.header.actions.border_color_token
            )} border ${textFromToken(
              c.header.actions.text_color_token
            )} ${radiusFromToken(
              c.header.actions.border_radius_token
            )} text-[${c.header.actions.font_size_px}px]">
              Range
            </button>`
          : ""
      }
    </div>
  `;

  // Chart placeholder (דיב אחד עם גובה קבוע – את הגרף האמיתי תצייר בספריה אחרת)
  const chartArea = c.chart_area;
  const chartMb = pxToSpacingClass("mb", chartArea.margin_bottom_px);

  const chartHtml = `
    <div class="${chartMb} h-[${chartArea.height_px}px] bg-muted rounded-md flex items-center justify-center">
      <span class="text-muted-foreground text-sm">Chart placeholder (${chartArea.chart_type})</span>
    </div>
  `;

  // Footer
  const footer = c.footer;
  const footerMt = pxToSpacingClass("mt", footer.layout.margin_top_px);
  const footerClasses = ["flex", "items-center", "justify-between", footerMt].join(
    " "
  );

  const primaryText = footer.primary_text;
  const secondaryText = footer.secondary_text;

  const footerHtml = `
    <div class="${footerClasses}">
      <div class="${textFromToken(primaryText.color_token)} text-[${primaryText.font_size_px}px] font-${primaryText.font_weight === 500 ? "medium" : "normal"}">
        ${esc(primaryText.text_role || "Trend text")}
      </div>
      <div class="${textFromToken(secondaryText.color_token)} text-[${secondaryText.font_size_px}px]">
        ${esc(secondaryText.text_role || "Helper text")}
      </div>
    </div>
  `;

  return `<section class="w-full">
    <div class="${cardClasses}">
      ${headerHtml}
      ${chartHtml}
      ${footerHtml}
    </div>
  </section>`;
}

// -------------------------------------------------------
//  Render full dashboard from spec
// -------------------------------------------------------
function renderDashboard(spec) {
  const page = spec.page;

  const pageClasses = [
    bgFromToken(page.background_color_token),
    textFromToken(page.text_color_token),
    "min-h-screen",
    "flex",
    "justify-center"
  ];

  const containerClasses = [
    "w-full",
    "max-w-[960px]",
    pxToSpacingClass("px", page.padding_horizontal_px),
    pxToSpacingClass("py", page.padding_vertical_px),
    "space-y-6"
  ].join(" ");

  const sectionsHtml = spec.sections
    .map((section) => {
      if (section.type === "card_row") return renderSummaryCardsRow(section);
      if (section.type === "card_chart") return renderChartCard(section);
      return "";
    })
    .join("\n");

  return `
<main class="${pageClasses.join(" ")}">
  <div class="${containerClasses}">
    ${sectionsHtml}
  </div>
</main>
`.trim();
}

// -------------------------------------------------------
//  Example usage: using the spec we defined לפני כן
// -------------------------------------------------------
const spec = /* הכנס כאן את האובייקט JSON של DashboardSummaryWithChart_v1 */ null;

// אם אתה מריץ ב-Node, תחליף null ב- require("./dashboard-spec.json")
// ואז:
if (spec) {
  console.log(renderDashboard(spec));
}
