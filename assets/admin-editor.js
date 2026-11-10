/* CFL Control V10: independent Supabase admin editor. Does not rely on legacy calendar edit mode. */
(()=>{
 const css=`
 #cfl-v10-toolbar{position:sticky;top:0;z-index:700;display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:13px 20px;background:#101826f7;border-bottom:2px solid #b33956;color:#fff;box-shadow:0 12px 30px #0006}
 #cfl-v10-toolbar button,#cfl-v10-toolbar a{border:1px solid #ffffff38;background:#202b3d;color:#fff;border-radius:10px;padding:11px 16px;font:700 14px system-ui;cursor:pointer;text-decoration:none}
 #cfl-v10-toolbar .primary{background:#9f2949;border-color:#d55576}#cfl-v10-toolbar .spacer{flex:1}
 #cfl-v10-toolbar .status{font:13px system-ui;color:#c9d1dd}
 #cfl-v10-toolbar #v11-drafts{border-color:#efb56d;background:#473325}
 #cfl-v10-dialog .v11-draft-row{display:flex;gap:12px;align-items:center;justify-content:space-between;padding:12px 10px;border:1px dashed #bd935a;background:#1a2433;border-radius:10px;margin:8px 0}
 #cfl-v10-dialog .v11-draft-row button{background:#9f2949;border:0;border-radius:8px;color:white;padding:9px 12px;cursor:pointer;font-weight:700}
 #cfl-v10-dialog .v11-draft-row small{color:#b7c5d8;display:block;margin-top:4px}
 #cfl-v10-overlay{position:fixed;inset:0;z-index:5000;background:#02050bca;display:none;align-items:center;justify-content:center;padding:18px}
 #cfl-v10-overlay.open{display:flex}
 #cfl-v10-dialog{width:min(790px,100%);max-height:95vh;overflow:auto;background:#121b2a;color:#f8f8fa;border:1px solid #ff9baf55;border-radius:18px;padding:24px;box-shadow:0 25px 80px #000b;font:15px system-ui}
 #cfl-v10-dialog h2{margin:0 0 18px;font-size:27px;color:#fff}
 #cfl-v10-dialog label{font-weight:750;color:#e7e8f1;font-size:13px;display:flex;flex-direction:column;gap:6px}
 #cfl-v10-dialog input,#cfl-v10-dialog textarea,#cfl-v10-dialog select{width:100%;box-sizing:border-box;background:#0b1220;color:white;border:1px solid #59637b;padding:11px;border-radius:9px;font:15px system-ui}
 #cfl-v10-dialog textarea{resize:vertical;min-height:115px}
 .cfl-v10-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px}.cfl-v10-wide{grid-column:1/-1}
 .cfl-v10-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;margin-top:22px}
 .cfl-v10-actions button{padding:12px 20px;border-radius:9px;border:1px solid #6e7687;color:white;background:#273449;font:700 14px system-ui;cursor:pointer}
 .cfl-v10-actions .primary{background:#a82a4c;border-color:#e66183}.cfl-v10-actions .danger{margin-right:auto;background:#45212b}
 #cfl-v10-dialog .error{color:#ffbdc7;font-weight:750;margin-top:10px}#cfl-v10-dialog .hint{font-size:12px;color:#bec6d7;margin-top:5px}
 #cfl-v10-dialog .choice-buttons{display:flex;gap:7px;flex-wrap:wrap}#cfl-v10-dialog .choice-buttons button{border:1px solid #66758f;border-radius:9px;background:#1d2b42;color:#fff;font:700 13px system-ui;padding:10px 13px;cursor:pointer}#cfl-v10-dialog .choice-buttons button[aria-pressed=true]{border-color:#f27c9c;background:#803047;box-shadow:0 0 0 1px #f27c9c}#cfl-v10-dialog .visual-bank{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:10px;max-height:275px;overflow:auto;padding:8px;border:1px solid #48536a;border-radius:12px}#cfl-v10-dialog .visual-choice{border:2px solid transparent;background:#263246;border-radius:10px;padding:6px;cursor:pointer;color:white;text-align:left}#cfl-v10-dialog .visual-choice[aria-pressed=true]{border-color:#fb8ba8}#cfl-v10-dialog .visual-choice img{width:100%;height:82px;object-fit:contain;margin:0 auto 5px}#cfl-v10-dialog .visual-choice span{display:block;font:11px system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 #cfl-v10-dialog img{max-height:140px;max-width:200px;object-fit:contain;display:block;margin-top:8px;border-radius:8px}
 @media(max-width:580px){.cfl-v10-fields{grid-template-columns:1fr}.cfl-v10-wide{grid-column:auto}}
 `;
 const style=document.createElement('style');style.textContent=css;document.head.append(style);
 const client=window.supabase?.createClient(window.CFL_CONFIG?.SUPABASE_URL,window.CFL_CONFIG?.SUPABASE_PUBLISHABLE_KEY);
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const toolbar=document.createElement('div');toolbar.id='cfl-v10-toolbar';toolbar.innerHTML='<button type="button" class="primary" id="v10-new">＋ Nouvel événement</button><button type="button" id="v10-choose">✎ Modifier un événement</button><button type="button" id="v11-drafts">◌ Brouillons</button><span class="spacer"></span><a href="/agenda.html" target="_blank" rel="noopener">↗ Voir l’agenda public</a><span id="v10-status" class="status">Vérification des droits…</span>';
 const overlay=document.createElement('div');overlay.id='cfl-v10-overlay';overlay.innerHTML='<div id="cfl-v10-dialog" role="dialog" aria-modal="true" aria-label="Édition de l’événement"></div>';
 const start=async()=>{
  if(!client)return;
  const {data:{user},error:ue}=await client.auth.getUser();if(ue||!user)return;
  const {data:role,error:re}=await client.from('app_admins').select('user_id').eq('user_id',user.id).maybeSingle();if(re||!role)return;
  document.body.prepend(toolbar);document.body.append(overlay);document.body.classList.add('cfl-unified-admin');const status=document.getElementById('v10-status');status.textContent='Édition Supabase active';
  const dialog=document.getElementById('cfl-v10-dialog');let rows=[];
  const notify=(message)=>status.textContent=message;
  const load=async()=>{const {data,error}=await client.from('events').select('*').order('start_date',{ascending:true});if(error)throw error;rows=data||[];return rows};
  const categories=()=>typeof CATS!=='undefined'?CATS.map(x=>x[0]):['Compétitions / Challenges','Community Events','Événements','Workshops / Formations','Soirées & convivialité'];
  const safeDate=(d)=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')?d:new Date().toLocaleDateString('en-CA',{timeZone:'Europe/Zurich'});
  const close=()=>{overlay.classList.remove('open');dialog.innerHTML=''};
  function optionsGroup(name,items,selected){return `<input type="hidden" name="${name}" value="${esc(selected||items[0][0])}"><div class="choice-buttons" data-choice-name="${name}">${items.map(([v,label])=>`<button type="button" data-val="${esc(v)}" aria-pressed="${v===(selected||items[0][0])}">${esc(label)}</button>`).join('')}</div>`}
  function bindChoiceGroups(){dialog.querySelectorAll('[data-choice-name]').forEach(g=>g.addEventListener('click',ev=>{const btn=ev.target.closest('[data-val]');if(!btn)return;const name=g.dataset.choiceName;g.parentElement.querySelector(`input[name="${name}"]`).value=btn.dataset.val;g.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)))}))}
  async function fillImageBank(current){
   const root=dialog.querySelector('#v12-gallery');if(!root)return;
   let items=[];const visual=window.CFL_CAL_VISUALS||{};
   for(const [key,data] of Object.entries(visual)){if(typeof data==='string'&&data.startsWith('data:image/'))items.push({key,url:data,name:key,kind:'legacy'});}
   for(const row of rows){if(row.image_url&&!items.some(v=>v.url===row.image_url))items.push({key:row.image_url,url:row.image_url,name:row.title,kind:'remote'});}
   try{const {data}=await client.storage.from('cfl-events').list('events',{limit:100,sortBy:{column:'created_at',order:'desc'}});for(const f of data||[]){if(!f.name||f.name.startsWith('.'))continue;const url=client.storage.from('cfl-events').getPublicUrl('events/'+f.name).data.publicUrl;if(!items.some(v=>v.url===url))items.push({key:url,url,name:f.name,kind:'remote'});}}catch(_e){}
   const selectedKey=current.image_url||current.legacy_visual_key||'';
   root.innerHTML=items.length?items.slice(0,120).map(v=>`<button type="button" class="visual-choice" data-kind="${v.kind}" data-key="${esc(v.key)}" aria-pressed="${v.key===selectedKey}"><img loading="lazy" src="${esc(v.url)}" alt=""><span>${esc(v.name)}</span></button>`).join(''):'<span class="hint">Aucune image enregistrée pour le moment.</span>';
   root.addEventListener('click',ev=>{const b=ev.target.closest('button[data-kind]');if(!b)return;root.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));const url=dialog.querySelector('[name=image_url]');const legacy=dialog.querySelector('[name=legacy_visual_key]');if(b.dataset.kind==='legacy'){legacy.value=b.dataset.key;url.value='';}else{url.value=b.dataset.key;legacy.value='';}const prev=dialog.querySelector('#v12-chosen-image');prev.src=b.querySelector('img').src;prev.hidden=false;});
  }

  function edit(row=null,selectedDate=null){
   const r=row||{};const d=safeDate(selectedDate);const id=r.id||'';
   dialog.innerHTML=`<h2>${id?'Modifier l’événement':'Créer un événement'}</h2><form id="v10-event-form"><div class="cfl-v10-fields">
   <label class="cfl-v10-wide">Nom complet<input required maxlength="120" name="title" value="${esc(r.title||'')}"></label>
   <label>Nom court<input name="short_title" maxlength="60" value="${esc(r.short_title||'')}"></label>
   <label>Catégorie<select name="category">${categories().map(c=>`<option ${c===r.category?'selected':''}>${esc(c)}</option>`).join('')}</select></label>
   <label>Début<input type="date" required name="start_date" value="${esc(r.start_date||d)}"></label>
   <label>Fin<input type="date" required name="end_date" value="${esc(r.end_date||d)}"></label>
   <label class="cfl-v10-wide">Publication ${optionsGroup('status',[['draft','Brouillon'],['published','Publié']],r.status||'draft')}</label>
   <label class="cfl-v10-wide">Tarif ${optionsGroup('price_label',[['À confirmer','À confirmer'],['Gratuit','Gratuit'],['Payant','Payant']],r.price_label||'À confirmer')}</label>
   <label class="cfl-v10-wide">Public concerné ${optionsGroup('audience',[['À définir','À définir'],['Membres CFL','Membres CFL'],['Membres CFL et sur invitation','Membres CFL et sur invitation'],['Ouvert au public','Ouvert au public']],r.audience||'À définir')}</label>
   <label class="cfl-v10-wide">Lien officiel<input name="link_url" type="url" placeholder="https://…" value="${esc(r.link_url||'')}"></label>
   <label class="cfl-v10-wide">Description<textarea name="description">${esc(r.description||'')}</textarea></label>
   <div class="cfl-v10-wide"><label>Banque d'images déjà enregistrées</label><div id="v12-gallery" class="visual-bank"><span class="hint">Chargement de la galerie…</span></div><p class="hint">Sélectionne une image existante ou importe-en une nouvelle.</p><img id="v12-chosen-image" src="${esc(r.image_url||'')}" alt="Image sélectionnée" ${r.image_url?'':'hidden'}><label>Nouvelle affiche <input name="poster" type="file" accept="image/jpeg,image/png,image/webp,image/gif"></label><input type="hidden" name="image_url" value="${esc(r.image_url||'')}"><input type="hidden" name="legacy_visual_key" value="${esc(r.legacy_visual_key||'')}"></div>
   </div><div class="error" id="v10-form-error" role="status"></div><div class="cfl-v10-actions">${id?'<button type="button" class="danger" id="v10-delete">Supprimer</button>':''}<button type="button" id="v10-cancel">Annuler</button><button type="submit" class="primary" id="v10-save">Enregistrer dans Supabase</button></div></form>`;
   overlay.classList.add('open');bindChoiceGroups();fillImageBank(r).catch(console.error);dialog.querySelector('#v10-cancel').onclick=close;
   dialog.querySelector('#v10-delete')?.addEventListener('click',async()=>{
    if(!confirm('Supprimer définitivement cet événement de l’agenda ?'))return;
    try{const {error}=await client.from('events').delete().eq('id',id);if(error)throw error;close();notify('Événement supprimé');location.reload()}catch(e){dialog.querySelector('#v10-form-error').textContent=e.message}
   });
   dialog.querySelector('#v10-event-form').onsubmit=async ev=>{
    ev.preventDefault();const form=ev.currentTarget;const fd=new FormData(form);const errorEl=dialog.querySelector('#v10-form-error');errorEl.textContent='';const saveBtn=dialog.querySelector('#v10-save');saveBtn.disabled=true;saveBtn.textContent='Enregistrement…';
    try{
     const start=String(fd.get('start_date')),end=String(fd.get('end_date'));if(end<start)throw Error('La date de fin doit être égale ou postérieure au début.');
     let image_url=String(fd.get('image_url')||'')||null;const file=fd.get('poster');
     if(file instanceof File&&file.size){if(file.size>10*1024*1024)throw Error('Affiche limitée à 10 Mo.');if(!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type))throw Error('Format JPG, PNG, WebP ou GIF uniquement.');const ext=file.name.split('.').pop().toLowerCase();const path='events/'+crypto.randomUUID()+'.'+ext;const upload=await client.storage.from('cfl-events').upload(path,file,{contentType:file.type});if(upload.error)throw upload.error;image_url=client.storage.from('cfl-events').getPublicUrl(path).data.publicUrl;}
     const title=String(fd.get('title')).trim();if(!title)throw Error('Titre obligatoire.');const description=String(fd.get('description')||'');
     const payload={id:id||'cfl-'+crypto.randomUUID(),title,short_title:String(fd.get('short_title')||'').trim()||title,category:String(fd.get('category')),start_date:start,end_date:end,status:String(fd.get('status')),description,summary:description.slice(0,280),price_label:String(fd.get('price_label')||''),audience:String(fd.get('audience')||''),link_url:String(fd.get('link_url')||''),image_url,legacy_visual_key:String(fd.get('legacy_visual_key')||'')};
     const {error}=await client.from('events').upsert(payload);if(error)throw error;close();notify('Événement enregistré dans Supabase ✓');location.reload();
    }catch(e){errorEl.textContent='Enregistrement impossible : '+e.message;saveBtn.disabled=false;saveBtn.textContent='Enregistrer dans Supabase'}
   };
  }
  async function showDrafts(){
   try{
    await load();const drafts=rows.filter(r=>r.status==='draft');
    dialog.innerHTML=`<h2>Brouillons enregistrés (${drafts.length})</h2><p class="hint">Ces événements sont conservés dans Supabase, visibles ici dans l'administration et invisibles dans l'agenda public tant qu'ils ne sont pas publiés.</p>${drafts.length?drafts.map(r=>`<div class="v11-draft-row"><div><strong>${esc(r.title)}</strong><small>${esc(r.start_date)} · ${esc(r.category)}</small></div><button type="button" data-draft-id="${esc(r.id)}">Modifier</button></div>`).join(''):'<p>Aucun brouillon enregistré.</p>'}<div class="cfl-v10-actions"><button type="button" id="v11-close-drafts">Fermer</button></div>`;
    overlay.classList.add('open');dialog.querySelector('#v11-close-drafts').onclick=close;
    dialog.querySelectorAll('[data-draft-id]').forEach(btn=>btn.onclick=()=>edit(drafts.find(r=>r.id===btn.dataset.draftId)));
   }catch(e){notify('Erreur de chargement des brouillons : '+e.message)}
  }
  toolbar.querySelector('#v11-drafts').onclick=showDrafts;
  toolbar.querySelector('#v10-new').onclick=()=>edit(null,document.getElementById('directDate')?.value||null);
  toolbar.querySelector('#v10-choose').onclick=async()=>{try{await load();dialog.innerHTML=`<h2>Modifier un événement</h2><label>Choisir l’événement<select id="v10-event-choice">${rows.map(r=>`<option value="${esc(r.id)}">${esc(r.start_date.slice(0,4))} — ${esc(r.title)} · ${esc(r.start_date)}</option>`).join('')}</select></label><div class="cfl-v10-actions"><button id="v10-choose-cancel">Annuler</button><button class="primary" id="v10-choose-open">Modifier</button></div>`;overlay.classList.add('open');dialog.querySelector('#v10-choose-cancel').onclick=close;dialog.querySelector('#v10-choose-open').onclick=()=>edit(rows.find(x=>x.id===dialog.querySelector('#v10-event-choice').value))}catch(e){notify('Erreur : '+e.message)}};
  overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open')){e.stopImmediatePropagation();close()}},true);
  // Capture phase: prevent older calendar view handlers from consuming editing clicks.
  document.addEventListener('click',async e=>{
   if(overlay.classList.contains('open'))return;
   const node=e.target.closest('[data-ids],[data-event],[data-date],[data-add-month],#addBtn,#contextAddEvent,#createOnDate');
   if(!node||!node.closest('#calendar,#addBtn,#contextActions,#contextAddEvent,#createOnDate'))return;
   if(e.target.closest('.month-week-day') && e.target.closest('[data-event]'))return;
   e.preventDefault();e.stopImmediatePropagation();
   try{
    const ids=(node.dataset.ids||node.dataset.event||'').split(',').filter(Boolean);
    if(ids.length){await load();const row=rows.find(r=>r.id===ids[0]);if(row)edit(row);else notify('Événement introuvable dans Supabase');return;}
    const dt=node.dataset.date||(node.dataset.addMonth!=null?`${typeof year!=='undefined'?year:2027}-${String(Number(node.dataset.addMonth)+1).padStart(2,'0')}-01`:document.getElementById('directDate')?.value);edit(null,dt);
   }catch(err){notify('Erreur Agenda : '+err.message)}
  },true);
  // Calendar double-click is unnecessary in admin: single click creates an event.
 };
 start().catch(console.error);
})();