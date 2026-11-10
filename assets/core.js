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
 let font=36, titleFont=88, gap=24, qr=145;
 for(let n=0;n<18;n++){
  desc.style.fontSize=font+'px';title.style.fontSize=titleFont+'px';copy.style.gap=gap+'px';
  const q=copy.querySelector('.tv-qr');if(q){q.style.width=qr+'px';q.style.height=qr+'px'}
  if(copy.scrollHeight<=copy.clientHeight+1 && title.scrollHeight<=title.clientHeight+1)break;
  font=Math.max(16,font-1.4);titleFont=Math.max(45,titleFont-2.1);gap=Math.max(9,gap-.9);qr=Math.max(95,qr-3);
 }
 const over=copy.scrollHeight>copy.clientHeight+1;
 art.dataset.overflow=over?'true':'false';
}
function artRender(frame,slide,events){
 const e=events.find(x=>x.id===slide.event_id) || slide.event_snapshot || {};
 const opts=slide.settings||{};
 const type=slide.slide_type||'event';
 let body='';
 if(type==='month'){
  const m=opts.month || '2027-03';const candidates=events.filter(x=>x.start_date<=m+'-31'&&x.end_date>=m+'-01').slice(0,Number(opts.count||6));
  const monthText=new Intl.DateTimeFormat('fr-CH',{month:'long',year:'numeric'}).format(new Date(m+'-01T12:00:00'));
  body=`<div style="display:flex;flex-direction:column;height:100%;width:100%"><h1 class="month-title">Événements du mois</h1><div style="font-size:32px;color:#ffb5c3">${esc(monthText)}</div><div class="month-list" style="grid-template-rows:repeat(${Math.max(candidates.length,1)},minmax(0,1fr))">${candidates.map(x=>`<div class="month-row"><div class="month-image">${imgMarkup(x)}</div><div style="flex:1;min-width:0"><b>${esc(x.short_title||x.title)}</b><small>${esc(period(x))}</small></div></div>`).join('')||'<div class="month-row">Aucun événement publié.</div>'}</div></div>`;
 }else if(type==='btwb'){
  const labels={wod:'WOD DU JOUR',leaderboard:'LEADERBOARD',activity:'ACTIVITÉ DES MEMBRES'};
  body=`<div class="btwb-preview" style="width:100%;height:100%"><b>${esc(labels[opts.widget]||'BTWB')}</b><p>Module BTWB : aperçu de conception. Connexion officielle à réaliser après déploiement de l’agenda.</p></div>`;
 }else{
  const title=opts.title || e.title || 'Événement CFL';const description=opts.description??e.description??'';
  const date=opts.showDate!==false ? `<div class="tv-meta">${esc(opts.dateLabel||period(e))}</div>`:'';
  const price=opts.showPrice===true && e.price_label?`<div class="tv-meta">${esc(e.price_label)}</div>`:'';
  const qrLink=opts.qrUrl||e.link_url||'';const qr=opts.showQR!==false && /^https?:\/\//.test(qrLink) ? `<div class="tv-qr qr-target" data-qr="${esc(qrLink)}"></div>`:'';
  const media=opts.posterOverride||imgUrl(e);
  const poster=`<div class="tv-poster ${media?'':'empty'}" style="--poster:url('${esc(media)}')">${media?`<img src="${esc(media)}" alt="Affiche de l’événement">`:''}</div>`;
  const copy=`<div class="tv-copy"><div class="tv-tag">${esc(e.category||'Événement')}</div><h1 class="tv-title">${esc(title)}</h1>${opts.showDesc!==false?`<div class="tv-description">${esc(description)}</div>`:''}${date}${price}<div class="tv-footer"><div class="url">${esc(opts.qrUrl||e.link_url||'events.crossfitleman.ch')}</div>${qr}</div></div>`;
  body=opts.layout==='poster-left'?poster+copy:copy+poster;
 }
 frame.innerHTML=`<div class="tv-art"><div class="tv-art-head"><div class="tv-art-brand">CROSSFIT <span style="color:#ff667e">LÉMAN</span></div><div class="tv-art-kicker">${type==='btwb'?'BTWB':type==='month'?'AGENDA':'CFL EVENTS'}</div></div><div class="tv-art-body">${body}</div></div>`;
 scaleArtwork(frame);textFit(frame.querySelector('.tv-art'));
 const qrEl=frame.querySelector('.qr-target');
 if(qrEl && window.QRCode){
  qrEl.innerHTML='';new window.QRCode(qrEl,{text:qrEl.dataset.qr,width:124,height:124,colorDark:'#10121a',colorLight:'#ffffff',correctLevel:window.QRCode.CorrectLevel.M});
 }

}
