/* CFL CONTROL V56 — official BTWB leaderboard transformed into two gender columns.
   No names are used to infer gender. WOD description stays in the hidden source. */
(()=>{
  'use strict';
  const root=document.querySelector('.btwb_webwidget');
  if(!root)return;
  const config=[{id:'men',title:'HOMMES',match:/^(?:hommes|men|male|males|masculin|masculine|male athletes)(?:\s*\(\d+\))?$/i},
                {id:'women',title:'FEMMES',match:/^(?:femmes|women|female|females|feminin|féminin|feminine|female athletes)(?:\s*\(\d+\))?$/i}];
  const txt=el=>(el?.innerText||el?.textContent||'').replace(/\s+/g,' ').trim();
  const isInsideBoard=el=>!!el.closest('.cfl-leader-board');
  const genderOf=s=>config.find(g=>g.match.test((s||'').trim()))?.id||null;
  const rowsFrom=(container)=>{
    if(!container)return [];
    const rows=[...container.querySelectorAll('tbody tr, table tr, [role="row"]')]
      .filter(el=>!isInsideBoard(el));
    if(rows.length){return rows.map(el=>{
      const cells=[...el.querySelectorAll(':scope > td,:scope > th,:scope > [role="cell"],:scope > [role="rowheader"]')].map(txt).filter(Boolean);
      if(cells.length<2)return null;
      let rank='';let name='';let score='';
      if(/^#?\d{1,3}(?:st|nd|rd|th|er|e|ème)?[.)]?$/i.test(cells[0])){rank=cells[0].replace(/[^\d]/g,'');name=cells[1];score=cells.slice(2).join(' · ')}
      else{name=cells[0];score=cells.slice(1).join(' · ')}
      if(!name||!score||/^(?:name|athlete|member|nom|membre|score|result|performance|rank|rang|place)$/i.test(name))return null;
      return {rank,name,score};
    }).filter(Boolean)}
    // Some BTWB versions use div or list rows rather than tables.
    const candidates=[...container.querySelectorAll('li,[class*="leaderboard-row"],[class*="leader-row"],[class*="ranking-row"],[class*="result-row"]')]
      .filter(el=>!isInsideBoard(el)&&![...el.children].some(c=>c.matches('li,[class*="leaderboard-row"],[class*="leader-row"],[class*="ranking-row"],[class*="result-row"]')));
    return candidates.map(el=>{
      const children=[...el.children].map(txt).filter(Boolean);
      if(children.length<2)return null;
      const rank=/^#?\d{1,3}$/.test(children[0])?children.shift().replace('#',''):'';
      const name=children.shift();const score=children.join(' · ');
      if(!name||!score)return null;
      return {rank,name,score};
    }).filter(Boolean);
  };
  function discover(){
    const found={men:[],women:[]};
    // Require an explicit category in the BTWB markup; never infer from a first name.
    const labels=[...root.querySelectorAll('h1,h2,h3,h4,h5,h6,th,legend,[role="heading"],.title,.heading,.gender,button,span,strong')]
      .filter(el=>!isInsideBoard(el)&&genderOf(txt(el)));
    for(const label of labels){
      const gender=genderOf(txt(label));
      if(!gender||found[gender].length)continue;
      // Prefer the smallest ancestor that contains the heading and scored rows.
      let scope=label.parentElement;
      for(let depth=0;scope&&scope!==root&&depth<5;depth++,scope=scope.parentElement){
        const result=rowsFrom(scope);
        if(result.length){found[gender]=result;break}
      }
      if(found[gender].length)continue;
      // Many webwidgets place the title before the table rather than inside it.
      for(let sib=label.nextElementSibling,i=0;sib&&i<3;sib=sib.nextElementSibling,i++){
        const result=rowsFrom(sib);if(result.length){found[gender]=result;break}
      }
      if(!found[gender].length&&label.parentElement){
        for(let sib=label.parentElement.nextElementSibling,i=0;sib&&i<3;sib=sib.nextElementSibling,i++){
          const result=rowsFrom(sib);if(result.length){found[gender]=result;break}
        }
      }
    }
    return found;
  }
  const board=document.createElement('div');board.className='cfl-leader-board';
  root.prepend(board);
  let last='';let firstLoad=Date.now();
  function draw(){
    const found=discover();
    const signature=JSON.stringify(found);
    if(signature===last)return;
    last=signature;
    const frag=document.createDocumentFragment();
    for(const category of config){
      const section=document.createElement('section');section.className='cfl-leader-section';
      const head=document.createElement('div');head.className='cfl-leader-head';head.textContent=category.title;
      const labels=document.createElement('div');labels.className='cfl-leader-labels';
      ['RANG','MEMBRE','PERFORMANCE'].forEach(t=>{const span=document.createElement('span');span.textContent=t;labels.append(span)});
      const list=document.createElement('div');list.className='cfl-leader-rows';
      const entries=found[category.id];
      entries.slice(0,20).forEach((entry,i)=>{
        const row=document.createElement('div');row.className='cfl-leader-row';
        for(const [cls,value] of [['rank',entry.rank||String(i+1)],['name',entry.name],['score',entry.score]]){
          const cell=document.createElement('div');cell.className=cls;cell.textContent=value;row.append(cell);
        }
        list.append(row);
      });
      if(!entries.length){const empty=document.createElement('p');empty.className='cfl-leader-empty';empty.textContent='Aucun classement séparé disponible depuis BTWB pour cette catégorie.';list.append(empty)}
      section.append(head,labels,list);frag.append(section);
    }
    board.replaceChildren(frag);
    root.classList.add('cfl-leader-ready');
  }
  function update(){
    // Allow the BTWB script to finish loading before replacing its public view.
    const hasSource=[...root.children].some(child=>child!==board&&txt(child).length>35);
    if(hasSource||Date.now()-firstLoad>7500)draw();
  }
  let pending=false;
  const observer=new MutationObserver(()=>{if(pending)return;pending=true;setTimeout(()=>{pending=false;update()},350)});
  observer.observe(root,{childList:true,subtree:true,characterData:true});
  setInterval(update,2000);update();
})();
