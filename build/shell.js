/* 共享外壳模板 — 生成各页面的 HTML 骨架
   导航栏变体、header-actions 容器、首帧前落定主题的内联脚本等结构
   依据站点所有者公开文档说明的规范，代码为原创实现。 */

/* 品牌：改成你自己的站名与标记。
   这里刻意不使用原站的域名或标识，站点所有者要求不复刻其个人信息。 */
const BRAND_NAME = "your-site";
const BRAND_MARK = "·";

const NAV = [
  { href: "projects.html", label: "Projects", section: "projects" },
  { href: "blog.html", label: "Blog" },
  { href: "mood.html", label: "Mood" },
  { href: "components.html", label: "Components" },
  { href: "docs.html", label: "Docs" }
];

const ROUTES = [
  { title: "Home", href: "index.html" },
  { title: "Projects", href: "projects.html" },
  { title: "Blog", href: "blog.html" },
  { title: "Mood", href: "mood.html" },
  { title: "Components", href: "components.html" },
  { title: "Docs", href: "docs.html" },
  { title: "Docs — Overview", href: "docs-overview.html" },
  { title: "Docs — Design tokens", href: "docs-tokens.html" },
  { title: "Privacy", href: "privacy.html" },
  { title: "Message", href: "message.html" }
];

/* 首帧前落定主题，避免导航后闪烁。步骤依文档规范：
   1 在 try 内读 localStorage.theme，被阻止时回退系统偏好而非抛出；
   2 解析生效主题，存储的 light/dark 优先，否则用 prefers-color-scheme；
   3 写 html[data-theme-setting]，它持有「设置」，与生效主题是不同的值；
   4 切换 html.dark。 */
const THEME_INLINE = `(function(){try{var s=null;try{s=localStorage.getItem('theme')}catch(e){}
var setting=s==='light'||s==='dark'?s:'system';
var eff=setting==='system'?(window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light'):setting;
var r=document.documentElement;r.setAttribute('data-theme-setting',setting);
if(eff==='dark')r.classList.add('dark')}catch(e){}})();`;

const ICON = {
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>',
  search:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1"/><path d="M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1"/></svg>'
};

function nav(variant, crumb) {
  const links =
    variant === "page" || variant === "docs"
      ? ""
      : `<nav class="nav-links">${NAV.map(
          (l) =>
            `<a class="nav-link" href="${l.href}"${
              l.section ? ` data-section="${l.section}"` : ""
            }>${l.label}</a>`
        ).join("")}</nav>`;

  const brand =
    variant === "docs"
      ? `<a class="brand" href="index.html"><span class="brand__mark">${BRAND_MARK}</span></a><span class="site-nav__crumb">Docs</span>`
      : `<a class="brand" href="index.html"><span class="brand__mark">${BRAND_MARK}</span><span>${BRAND_NAME}</span></a>${
          crumb ? `<span class="site-nav__crumb">${crumb}</span>` : ""
        }`;

  return `<header class="site-nav" data-variant="${variant}">
  <div class="site-nav__inner">
    ${brand}
    ${links}
    <div class="header-actions" data-header-actions>
      <button class="icon-btn js-palette-open" type="button" aria-label="搜索站点">${ICON.search}</button>
      <div class="theme-menu" data-theme-menu data-open="false">
        <button class="icon-btn" type="button" data-theme-toggle aria-label="切换主题">${ICON.sun}</button>
        <div class="theme-menu__list" role="menu">
          <button class="theme-menu__item" data-set="light" role="menuitem">浅色</button>
          <button class="theme-menu__item" data-set="dark" role="menuitem">深色</button>
          <button class="theme-menu__item" data-set="system" role="menuitem">跟随系统</button>
        </div>
      </div>
    </div>
  </div>
</header>`;
}

function footer() {
  return `<footer class="site-footer">
  <div class="shell">
    <div class="site-footer__grid">
      <div class="site-footer__col">
        <h4>浏览</h4>
        <a href="projects.html">Projects</a>
        <a href="blog.html">Blog</a>
        <a href="mood.html">Mood</a>
      </div>
      <div class="site-footer__col">
        <h4>更多</h4>
        <a href="components.html">Components</a>
        <a href="docs.html">Docs</a>
        <a href="privacy.html">Privacy</a>
      </div>
      <div class="site-footer__col">
        <h4>联系</h4>
        <a href="message.html">Message me</a>
        <a href="#" data-blank-link>GitHub <span class="blank">待填</span></a>
        <a href="#" data-blank-link>Telegram <span class="blank">待填</span></a>
      </div>
    </div>
    <div class="site-footer__bottom">
      <span class="status-pill" data-footer-status="unknown">
        <span class="status-pill__dot"></span>
        <span data-status-label>Checking</span>
      </span>
      <small>本地复刻示例 · 内容待填 · 原站设计与代码版权归 bunizao</small>
    </div>
  </div>
</footer>`;
}

function palette() {
  return `<div class="palette" data-palette data-open="false">
  <div class="palette__panel">
    <input class="palette__input" data-palette-input type="text" placeholder="跳转到页面…  (Cmd/Ctrl + K)" aria-label="搜索页面">
    <div class="palette__results" data-palette-results></div>
  </div>
</div>`;
}

function page({
  title,
  desc = "",
  variant = "home",
  crumb = "",
  bodyClass = "",
  bodyAttrs = "",
  head = "",
  main,
  scripts = [],
  footerHtml = footer()
}) {
  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="robots" content="noindex, nofollow">
<script>${THEME_INLINE}</script>
<link rel="stylesheet" href="assets/css/tokens.css">
<link rel="stylesheet" href="assets/css/base.css">
<link rel="stylesheet" href="assets/css/chrome.css">
<link rel="stylesheet" href="assets/css/surfaces.css">
${head}
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""}${bodyAttrs ? " " + bodyAttrs : ""}>
<a class="skip-link" href="#main">跳到主要内容</a>
${nav(variant, crumb)}
<main id="main">
${main}
</main>
${footerHtml}
${palette()}
<script>window.__SITE_ROUTES__=${JSON.stringify(ROUTES)};</script>
<script src="assets/js/shell.js"></script>
${scripts.map((s) => `<script src="${s}"></script>`).join("\n")}
</body>
</html>`;
}

module.exports = { page, footer, nav, ICON, NAV, ROUTES };
