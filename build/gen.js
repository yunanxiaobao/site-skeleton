/* gen.js — 生成所有页面
   内容全部为中性占位，所有者个人信息一律留白，由使用者自行填入。 */

const fs = require("fs");
const path = require("path");
const { page, ICON } = require("./shell");

const OUT = path.resolve(__dirname, "..");
const w = (name, html) => {
  fs.writeFileSync(path.join(OUT, name), html, "utf8");
  console.log("wrote", name);
};

const blank = (hint) => `<span class="blank">${hint}</span>`;

const NOTICE_HOME = `<div class="notice">
<strong>这是一个本地复刻骨架。</strong>站点结构、版面与交互依据站点所有者公开发布的设计文档实现，
所有个人信息（姓名、简介、项目、文章、社交链接等）均未复刻，以虚线占位标出，请填入你自己的信息。
标注「需接入」的部分依赖原站后端接口，本地无法还原。
</div>`;

/* ---------------- 首页 ----------------
   六个区块固定顺序：Hero / Listening / Projects / Writing / Mood preview / Footer
   （Listening 与 GitHub 卡位于 Hero 的 widgets 行内） */
const home = page({
  title: "首页 · 本地复刻骨架",
  desc: "依据公开设计文档实现的本地复刻骨架，个人信息待填。",
  variant: "home",
  head: `<link rel="stylesheet" href="assets/css/home.css">`,
  scripts: ["assets/js/home.js"],
  main: `
<div class="glyph-track">
  <div class="glyph-field" data-glyph-field aria-hidden="true"></div>
  <section class="hero shell">
    <div class="hero__status hero-animate" style="--hero-i:0">
      <span class="hero__status-dot"></span>
      <span data-status-words="在线|写作中|构建中|在读">在线</span>
    </div>

    <h1 class="hero__name hero-animate" style="--hero-i:1" data-typewriter="你的名字|Your Name">
      <span class="hero-lcp-anchor">Your Name</span>
    </h1>

    <div class="hero__chips hero-animate" style="--hero-i:2">
      <span class="chip">${blank("身份一")}</span>
      <span class="chip">${blank("身份二")}</span>
      <span class="chip">${blank("身份三")}</span>
    </div>

    <p class="hero__role hero-animate" style="--hero-i:3">${blank("一句话角色描述")}</p>

    <div class="hero__bio hero-animate" style="--hero-i:4" data-decode>
      <p>我做 <a href="projects.html" data-mark="underline" style="--mark-i:0">projects</a>，
      也 <a href="blog.html" data-mark="underline" style="--mark-i:1">write</a>，
      偶尔发一些 <a href="mood.html" data-mark="underline" style="--mark-i:2">moods</a>。</p>
      <p>这里写你在做什么。第二段写你写些什么。第三段写你在哪里。${blank("自我介绍")}</p>
      <p>
        <a href="message.html" data-mark="icon">${ICON.mail}Message me</a>
        &nbsp;
        <a href="#" data-mark="icon" data-blank-link>${ICON.link}${blank("社交链接")}</a>
      </p>
    </div>

    <div class="hero__widgets">
      <div class="card gh-card hero-animate" style="--hero-i:0" data-gh-card>
        <div class="card__label">GitHub 活动</div>
        <div class="gh-wave" data-gh-wave></div>
        <div class="gh-total" data-gh-total></div>
      </div>

      <div class="card listening hero-animate" style="--hero-i:1">
        <div class="listening__art"></div>
        <div class="listening__meta">
          <div class="listening__title">未在播放
            <span class="eq"><i></i><i></i><i></i></span>
          </div>
          <div class="listening__artist"><span class="placeholder-note">需接入 /api/v2/listening</span></div>
        </div>
      </div>
    </div>

    <div class="hero__widgets">
      <div class="marquee hero-animate" style="--hero-i:2;flex:1">
        <div class="marquee__track">
          ${Array(2)
            .fill(
              ["技术一", "技术二", "技术三", "技术四", "技术五", "技术六"]
                .map((t) => `<span class="chip">${t}</span>`)
                .join("")
            )
            .join("")}
        </div>
      </div>
    </div>
  </section>
</div>

<div class="shell">
${NOTICE_HOME}
</div>

<section class="section shell" id="projects-section">
  <div class="section__head">
    <h2>Projects</h2>
    <a class="section__more" href="projects.html">全部项目 →</a>
  </div>
  <div class="projects-deck">
    ${[1, 2, 3]
      .map(
        (i) => `<article class="project reveal">
      <div class="project__kind">${blank("分类")}</div>
      <h3 class="project__name">${blank("项目名 " + i)}</h3>
      <p class="project__desc">${blank("一两句项目说明")}</p>
      <span class="project__link">了解更多 →</span>
    </article>`
      )
      .join("\n    ")}
  </div>
</section>

<section class="section shell" id="writing-section">
  <div class="section__head">
    <h2>Writing</h2>
    <a class="section__more" href="blog.html">全部文章 →</a>
  </div>
  <div class="post-list">
    ${[1, 2, 3, 4]
      .map(
        (i) => `<a class="post-row reveal" href="blog.html">
      <span>
        <span class="post-row__title">${blank("文章标题 " + i)}</span>
        <span class="post-row__excerpt">${blank("摘要")}</span>
      </span>
      <span class="post-row__date">YYYY-MM-DD</span>
    </a>`
      )
      .join("\n    ")}
  </div>
  <p class="notice">原站此区块在构建时从 Ghost Content API 取文章，需要构建期凭据；本地复刻为占位。</p>
</section>

<section class="section shell" id="moods-section">
  <div class="section__head">
    <h2>Moods</h2>
    <a class="section__more" href="mood.html">全部动态 →</a>
  </div>
  <div class="mood-preview">
    ${[1, 2, 3]
      .map(
        () => `<article class="mood-card reveal">
      <div class="mood-card__meta"><span>YYYY-MM-DD</span><span>·</span><span>${blank("标签")}</span></div>
      <div class="mood-card__body">
        <div class="skeleton skeleton--line" style="width:92%">&nbsp;</div>
        <div class="skeleton skeleton--line" style="width:64%">&nbsp;</div>
      </div>
    </article>`
      )
      .join("\n    ")}
  </div>
  <p class="notice">原站此区块在滚动进入前约一个视口时请求 <code>/api/v2/mood?limit=5</code>；本地复刻保留骨架屏。</p>
</section>
`
});

