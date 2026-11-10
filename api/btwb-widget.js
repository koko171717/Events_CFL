// CFL TV V9 — official BTWB Webwidget container.
// Configure BTWB_WEBWIDGET_KEY in Vercel Environment Variables.
// A BTWB webwidget key is designed to be sent to a visitor's browser by BTWB;
// this route avoids committing it to Git, but DOES NOT make it secret from users.
const TRACKS=new Set(['84043','1237036','1237037','1237038','1237039','1237040','1237041','1237042','1237043']);
function escapeHtml(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
module.exports = function handler(req,res){
  const raw=Array.isArray(req.query.track)?req.query.track[0]:req.query.track;
  const track=TRACKS.has(String(raw))?String(raw):'84043';
  const key=process.env.BTWB_WEBWIDGET_KEY;
  res.setHeader('Cache-Control','no-store, max-age=0');
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('X-Content-Type-Options','nosniff');
  if(!key){res.status(503).end('<!doctype html><html lang="fr"><meta charset="utf-8"><body style="font:22px sans-serif;padding:25px;color:#751c32"><h2>BTWB non configuré</h2><p>Ajouter la variable BTWB_WEBWIDGET_KEY dans Vercel puis redéployer.</p></body></html>');return;}
  // Avoid interpolating key in HTML as markup; standard BTWB widget expects an HTML data attribute.
  const safeKey=escapeHtml(key);
  const page=`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="https://static.btwb.com/libs/webwidgets/2/webwidgets.css"><style>html,body{margin:0;padding:0;background:white;color:#121a23;font:20px system-ui,sans-serif}body{padding:14px;box-sizing:border-box}.btwb_webwidget{max-width:100%;font-size:1.16rem}*{box-sizing:border-box}img{max-width:100%}</style></head><body><div class="btwb_webwidget" data-type="wods" data-sections="main" data-track_ids="${track}" data-activity_length="0" data-leaderboard_length="0" data-days="1"></div><script id="btwb_config" data-api_key="${safeKey}"></script><script src="https://static.btwb.com/libs/webwidgets/2/webwidgets.js"><\/script></body></html>`;
  res.status(200).end(page.replace('<\/script>','</script>'));
};
