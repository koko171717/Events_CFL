const C = window.CFL_CONFIG || {};
const valid = !!(C.SUPABASE_URL && C.SUPABASE_PUBLISHABLE_KEY && !C.SUPABASE_URL.includes('VOTRE-') && !C.SUPABASE_PUBLISHABLE_KEY.includes('VOTRE_'));
const client = valid && window.supabase ? window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_PUBLISHABLE_KEY) : null;
window.CFL = {client, valid};
const $ = id => document.getElementById(id);
const esc = s => String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const pretty = d => d ? new Intl.DateTimeFormat('fr-CH',{day:'numeric',month:'long',year:'numeric'}).format(new Date(d+'T12:00:00')) : '';
const period = e => e.start_date===e.end_date ? pretty(e.start_date) : pretty(e.start_date)+' — '+pretty(e.end_date);
const legacyVisual = e => (window.CFL_CAL_VISUALS||{})[e.legacy_visual_key] || '';
const imgUrl = e => e.image_url || legacyVisual(e) || '';
const imgMarkup = e => imgUrl(e)?`<img src="${esc(imgUrl(e))}" alt="">`:'<span class="muted tiny">CFL</span>';
function msg(id, text, kind=''){const el=$(id);if(el){el.className='notice '+kind;el.textContent=text;el.classList.remove('hidden')}}
function moneyOrDate(s){return esc(s||'')}
async function requireAdmin(){
 if(!client){location.replace('/login.html?setup=1');return false}
 const {data:{user},error}=await client.auth.getUser();if(error||!user){location.replace('/login.html');return false}
 const {data,error:authError}=await client.from('app_admins').select('user_id').eq('user_id',user.id).maybeSingle();
 if(authError||!data){await client.auth.signOut();location.replace('/login.html?denied=1');return false}
 return true;
}
async function authLogout(){if(client)await client.auth.signOut();location.replace('/login.html')}
async function getAllEvents(admin=false){let q=client.from('events').select('*').order('start_date',{ascending:true}).order('display_order',{ascending:true});if(!admin)q=q.eq('status','published');const {data,error}=await q;if(error)throw error;return data||[]}
async function getDraftSlides(){const {data,error}=await client.from('tv_slides').select('*').order('position',{ascending:true});if(error)throw error;return data||[]}
function scaleArtwork(frame){if(!frame)return;const art=frame.querySelector('.tv-art');if(!art)return;const scale=frame.clientWidth/1920;art.style.transform=`scale(${scale})`}
function resizeFrames(){document.querySelectorAll('.tv-frame').forEach(scaleArtwork)}
window.addEventListener('resize',resizeFrames);
function textFit(art){
 const desc=art.querySelector('.tv-description'); if(!desc)return;
 const copy=art.querySelector('.tv-copy'); const title=copy?.querySelector('.tv-title');
 if(!copy||!title)return;
 let font=62, titleFont=76, gap=19, qr=116;
 for(let n=0;n<45;n++){
  desc.style.fontSize=font+'px';title.style.fontSize=titleFont+'px';copy.style.gap=gap+'px';
  const q=copy.querySelector('.tv-qr');if(q){q.style.width=qr+'px';q.style.height=qr+'px'}
  if(copy.scrollHeight<=copy.clientHeight+1 && title.scrollHeight<=title.clientHeight+1)break;
  font=Math.max(30,font-1.0);titleFont=Math.max(49,titleFont-0.7);gap=Math.max(8,gap-.35);qr=Math.max(86,qr-.5);
 }
 const over=copy.scrollHeight>copy.clientHeight+1;
 art.dataset.overflow=over?'true':'false';
}
function cflDateUTC(y,m,d){return new Date(Date.UTC(y,m,d))}
function cflInMonth(e,y,m){const a=`${y}-${String(m+1).padStart(2,'0')}-01`,b=`${y}-${String(m+1).padStart(2,'0')}-31`;return e.start_date<=b&&e.end_date>=a}
const cflMonths=['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛ','SEP','OCT','NOV','DÉC'];
function renderCflAnnualGrid(y,events){
 const months=cflMonths.map((name,m)=>{
  const count=new Date(y,m+1,0).getDate();const items=events.filter(e=>cflInMonth(e,y,m));
  let days='';for(let d=1;d<=31;d++){
   const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
   const todays=items.filter(e=>e.start_date<=iso&&e.end_date>=iso);const one=todays[0];
   days+=`<div class="cfl-tv-year-day ${d>count?'empty':one?'has-event':''}" title="${one?esc(one.title):''}">${one?`<span>${esc(one.short_title||one.title)}</span>`:d<=count?'<i></i>':''}${todays.length>1?`<b>+${todays.length-1}</b>`:''}</div>`;
  }
  return `<section class="cfl-tv-year-month"><header>${esc(name)}</header>${days}</section>`;
 }).join('');
 return `<div class="cfl-tv-calendar cfl-tv-calendar-year"><div class="cfl-tv-calendar-heading"><h1>AGENDA ${y}</h1><span>GRILLE ANNUELLE</span></div><div class="cfl-tv-year-grid"><div class="cfl-tv-day-numbers"><header>JOUR</header>${Array.from({length:31},(_,i)=>`<div>${String(i+1).padStart(2,'0')}</div>`).join('')}</div>${months}</div></div>`
}
function renderCflMonthGrid(y,m,events){
 const count=new Date(y,m+1,0).getDate(),start=(cflDateUTC(y,m,1).getUTCDay()+6)%7;
 const items=events.filter(e=>cflInMonth(e,y,m));let cells='';
 for(let i=0;i<42;i++){
  const day=i-start+1;
  if(day<1||day>count){cells+='<div class="cfl-tv-month-day outside"></div>';continue}
  const iso=`${y}-${String(m+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
  const evs=items.filter(e=>e.start_date<=iso&&e.end_date>=iso);
  cells+=`<div class="cfl-tv-month-day"><b>${String(day).padStart(2,'0')}</b>${evs.slice(0,3).map(e=>`<div class="cfl-tv-month-event">${esc(e.short_title||e.title)}</div>`).join('')}${evs.length>3?`<small>+${evs.length-3}</small>`:''}</div>`;
 }
 return `<div class="cfl-tv-calendar cfl-tv-calendar-month"><div class="cfl-tv-calendar-heading"><h1>${cflMonths[m]} ${y}</h1><span>VUE MENSUELLE</span></div><div class="cfl-tv-weekdays">${['LUN','MAR','MER','JEU','VEN','SAM','DIM'].map(v=>`<span>${v}</span>`).join('')}</div><div class="cfl-tv-month-grid">${cells}</div></div>`
}
function artRender(frame,slide,events){
 const e=events.find(x=>x.id===slide.event_id) || slide.event_snapshot || {};
 const opts=slide.settings||{};
 const type=slide.slide_type||'event';
 let body='';
 if(type==='month'){
  const m=opts.month || '2027-03';const candidates=events.filter(x=>x.start_date<=m+'-31'&&x.end_date>=m+'-01').slice(0,Number(opts.count||6));
  const monthText=new Intl.DateTimeFormat('fr-CH',{month:'long',year:'numeric'}).format(new Date(m+'-01T12:00:00'));
  body=`<div style="display:flex;flex-direction:column;height:100%;width:100%"><h1 class="month-title">Événements du mois</h1><div style="font-size:32px;color:#ffb5c3">${esc(monthText)}</div><div class="month-list" style="grid-template-rows:repeat(${Math.max(candidates.length,1)},minmax(0,1fr))">${candidates.map(x=>`<div class="month-row"><div class="month-image">${imgMarkup(x)}</div><div style="flex:1;min-width:0"><b>${esc(x.short_title||x.title)}</b><small>${esc(period(x))}</small><span class="month-summary">${esc(x.summary||x.description||'')}</span></div></div>`).join('')||'<div class="month-row">Aucun événement publié.</div>'}</div></div>`;
 }else if(type==='custom'&&opts.view==='annual'){
  const y=Math.min(2100,Math.max(2025,Number(opts.year)||new Date().getFullYear()));
  const monthLabels=['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛ','SEP','OCT','NOV','DÉC'];
  const publicEvents=events.filter(e=>e.status==='published');
  const calendarView=['grid','overview','month'].includes(opts.calendarView)?opts.calendarView:'overview';
  const monthIndex=Math.max(0,Math.min(11,(Number(opts.month)||1)-1));
  if(calendarView==='grid') body=renderCflAnnualGrid(y,publicEvents);
  else if(calendarView==='month') body=renderCflMonthGrid(y,monthIndex,publicEvents);
  else body=`<div class="annual-slide"><div class="annual-slide-top"><h1>AGENDA ${y}</h1><span>ÉVÉNEMENTS CROSSFIT LÉMAN</span></div><div class="annual-slide-grid">${monthLabels.map((label,m)=>{
   const start=`${y}-${String(m+1).padStart(2,'0')}-01`;const end=`${y}-${String(m+1).padStart(2,'0')}-31`;
   const items=publicEvents.filter(e=>e.start_date<=end&&e.end_date>=start).sort((a,b)=>a.start_date.localeCompare(b.start_date));
   return `<section class="annual-slide-month"><header><span>${String(m+1).padStart(2,'0')}</span>${label}</header><div class="annual-slide-items">${items.slice(0,5).map(e=>`<div class="annual-slide-item"><b>${esc(e.start_date.slice(8,10))}</b><span>${esc(e.short_title||e.title)}</span></div>`).join('')||'<span class="annual-slide-empty">—</span>'}${items.length>5?`<small>+${items.length-5} événements</small>`:''}</div></section>`;
  }).join('')}</div></div>`;
 }else if(type==='btwb'){
  const mainId=String(opts.trackId||'84043');const trainId=String(opts.trainTrackId||'');
  const safeId=/^\d+$/.test(mainId)?mainId:'84043';const safeTrain=/^\d+$/.test(trainId)&&trainId!==safeId?trainId:'';const trackNames={'84043':'CROSSFIT LÉMAN PROGRAM','1237036':'HWPO FOCUS','1237037':'HWPO AFFILIATE','1237038':'HWPO AFFILIATE — COACHES NOTES','1237039':'HWPO SWEAT','1237040':'HWPO ACCESSORY','1237041':'HWPO EMOM 40','1237042':'HWPO HYROX','1237043':'HWPO BODYBUILDING'};const titleFor=id=>trackNames[id]||'PROGRAMMATION BTWB';
  // The official widget owns its DOM and layout; do not parse/rewrite private BTWB responses.
  // Refreshes when returning to the slide, at minimum every 5 minutes, and after midnight.
  const currentDay=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const revision=Math.floor(Date.now()/300000);
  const widgetFrame=(id,label)=>`<section class="btwb-pane"><h2>${esc(titleFor(id))}${label?` <small>· ${esc(label)}</small>`:""}</h2><iframe class="btwb-embed" title="BTWB ${label}" loading="eager" src="/api/btwb-widget?track=${id}&v=${revision}&day=${currentDay}" referrerpolicy="same-origin"></iframe></section>`;
  body=`<div class="btwb-screen"><div class="btwb-date"><strong>${esc(titleFor(safeId))}${safeTrain?" + "+esc(titleFor(safeTrain)):""}</strong><span>SÉANCE DU JOUR · ${esc(new Intl.DateTimeFormat('fr-CH',{timeZone:'Europe/Zurich',weekday:'long',day:'numeric',month:'long'}).format(new Date()))}</span></div><div class="btwb-panes ${safeTrain?'two':''}">${widgetFrame(safeId,safeTrain?'WOD / RX':'WOD · VARIANTES')}${safeTrain?widgetFrame(safeTrain,'TRAIN'):''}</div><p class="btwb-note">Source : programmation officielle BTWB · Section Main</p></div>`;
 }else{
  const title=opts.title || e.title || 'Événement CFL';const description=String(opts.description||'').trim() || e.description || ''; 
  const date=opts.showDate!==false ? `<div class="tv-meta">${esc(opts.dateLabel||period(e))}</div>`:'';
  const price=opts.showPrice===true && e.price_label?`<div class="tv-meta">${esc(e.price_label)}</div>`:'';
  const qrLink=opts.qrUrl||e.link_url||'';const qr=opts.showQR!==false && /^https?:\/\//.test(qrLink) ? `<div class="tv-qr qr-target" data-qr="${esc(qrLink)}"></div>`:'';
  const media=opts.posterOverride||imgUrl(e);
  const poster=`<div class="tv-poster ${media?'':'empty'}" style="--poster:url('${esc(media)}')">${media?`<img src="${esc(media)}" alt="Affiche de l’événement">`:''}</div>`;
  const copy=`<div class="tv-copy"><div class="tv-tag">${esc(e.category||'Événement')}</div><h1 class="tv-title">${esc(title)}</h1>${opts.showDesc!==false?`<div class="tv-description">${esc(description)}</div>`:''}${date}${price}<div class="tv-footer"><div class="url">${esc(opts.qrUrl||e.link_url||'')}</div>${qr}</div></div>`;
  body=opts.layout==='poster-left'?poster+copy:copy+poster;
 }
 frame.innerHTML=`<div class="tv-art"><div class="tv-art-head"><div class="tv-art-brand"><img src="/assets/logo-crossfit-leman.svg" alt="CrossFit Léman"></div><div class="tv-art-kicker">${type==='btwb'?'BTWB':(type==='month'||type==='custom')?'AGENDA':'CFL EVENTS'}</div></div><div class="tv-art-body">${body}</div></div>`;
 scaleArtwork(frame);textFit(frame.querySelector('.tv-art'));
 const qrEl=frame.querySelector('.qr-target');
 if(qrEl && window.QRCode){
  qrEl.innerHTML='';new window.QRCode(qrEl,{text:qrEl.dataset.qr,width:124,height:124,colorDark:'#10121a',colorLight:'#ffffff',correctLevel:window.QRCode.CorrectLevel.M});
 }

}