/* ---------------- Projects ---------------- */
const projects = page({
  title: "Projects · 本地复刻骨架",
  variant: "page",
  crumb: "Projects",
  main: `
<div class="shell">
  <div class="page-head">
    <h1>Projects</h1>
    <p class="page-head__lede">精选项目，每个都附上背后的故事。${blank("导语")}</p>
  </div>
  <div class="projects-deck">
    ${[1, 2, 3, 4, 5, 6]
      .map(
        (i) => `<article class="project reveal">
      <div class="project__kind">${blank("分类")}</div>
      <h3 class="project__name">${blank("项目 " + i)}</h3>
      <p class="project__desc">${blank("项目说明：它解决什么问题，怎么做的")}</p>
      <span class="project__link">${blank("链接")}</span>
    </article>`
      )
      .join("\n    ")}
  </div>
</div>
`
});

/* ---------------- Blog ----------------
   独立出版物，作用域限定在 .blog-zone 内，单一 720px 阅读栏，
   发丝线代替阴影，底部海之页脚。 */
const SEA = `<div class="sea-footer" aria-hidden="true">
  <svg class="sea-footer__boat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round">
    <path d="M12 3v11"/><path d="M12 5l6 7h-6"/><path d="M3 16h18l-2.5 4h-13z"/>
  </svg>
  <div class="sea-footer__wave"></div>
</div>`;

