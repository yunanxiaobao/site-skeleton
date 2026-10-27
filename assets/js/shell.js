/* ==========================================================================
   shell.js — 共享外壳行为：主题、导航高亮、命令面板、滚动揭示、复制按钮
   原创实现。行为规范（主题在首帧前落定、设置与生效主题分离、仅首页区块
   链接随滚动点亮、减弱动效时跳过擦除转场）依据站点所有者公开发布的文档。
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------- 主题 ----------------
     注意：首帧前落定主题的那一小段脚本内联在每个页面的 <head> 里，
     这里处理的是之后的切换。 */
  function resolveTheme(setting) {
    if (setting === "light" || setting === "dark") return setting;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function applyTheme(setting, animate) {
    var root = document.documentElement;
    var before = root.classList.contains("dark") ? "dark" : "light";
    var after = resolveTheme(setting);

    try {
      if (setting === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", setting);
    } catch (e) {
      /* 存储被阻止时静默回退，不抛出 */
    }

    root.setAttribute("data-theme-setting", setting);

    // 生效主题未变化，或开启了减弱动效时，跳过擦除转场
    var shouldWipe = animate && !reduceMotion && before !== after;
    if (shouldWipe) {
      var wipe = document.createElement("div");
      wipe.className = "theme-wipe";
      wipe.setAttribute("data-run", "true");
      document.body.appendChild(wipe);
      setTimeout(function () {
        wipe.remove();
      }, 500);
    }

    root.classList.toggle("dark", after === "dark");
  }

  // 自有主题控件通过 document 上的 theme:set 事件走同一套解析
  document.addEventListener("theme:set", function (ev) {
    var next = ev && ev.detail ? ev.detail : "system";
    applyTheme(next, true);
  });

  var themeMenu = document.querySelector("[data-theme-menu]");
  if (themeMenu) {
    var toggle = themeMenu.querySelector("[data-theme-toggle]");
    toggle &&
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        var open = themeMenu.getAttribute("data-open") === "true";
        themeMenu.setAttribute("data-open", open ? "false" : "true");
      });

    themeMenu.querySelectorAll("[data-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        document.dispatchEvent(
          new CustomEvent("theme:set", { detail: btn.getAttribute("data-set") })
        );
        themeMenu.setAttribute("data-open", "false");
      });
    });

    document.addEventListener("click", function () {
      themeMenu.setAttribute("data-open", "false");
    });
  }

  // 系统偏好变化时，仅在设置为 system 时跟随
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function () {
      if (document.documentElement.getAttribute("data-theme-setting") === "system") {
        applyTheme("system", false);
      }
    });

  /* ---------------- 导航：区块高亮 ----------------
     文档规范：只有首页存在这些区块，其他页面不点亮任何链接。 */
  var sectionLinks = Array.prototype.slice.call(
    document.querySelectorAll(".nav-link[data-section]")
  );
  var sections = sectionLinks
    .map(function (a) {
      var id = a.getAttribute("data-section");
      var el = document.getElementById(id + "-section");
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var hit = sections.find(function (s) {
            return s.el === entry.target;
          });
          if (!hit) return;
          if (entry.isIntersecting) {
            sections.forEach(function (s) {
              s.link.removeAttribute("aria-current");
            });
            hit.link.setAttribute("aria-current", "true");
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    sections.forEach(function (s) {
      spy.observe(s.el);
    });
  }

  // 只有 # 链接做平滑滚动；navLinks 里都是真实路由，点击即导航
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href").slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  /* ---------------- 滚动揭示 ----------------
     先给 html 加 js-reveal 再隐藏初始态：脚本没跑到这一步时内容保持可见，
     不会出现「不滚动就一片空白」。 */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if (!("IntersectionObserver" in window) || reduceMotion) {
      reveals.forEach(function (el) {
        el.classList.add("is-in");
      });
    } else {
      document.documentElement.classList.add("js-reveal");
      var ro = new IntersectionObserver(
        function (entries, obs) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
      );
      reveals.forEach(function (el) {
        ro.observe(el);
      });
    }
  }

  /* ---------------- 命令面板 ---------------- */
  var palette = document.querySelector("[data-palette]");
  if (palette) {
    var input = palette.querySelector("[data-palette-input]");
    var results = palette.querySelector("[data-palette-results]");
    var routes = window.__SITE_ROUTES__ || [];
    var active = 0;
    var shown = routes.slice();

    function render() {
      if (!shown.length) {
        results.innerHTML =
          '<div class="palette__empty">没有匹配的页面</div>';
        return;
      }
      results.innerHTML = shown
        .map(function (r, i) {
          return (
            '<a class="palette__item" data-active="' +
            (i === active) +
            '" href="' +
            r.href +
            '"><b>' +
            r.title +
            "</b><span>" +
            r.href +
            "</span></a>"
          );
        })
        .join("");
    }

    function openPalette() {
      palette.setAttribute("data-open", "true");
      shown = routes.slice();
      active = 0;
      input.value = "";
      render();
      input.focus();
    }

    function closePalette() {
      palette.setAttribute("data-open", "false");
    }

    document.querySelectorAll(".js-palette-open").forEach(function (btn) {
      btn.addEventListener("click", openPalette);
    });

    input &&
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        shown = routes.filter(function (r) {
          return (
            !q ||
            r.title.toLowerCase().indexOf(q) > -1 ||
            r.href.toLowerCase().indexOf(q) > -1
          );
        });
        active = 0;
        render();
      });

    document.addEventListener("keydown", function (e) {
      var isOpen = palette.getAttribute("data-open") === "true";
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        isOpen ? closePalette() : openPalette();
        return;
      }
      if (!isOpen) return;
      if (e.key === "Escape") {
        closePalette();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        active = Math.min(active + 1, shown.length - 1);
        render();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        active = Math.max(active - 1, 0);
        render();
      } else if (e.key === "Enter") {
        if (shown[active]) window.location.href = shown[active].href;
      }
    });

    palette.addEventListener("click", function (e) {
      if (e.target === palette) closePalette();
    });
  }

  /* ---------------- 复制按钮 ----------------
     复制成功是「确认动作」，用唯一允许过冲的弹簧曲线。 */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      var done = function () {
        btn.setAttribute("data-copied", "true");
        var old = btn.textContent;
        btn.textContent = "已复制";
        setTimeout(function () {
          btn.removeAttribute("data-copied");
          btn.textContent = old;
        }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, done);
      } else {
        done();
      }
    });
  });

  /* ---------------- 心情点赞 ---------------- */
  document.querySelectorAll("[data-like]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var on = btn.getAttribute("data-liked") === "true";
      btn.setAttribute("data-liked", on ? "false" : "true");
      var n = btn.querySelector("[data-like-count]");
      if (n) {
        var v = parseInt(n.textContent, 10) || 0;
        n.textContent = String(on ? Math.max(0, v - 1) : v + 1);
      }
    });
  });

  /* ---------------- 页脚状态 ----------------
     文档规范：data-footer-status 初始为 unknown，在 /api/footer 应答前
     读作 Checking。本地复刻没有后端，故停在 unknown 并说明。 */
  document.querySelectorAll("[data-footer-status]").forEach(function (pill) {
    var label = pill.querySelector("[data-status-label]");
    if (label) label.textContent = "本地复刻：无后端";
  });
})();
