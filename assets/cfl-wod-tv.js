/* CFL TV V44 - Same slide chrome, official BTWB HTML extraction, no external auth */
(()=>{'use strict';
const clean=s=>String(s??'').replace(/\u00a0/g,' ').trim();
const text=n=>clean(n?.innerText||n?.textContent||'');
const swiss=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const trNames={'84043':'CrossFit Leman Program','1237036':'HWPO Focus','1237037':'HWPO Affiliate','1237039':'HWPO Sweat','1237042':'HWPO Hyrox','1237043':'HWPO Bodybuilding'};
function extract(doc){
 const root=doc?.querySelector('.btwb_webwidget');if(!root)return [];
 let nodes=[...root.querySelectorAll('ul.btwb-wod-list > li')];
 if(!nodes.length)nodes=[...root.querySelectorAll('.btwb-workout-description')].map(x=>x.closest('li')||x.parentElement);
 return [...new Set(nodes)].map(node=>{
  const desc=node.querySelector('.btwb-workout-description,.workout-description')||node;
  const raw=text(desc);if(raw.length<4)return null;
  let title=text(node.querySelector('.btwb-track-event-title,.btwb-wod-name,.btwb-workout-title,.workout-name'));
  if(!title){const arr=text(node).split(/\n+/).map(x=>x.trim()).filter(Boolean);if(arr.length>1&&/^(?:MAIN|STRENGTH|METCON|SKILL|ACCESSORY)\s*:/i.test(arr[1]))title=arr[0];}
  if(!title)title=text(node.querySelector('h1,h2,h3,h4'));
  let lines=raw.split(/\n+/).map(x=>x.trim()).filter(Boolean);
  if(lines.length===1&&raw.length>210)lines=raw.split(/(?=\b(?:For time:|AMRAP\b|EMOM\b|Time cap:|Every\s+\d|\d+\s*(?:Bike|Pull|Chest|Bar|Rope|Row|Ski|Deadlift|Squat|Burpees)))/i).map(x=>x.trim()).filter(Boolean);
  if(lines[0]===title)lines.shift();
  return {title:title||'Entraînement',lines};
 }).filter(Boolean);
}
const accessory=w=>/\b(?:accessor(?:y|ies)|extra(?:s)?|cool\s*down)\b/i.test(w.title);
const metcon=w=>/\b(?:metcon|conditioning|workout\s*[1-9])\b/i.test(w.title);
function chunks(items,track){
 const name=(trNames[track]||'').toLowerCase();
 if(name.includes('hwpo affiliate')){
  const filtered=items.filter(w=>!accessory(w));
  const a=filtered.filter(w=>/^\s*A(?:[.)\s:-]|$)/i.test(w.title)||!metcon(w));
  const m=filtered.filter(w=>!a.includes(w));
  return [...a.map(w=>[w]),...Array.from({length:Math.ceil(m.length/3)},(_,i)=>m.slice(i*3,i*3+3))];
 }
 // Do not silently delete parts: one group can split by 2/3 as necessary.
 return [items];
}
function mount(root){
 if(!root||root.dataset.initialized==='1')return;
 root.dataset.initialized='1';
 const trackIds=(root.dataset.tracks||'84043').split(',').filter(x=>/^\d+$/.test(x));
 const frames=[];let page=0,pages=[],timers=[],lastSignature='';const origin=swiss();
 const size=root.dataset.size||'balanced';
 const instruction=clean(root.dataset.instruction||'');
 const instructionDate=clean(root.dataset.instructionDate||'');
 const instructionTrack=clean(root.dataset.instructionTrack||'');
 const showInstruction=()=>Boolean(instruction&&instructionDate===swiss()&&instructionTrack===trackIds[0]);
 const asDiv=(tag,cls,label)=>{const el=document.createElement(tag);el.className=cls;if(label!==undefined)el.textContent=label;return el};
 function alive(){return root.isConnected&&swiss()===origin}
 function update(){
  if(!alive()){stop();return}
  const data=[];for(const entry of frames){let doc;try{doc=entry.iframe.contentDocument}catch{}if(!doc?.body)continue;data.push({track:entry.track,items:extract(doc)})}
  if(data.some(x=>x.items.length)){
   const signature=JSON.stringify(data);
   if(signature===lastSignature)return;
   lastSignature=signature;page=0;pages=[];
   for(const d of data){for(const group of chunks(d.items,d.track)){
    const normalized=group.flatMap(w=>{const maxLines=10;if(w.lines.length<=maxLines && w.lines.join(' ').length<580)return [w];const slices=[];for(let k=0;k<w.lines.length;k+=7)slices.push({...w,title:w.title+(k?' · suite '+(Math.floor(k/7)+1):''),lines:w.lines.slice(k,k+7)});return slices});
    for(let i=0;i<normalized.length;i+=3){const subset=normalized.slice(i,i+3);pages.push({title:trNames[d.track]||'Programmation BTWB',items:subset});}
   }}
   render();
  }
 }
 function render(){
  if(!alive()){stop();return}
  root.replaceChildren();const p=pages[page%pages.length];
  if(!p){root.append(asDiv('div','cfl-wod-loading','BTWB — récupération du WOD en cours…'));return}
  const head=asDiv('div','cfl-wod-head');head.append(asDiv('div','cfl-wod-track',p.title),asDiv('div','cfl-wod-counter',pages.length>1?`ÉCRAN ${page%pages.length+1}/${pages.length}`:'PROGRAMMATION DU JOUR'));root.append(head);
  const grid=asDiv('div','cfl-wod-grid');grid.style.setProperty('--cfl-cols',String(Math.min(3,p.items.length)));root.classList.toggle('cfl-wod-three',p.items.length===3);
  for(const w of p.items){const card=asDiv('section','cfl-wod-card');card.append(asDiv('h2','cfl-wod-title',w.title));const list=asDiv('div','cfl-wod-lines');for(const l of w.lines){const el=asDiv('div',/^(for time|amrap|emom|every|complete|\d+\s*rounds?)/i.test(l)?'intro':/^rest\b/i.test(l)?'rest':'',l);list.append(el)}card.append(list);grid.append(card)}root.append(grid);
  if(showInstruction()){
   const note=asDiv('aside','cfl-wod-athlete-note');
   note.append(asDiv('div','cfl-wod-athlete-label','CONSIGNES AUX ATHLÈTES'));
   note.append(asDiv('div','cfl-wod-athlete-copy',instruction));
   root.append(note);
   root.classList.add('has-athlete-note');
  }else root.classList.remove('has-athlete-note');
  root.append(asDiv('div','cfl-wod-bottom','BTWB · CROSSFIT LEMAN'));
  // Fit text down only when necessary, retain readability and never silently truncate.
  const cards=[...grid.children];for(const card of cards){const list=card.querySelector('.cfl-wod-lines');let fs=parseFloat(getComputedStyle(root).getPropertyValue('--cfl-font'))||31;if(p.items.length===3)fs=Math.min(fs,27);list.style.fontSize=fs+'px';while(list.scrollHeight>list.clientHeight+2&&fs>19){fs-=1;list.style.fontSize=fs+'px'}if(list.scrollHeight>list.clientHeight+2){card.title='Entraînement long : consulter le widget officiel pour toutes les consignes';list.style.overflow='auto'}}
 }
 function stop(){for(const id of timers)clearInterval(id);timers.length=0;for(const f of frames)f.iframe.remove()}
 const host=document.createElement('div');host.style.cssText='position:absolute;left:-12000px;top:0;width:1000px;height:900px;overflow:hidden;pointer-events:none;opacity:0';root.append(host);
 for(const id of trackIds){const iframe=document.createElement('iframe');iframe.title='Chargement BTWB';iframe.setAttribute('aria-hidden','true');iframe.style.cssText='width:950px;height:850px;border:0';iframe.src='/api/btwb-widget?'+new URLSearchParams({type:'wod',track:id,size:'balanced',count:'5',day:origin,v:Math.floor(Date.now()/300000)});iframe.addEventListener('load',()=>{setTimeout(update,1300);setTimeout(update,3500)});host.append(iframe);frames.push({track:id,iframe})}
 // host should survive rerender: append to slide art separately instead of root
 root.parentElement.append(host);
 timers.push(setInterval(()=>{if(!alive()){stop();return}update()},7000));
 timers.push(setInterval(()=>{if(!alive()){stop();return}if(pages.length>1){page=(page+1)%pages.length;render()}},12000));
 update();
}
window.CFL_WOD={mount};
})();
