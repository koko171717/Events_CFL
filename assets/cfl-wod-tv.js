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
function hwpoB(w){return /^\s*B(?:[.)\s:-]|$)/i.test(w.title)||metcon(w)}
function maxListedLoad(w){
 // Comparison only for duplicate generic titles. The visible prescribed loads remain unchanged.
 const values=(w.lines.join(' ').match(/\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?\s*(?:lb|lbs|kg)/gi)||[])
  .map(v=>Number(v.match(/^\d+(?:\.\d+)?/)[0]));
 return values.length?Math.max(...values):null;
}
function hwpoVariants(items){
 // The official widget can call both standard and intermediate "B. Metcon".
 // Preserve all original variants; distinguish generic title duplicates only when unambiguous.
 const ret=items.map(w=>({...w}));
 if(ret.length>=3){
  const beginners=ret.filter(w=>/beginner/i.test(w.title));
  const intermediates=ret.filter(w=>/intermediate/i.test(w.title));
  const generic=ret.filter(w=>!/beginner|intermediate/i.test(w.title));
  if(ret.length===3&&beginners.length===1&&intermediates.length===0&&generic.length===2){
   const l0=maxListedLoad(generic[0]),l1=maxListedLoad(generic[1]);
   if(l0!==null&&l1!==null&&l0!==l1){
    const lower=l0<l1?generic[0]:generic[1];
    lower.title='B. Metcon Intermediate';
   }
  }
  // Keep official tier labels, including distinct Intermediate Level 1 and Level 2.
  // The more demanding intermediate level is shown first when numeric levels are supplied.
  // Unknown/additional tiers keep their source order (stable sort).
  const rank=w=>{
   const t=clean(w.title);
   if(/beginner/i.test(t))return 50;
   if(/intermediate/i.test(t)){
    const m=t.match(/intermediate\s*(?:level|lvl|niv(?:eau)?)?\s*([12])\b/i);
    return m?10+Number(m[1]):15;
   }
   if(/\b(?:scaled|foundation)\b/i.test(t))return 60;
   return 0;
  };
  ret.sort((x,y)=>rank(x)-rank(y));
 }
 return ret;
}
function chunks(items,track){
 const name=(trNames[track]||'').toLowerCase();
 if(name.includes('hwpo affiliate')){
  const filtered=items.filter(w=>!accessory(w));
  const a=filtered.filter(w=>!hwpoB(w));
  const b=filtered.filter(w=>hwpoB(w));
  // All B variants (sometimes 3, 4 or 5) belong to one metcon.
  // Keep each variant complete. Pagination is decided by fit, not a hard-coded count.
  return [...a.map(w=>({items:[w],hwpoB:false})),
   ...(b.length?[{items:hwpoVariants(b),hwpoB:true}]:[])];
 }
 return [{items,hwpoB:false}];
}

// A two-row screen works only for short variants. Longer variations stay
// intact, on individual pages of up to three full cards. Never crop a variant.
function hwpoFitsTwoRows(items){
 if(items.length<4||items.length>5)return false;
 return items.every(w=>w.lines.length<=7 && w.lines.join(' ').length<=320 && !w.lines.some(l=>l.length>66));
}
function hwpoPages(items){
 if(items.length<=3)return [{items,hwpoB:true,hwpoDense:false}];
 if(hwpoFitsTwoRows(items))return [{items,hwpoB:true,hwpoDense:true}];
 const result=[];
 for(let i=0;i<items.length;i+=3)result.push({items:items.slice(i,i+3),hwpoB:true,hwpoDense:false});
 return result;
}

// HWPO Hyrox: section names and number of blocks vary by day. Preserve BTWB
// order and complete descriptions, with no arbitrary 10-line splitting.
function hyroxWeight(w){
 const lines=w.lines||[];
 const wrapped=lines.reduce((sum,l)=>sum+Math.max(1,Math.ceil(l.length/42)),0);
 return Math.max(lines.length,wrapped);
}
function hyroxPages(items){
 const result=[];
 let i=0;
 while(i<items.length){
  const remaining=items.slice(i);
  // A 2x2 or 3x2 layout only if every section is genuinely short.
  const short=remaining.slice(0,6);
  if(short.length>=4){
   let n=0;
   if(short.length>=6 && short.slice(0,6).every(w=>hyroxWeight(w)<=5 && w.lines.join(' ').length<=210))n=6;
   else if(short.length>=5 && short.slice(0,5).every(w=>hyroxWeight(w)<=5 && w.lines.join(' ').length<=210))n=5;
   else if(short.slice(0,4).every(w=>hyroxWeight(w)<=7 && w.lines.join(' ').length<=260))n=4;
   if(n){result.push({items:remaining.slice(0,n),hyrox:true,hyroxDense:true});i+=n;continue;}
  }
  // Use three columns for compact/medium sections, two for longer sections,
  // and a dedicated full-width card for very long descriptions.
  const first=remaining[0];const weight=hyroxWeight(first);
  if(weight>22 || first.lines.join(' ').length>1050){result.push({items:[first],hyrox:true});i++;continue;}
  const max=weight>13?2:3;
  const group=[first];
  while(group.length<max && i+group.length<items.length){
   const next=items[i+group.length];
   const limit=group.length===1 && max===2?16:12;
   if(hyroxWeight(next)>limit||next.lines.join(' ').length>650)break;
   group.push(next);
  }
  result.push({items:group,hyrox:true});i+=group.length;
 }
 return result;
}

