# Song's personal site — replica of buxx.me structure

## Authorization (2026-10-27)
Bunizao, author of buxx.me, agreed: you may replicate the overall design and
code, but do NOT replicate his personal information. This build follows that
scope exactly.

## Update — Subpage REA captures + refined version (2026-10-27)
- Captured projects, blog, mood, message from Windows (non-headless, real
  DOM sizes 66–124 KB, not the browsers-only notice). Structure-only
  analysis: projects has native <dialog> detail views and 6 works;
  blog has a subscribe <dialog> and an expand-older-posts control;
  mood entries carry comment-count + Comment/View-full-post actions;
  message has a site menu. No author content was copied.
- Refinements made from those structures: projects checklist + gallery
  expanded to 6 (1 real + 5 placeholders) and Step closer now opens a real
  <dialog> instead of an alert; blog got a subscribe <dialog>, an
  expand-older-posts control and a monthly-chart placeholder (no fake
  data); mood got a vertical TODAY rail + Back to top + per-entry comment
  actions; message got a working menu dropdown. All 7 pages re-verified,
  dialog interactions tested in Playwright.

## Update — REA capture from Windows (2026-10-27)
- Windows SSH works (Administrator@100.82.173.103, Tailscale). Node upgraded
  24.18.0 → 24.22.1 via winget, Chrome at
  C:\Program Files\Google\Chrome\Application\chrome.exe, rea-agents 6.8.0
  installed globally.
- First Windows capture (headless) returned only the site's browsers-only
  notice page (1,458 bytes) — the site detects headless browsers.
- Second capture with headless:false returned the real homepage DOM
  (169,728 bytes, Chrome 156). Structure check only (no author text,
  projects, posts or links copied): 7 positioned painting hotspots,
  8 canvas tabs/panels, a command palette, and the same page set already
  built here. One gap found and fixed: added site/privacy.html
  (placeholder, Song's own wording) and linked it from the homepage footer.
- The homepage still-life remains an original CSS composition, not the
  author's canvas painting, and no author personal information is in site/.

## What was actually done
- REA (morluto/rea) was installed and tried for a browser capture, but its
  Playwright capture could not reach buxx.me from this VM: the VM's egress
  goes through a proxy that Chromium does not accept (ERR_NO_SUPPORTED_PROXIES),
  so REA navigation failed before any capture. That failure is recorded here
  rather than hidden.
- The structure was then mapped with the managed browser (which can reach the
  site), using structural summaries only — no author biography, posts,
  project descriptions, or artwork were copied.
- The site in `site/` is an original implementation of that structure:
  homepage (left text / right still-life panel with hotspots and canvas
  panels), projects (checklist + gallery wall + detail placeholder),
  blog (year nav + list), mood (dotted background + timeline feed),
  message (chat bubbles + form), docs/colophon.

## What is NOT in here
- No author personal information, contact handles, writing, project copy,
  or painting. The still-life on the homepage is a plain CSS composition,
  not the author's artwork.
- No backend: the message form shows a local note and does not send.
  The subscribe buttons are placeholders.

## How to run
Open `site/index.html` in a browser, or serve the folder:
`python3 -m http.server 8000 --directory site` then visit http://localhost:8000/

## Fill in / leave blank
Search the site folder for （待填写） — every one is a placeholder for
Song's own information. Known real items already filled in: name
(Haoshuang Song), Monash computer science background, NutriTrack project,
and GitHub (yunanxiaobao). Email and other social accounts are left blank
on purpose until Song confirms what he wants published.