const blog = page({
  title: "Blog · 本地复刻骨架",
  variant: "page",
  crumb: "Blog",
  bodyClass: "blog-zone",
  main: `
<div class="shell">
  <div class="blog-head">
    <div class="blog-head__kicker">${blank("出版物名")}</div>
    <h1>Blog</h1>
    <div class="blog-head__meta">
      <span>${blank("文章数")} 篇</span><span>·</span><span>${blank("起始年份")} 至今</span>
    </div>
  </div>

  <div class="ledger">
    <div class="tag-cards" style="margin-bottom:var(--space-5)">
      ${["标签一", "标签二", "标签三", "标签四"]
        .map((t) => `<a class="tag" href="#">${t}</a>`)
        .join("")}
    </div>

    ${["YYYY", "YYYY"]
      .map(
        (y) => `<div class="ledger__year">
      <h2>${y}</h2><span class="ledger__count">${blank("n")} 篇</span>
    </div>
    <div class="post-list">
      ${[1, 2, 3]
        .map(
          (i) => `<a class="post-row reveal" href="blog-post.html">
        <span>
          <span class="post-row__title">${blank("文章标题 " + i)}</span>
          <span class="post-row__excerpt">${blank("摘要")}</span>
        </span>
        <span class="post-row__date">MM-DD</span>
      </a>`
        )
        .join("\n      ")}
    </div>`
      )
      .join("\n    ")}
  </div>

  <p class="notice">原站文章在 Ghost 中撰写、经部署钩子渲染到此；本地复刻为占位结构。</p>
</div>
${SEA}
`
});

/* ---------------- 单篇文章 ---------------- */
const blogPost = page({
  title: "文章标题 · 本地复刻骨架",
  variant: "page",
  crumb: "Blog",
  bodyClass: "blog-zone",
  main: `
<div class="shell">
  <div class="blog-head">
    <div class="blog-head__kicker">${blank("标签")}</div>
    <h1>${blank("文章标题")}</h1>
    <div class="blog-head__meta">
      <span>YYYY-MM-DD</span><span>·</span><span>${blank("字数")}</span><span>·</span><span>${blank("作者")}</span>
    </div>
  </div>

  <article class="prose">
    <p>${blank("正文第一段")}。这里是正文排版的示例：单一 720px 阅读栏，行高 1.78，段间距按间距刻度。</p>
    <h2>小节标题</h2>
    <p>正文中的 <a href="#">链接</a> 使用「黛」这一主色，带 1px 下划线。<mark>高亮</mark> 使用「霁」作填充色，
    因为它在浅色表面上的对比度不足以承载文本。</p>
    <blockquote>引文样式：左侧 2px 主色竖线，文字弱化并倾斜。</blockquote>
    <h3>更小的标题</h3>
    <p>${blank("继续正文")}</p>
    <pre><code>代码块示例
第二行</code></pre>
  </article>
</div>
${SEA}
`
});

/* ---------------- Mood ---------------- */
const mood = page({
  title: "Mood · 本地复刻骨架",
  variant: "page",
  crumb: "Mood",
  bodyAttrs: 'data-hide-actions-mobile="true"',
  main: `
<div class="shell">
  <div class="page-head">
    <h1>Mood</h1>
    <p class="page-head__lede">短帖、照片与链接的流水。${blank("导语")}</p>
  </div>

  <div class="mood-wheel">
    ${Array(7)
      .fill(0)
      .map(() => `<button type="button" aria-label="心情"></button>`)
      .join("")}
  </div>

  <div class="mood-feed">
    ${[1, 2, 3, 4]
      .map(
        () => `<article class="mood-item reveal">
      <div class="mood-item__head">
        <div class="mood-item__avatar"></div>
        <div>
          <div class="mood-item__who">${blank("昵称")}</div>
          <div class="mood-item__when">YYYY-MM-DD HH:mm</div>
        </div>
      </div>
      <div class="mood-item__body">${blank("这条动态的内容")}</div>
      <div class="mood-item__actions">
        <button class="mood-action" type="button" data-like data-liked="false">♥ <span data-like-count>0</span></button>
        <span class="mood-action">💬 0</span>
        <span class="mood-action">↗ 分享</span>
      </div>
    </article>`
      )
      .join("\n    ")}
  </div>

  <p class="notice">原站动态由 Telegram 镜像进结构化归档，经 <code>/api/v2/mood</code> 读取，评论走实时镜像；本地复刻为占位，互动仅前端演示。</p>
</div>
`
});

