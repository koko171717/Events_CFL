// CFL TV V9 — official BTWB Webwidget container.
// Configure BTWB_WEBWIDGET_KEY in Vercel Environment Variables.
// A BTWB webwidget key is designed to be sent to a visitor's browser by BTWB;
// this route avoids committing it to Git, but DOES NOT make it secret from users.
const TRACKS=new Set(['84043','1237036','1237037','1237038','1237039','1237040','1237041','1237042','1237043']);
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
module.exports = function handler(req,res){
  const get = k => { const v=req.query[k];return Array.isArray(v)?v[0]:v; };
  const raw=get('track');
  const track=TRACKS.has(String(raw))?String(raw):'84043';
  const kind=['wod','activity','leaderboard','daily-leaderboard'].includes(String(get('type')))?String(get('type')):'wod';
  const count=Math.max(1,Math.min(kind==='activity'?30:20,Number.parseInt(get('count'),10)||5));
  const workoutId=/^[1-9]\d{0,9}$/.test(String(get('workout')||''))?String(get('workout')):'';
  const compact=String(get('compact')||'')==='1';
  // Readable TV presets, independent for single and two-column layouts.
  const size=['compact','balanced','large'].includes(String(get('size')))?String(get('size')):'balanced';
  const typography={compact:{body:compact?16:19,small:compact?14:16,h1:compact?25:30,h2:compact?23:27,h3:compact?21:24},balanced:{body:compact?20:24,small:compact?16:19,h1:compact?29:37,h2:compact?27:33,h3:compact?24:29},large:{body:compact?25:32,small:compact?20:25,h1:compact?35:47,h2:compact?31:41,h3:compact?28:35}}[size];
  const key=process.env.BTWB_WEBWIDGET_KEY;
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(!key){res.status(503).end('<!doctype html><html lang="fr"><meta charset="utf-8"><body style="font:22px sans-serif;padding:25px;color:#751c32"><h2>BTWB non configuré</h2><p>Ajouter la variable BTWB_WEBWIDGET_KEY dans Vercel puis redéployer.</p></body></html>');return;}
  // Avoid interpolating key in HTML as markup; standard BTWB widget expects an HTML data attribute.
  const safeKey=escapeHtml(key);
  if(kind==='leaderboard'&&!workoutId){res.status(400).end('<!doctype html><html lang="fr"><meta charset="utf-8"><body style="font:20px sans-serif;padding:24px">Choisir un identifiant de workout BTWB pour afficher le classement.</body></html>');return;}
  const widgetAttributes=kind==='activity'?`data-type="activities" data-length="${count}"`:
    kind==='leaderboard'?`data-type="leaders" data-workout_id="${workoutId}" data-length="${count}"`:
    `data-type="wods" data-sections="main" data-track_ids="${track}" data-activity_length="0" data-leaderboard_length="${kind==='daily-leaderboard'?count:0}" data-days="1"`;
  // BTWB owns its markup. Improve the shell without scraping or changing results.
  // Keep an accessible scroll fallback when a large WOD cannot fit a single screen.
  const presentationCss = `
    :root{color-scheme:light}html,body{min-height:100%;height:auto;background:#f5f7fb;color:#172238}
    body{padding:22px 27px 26px;margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:${typography.body}px;line-height:1.36}
    /* V30: CSS sits after BTWB stylesheet, with scoped type overrides. */
    .btwb_webwidget{max-width:100%;margin:0 auto;color:#172238;line-height:1.36;font-size:${typography.body}px!important}
    .btwb_webwidget p,.btwb_webwidget li,.btwb_webwidget td,.btwb_webwidget th,.btwb_webwidget label,.btwb_webwidget .description,.btwb_webwidget .text,.btwb_webwidget .workout-description{font-size:inherit!important;line-height:1.34!important}
    .btwb_webwidget small,.btwb_webwidget .small,.btwb_webwidget .muted,.btwb_webwidget .date{font-size:${typography.small}px!important;line-height:1.3!important}
    .btwb_webwidget strong,.btwb_webwidget b{font-weight:800}
    .btwb_webwidget h1{font-size:${typography.h1}px!important}
    .btwb_webwidget h2{font-size:${typography.h2}px!important}
    .btwb_webwidget h3,.btwb_webwidget h4{font-size:${typography.h3}px!important}
    .btwb_webwidget .btn,.btwb_webwidget button{font-size:${typography.small}px!important}
    .btwb_webwidget table{font-size:inherit!important}
    .btwb_webwidget table td,.btwb_webwidget table th{white-space:normal}
    
    .btwb_webwidget table{width:100%!important;border-collapse:separate;border-spacing:0;font-size:inherit}
    .btwb_webwidget td,.btwb_webwidget th{padding:9px 10px;vertical-align:middle}
    .btwb_webwidget img{max-width:100%;height:auto}
    .btwb_webwidget a{color:#95334e}
    .btwb_webwidget h1,.btwb_webwidget h2,.btwb_webwidget h3{line-height:1.14;overflow-wrap:anywhere}
    .btwb_webwidget *{box-sizing:border-box;overflow-wrap:break-word}
    #cfl-widget-state{position:fixed;top:9px;right:12px;z-index:30;padding:6px 11px;border-radius:20px;background:#152236;color:#fff;font-size:13px;font-weight:750;pointer-events:none;opacity:.90}
    #cfl-widget-state.ready{display:none}#cfl-widget-state.warning{background:#713447}
    #cfl-widget-actions{position:fixed;bottom:10px;right:14px;z-index:31;display:none;gap:8px}
    #cfl-widget-actions button{font:700 13px system-ui;padding:7px 11px;color:#162135;border:1px solid #bcc4cf;background:#fff;border-radius:8px;cursor:pointer}
    body.cfl-overflow #cfl-widget-actions{display:flex}
    body.cfl-overflow #cfl-widget-state.ready{display:block;background:#47566b}
    @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
  `;
  const presentationJs = `
    (()=>{
      const root=document.querySelector('.btwb_webwidget');
      const badge=document.getElementById('cfl-widget-state');
      const actions=document.getElementById('cfl-widget-actions');
      const prev=document.getElementById('cfl-scroll-prev'),next=document.getElementById('cfl-scroll-next');
      let checked=0;let lastContent='';
      function setState(state,copy){badge.className=state;badge.textContent=copy;}
      function measure(){
        if(!root)return;
        const text=root.innerText.trim();
        const nodes=root.querySelectorAll('table tr,li,article,.workout,.wod,section').length;
        const hasContent=text.length>25||nodes>2;
        if(hasContent){setState('ready','Contenu BTWB');}
        else if(++checked>15){setState('warning','Pas de données visibles · BTWB');}
        const overflow=document.documentElement.scrollHeight>window.innerHeight+45;
        document.body.classList.toggle('cfl-overflow',overflow);
        actions.style.display=overflow?'flex':'none';
        if(hasContent&&text!==lastContent){lastContent=text;window.parent?.postMessage({source:'cfl-btwb',status:'content'},location.origin)}
      }
      function move(dir){scrollBy({top:dir*Math.max(120,innerHeight*.65),behavior:'smooth'})}
      prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
      const observer=new MutationObserver(()=>{clearTimeout(window.__cflMeasureTimeout);window.__cflMeasureTimeout=setTimeout(measure,220)});
      if(root)observer.observe(root,{subtree:true,childList:true,characterData:true});
      setInterval(measure,1900);measure();
    })();
  `;
  const page=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://static.btwb.com/libs/webwidgets/2/webwidgets.css"><style>${presentationCss}</style></head><body><div id="cfl-widget-state" role="status">Chargement BTWB…</div><div class="btwb_webwidget" ${widgetAttributes}></div><div id="cfl-widget-actions" aria-label="Navigation contenu long"><button id="cfl-scroll-prev" type="button">↑ Plus haut</button><button id="cfl-scroll-next" type="button">↓ Suite</button></div><script id="btwb_config" data-api_key="${safeKey}"></script><script src="https://static.btwb.com/libs/webwidgets/2/webwidgets.js"></script><script>${presentationJs.replace(/<\/script/gi,'<\\/script')}</script></body></html>`;
  res.status(200).end(page);
};
