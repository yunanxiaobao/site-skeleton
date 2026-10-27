/* ==========================================================================
   home.js — 首页行为：字形雨、打字机、解码文本、GitHub 波形
   原创实现。各效果的参数（模拟步进 60ms、头部下落 6–12 格/秒、尾迹约
   半秒、阵风每 8–14 秒穿过、栅格对齐 24px 格、指针重绘约 30fps 上限、
   波形保留最近 30 天）依据站点所有者公开文档中以规范值形式给出的部分。
   绘制与实现代码为本文件自行编写。
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  var hero = document.querySelector(".hero");

  /* ---------------- 入场 ----------------
     脚本给区块加 is-live，各元素按 --hero-i 错位上浮；
     并在 600ms 时派发名字与简介的 ready 事件。 */
  if (hero) {
    requestAnimationFrame(function () {
      hero.classList.add("is-live");
    });
    setTimeout(function () {
      document.dispatchEvent(new CustomEvent("home:hero-name-ready"));
      document.dispatchEvent(new CustomEvent("home:hero-bio-ready"));
    }, reduceMotion ? 0 : 600);
  }

  /* ---------------- 状态词轮换 ----------------
     文档规范：状态文字在固定词表中随机换四次后停住。 */
  var statusEl = document.querySelector("[data-status-words]");
  if (statusEl && !reduceMotion) {
    var words = (statusEl.getAttribute("data-status-words") || "")
      .split("|")
      .filter(Boolean);
    if (words.length > 1) {
      var swaps = 0;
      var tick = setInterval(function () {
        swaps += 1;
        statusEl.textContent =
          words[Math.floor(Math.random() * words.length)];
        if (swaps >= 4) {
          clearInterval(tick);
          statusEl.textContent = words[0];
        }
      }, 900);
    }
  }

  /* ---------------- 打字机 ----------------
     在画布上绘制，按前序文本的实测宽度放置每个字形，以保留字距。
     跑完一遍名字后停在第一个。画布文字不计入 LCP，故页面另有一个
     淡的 .hero-lcp-anchor 在首帧绘出最长的名字，打字开始时移除。 */
  var typeHost = document.querySelector("[data-typewriter]");
  if (typeHost) {
    var names = (typeHost.getAttribute("data-typewriter") || "")
      .split("|")
      .filter(Boolean);

    if (!names.length) {
      names = [""];
    }

    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    typeHost.appendChild(canvas);

    var anchor = document.querySelector(".hero-lcp-anchor");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cssFont = "";
    var lineH = 0;

    function readFont() {
      var cs = getComputedStyle(typeHost);
      cssFont =
        cs.fontWeight + " " + cs.fontSize + "/" + cs.lineHeight + " " + cs.fontFamily;
      lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.1;
      return {
        tracking: parseFloat(cs.letterSpacing) || 0,
        color: cs.color
      };
    }

    var style = readFont();

    function size() {
      var w = typeHost.clientWidth || 600;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(lineH * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = lineH + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(text, caret) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = cssFont;
      ctx.textBaseline = "middle";
      ctx.fillStyle = style.color;

      var x = 0;
      var y = lineH / 2;
      // 逐字放置：x 取前序 run 的实测宽度，保留 CSS 字距
      for (var i = 0; i < text.length; i++) {
        var ch = text[i];
        ctx.fillText(ch, x, y);
        x += ctx.measureText(ch).width + style.tracking;
      }
      if (caret) {
        ctx.fillRect(x + 2, y - lineH * 0.34, 2, lineH * 0.68);
      }
    }

    var ni = 0;
    var ci = 0;
    var started = false;

    function step() {
      var name = names[ni];
      ci += 1;
      draw(name.slice(0, ci), true);

      if (ci < name.length) {
        // 约每秒 11 次击键
        setTimeout(step, 90);
      } else if (ni < names.length - 1) {
        setTimeout(function () {
          ni += 1;
          ci = 0;
          step();
        }, 1100);
      } else {
        // 跑完一遍后停在第一个
        setTimeout(function () {
          ni = 0;
          ci = names[0].length;
          draw(names[0], false);
        }, 1100);
      }
    }

    function start() {
      if (started) return;
      started = true;
      style = readFont();
      size();
      if (anchor) anchor.remove();
      if (reduceMotion) {
        draw(names[0], false);
        return;
      }
      ci = 0;
      step();
    }

    document.addEventListener("home:hero-name-ready", start);
    window.addEventListener("resize", function () {
      style = readFont();
      size();
      draw(names[ni].slice(0, ci), !reduceMotion);
    });
    // 字体就绪后重新测量，避免用回退字体的宽度定位
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        if (!started) return;
        style = readFont();
        size();
        draw(names[ni].slice(0, ci), false);
      });
    }
  }

  /* ---------------- 解码文本 ----------------
     打乱后落定的揭示效果。链接是解码的原子，各自保留自己的盒子，
     揭示结束后原始标记回归（依文档规范）。 */
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  function decodeNode(root, done) {
    // 原子：链接整体不打散，其余文本节点逐字打乱
    var atoms = [];
    (function walk(node) {
      Array.prototype.forEach.call(node.childNodes, function (child) {
        if (child.nodeType === 3) {
          if (child.nodeValue.trim()) atoms.push({ node: child, text: child.nodeValue });
        } else if (child.nodeType === 1) {
          if (child.tagName === "A") {
            // 链接保留其盒子，内部文本一起解码
            var t = child.textContent;
            atoms.push({ node: child, text: t, isLink: true });
          } else {
            walk(child);
          }
        }
      });
    })(root);

    if (reduceMotion || !atoms.length) {
      done && done();
      return;
    }

    var frame = 0;
    var total = 16;

    var originals = atoms.map(function (a) {
      return a.isLink ? a.node.textContent : a.node.nodeValue;
    });

    var timer = setInterval(function () {
      frame += 1;
      var ratio = frame / total;

      atoms.forEach(function (a, idx) {
        var orig = originals[idx];
        var settleTo = Math.floor(orig.length * ratio);
        var out = "";
        for (var i = 0; i < orig.length; i++) {
          var ch = orig[i];
          if (i < settleTo || ch === " " || ch === "\n") {
            out += ch;
          } else {
            out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }
        if (a.isLink) a.node.textContent = out;
        else a.node.nodeValue = out;
      });

      if (frame >= total) {
        clearInterval(timer);
        // 原始标记回归
        atoms.forEach(function (a, idx) {
          if (a.isLink) a.node.textContent = originals[idx];
          else a.node.nodeValue = originals[idx];
        });
        done && done();
      }
    }, 45);
  }

  var bio = document.querySelector("[data-decode]");
  if (bio) {
    document.addEventListener("home:hero-bio-ready", function () {
      decodeNode(bio, function () {
        // 解码落定后，链接下划线依次画入
        bio.classList.add("dt-settled");
      });
    });
  }

  /* ---------------- 字形雨 ----------------
     画布按宿主尺寸设定，故引擎只模拟看得见的格子。
     带宽对齐 24px 格；ResizeObserver 在尺寸变化时重建栅格；
     指针辉光重绘上限约 30fps。 */
  var field = document.querySelector("[data-glyph-field]");
  if (field && !reduceMotion) {
    var fCanvas = document.createElement("canvas");
    var fctx = fCanvas.getContext("2d");
    field.appendChild(fCanvas);

    var LATTICE = 24;
    var cols = 0;
    var rows = 0;
    var heads = [];
    var trail = [];
    var fdpr = Math.min(window.devicePixelRatio || 1, 2);
    var pointer = { x: -1e4, y: -1e4, at: 0 };

    // 查询参数可钉住外观以便检视：?speed= 缩放下落，?ink= 选色相
    var params = new URLSearchParams(location.search);
    var speedScale = parseFloat(params.get("speed")) || 1;
    var inkName = params.get("ink");

    var INKS = {
      accent: "--accent",
      success: "--success",
      warning: "--warning",
      danger: "--danger"
    };

    function inkColor(alpha) {
      var varName = INKS[inkName] || null;
      if (varName) {
        var v = getComputedStyle(document.documentElement)
          .getPropertyValue(varName)
          .trim();
        if (v) return "hsl(" + v + " / " + alpha + ")";
      }
      var fg = getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim();
      return "hsl(" + (fg || "0 0% 0%") + " / " + alpha + ")";
    }

    function build() {
      var w = field.clientWidth;
      var h = field.clientHeight;
      if (!w || !h) return;

      // 带宽对齐 24px 格
      cols = Math.max(1, Math.floor(w / LATTICE));
      rows = Math.max(1, Math.floor(h / LATTICE));

      fCanvas.width = Math.floor(w * fdpr);
      fCanvas.height = Math.floor(h * fdpr);
      fCanvas.style.width = w + "px";
      fCanvas.style.height = h + "px";
      fctx.setTransform(fdpr, 0, 0, fdpr, 0, 0);

      heads = [];
      for (var c = 0; c < cols; c++) {
        heads.push({
          row: Math.random() * rows * -1,
          // 头部下落 6–12 格/秒
          speed: (6 + Math.random() * 6) * speedScale,
          glyph: rand()
        });
      }
      trail = [];
      field.setAttribute("data-ready", "true");
    }

    function rand() {
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    }

    var last = 0;
    var SIM = 60; // 模拟步进 60ms
    var gustAt = performance.now() + 8000 + Math.random() * 6000;
    var gustUntil = 0;

    function frameLoop(now) {
      if (!cols) {
        requestAnimationFrame(frameLoop);
        return;
      }

      if (now - last >= SIM) {
        var dt = (now - last) / 1000;
        last = now;

        // 阵风每 8–14 秒穿过带区，速度不超过静息的两倍
        var gusting = now < gustUntil;
        if (now > gustAt) {
          gustUntil = now + 1400;
          gustAt = now + 8000 + Math.random() * 6000;
        }

        for (var c = 0; c < cols; c++) {
          var head = heads[c];
          head.row += head.speed * dt * (gusting ? 1.9 : 1);
          if (Math.random() < 0.25) head.glyph = rand();

          if (head.row > rows + 2) {
            head.row = -Math.random() * 6;
            head.speed = (6 + Math.random() * 6) * speedScale;
          }
          trail.push({ c: c, r: Math.floor(head.row), g: head.glyph, t: now });
        }

        // 尾迹约停留半秒
        trail = trail.filter(function (p) {
          return now - p.t < 520;
        });

        fctx.clearRect(0, 0, fCanvas.width, fCanvas.height);
        fctx.font = "500 13px " + (getComputedStyle(document.body).getPropertyValue("--font-mono") || "monospace");
        fctx.textBaseline = "top";

        trail.forEach(function (p) {
          var age = (now - p.t) / 520;
          var alpha = Math.max(0, 0.42 * (1 - age));
          var x = p.c * LATTICE;
          var y = p.r * LATTICE;

          // 指针辉光
          var dx = x - pointer.x;
          var dy = y - pointer.y;
          var near = Math.sqrt(dx * dx + dy * dy);
          if (near < 90) alpha += (1 - near / 90) * 0.4;

          fctx.fillStyle = inkColor(Math.min(alpha, 0.9).toFixed(3));
          fctx.fillText(p.g, x, y);
        });
      }

      requestAnimationFrame(frameLoop);
    }

    build();
    requestAnimationFrame(frameLoop);

    if ("ResizeObserver" in window) {
      new ResizeObserver(build).observe(field);
    } else {
      window.addEventListener("resize", build);
    }

    // 指针重绘上限约 30fps
    field.parentElement &&
      field.parentElement.addEventListener("pointermove", function (e) {
        var now = performance.now();
        if (now - pointer.at < 33) return;
        pointer.at = now;
        var rect = fCanvas.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
      });

    // 带区在轨道中吸顶，并在最初 320px 滚动中压缩淡出
    var track = field.closest(".glyph-track");
    if (track) {
      window.addEventListener(
        "scroll",
        function () {
          var y = window.scrollY;
          var k = Math.max(0, 1 - y / 320);
          field.style.opacity = String(k);
        },
        { passive: true }
      );
    }
  } else if (field) {
    field.setAttribute("data-ready", "true");
  }

  /* ---------------- GitHub 波形 ----------------
     文档规范：客户端在 DOM ready 后请求 /api/github/contributions?days=84；
     波形保留最近 30 天并自行求和，因为载荷里的 total 覆盖全部 84 天。
     本地复刻没有该接口，故渲染为空态并标注，不编造数据。 */
  var gh = document.querySelector("[data-gh-card]");
  if (gh) {
    var wave = gh.querySelector("[data-gh-wave]");
    var totalEl = gh.querySelector("[data-gh-total]");

    // 不伪造贡献数据：渲染静态的空槽位
    if (wave) {
      var html = "";
      for (var i = 0; i < 30; i++) {
        html +=
          '<span class="gh-wave__bar" style="--bar-i:' +
          i +
          ';height:4px"></span>';
      }
      wave.innerHTML = html;
    }
    if (totalEl) {
      totalEl.innerHTML =
        '<span class="placeholder-note">需接入 /api/github/contributions</span>';
    }
    gh.setAttribute("data-ready", "true");
    window.__homeHeroGithubReady = true;
    document.dispatchEvent(new CustomEvent("home:hero-github-ready"));
  }
})();