/* ---------------- Components ---------------- */
const TILES = [
  ["Button", "primitive", "基础按钮"],
  ["Badge", "primitive", "状态标记"],
  ["Card", "primitive", "内容容器"],
  ["Decode Text", "showpiece", "打乱后落定的文本揭示"],
  ["Mood Wheel", "showpiece", "心情选择轮盘"],
  ["List Hover", "primitive", "列表悬停缩进"],
  ["Tag Cards", "primitive", "标签卡片"],
  ["Contact Links", "composition", "联系方式组"]
];

const components = page({
  title: "Components · 本地复刻骨架",
  variant: "page",
  crumb: "Components",
  main: `
<div class="shell">
  <div class="page-head">
    <h1>Components</h1>
    <p class="page-head__lede">构成这个站点的交互零件，每块都是活的样品。</p>
  </div>

  <div class="install-cmd">
    <span>bunx shadcn@latest add &lt;registry-url&gt;/decode-text</span>
    <button class="copy-btn" type="button" data-copy="bunx shadcn@latest add <registry-url>/decode-text">复制</button>
  </div>

  <div class="bento" style="margin-top:var(--space-5)">
    ${TILES.map(
      ([name, tier, tagline]) => `<a class="bento__tile reveal" data-tier="${tier}" href="#">
      <span class="bento__tier">${tier}</span>
      <div class="bento__stage">${
        tier === "showpiece" ? "◆ 活样品" : "◻ 样品"
      }</div>
      <span class="bento__name">${name}</span>
      <span class="bento__tagline">${tagline}</span>
    </a>`
    ).join("\n    ")}
  </div>

  <p class="notice">原站的 <code>/r</code> 注册表在构建时由真实源码生成；本地复刻只还原册页的版面与瓦片分层（primitive / showpiece / composition）。</p>
</div>
`
});

/* ---------------- Docs ---------------- */
const RAIL = `<aside class="docs-rail">
  <input class="docs-rail__search" type="search" placeholder="搜索文档…" aria-label="搜索文档">
  <h4>开始</h4>
  <a href="docs.html" aria-current="page">Docs 首页</a>
  <a href="docs-overview.html">Overview</a>
  <h4>表面</h4>
  <a href="docs-tokens.html">Design tokens</a>
  <a href="#">Home</a>
  <a href="#">Blog</a>
  <a href="#">Mood</a>
  <a href="#">Components</a>
  <h4>平台</h4>
  <a href="#">Architecture</a>
  <a href="#">Security</a>
  <a href="#" data-locked="true">Admin internals</a>
  <a href="#" data-locked="true">Moderation</a>
</aside>`;

const docsPage = (title, crumbTitle, body) =>
  page({
    title: title + " · 本地复刻骨架",
    variant: "docs",
    bodyAttrs: 'data-hide-actions-mobile="false"',
    main: `
<div class="shell">
  <div class="docs-layout">
    ${RAIL}
    <article class="docs-body">
      ${body}
    </article>
  </div>
</div>
`
  });

