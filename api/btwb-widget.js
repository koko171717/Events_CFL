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
  const activityColumns=kind==='activity'&&String(get('layout')||'')==='columns';
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
    ${activityColumns ? `
    html,body{height:100%;min-height:100%;overflow:hidden;background:#181818;color:#fff}
    body{padding:14px 18px 12px!important}
    .btwb_webwidget{color:#fff!important;height:100%;overflow:auto;scrollbar-color:#6c3d44 #222}
    .btwb_webwidget a{color:#ffc8cd!important}
    /* CFL Activities: two full-height leaderboard-like tables, not cards. */
    .btwb_webwidget.cfl-activity-ready > :not(.cfl-activity-board){display:none!important}
    .btwb_webwidget .cfl-activity-source{display:none!important}
    .btwb_webwidget .cfl-activity-board{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px;width:100%;height:100%;min-height:0;color:#fff}
    .btwb_webwidget .cfl-activity-column{display:flex;flex-direction:column;min-width:0;min-height:0;border:1px solid #4b4b4b;border-radius:10px;overflow:hidden;background:#222}
    .btwb_webwidget .cfl-activity-table-head{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.4fr) minmax(0,.9fr);gap:12px;padding:14px 18px;background:#B8151F;color:#fff!important;font-size:18px;font-weight:900;letter-spacing:.04em}
    .btwb_webwidget .cfl-activity-rows{display:grid;grid-auto-rows:minmax(0,1fr);min-height:0;height:100%;overflow:auto;scrollbar-width:thin;scrollbar-color:#924348 #292929}
    .btwb_webwidget .cfl-activity-row{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.4fr) minmax(0,.9fr);gap:12px;align-items:center;padding:12px 18px;border-bottom:1px solid #444;min-height:66px;font-size:clamp(17px,1.65vw,26px);line-height:1.24}
    .btwb_webwidget .cfl-activity-row:nth-child(even){background:#303030}
    .btwb_webwidget .cfl-activity-row:last-child{border-bottom:0}
    .btwb_webwidget .cfl-activity-person{font-weight:850;color:#fff;overflow-wrap:anywhere}
    .btwb_webwidget .cfl-activity-workout{font-weight:650;color:#e3e3e3;overflow-wrap:anywhere}
    .btwb_webwidget .cfl-activity-age{display:block;margin-top:3px;color:#e8a6ad;font-weight:550;font-size:.68em}
    .btwb_webwidget .cfl-activity-performance{font-weight:780!important;color:#fff!important;overflow-wrap:anywhere;white-space:pre-line}
    .btwb_webwidget .cfl-activity-detail{display:block;font-weight:450;font-size:.76em;color:#c9c9c9;margin-top:2px}
    .btwb_webwidget .cfl-activity-performance{font-weight:650;color:#e1e1e1;overflow-wrap:anywhere;white-space:pre-line}
    .btwb_webwidget .cfl-activity-board *{box-sizing:border-box}
    @media(max-width:650px){.btwb_webwidget .cfl-activity-board{gap:8px}.btwb_webwidget .cfl-activity-row{padding:8px;gap:5px;font-size:14px}.btwb_webwidget .cfl-activity-table-head{padding:8px;font-size:13px}}
    #cfl-widget-actions{background:#202020e8;border-radius:10px;padding:4px}
    #cfl-widget-state.warning{display:block}
    ` : ''}
    @media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
  `;
  const presentationJs = `
    (()=>{
      const root=document.querySelector('.btwb_webwidget');
      const badge=document.getElementById('cfl-widget-state');
      const actions=document.getElementById('cfl-widget-actions');
      const prev=document.getElementById('cfl-scroll-prev'),next=document.getElementById('cfl-scroll-next');
      let checked=0;let lastContent='';
      const twoColumns=${activityColumns?'true':'false'};
      // BTWB activities are not necessarily rendered as UL/LI: several versions
      // use nested DIV cards. Detect individual entries from their DOM content,
      // without depending on any one undocumented class name.
      function isActivityAge(s){return /(?:\\b\\d+\\s*(?:minutes?|mins?|heures?|hours?|hrs?|jours?|days?|semaines?|weeks?|secondes?|seconds?|sec|mois|months?)\\s*(?:ago|il y a)?\\b|\\bil y a\\b|\\byesterday\\b|\\bhier\\b|\\bjust now\\b|\\bà l.instant\\b)/i.test(s||'')}
      function cleanLines(node){return (node.innerText||node.textContent||'').split(/\\n+/).map(s=>s.replace(/\\s+/g,' ').trim()).filter(Boolean)}
      function isSourceCard(el){
        if(!el || el.closest('.cfl-activity-board') || el.classList?.contains('cfl-activity-board'))return false;
        const lines=cleanLines(el),txt=lines.join(' ');
        if(lines.length<3||lines.length>18||txt.length<35||txt.length>1500)return false;
        if(!isActivityAge(txt))return false;
        if(!el.querySelector('a,img,strong,b,[class*=user],[class*=member],[class*=athlete]'))return false;
        return true;
      }
      function findActivities(){
        // First choose repeated smallest card-like blocks; works with UL, DIV and ARTICLE feeds.
        const nodes=[...root.querySelectorAll('li,article,div,section')].filter(isSourceCard);
        const leaves=nodes.filter(el=>!nodes.some(other=>other!==el&&el.contains(other)));
        // A feed can contain intermediate divs for name + body. Prefer the wrapper
        // that contains at least a time label and a workout/score line.
        const chosen=[];
        for(const el of leaves){
          let item=el;
          while(item.parentElement&&item.parentElement!==root && !item.parentElement.classList.contains('btwb_webwidget')){
            const parent=item.parentElement;
            const childActs=[...parent.children].filter(x=>x!==item&&isSourceCard(x));
            if(childActs.length)break;
            const parentLines=cleanLines(parent);
            if(parentLines.length>14||(parent.textContent||'').length>900)break;
            if(parent.querySelectorAll('a,img').length>5)break;
            item=parent;
          }
          if(!chosen.some(prev=>prev.contains(item)||item.contains(prev)))chosen.push(item);
        }
        // Last resort: find the repeated parent of visible member/time labels.
        if(chosen.length<2){
          const anchors=[...root.querySelectorAll('a,strong,b')].filter(el=>!el.closest('.cfl-activity-board')&&el.textContent.trim().length>3);
          const alternatives=[];
          for(const a of anchors){
            let el=a.parentElement;
            for(let depth=0;el&&depth<5;depth++,el=el.parentElement){if(isSourceCard(el)){alternatives.push(el);break;}}
          }
          const unique=alternatives.filter((el,i)=>!alternatives.some((v,j)=>j!==i&&el.contains(v)));
          if(unique.length>=2)return [...new Set(unique)];
        }
        return chosen;
      }
      function parseActivity(el){
        const lines=cleanLines(el);
        const nameNode=el.querySelector('[class*=member-name],[class*=athlete-name],[class*=user-name],a[href*=member],a[href*=athlete],a[href*=user],strong,b');
        let person=(nameNode?.innerText||nameNode?.textContent||lines[0]||'').replace(/\\s+/g,' ').trim();
        let idx=lines.findIndex(x=>x===person);
        if(idx<0){ // Name and elapsed time may be on the same HTML text line.
          idx=lines.findIndex(x=>x.startsWith(person));
        }
        if(!person || person.length>85 || isActivityAge(person))person=lines[0];
        const ageLine=lines.find(x=>isActivityAge(x)&&x.length<110)||'';
        const remaining=lines.filter((x,i)=>i!==idx&&x!==person&&x!==ageLine&&!/^(?:like|comment|reply|j.aime|partager|share|rx.d|scaled|rx)$/i.test(x));
        const content=remaining.filter(x=>!/^(?:completed\\s*\\|\\s*rx.d.*|completed\\s*\\|\\s*scaled.*)$/i.test(x));
        const workout=content[0]||'Activité enregistrée';
        // Keep exact source score rather than infer a number from an exercise name.
        const resultLine=remaining.find(x=>/\\b(?:completed|rx.d|scaled|\\d+\\s*(?:kg|lb|lbs|reps|rounds|cal|m|km)|\\d{1,2}:\\d{2})\\b/i.test(x)&&x!==workout)||'';
        const extras=remaining.filter(x=>x!==workout&&x!==resultLine).slice(0,2);
        return {person,age:ageLine,workout,performance:resultLine||extras.shift()||'—',detail:extras.join(' · ')};
      }
      function arrangeActivities(){
        if(!twoColumns||!root)return;
        const source=findActivities();
        if(source.length<2)return;
        const entries=source.map(parseActivity).filter(v=>v.person&&v.workout);
        if(entries.length<2)return;
        const signature=entries.map(v=>[v.person,v.age,v.workout,v.performance,v.detail].join('|')).join('\\n');
        if(signature===root.dataset.cflActivitySignature)return;
        let board=root.querySelector('.cfl-activity-board');
        if(!board){board=document.createElement('div');board.className='cfl-activity-board';root.prepend(board)}
        const fragment=document.createDocumentFragment();
        const midpoint=Math.ceil(entries.length/2);
        [entries.slice(0,midpoint),entries.slice(midpoint)].forEach(part=>{
          const column=document.createElement('section');column.className='cfl-activity-column';
          const header=document.createElement('div');header.className='cfl-activity-table-head';
          ['MEMBRE','ACTIVITÉ','PERFORMANCE'].forEach(label=>{const cell=document.createElement('span');cell.textContent=label;header.append(cell)});
          const rows=document.createElement('div');rows.className='cfl-activity-rows';
          part.forEach(entry=>{
            const row=document.createElement('div');row.className='cfl-activity-row';
            const member=document.createElement('div');member.className='cfl-activity-person';member.textContent=entry.person;
            if(entry.age){const age=document.createElement('small');age.className='cfl-activity-age';age.textContent=entry.age;member.append(age)}
            const workout=document.createElement('div');workout.className='cfl-activity-workout';workout.textContent=entry.workout;
            const perf=document.createElement('div');perf.className='cfl-activity-performance';perf.textContent=entry.performance;
            if(entry.detail){const detail=document.createElement('small');detail.className='cfl-activity-detail';detail.textContent=entry.detail;perf.append(detail)}
            row.append(member,workout,perf);rows.append(row);
          });
          column.append(header,rows);fragment.append(column);
        });
        board.replaceChildren(fragment);
        root.dataset.cflActivitySignature=signature;
        root.classList.add('cfl-activity-ready');
      }
      function setState(state,copy){badge.className=state;badge.textContent=copy;}
      function measure(){
        if(!root)return;
        arrangeActivities();
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
