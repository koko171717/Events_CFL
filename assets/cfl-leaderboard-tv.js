/* CFL V57: Parse BTWB's nested Perform / Train A+B leaderboards.
   Never infer gender from names; only explicit Men's / Women's Leaderboard headers. */
(()=>{
 'use strict';
 const root=document.querySelector('.btwb_webwidget');if(!root)return;
 const normal=s=>String(s||'').replace(/\s+/g,' ').trim();
 const text=el=>normal(el?.innerText||el?.textContent||'');
 const genderOf=s=>/^(men'?s|male|hommes)\s+(?:leaderboard|classement)$/i.test(normal(s))?'men':/^(women'?s|female|femmes)\s+(?:leaderboard|classement)$/i.test(normal(s))?'women':'';
 const partOf=s=>/\bperform\s*\/\s*train\s*a\b/i.test(s)?'A':/\bperform\s*\/\s*train\s*b\b/i.test(s)?'B':'';
 const data={A:{men:[],women:[]},B:{men:[],women:[]}};
 const source=document.createElement('div');source.className='cfl-leader-original';
 const board=document.createElement('div');board.className='cfl-leader-board';
 root.prepend(board);
 const candidates=()=>[...root.querySelectorAll('h1,h2,h3,h4,h5,h6,div,span,strong,b,th,p')].filter(el=>!el.closest('.cfl-leader-board')&&el.children.length<3);
 function findPart(label){
  let scope=label;
  for(let depth=0;scope&&depth<10;depth++,scope=scope.parentElement){
   let sib=scope.previousElementSibling;
   for(let i=0;sib&&i<12;i++,sib=sib.previousElementSibling){
    const t=text(sib);if(t.length<240){const p=partOf(t);if(p)return p;}
   }
   if(scope!==label&&partOf(text(scope).slice(0,100)))return partOf(text(scope).slice(0,100));
  }
  return '';
 }
 function nameAndScore(el){
  const t=(el.innerText||'').replace(/\r/g,'').split('\n').map(normal).filter(Boolean);
  const clean=t.filter(x=>!/^via\s*$/i.test(x)&&!/^\d+\s*(?:minutes?|hours?|heures?|jours?)\s*ago$/i.test(x));
  let rank='',name='',score='';
  for(let i=0;i<clean.length;i++){
   let s=clean[i];const m=s.match(/^#?([1-9]\d?)\s*[.)]\s*(.*)$/);
   if(m){rank=m[1];if(m[2]&&!/^completed|rx/i.test(m[2])){name=m[2].replace(/\s+via\b.*$/i,'');}else if(clean[i+1])name=clean[i+1];break;}
  }
  if(!name){const anchors=[...el.querySelectorAll('a')].filter(a=>/^[\p{L}][\p{L}\p{M}'’ -]{3,70}$/u.test(text(a))&&!/leaderboard|via|rx|completed/i.test(text(a)));name=text(anchors[0]);}
  if(!name)return null;
  const performance=clean.find(s=>/\b(?:completed|rx'?d|not rx'?d|\d+\s*(?:reps|rounds|mins?|secs?|kg|lb)|\d+:\d{2})\b/i.test(s)&&s!==name);
  score=performance||clean.slice(clean.indexOf(name)+1).find(s=>s.length>3&&!/^via/i.test(s))||'';
  if(!score||/leaderboard/i.test(name))return null;
  return {rank,name,score};
 }
 function extract(label){
  // Prefer the nearest dedicated results panel. Its heading may be outside the iframe-like panel.
  const elements=[];
  let sibling=label.nextElementSibling;
  for(let i=0;sibling&&i<5;i++,sibling=sibling.nextElementSibling){if(genderOf(text(sibling))||partOf(text(sibling).slice(0,80)))break;elements.push(sibling)}
  let anc=label.parentElement;
  for(let j=0;anc&&j<3;j++,anc=anc.parentElement){
   if(anc){const children=[...anc.children];const index=children.findIndex(c=>c===label||c.contains(label));
    for(let k=index+1;k<Math.min(index+4,children.length);k++)if(children[k]&&!elements.includes(children[k]))elements.push(children[k]);
   }
  }
  const results=[];const seen=new Set();
  for(const el of elements){
   const nodes=[...el.querySelectorAll('li,article,[class*="leader"],[class*="athlete"],[class*="result"],tr')].filter(n=>n!==el&&text(n).length>6);
   if(!nodes.length)nodes.push(...[...el.children].filter(n=>text(n).length>6));
   for(const node of nodes){const nested=nodes.some(other=>other!==node&&node.contains(other));if(nested)continue;
    const r=nameAndScore(node);if(r&&!seen.has(r.name+'|'+r.score)){seen.add(r.name+'|'+r.score);results.push(r);}
   }
   if(results.length)break;
  }
  if(!results.length){
   for(const el of elements){const iframe=el.matches('iframe')?el:el.querySelector('iframe');
    if(iframe&&(iframe.src||iframe.srcdoc))return [{embedded:true,src:iframe.src||'',srcdoc:iframe.srcdoc||''}];
   }
  }
  return results.slice(0,12);
 }
 let last='';
 function update(){
  const labels=candidates().filter(el=>genderOf(text(el)));
  const found={A:{men:[],women:[]},B:{men:[],women:[]}};
  for(const label of labels){const gender=genderOf(text(label));const part=findPart(label);if(!part||found[part][gender].length)continue;found[part][gender]=extract(label)}
  const sign=JSON.stringify(found);if(sign===last)return;last=sign;
  const fragment=document.createDocumentFragment();
  for(const part of ['A','B']){
   const area=document.createElement('section');area.className='cfl-leader-part';
   const heading=document.createElement('div');heading.className='cfl-leader-part-title';heading.textContent='PERFORM / TRAIN '+part;area.append(heading);
   const panels=document.createElement('div');panels.className='cfl-leader-panels';
   for(const [gender,title] of [['men','HOMMES'],['women','FEMMES']]){
    const section=document.createElement('div');section.className='cfl-leader-section';
    const head=document.createElement('div');head.className='cfl-leader-head';head.textContent=title;
    const header=document.createElement('div');header.className='cfl-leader-labels';['#','MEMBRE','PERFORMANCE'].forEach(v=>{const x=document.createElement('span');x.textContent=v;header.append(x)});
    const rows=document.createElement('div');rows.className='cfl-leader-rows';
    found[part][gender].forEach((r,i)=>{if(r.embedded){const iframe=document.createElement('iframe');iframe.className='cfl-leader-embedded';iframe.title='Classement BTWB '+title+' '+part;iframe.loading='eager';if(r.srcdoc)iframe.srcdoc=r.srcdoc;else iframe.src=r.src;rows.append(iframe);return;}const row=document.createElement('div');row.className='cfl-leader-row';for(const [cls,value] of [['rank',r.rank||String(i+1)],['name',r.name],['score',r.score]]){const cell=document.createElement('div');cell.className=cls;cell.textContent=value;row.append(cell)}rows.append(row)});
    if(!found[part][gender].length){const p=document.createElement('p');p.className='cfl-leader-empty';p.textContent='Aucun résultat disponible';rows.append(p)}
    section.append(head,header,rows);panels.append(section);
   }
   area.append(panels);fragment.append(area);
  }
  board.replaceChildren(fragment);root.classList.add('cfl-leader-ready');
 }
 new MutationObserver(()=>{clearTimeout(window.__leaderTimer);window.__leaderTimer=setTimeout(update,300)}).observe(root,{childList:true,subtree:true,characterData:true});
 setInterval(update,1800);update();
})();
