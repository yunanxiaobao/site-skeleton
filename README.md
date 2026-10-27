# strict-orig — deployed to GitHub Pages for viewing (local strict-orig version)

- HTML: strict transform from REA DOM structure, personal text blanked for the owner to fill in later.
- CSS: 17 original CSS files, in css/.
- JS: original module scripts + imported chunks, in assets/, in the original per-page order.
- Fonts: NOT copied into this repo (the GitHub connector cannot push binary files);
  CSS loads them from the original site's /fonts/ path, so the look is preserved.
- NOT included: inline boot scripts, structured data, and JSON data payloads
  (cup / easel sections / logo / mood feed) — those carry the author's own
  content, to be replaced by the owner with his own data/interfaces.
- Known limits on this Pages project site: backend API calls (/api/...) return
  404 until the owner supplies his own backend; the clock worker (absolute
  /_astro/ path) does not resolve under a project-site subpath; easel/painting,
  project dialog, blog subscribe and mood feed need the owner's data payloads
  and backend before they work fully. Theme and command palette work.
