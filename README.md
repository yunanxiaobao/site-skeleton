# buxx.me 复刻骨架

依据站点所有者公开发布的设计文档，编写的**原创实现**。不含原站源码。

## 怎么用

```bash
# 任意静态服务器
python3 -m http.server 8777
# 打开 http://127.0.0.1:8777/index.html
```

改内容后重新生成页面：

```bash
node build/gen.js
```

## 文件结构

```
index.html            首页（Hero / Projects / Writing / Moods）
projects.html         项目列表
blog.html             博客索引（账簿式，按年份分组）
blog-post.html        单篇文章排版
mood.html             动态流 + 心情轮盘
components.html       组件册（bento 栅格，三个分层）
docs.html             文档首页
docs-overview.html    本复刻的范围说明
docs-tokens.html      设计令牌一览（含色板）
privacy.html          隐私政策（结构，条款待填）
message.html          联系表单（无后端）

assets/css/tokens.css    设计令牌：颜色、阴影、动效、圆角、间距
assets/css/base.css      元素规则、栅格、滚动条、打印、减弱动效
assets/css/chrome.css    导航栏三变体、主题下拉、命令面板、页脚
assets/css/home.css      首页各区块、字形雨、入场错位
assets/css/surfaces.css  blog / mood / components / docs 四个分区
assets/js/shell.js       主题、导航高亮、命令面板、滚动揭示、复制
assets/js/home.js        字形雨、打字机、解码文本、GitHub 波形

build/shell.js        共享外壳模板
build/gen.js          页面生成脚本
```

## 需要你填的东西

所有个人信息都以虚线占位（`.blank`）标出，搜索 `待填` 或 `class="blank"` 即可定位：

- 姓名：`build/gen.js` 里 `data-typewriter="你的名字|Your Name"`
- 身份标签、角色描述、三段自我介绍
- 项目名称与说明、文章标题与摘要
- 社交链接（页脚与 Hero 最后一段）
- 隐私政策条款
- 品牌标记：现为字母 `b` 的方块，换成你自己的

## 已实现的交互

| 功能 | 说明 |
| --- | --- |
| 主题切换 | 浅色 / 深色 / 跟随系统，首帧前落定避免闪烁，切换时有擦除转场 |
| 命令面板 | `Cmd/Ctrl + K` 打开，方向键选择，回车跳转 |
| 导航高亮 | 首页滚动时对应区块的链接点亮；其他页面不点亮 |
| 字形雨 | Canvas 绘制，`?speed=` 调速、`?ink=accent\|success\|warning\|danger` 换色 |
| 打字机 | Canvas 逐字测量放置，保留字距；另有 LCP 锚点 |
| 解码文本 | 打乱后落定，链接作为原子保留自己的盒子 |
| 滚动揭示 | IntersectionObserver，禁用 JS 时内容保持可见 |
| 减弱动效 | `prefers-reduced-motion` 下所有动效关闭，页面仍可完整阅读 |

## 本地无法还原的部分

这些依赖原站后端，页面上以「需接入」标注：

- `/api/github/contributions` — GitHub 贡献波形（现为空槽位，不伪造数据）
- `/api/v2/listening` — 正在播放（现为中性外壳）
- `/api/v2/mood` — 动态流（现为骨架屏与占位）
- Ghost Content API — 文章列表（原站在构建时取，需要构建期凭据）
- `/api/footer`、`/api/edge` — 页脚状态与区域（状态药丸停在 unknown）

## 关于来源与版权

- 原站对自动化访问统一返回告示页，拿不到其 HTML/CSS/JS；所有者的源码仓库为私有。
- 因此本骨架依据所有者主动开放的机读文档通道（`/docs/*`，`Accept: text/markdown`）中
  以规范形式说明的设计规则重新编写。文档中以规范值给出的动效曲线与时长按原值采用，
  因为那是实现该规范所必需的。
- 配色色值、字体选择、间距刻度、全部绘制与交互代码均为本实现自行编写。
- 字体使用系统字体栈，未引入第三方字体文件；未使用任何他人品牌图形。
- 原站的设计与代码版权归 bunizao。本骨架仅供你在已获其书面同意的范围内使用，
  且按其要求未复刻任何个人信息。对外发布前请确认内容已全部替换为你自己的。
