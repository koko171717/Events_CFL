const C = window.CFL_CONFIG || {};
const valid = !!(C.SUPABASE_URL && C.SUPABASE_PUBLISHABLE_KEY && !C.SUPABASE_URL.includes('VOTRE-') && !C.SUPABASE_PUBLISHABLE_KEY.includes('VOTRE_'));
const client = valid && window.supabase ? window.supabase.createClient(C.SUPABASE_URL,C.SUPABASE_PUBLISHABLE_KEY) : null;
window.CFL = {client, valid};
const $ = id => document.getElementById(id);
const esc = s => String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const pretty = d => d ? new Intl.DateTimeFormat('fr-CH',{day:'numeric',month:'long',year:'numeric'}).format(new Date(d+'T12:00:00')) : '';
// Unified French event dates for both “Événements du mois” and dedicated event slides.
// Parse calendar dates as UTC day numbers so DST in Switzerland cannot shift a duration.
function period(e){
 const start=String(e?.start_date||'');
 const end=String(e?.end_date||start);
 const valid=/^\d{4}-\d{2}-\d{2}$/;
 if(!valid.test(start)||!valid.test(end)) return pretty(start)||'';
 const a=start.split('-').map(Number),b=end.split('-').map(Number);
 const startDay=Date.UTC(a[0],a[1]-1,a[2]);
 const endDay=Date.UTC(b[0],b[1]-1,b[2]);
 const span=Math.round((endDay-startDay)/86400000)+1;
 if(span<=1) return pretty(start);
 const monthNames=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
 if(span===2 && a[0]===b[0] && a[1]===b[1])return `${a[2]} et ${b[2]} ${monthNames[a[1]-1]} ${a[0]}`;
 if(a[0]===b[0] && a[1]===b[1])return `Du ${a[2]} au ${b[2]} ${monthNames[a[1]-1]} ${a[0]}`;
 if(a[0]===b[0])return `Du ${a[2]} ${monthNames[a[1]-1]} au ${b[2]} ${monthNames[b[1]-1]} ${a[0]}`;
 return `Du ${a[2]} ${monthNames[a[1]-1]} ${a[0]} au ${b[2]} ${monthNames[b[1]-1]} ${b[0]}`;
}
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
 const spotlight=art.querySelector('.spotlight-content');
 if(spotlight){
  const title=spotlight.querySelector('.spotlight-headline'),name=spotlight.querySelector('.spotlight-person'),sub=spotlight.querySelector('.spotlight-subtitle'),quote=spotlight.querySelector('.spotlight-highlight'),about=spotlight.querySelector('.spotlight-about');
  let step=0;
  while(spotlight.scrollHeight>spotlight.clientHeight+1&&step<24){
   step++;spotlight.style.gap=Math.max(8,20-step*.65)+'px';
   for(const [el,initial,min] of [[title,68,38],[name,85,44],[sub,37,23],[quote,44,26],[about,30,21]])if(el)el.style.fontSize=Math.max(min,initial-step*1.5)+'px';
  }
  art.dataset.overflow=spotlight.scrollHeight>spotlight.clientHeight+1?'true':'false';
  return;
 }
 const bottom=art.querySelector('.tv-event-bottom');
 if(bottom){
  const copy=bottom.querySelector('.tv-copy'),title=copy?.querySelector('.tv-title'),desc=copy?.querySelector('.tv-description');
  if(!copy||!title)return;
  // Let the image take all space not required by the text. Never scroll.
  for(let i=0;i<70;i++){
   const t=Math.max(38,76-i*.65),d=Math.max(23,42-i*.38);
   title.style.fontSize=t+'px'; if(desc)desc.style.fontSize=d+'px';
   copy.style.gap=Math.max(6,13-i*.11)+'px';
   if(copy.scrollHeight<=bottom.clientHeight*.70 && bottom.querySelector('.tv-poster').clientHeight>=200)break;
  }
  const poster=bottom.querySelector('.tv-poster');
  art.dataset.overflow=(copy.scrollHeight>copy.clientHeight+1 || poster.clientHeight<190)?'true':'false';
  return;
 }
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
   const todays=items.filter(e=>e.start_date<=iso&&e.end_date>=iso);const one=todays[0];const weekend=d<=count&&[0,6].includes(cflDateUTC(y,m,d).getUTCDay());const ref=d<=count?(window.CFL_VAUD_REF?.(iso)||{}):{};
   days+=`<div class="cfl-tv-year-day ${d>count?'empty':one?'has-event':''} ${weekend?'weekend':''} ${ref.holiday?'holiday':''}" title="${esc([one?.title,ref.holiday].filter(Boolean).join(' · '))}">${one?`<span>${esc(one.short_title||one.title)}</span>`:d<=count?'<i></i>':''}${todays.length>1?`<b>+${todays.length-1}</b>`:''}</div>`;
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
  const evs=items.filter(e=>e.start_date<=iso&&e.end_date>=iso);const weekend=[0,6].includes(cflDateUTC(y,m,day).getUTCDay());const ref=window.CFL_VAUD_REF?.(iso)||{};
  cells+=`<div class="cfl-tv-month-day ${weekend?'weekend':''} ${ref.holiday?'holiday':''}" title="${esc([ref.holiday].filter(Boolean).join(' · '))}"><b>${String(day).padStart(2,'0')}</b>${evs.slice(0,3).map(e=>`<div class="cfl-tv-month-event">${esc(e.short_title||e.title)}</div>`).join('')}${evs.length>3?`<small>+${evs.length-3}</small>`:''}</div>`;
 }
 return `<div class="cfl-tv-calendar cfl-tv-calendar-month"><div class="cfl-tv-calendar-heading"><h1>${cflMonths[m]} ${y}</h1><span>VUE MENSUELLE</span></div><div class="cfl-tv-weekdays">${['LUN','MAR','MER','JEU','VEN','SAM','DIM'].map(v=>`<span>${v}</span>`).join('')}</div><div class="cfl-tv-month-grid">${cells}</div></div>`
}
function artRender(frame,slide,events){
 const e=events.find(x=>x.id===slide.event_id) || slide.event_snapshot || {};
 const opts=slide.settings||{};
 const type=slide.slide_type||'event';
 let body='';
 if(type==='welcome'){
  const img=String(opts.imageUrl||'/assets/welcome-group.jpg');
  const safeImage=/^(https:\/\/|blob:|\/assets\/welcome-group\.jpg$)/i.test(img)?img:'/assets/welcome-group.jpg';
  const overlay=Math.max(20,Math.min(85,Number(opts.overlay)||60))/100;
  const position=['top','bottom'].includes(opts.imagePosition)?opts.imagePosition:'center';
  const title=opts.title??'BIENVENUE A CROSSFIT LEMAN';
  const subtitle=opts.subtitle??'Une communaute, du coaching, du fun et du depassement de soi.';
  body=`<div class="welcome-design" style="--welcome-overlay:${overlay};--welcome-position:${position}"><img class="welcome-background" src="${esc(safeImage)}" alt="Photo de la communaute CrossFit Leman"><div class="welcome-shade"></div><div class="welcome-diagonal top"></div><div class="welcome-diagonal bottom"></div><div class="welcome-content"><div class="welcome-logo"><img src="/assets/logo-crossfit-leman.svg" alt="Logo officiel CrossFit Leman"></div>${opts.badge!==''?`<div class="welcome-badge">${esc(opts.badge??'CFL COMMUNITY')}</div>`:''}<h1 class="welcome-title">${esc(title)}</h1>${subtitle?`<p class="welcome-subtitle">${esc(subtitle)}</p>`:''}${opts.website!==''?`<div class="welcome-website">${esc(opts.website??'crossfitleman.ch')}</div>`:''}</div></div>`;
 }else if(type==='spotlight'){
  const mode=opts.template==='performance'?'performance':'member';
  const photoOnly=opts.photoOnly===true;
  const title=String(opts.title??'').trim();
  const name=String(opts.name??'').trim();
  const subtitle=String(opts.subtitle??'').trim();
  const quote=String(opts.highlight??'').trim();
  const about=String(opts.description??'').trim();
  const img=String(opts.imageUrl||'');
  const video=String(opts.videoUrl||'');
  const videoDirect=/^blob:/i.test(video)||/^https:\/\//i.test(video)&&(/\.(?:mp4|webm)(?:[?#]|$)/i.test(video)||/\/storage\/v1\/object\//i.test(video));
  const videoTag=videoDirect?`<video src="${esc(video)}" autoplay muted loop playsinline preload="metadata" poster="${esc(img)}"></video>`:'';
  const image=img&&/^(https:\/\/|blob:)/i.test(img)?`<img src="${esc(img)}" alt="Photo CFL">`:'<span class="spotlight-photo-empty">AJOUTER UNE PHOTO</span>';
  const photo=`<div class="spotlight-photo">${videoTag||image}</div>`;
  const noText=![title,name,subtitle,quote,about].some(Boolean);
  const info=`<div class="spotlight-content">${title?`<h1 class="spotlight-headline">${esc(title)}</h1>`:''}${name?`<div class="spotlight-person">${esc(name)}</div>`:''}${subtitle?`<div class="spotlight-subtitle">${esc(subtitle)}</div>`:''}${quote?`<div class="spotlight-highlight">${esc(quote)}</div>`:''}${about?`<div class="spotlight-about">${esc(about)}</div>`:''}</div>`;
  body=(photoOnly||noText)?`<div class="spotlight-layout photo-only">${photo}</div>`:`<div class="spotlight-layout ${mode} ${opts.imageSide==='right'?'picture-right':''}">${photo}${info}</div>`;
 }else if(type==='month'){

  const m=opts.month || '2027-03';const candidates=events.filter(x=>x.start_date<=m+'-31'&&x.end_date>=m+'-01').slice(0,Number(opts.count||6));
  const monthText=new Intl.DateTimeFormat('fr-CH',{month:'long',year:'numeric'}).format(new Date(m+'-01T12:00:00'));
  body=`<div style="display:flex;flex-direction:column;height:100%;width:100%"><h1 class="month-title">Événements du mois</h1><div style="font-size:32px;color:#F0A5AA">${esc(monthText)}</div><div class="month-list" style="grid-template-rows:repeat(${Math.max(candidates.length,1)},minmax(0,1fr))">${candidates.map(x=>`<div class="month-row"><div class="month-image">${imgMarkup(x)}</div><div style="flex:1;min-width:0"><b>${esc(x.short_title||x.title)}</b><small>${esc(period(x))}</small>${x.box_closed===true?'<span class="tv-box-closed tv-box-closed-month">BOX FERMÉE</span>':''}</div></div>`).join('')||'<div class="month-row">Aucun événement publié.</div>'}</div></div>`;
 }else if(type==='custom'&&opts.view==='annual'){
  const y=Math.min(2100,Math.max(2025,Number(opts.year)||new Date().getFullYear()));
  const monthLabels=['JAN','FÉV','MAR','AVR','MAI','JUIN','JUIL','AOÛ','SEP','OCT','NOV','DÉC'];
  const publicEvents=events.filter(e=>e.status==='published');
  const calendarView=['grid','overview','month'].includes(opts.calendarView)?opts.calendarView:'overview';
  const monthIndex=Math.max(0,Math.min(11,(Number(opts.month)||1)-1));
  if(calendarView==='grid') body=renderCflAnnualGrid(y,publicEvents);
  else if(calendarView==='month') body=renderCflMonthGrid(y,monthIndex,publicEvents);
  else body=`<div class="annual-slide"><div class="annual-slide-top"><h1>AGENDA ${y}</h1><span>ÉVÉNEMENTS CROSSFIT LEMAN</span></div><div class="annual-slide-grid">${monthLabels.map((label,m)=>{
   const start=`${y}-${String(m+1).padStart(2,'0')}-01`;const end=`${y}-${String(m+1).padStart(2,'0')}-31`;
   const items=publicEvents.filter(e=>e.start_date<=end&&e.end_date>=start).sort((a,b)=>a.start_date.localeCompare(b.start_date));
   return `<section class="annual-slide-month"><header><span>${String(m+1).padStart(2,'0')}</span>${label}</header><div class="annual-slide-items">${items.slice(0,5).map(e=>`<div class="annual-slide-item"><b>${esc(e.start_date.slice(8,10))}</b><span>${esc(e.short_title||e.title)}</span></div>`).join('')||'<span class="annual-slide-empty">—</span>'}${items.length>5?`<small>+${items.length-5} événements</small>`:''}</div></section>`;
  }).join('')}</div></div>`;
 }else if(type==='btwb'){
  const mode=['wod','cfl-wod','activity','cfl-activity','leaderboard','daily-leaderboard','cfl-leaderboard'].includes(opts.widget)?opts.widget:'wod';
  const mainId=String(opts.trackId||'84043');const trainId=String(opts.trainTrackId||'');
  const safeId=/^\d+$/.test(mainId)?mainId:'84043';const safeTrain=(mode==='wod'||mode==='cfl-wod')&&/^\d+$/.test(trainId)&&trainId!==safeId?trainId:'';
  const trackNames={'84043':'CROSSFIT LEMAN PROGRAM','1237036':'HWPO FOCUS','1237037':'HWPO AFFILIATE','1237038':'HWPO AFFILIATE — COACHES NOTES','1237039':'HWPO SWEAT','1237040':'HWPO ACCESSORY','1237041':'HWPO EMOM 40','1237042':'HWPO HYROX','1237043':'HWPO BODYBUILDING'};
  const workoutId=/^[1-9]\d{0,9}$/.test(String(opts.workoutId||''))?String(opts.workoutId):'';
  const count=Math.max(1,Math.min((mode==='activity'||mode==='cfl-activity')?30:20,Number(opts.count)||5));
  const textSize=['compact','balanced','large'].includes(opts.textSize)?opts.textSize:'balanced';
  const currentDay=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Zurich',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  const revision=Math.floor(Date.now()/300000);
  const widgetFrame=(id,label,kind)=>{const params=new URLSearchParams({type:kind,track:id,count:String(count),v:String(revision),day:currentDay,compact:safeTrain?'1':'0',size:textSize,layout:mode==='cfl-activity'?'columns':mode==='cfl-leaderboard'?'gender':'default'});if(kind==='leaderboard'&&workoutId)params.set('workout',workoutId);return `<section class="btwb-pane"><div class="btwb-pane-label">${esc(label)}</div><iframe class="btwb-embed" title="BTWB ${esc(label)}" loading="eager" src="/api/btwb-widget?${params.toString()}" referrerpolicy="same-origin"></iframe></section>`};
  const dateStr=new Intl.DateTimeFormat('fr-CH',{timeZone:'Europe/Zurich',weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(new Date());
  let title='',pane='';
  if(mode==='activity'||mode==='cfl-activity'){title=mode==='cfl-activity'?'ACTIVITIES · CROSSFIT LEMAN':'ACTIVITÉ DES MEMBRES';pane=widgetFrame(safeId,mode==='cfl-activity'?'ACTIVITÉS DE LA COMMUNAUTÉ':'PERFORMANCES RÉCENTES','activity')}
  else if(mode==='leaderboard'){title='CLASSEMENT BTWB';pane=workoutId?widgetFrame(safeId,'WORKOUT #'+workoutId,'leaderboard'):'<div class="btwb-no-workout">Sélectionne un identifiant de workout BTWB dans le Studio pour afficher son classement.</div>'}
  else if(mode==='cfl-wod'){
   title='WOD DU JOUR · '+(trackNames[safeId]||'BTWB');
   const tracks=[safeId,...(safeTrain?[safeTrain]:[])];
   pane=`<div class="cfl-custom-wod" data-tracks="${esc(tracks.join(','))}" data-size="${esc(textSize)}" data-duration="${Math.max(10,Number(slide.duration_seconds)||45)}" data-instruction="${esc(String(opts.athleteInstruction||''))}" data-instruction-date="${esc(String(opts.athleteInstructionDate||''))}" data-instruction-track="${esc(String(opts.athleteInstructionTrack||''))}"><div class="cfl-wod-loading">Chargement du WOD du jour…</div></div>`;
  }
  else if(mode==='cfl-leaderboard'){title='LEADERBOARD · CROSSFIT LEMAN';pane=widgetFrame(safeId,'CLASSEMENT HOMMES / FEMMES','daily-leaderboard')}
  else if(mode==='daily-leaderboard'){title='CLASSEMENT DU JOUR · '+(trackNames[safeId]||'BTWB');pane=widgetFrame(safeId,'WOD + RÉSULTATS','daily-leaderboard')}
  else{title=trackNames[safeId]||'PROGRAMMATION BTWB';pane=widgetFrame(safeId,safeTrain?'WOD PRINCIPAL':'PROGRAMMATION DU JOUR','wod')+(safeTrain?widgetFrame(safeTrain,'TRAIN · '+(trackNames[safeTrain]||'BTWB'),'wod'):'')}
  body=`<div class="btwb-screen"><div class="btwb-date"><strong>${esc(title)}</strong><span>${esc(dateStr)}</span></div><div class="btwb-panes ${safeTrain?'two':''}">${pane}</div><p class="btwb-note">BTWB · données actualisées à chaque diffusion</p></div>`;
 }else{
  const title=opts.title || e.title || 'Événement CFL';const description=String(opts.description||'').trim() || e.description || ''; 
  const date=opts.showDate!==false ? `<div class="tv-meta">${esc(opts.dateLabel||period(e))}</div>`:'';
  const price=opts.showPrice===true && e.price_label?`<div class="tv-meta">${esc(e.price_label)}</div>`:'';
  const qrLink=opts.qrUrl||e.link_url||'';const qr=opts.showQR!==false && /^https?:\/\//.test(qrLink) ? `<div class="tv-qr qr-target" data-qr="${esc(qrLink)}"></div>`:'';
  const media=opts.posterOverride||imgUrl(e);
  const video=String(e.video_url||'');
  const videoDirect=/^https:\/\//i.test(video)&&(/\.(?:mp4|webm)(?:[?#]|$)/i.test(video)||/\/storage\/v1\/object\//i.test(video));
  const poster=`<div class="tv-poster ${media||videoDirect?'':'empty'}" style="--poster:url('${esc(media)}')">${videoDirect?`<video src="${esc(video)}" autoplay muted loop playsinline preload="metadata" poster="${esc(media)}"></video>`:media?`<img src="${esc(media)}" alt="Affiche de l’événement">`:''}</div>`;
  const copy=`<div class="tv-copy"><div class="tv-tag">${esc(e.category||'Événement')}</div><h1 class="tv-title">${esc(title)}</h1>${opts.showDesc!==false?`<div class="tv-description">${esc(description)}</div>`:''}${date}${e.box_closed===true?'<div class="tv-box-closed tv-box-closed-event">BOX FERMÉE</div>':''}${price}<div class="tv-footer"><div class="url">${esc(opts.qrUrl||e.link_url||'')}</div>${qr}</div></div>`;
  const chosen=String(e.image_layout||opts.layout||'right');
  const layout=({ 'poster-left':'left', 'poster-right':'right',left:'left',right:'right',bottom:'bottom' })[chosen]||'right';
  if(layout==='bottom'){
   // Text strictly above the poster, image fitted in the remaining space.
   const bottomCopy=`<div class="tv-copy"><div class="tv-tag">${esc(e.category||'Événement')}</div><h1 class="tv-title">${esc(title)}</h1>${opts.showDesc!==false?`<div class="tv-description">${esc(description)}</div>`:''}${date}${e.box_closed===true?'<div class="tv-box-closed tv-box-closed-event">BOX FERMÉE</div>':''}</div>`;
   body=`<div class="tv-event-bottom">${bottomCopy}${poster}</div>`;
  }else body=layout==='left'?poster+copy:copy+poster;
 }
 frame.innerHTML=(type==='welcome'||(type==='spotlight'&&opts.photoOnly===true))?`<div class="tv-art ${type==='welcome'?'welcome-art':'spotlight-photo-art'}">${body}</div>`:`<div class="tv-art"><div class="tv-art-head"><div class="tv-art-brand"><img src="/assets/logo-crossfit-leman.svg" alt="CrossFit Leman"></div><div class="tv-art-kicker">${type==='btwb'?'BTWB':type==='spotlight'?'CFL SPOTLIGHT':(type==='month'||type==='custom')?'AGENDA':'CFL EVENTS'}</div></div><div class="tv-art-body">${body}</div></div>`;
 scaleArtwork(frame);textFit(frame.querySelector('.tv-art'));
 if(type==='btwb' && opts.widget==='cfl-wod' && window.CFL_WOD)window.CFL_WOD.mount(frame.querySelector('.cfl-custom-wod'));
 const qrEl=frame.querySelector('.qr-target');
 if(qrEl && window.QRCode){
  qrEl.innerHTML='';new window.QRCode(qrEl,{text:qrEl.dataset.qr,width:124,height:124,colorDark:'#10121a',colorLight:'#ffffff',correctLevel:window.QRCode.CorrectLevel.M});
 }

}
