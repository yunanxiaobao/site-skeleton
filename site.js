// Theme: Light / Dark / System, plus the lamp on the painting toggles night.
(function(){
  const root=document.documentElement;
  function apply(mode){
    if(mode==='dark')root.setAttribute('data-theme','dark');
    else if(mode==='light')root.removeAttribute('data-theme');
    else root.setAttribute('data-theme',matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
    // System is represented by the matched value; explicit dark/light overrides it.
    if(mode==='system')root.dataset.system='1';
    localStorage.setItem('song-site-theme',mode);
  }
  const saved=localStorage.getItem('song-site-theme')||'system';
  if(saved==='dark')root.setAttribute('data-theme','dark');
  else if(saved==='light')root.removeAttribute('data-theme');
  else if(matchMedia('(prefers-color-scheme: dark)').matches)root.setAttribute('data-theme','dark');
  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-theme-set]');if(t)apply(t.dataset.themeSet);
    const lamp=e.target.closest('[data-lamp]');if(lamp){const cur=root.getAttribute('data-theme');apply(cur==='dark'?'light':'dark');}
    const open=e.target.closest('[data-search-open]');if(open)document.getElementById('searchModal').classList.add('open');
    const close=e.target.closest('[data-search-close]');if(close)document.getElementById('searchModal').classList.remove('open');
  });
  document.addEventListener('keydown',e=>{
    if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('searchModal').classList.add('open');}
    if(e.key==='Escape')document.getElementById('searchModal').classList.remove('open');
  });
  // Painting hotspots: hover swaps the caption, click opens the matching canvas tab.
  document.querySelectorAll('[data-hotspot]').forEach(el=>{
    const caption=document.getElementById('paintingCaption');const def=caption?caption.innerHTML:'';
    el.addEventListener('mouseenter',()=>{if(caption)caption.innerHTML=el.dataset.caption;});
    el.addEventListener('mouseleave',()=>{if(caption)caption.innerHTML=def;});
    el.addEventListener('click',()=>{
      const tab=document.querySelector('[data-panel="'+el.dataset.hotspot+'"]');
      if(tab)tab.click();
      document.getElementById('canvas').classList.add('active');
      document.getElementById('canvas').scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  });
  document.querySelectorAll('[data-panel]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('[data-panel]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');
      document.querySelectorAll('[data-panel-content]').forEach(p=>p.style.display='none');
      const p=document.querySelector('[data-panel-content="'+btn.dataset.panel+'"]');if(p)p.style.display='block';
    });
  });
  // Clock in the painting, local time.
  const clock=document.getElementById('paintingClock');
  if(clock){const tick=()=>{clock.textContent=new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'});};tick();setInterval(tick,30000);}
  // Message form: no backend is connected yet, so show a local note instead of sending.
  const form=document.getElementById('messageForm');
  if(form)form.addEventListener('submit',e=>{e.preventDefault();document.getElementById('messageNote').textContent='表单尚未接入后端：这条留言没有发送。请先在 message.html 里接好你的邮箱或后端再启用。';});
})();