const docs = docsPage(
  "Docs",
  "Docs",
  `<h1>Docs</h1>
<p class="page-head__lede">这个站点由什么构成、可以调用什么、每部分在哪里记录。</p>
<p class="notice">侧栏中带锁标记的条目对应原站的内部页面，仅所有者可打开；此处仅还原其在导航中的呈现方式。</p>
<h2>从哪里开始</h2>
<table>
  <thead><tr><th>如果你想</th><th>就读</th></tr></thead>
  <tbody>
    <tr><td>了解整体构成</td><td><a href="docs-overview.html">Overview</a></td></tr>
    <tr><td>查设计令牌</td><td><a href="docs-tokens.html">Design tokens</a></td></tr>
  </tbody>
</table>
<h2>表面</h2>
<table>
  <thead><tr><th>表面</th><th>路径</th><th>是什么</th></tr></thead>
  <tbody>
    <tr><td>Home</td><td><code>/</code></td><td>简介、精选项目、近期写作</td></tr>
    <tr><td>Blog</td><td><code>/blog</code></td><td>独立出版物，自有设计系统</td></tr>
    <tr><td>Mood</td><td><code>/mood</code></td><td>短帖流水</td></tr>
    <tr><td>Components</td><td><code>/components</code></td><td>交互零件册</td></tr>
    <tr><td>Docs</td><td><code>/docs</code></td><td>你在这里</td></tr>
  </tbody>
</table>`
);

const docsOverview = docsPage(
  "Overview",
  "Overview",
  `<h1>Overview</h1>
<p class="page-head__lede">本地复刻骨架的构成说明。</p>
<h2>这份复刻包含什么</h2>
<p>站点的信息架构、共享外壳（导航栏三变体、主题切换、命令面板、页脚）、
首页六个区块的版面与入场节奏、博客的独立阅读系统、心情流、组件册的 bento 栅格、
以及文档页的侧栏布局。全部为依据公开设计文档编写的原创实现。</p>
<h2>这份复刻不包含什么</h2>
<table>
  <thead><tr><th>缺口</th><th>原因</th></tr></thead>
  <tbody>
    <tr><td>所有个人信息</td><td>站点所有者明确要求不复刻，已全部留白</td></tr>
    <tr><td>原站的 HTML/CSS/JS 源码</td><td>站点只向浏览器提供页面，且其源码仓库为私有，无授权来源</td></tr>
    <tr><td>动态接口数据</td><td>需要 <code>/api/*</code> 后端、Ghost 凭据与 Telegram 镜像</td></tr>
    <tr><td>字体与品牌图形</td><td>第三方授权与他人商标，改用系统字体与中性占位</td></tr>
  </tbody>
</table>`
);