// Compact paired layout: A above B for Perform / Intermediate / Train.
// Only enable it for short, complete sections; long WODs keep the safe 3-card pages.
function compactPairs(items){
 if(items.length!==6)return false;
 const slots=new Map();
 for(const w of items){
  const match=clean(w.title).match(/^(perform|intermediate|train)\s*([AB])\b/i);
  if(!match)return false;
  const key=match[1].toLowerCase()+match[2].toUpperCase();
  if(slots.has(key))return false;
  slots.set(key,w);
  // Short enough for half-height cards at readable TV font sizes.
  if(w.lines.length>7 || w.lines.join(' ').length>270 || w.lines.some(l=>l.length>92))return false;
 }
 return ['performA','performB','intermediateA','intermediateB','trainA','trainB'].every(k=>slots.has(k));
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
    if((trNames[d.track]||'').toLowerCase().includes('hwpo hyrox')){
     for(const hp of hyroxPages(group.items))pages.push({title:trNames[d.track]||'HWPO Hyrox',...hp});
     continue;
    }
    if(group.hwpoB){
     // One screen when all variants fit; otherwise full-card pages.
     for(const hp of hwpoPages(group.items)) pages.push({title:trNames[d.track]||'Programmation BTWB',...hp});
     continue;
    }
    const normalized=group.items.flatMap(w=>{const maxLines=10;if(w.lines.length<=maxLines && w.lines.join(' ').length<580)return [w];const slices=[];for(let k=0;k<w.lines.length;k+=7)slices.push({...w,title:w.title+(k?' · suite '+(Math.floor(k/7)+1):''),lines:w.lines.slice(k,k+7)});return slices});
    if(compactPairs(normalized)&&!showInstruction()){
     pages.push({title:trNames[d.track]||'Programmation BTWB',items:normalized,compact:true});
    }else{
     for(let i=0;i<normalized.length;i+=3){const subset=normalized.slice(i,i+3);pages.push({title:trNames[d.track]||'Programmation BTWB',items:subset});}
    }
   }}
   render();
  }
 }
 function render(){
  if(!alive()){stop();return}
  root.replaceChildren();const p=pages[page%pages.length];
  if(!p){root.append(asDiv('div','cfl-wod-loading','BTWB — récupération du WOD en cours…'));return}
  const head=asDiv('div','cfl-wod-head');head.append(asDiv('div','cfl-wod-track',p.title),asDiv('div','cfl-wod-counter',pages.length>1?`ÉCRAN ${page%pages.length+1}/${pages.length}`:'PROGRAMMATION DU JOUR'));root.append(head);
  const grid=asDiv('div','cfl-wod-grid');grid.style.setProperty('--cfl-cols',String(p.hyroxDense&&p.items.length===4?2:Math.min(3,p.items.length)));root.classList.toggle('cfl-wod-three',p.items.length===3);root.classList.toggle('cfl-wod-six',!!p.compact);root.classList.toggle('cfl-wod-hwpo-b',!!p.hwpoB);root.classList.toggle('cfl-wod-hwpo-dense',!!p.hwpoDense);root.classList.toggle('cfl-wod-hyrox',!!p.hyrox);root.classList.toggle('cfl-wod-hyrox-dense',!!p.hyroxDense);
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
  const cards=[...grid.children];for(const card of cards){const list=card.querySelector('.cfl-wod-lines');let fs=parseFloat(getComputedStyle(root).getPropertyValue('--cfl-font'))||31;
   if(p.hwpoDense)fs=Math.min(fs,20);else if(p.hwpoB)fs=Math.min(fs,24);else if(p.hyroxDense)fs=Math.min(fs,22);else if(p.hyrox)fs=Math.min(fs,p.items.length===1?30:26);else if(p.compact)fs=Math.min(fs,25);else if(p.items.length===3)fs=Math.min(fs,27);
   list.style.fontSize=fs+'px';
   const minFont=p.hwpoDense?17:p.hwpoB?17:p.hyroxDense?18:p.hyrox?20:p.compact?21:19;
   while(list.scrollHeight>list.clientHeight+2&&fs>minFont){fs-=1;list.style.fontSize=fs+'px'}
   if(list.scrollHeight>list.clientHeight+2){card.title='Entraînement long : consulter le widget officiel pour toutes les consignes';list.style.overflow='auto'}}
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
