// Shared TV calendar reference colors/dates; source: CFL Admin calendar V15.
(()=>{
const schoolVacations=[
  // Calendrier officiel VD 2026 ; les années 2027–2031 suivent ci-dessous.
  ['2025-12-20','2026-01-04','Vacances d’hiver'],
  ['2026-02-14','2026-02-22','Relâches'],
  ['2026-04-03','2026-04-19','Vacances de Pâques'],
  ['2026-05-14','2026-05-17','Pont de l’Ascension'],
  ['2026-06-27','2026-08-16','Vacances d’été'],
  ['2026-10-10','2026-10-25','Vacances d’automne'],
 ['2026-12-24','2027-01-10','Vacances d’hiver'],['2027-02-06','2027-02-14','Relâches'],
 ['2027-03-26','2027-04-11','Vacances de Pâques'],['2027-05-06','2027-05-09','Pont de l’Ascension'],
 ['2027-07-03','2027-08-22','Vacances d’été'],['2027-10-09','2027-10-24','Vacances d’automne'],
 ['2027-12-24','2028-01-09','Vacances d’hiver'],['2028-02-12','2028-02-20','Relâches'],
 ['2028-04-14','2028-04-30','Vacances de Pâques'],['2028-05-25','2028-05-28','Pont de l’Ascension'],
 ['2028-07-01','2028-08-20','Vacances d’été'],['2028-10-14','2028-10-29','Vacances d’automne'],
 ['2028-12-23','2029-01-07','Vacances d’hiver'],['2029-02-10','2029-02-18','Relâches'],
 ['2029-03-30','2029-04-15','Vacances de Pâques'],['2029-05-10','2029-05-13','Pont de l’Ascension'],
 ['2029-06-30','2029-08-19','Vacances d’été'],['2029-10-13','2029-10-28','Vacances d’automne'],
 ['2029-12-22','2030-01-06','Vacances d’hiver'],['2030-02-16','2030-02-24','Relâches'],
 ['2030-04-19','2030-05-05','Vacances de Pâques'],['2030-05-30','2030-06-02','Pont de l’Ascension'],
 ['2030-07-06','2030-08-25','Vacances d’été'],['2030-10-12','2030-10-27','Vacances d’automne'],
 ['2030-12-21','2031-01-05','Vacances d’hiver'],['2031-02-15','2031-02-23','Relâches'],
 ['2031-04-11','2031-04-27','Vacances de Pâques'],['2031-05-22','2031-05-25','Pont de l’Ascension'],
 ['2031-07-05','2031-08-24','Vacances d’été']
];
function p(n){return String(n).padStart(2,'0')}
function plusDays(iso,delta){const dt=new Date(iso+'T12:00:00Z');dt.setUTCDate(dt.getUTCDate()+delta);return dt.toISOString().slice(0,10)}
function easter(y){const a=y%19,b=Math.floor(y/100),c=y%100,d=Math.floor(b/4),e=b%4,f=Math.floor((b+8)/25),g=Math.floor((b-f+1)/3),h=(19*a+b-d-g+15)%30,i=Math.floor(c/4),k=c%4,l=(32+2*e+2*i-h-k+700)%7,m=Math.floor((a+11*h+22*l)/451),q=Math.floor((h+l-7*m+114)/31),day=((h+l-7*m+114)%31)+1;return `${y}-${p(q)}-${p(day)}`}
function holidays(y){const sep=new Date(Date.UTC(y,8,1)),firstSun=1+(7-sep.getUTCDay())%7,fast=`${y}-09-${p(firstSun+15)}`,e=easter(y);return Object.fromEntries([[`${y}-01-01`,'Nouvel An'],[`${y}-01-02`,'2 janvier'],[plusDays(e,-2),'Vendredi Saint'],[plusDays(e,1),'Lundi de Pâques'],[plusDays(e,39),'Ascension'],[plusDays(e,50),'Lundi de Pentecôte'],[`${y}-08-01`,'Fête nationale'],[fast,'Lundi du Jeûne'],[`${y}-12-25`,'Noël']])}
const cache={};
window.CFL_VAUD_REF=(iso)=>{const y=Number(iso.slice(0,4)),h=cache[y]||(cache[y]=holidays(y));return {holiday:h[iso]||'',vacation:schoolVacations.find(([a,b])=>a<=iso&&iso<=b)?.[2]||''}};
})();