const docsTokens = docsPage(
  "Design tokens",
  "Design tokens",
  `<h1>Design tokens</h1>
<p class="page-head__lede">颜色、阴影、动效、圆角、间距与字体，含浅色与深色取值。</p>
<h2>颜色</h2>
<p>单一中性色阶服务所有表面，层级来自前景色透出多少，因此深色模式无需第二套色阶。
四个色相是中性色之外唯一的彩度来源，每个只对应一类时刻。</p>
<div class="swatches">
  ${[
    ["--ink", "var(--ink)"],
    ["--quill", "var(--quill)"],
    ["--muted", "var(--muted)"],
    ["--faint", "var(--faint)"],
    ["--hairline", "var(--hairline)"],
    ["--fill", "var(--fill)"],
    ["--accent", "var(--accent-ink)"],
    ["--success", "var(--success-ink)"],
    ["--warning", "var(--warning-ink)"],
    ["--danger", "var(--danger-ink)"]
  ]
    .map(
      ([n, v]) =>
        `<div class="swatch"><div class="swatch__chip" style="background:${v}"></div><div class="swatch__name">${n}</div></div>`
    )
    .join("\n  ")}
</div>
<h2>动效</h2>
<p>令牌按职责命名，而非按曲线形状。动效要么解释状态变化，要么保持视图间的连续性，
要么确认一个动作；其余一切保持静止。</p>
<table>
  <thead><tr><th>令牌</th><th>取值</th><th>用于</th></tr></thead>
  <tbody>
    <tr><td><code>--ease</code></td><td>cubic-bezier(0.2, 0, 0, 1)</td><td>原地变化：开关、旋转、变色</td></tr>
    <tr><td><code>--ease-out</code></td><td>cubic-bezier(0.23, 1, 0.32, 1)</td><td>到达，或响应输入</td></tr>
    <tr><td><code>--ease-out-expo</code></td><td>cubic-bezier(0.16, 1, 0.3, 1)</td><td>连续性：视图转场</td></tr>
    <tr><td><code>--ease-in</code></td><td>cubic-bezier(0.4, 0, 1, 1)</td><td>退出</td></tr>
    <tr><td><code>--ease-in-out</code></td><td>cubic-bezier(0.65, 0, 0.35, 1)</td><td>循环与往复</td></tr>
    <tr><td><code>--spring</code></td><td>cubic-bezier(0.34, 1.56, 0.64, 1)</td><td>唯一的过冲：确认动作</td></tr>
    <tr><td><code>--dur-fast</code></td><td>150ms</td><td>悬停、焦点、变色</td></tr>
    <tr><td><code>--dur-base</code></td><td>200ms</td><td>开关与小位移</td></tr>
    <tr><td><code>--dur-slow</code></td><td>300ms</td><td>面板、入场</td></tr>
  </tbody>
</table>
<h2>圆角与间距</h2>
<p>嵌套形状保持同心：内圆角等于外圆角减去两者之间的间距。间距刻度上的值读取刻度，
刻度外的值属于视觉微调，保持为字面量。</p>`
);

/* ---------------- Privacy / Message ---------------- */
const privacy = page({
  title: "Privacy · 本地复刻骨架",
  variant: "page",
  crumb: "Privacy",
  main: `
<div class="shell">
  <div class="page-head">
    <h1>Privacy</h1>
    <p class="page-head__lede">这个站点如何处理数据。${blank("请填入你自己的隐私政策")}</p>
  </div>
  <article class="prose read">
    <p class="notice">原站的隐私政策属于其文字内容，未复刻。此页仅保留版面结构，请填入你自己的条款。</p>
    <h2>${blank("小节标题")}</h2>
    <p>${blank("正文")}</p>
  </article>
</div>
`
});

const message = page({
  title: "Message · 本地复刻骨架",
  variant: "page",
  crumb: "Message",
  main: `
<div class="shell">
  <div class="page-head">
    <h1>Message me</h1>
    <p class="page-head__lede">原站不公开邮箱地址，只提供这个页面。</p>
  </div>
  <article class="read">
    <form class="card" onsubmit="event.preventDefault();this.querySelector('[data-sent]').hidden=false">
      <label style="display:block;margin-bottom:var(--space-3)">
        <span class="card__label">你的称呼</span>
        <input type="text" style="width:100%;padding:var(--space-3);border:1px solid var(--hairline);border-radius:var(--radius-sm);background:var(--fill)">
      </label>
      <label style="display:block;margin-bottom:var(--space-3)">
        <span class="card__label">消息</span>
        <textarea rows="5" style="width:100%;padding:var(--space-3);border:1px solid var(--hairline);border-radius:var(--radius-sm);background:var(--fill)"></textarea>
      </label>
      <button class="copy-btn" type="submit" style="padding:var(--space-2) var(--space-4)">发送</button>
      <p data-sent hidden class="notice" style="margin-top:var(--space-4)">本地复刻没有后端，这个表单不会真的发送。</p>
    </form>
  </article>
</div>
`
});

w("index.html", home);
w("projects.html", projects);
w("blog.html", blog);
w("blog-post.html", blogPost);
w("mood.html", mood);
w("components.html", components);
w("docs.html", docs);
w("docs-overview.html", docsOverview);
w("docs-tokens.html", docsTokens);
w("privacy.html", privacy);
w("message.html", message);
