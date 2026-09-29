/**
 * /talent — the motion engine for talent.html.
 *
 * The demo's own script, run as built. It pins and scrubs its scenes with GSAP
 * ScrollTrigger over the document's native scroll, so the site's inertia layer
 * keeps moving the page and anchors travel with `scrollPageTo`.
 *
 * `mountTalent(root)` returns a cleanup that reverts every tween and trigger
 * and removes what it set on <html> and <body>.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { scrollPageTo } from "@/components/scroll-inertia";

gsap.registerPlugin(ScrollTrigger);

export function mountTalent(root) {
  const cleanups = [];
  let alive = true;
  const on = (target, type, fn) => {
    target.addEventListener(type, fn);
    cleanups.push(() => target.removeEventListener(type, fn));
  };
  const ctx = gsap.context(() => {

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s,r=root)=>r.querySelector(s), $$=(s,r=root)=>Array.from(r.querySelectorAll(s));
const MOBILE = window.matchMedia('(max-width: 900px)').matches;

/* ---------- smooth scroll ---------- */
function go(target){ const el = typeof target==='string'?$(target):target; if(!el) return; scrollPageTo(el,{reduce:RM}); }
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{ const id=a.getAttribute('href'); if(id.length>1 && $(id)){ e.preventDefault(); go(id); } }));

/* ---------- paper colour + HUD (triggers created last, see bottom) ---------- */
document.documentElement.classList.add('js-bg');
document.body.dataset.hud='dark';
const COL = {dark:'#050505', light:'#faf7f2'};
const scenes = $$('.scene');
gsap.set('#bg',{backgroundColor:COL[scenes[0].dataset.theme]});

/* pinned, scrubbed scene helper */
function pinScene(sel,len,tl,opts={}){
  if(RM){ tl.progress(1); return null; }
  return ScrollTrigger.create(Object.assign({trigger:sel,start:'top top',end:'+='+len,pin:true,scrub:.7,animation:tl,anticipatePin:1},opts));
}

/* ---------- magnetic buttons ---------- */
if(!RM && !MOBILE) $$('.magnetic').forEach(b=>{
  const xs=gsap.quickTo(b,'x',{duration:.5,ease:'power3'}), ys=gsap.quickTo(b,'y',{duration:.5,ease:'power3'});
  b.addEventListener('pointermove',e=>{ const r=b.getBoundingClientRect(); xs((e.clientX-r.left-r.width/2)*.28); ys((e.clientY-r.top-r.height/2)*.35); });
  b.addEventListener('pointerleave',()=>{xs(0);ys(0);});
});

/* ================= 01 OPEN ================= */
(function(){
  const lines=$$('.o-line'); const cap=$('#ocap');
  gsap.set(lines,{autoAlpha:0,y:40}); gsap.set(lines[0],{autoAlpha:1,y:0});
  const cam=$('.o-cam'), frame=$('.o-frame');
  const tl=gsap.timeline({defaults:{ease:'none'}});
  gsap.set(cam,{scale:3.1,transformOrigin:'49% 15.5%'});
  tl.to('.o-hint',{autoAlpha:0,duration:.05},0)
    .to('.o-intro',{autoAlpha:0,y:-20,duration:.12},.02)
    .to(cam,{scale:1.65,transformOrigin:'50% 30%',duration:.3,ease:'power1.inOut'},.05)
    .to(lines[0],{autoAlpha:0,y:-40,duration:.1},.18)
    .to(lines[1],{autoAlpha:1,y:0,duration:.1},.25)
    .to(cam,{scale:1,transformOrigin:'50% 50%',duration:.28,ease:'power1.inOut'},.38)
    .to(frame,{'--ar':.6667,duration:.28,ease:'power1.inOut'},.38)
    .to(lines[1],{autoAlpha:0,y:-40,duration:.1},.45)
    .to(lines[2],{autoAlpha:1,y:0,duration:.1},.52)
    /* the lift: the sky goes, the figure stays */
    .to(lines[2],{autoAlpha:MOBILE?1:0,y:MOBILE?0:-30,duration:.08},.7)
    .set(frame,{overflow:'visible'},.72)
    .to(frame,{x:()=>{ if(MOBILE) return 0; const h=frame.offsetHeight, w=h*.6667, right=Math.max(parseFloat(getComputedStyle(frame).right)||0,0); return window.innerWidth/2-(window.innerWidth-right-w/2); },duration:.14,ease:'power2.inOut'},.7)
    .to('.o-cap',{autoAlpha:0,duration:.05},.7)
    .to('.o-photo',{autoAlpha:0,duration:.12},.72)
    .fromTo('.o-giant',{autoAlpha:0,scale:.82},{autoAlpha:1,scale:1,duration:.16,ease:'power2.out'},.74)
    .to({},{duration:.14});
  tl.eventCallback('onUpdate',()=>{
    const p=tl.progress();
    cap.innerHTML = p<.22?'<b>Headshot</b>':p<.46?'<b>Three-quarter</b>':'<b>Full length</b>';
    frame.classList.toggle('lifted',p>.71);
  });
  if(RM){ gsap.set(lines,{autoAlpha:0}); }
  pinScene('#open','360%',tl,{invalidateOnRefresh:true});
  // intro on load
  if(!RM){ gsap.from('.o-frame',{autoAlpha:0,scale:.96,duration:1.6,ease:'expo.out',delay:.1}); gsap.from('.o-line[data-i="0"] .h-xl',{yPercent:60,autoAlpha:0,duration:1.4,ease:'expo.out',delay:.35}); gsap.from('.o-line[data-i="0"] .o-sub, .o-intro',{autoAlpha:0,y:16,duration:1.2,ease:'expo.out',delay:.7,stagger:.1}); }
})();


/* ================= 02 SET + FRESHNESS ================= */
(function(){
  const slots=$('#slots'), wk=$('#wk'), st=$('#fstate'), bar=$('#fbar');
  const proxy={w:1};
  const tl=gsap.timeline({defaults:{ease:'none'}});
  tl.from('#slots .slot',{y:60,autoAlpha:0,stagger:.03,duration:.14,ease:'power2.out'},0)
    .from('.set-head > *',{y:30,autoAlpha:0,stagger:.04,duration:.12,ease:'power2.out'},0)
    .from('.fresh',{autoAlpha:0,y:20,duration:.1},.12)
    .to(proxy,{w:14,duration:.62,ease:'power1.in',onUpdate:()=>{
      const w=proxy.w, age=Math.max(0,(w-3)/11);
      slots.style.setProperty('--age',age.toFixed(3));
      wk.textContent='Week '+String(Math.floor(w)).padStart(2,'0');
      bar.style.transform='scaleX('+Math.min(1,w/14)+')';
      const s = w<9?'<em>Current.</em>':w<13?'<em>Aging.</em>':'<em>Stale.</em>';
      if(st.innerHTML!==s) st.innerHTML=s;
      $$('#slots .dt').forEach(d=>d.textContent = w<13?'14 Sep':'Stale');
    }},.24)
    .to('#dec',{autoAlpha:1,y:0,duration:.1},.86)
    .to({},{duration:.08});
  gsap.set('#dec',{y:14});
  pinScene('#set','260%',tl);
})();

/* ================= 03 CAPTURE ================= */
(function(){
  const feed=$('#vffeed'), ghost=$('#vfghost'), hint=$('#vfhint'), checks=$$('#vfchecks li'), sh=$('#vfshutter');
  const T=[.14,.2,.27,.36,.55];
  let hintState='';
  function sync(p){
    checks.forEach((c,i)=>c.classList.toggle('ok',p>=T[i]));
    sh.classList.toggle('ready',p>=.55);
    const h = p<.55?'Step back until your feet are in frame':p<.63?'Hold still':'Full length · captured';
    if(h!==hintState){ hintState=h; hint.textContent=h; }
  }
  gsap.set(feed,{scale:1.75,xPercent:6,yPercent:-4});
  const tl=gsap.timeline({defaults:{ease:'none'},onUpdate:()=>sync(tl.progress())});
  tl.from('.cp-copy > *',{y:40,autoAlpha:0,stagger:.03,duration:.1,ease:'power2.out'},0)
    .from('#phone',{y:120,rotate:-4,autoAlpha:0,duration:.14,ease:'power2.out'},0)
    .to(feed,{scale:1,xPercent:0,yPercent:0,duration:.4,ease:'power2.inOut'},.14)
    .to(ghost,{opacity:1,duration:.04},.53)
    .to('#vfflash',{opacity:1,duration:.02},.62).to('#vfflash',{opacity:0,duration:.06},.64)
    .to(ghost,{opacity:0,duration:.04},.64)
    .to('#phone',{x:()=>MOBILE?0:-40,scale:.94,duration:.12,ease:'power2.inOut'},.68)
    .fromTo('#cpres',{autoAlpha:0,x:-40},{autoAlpha:1,x:0,duration:.14,ease:'power2.out'},.7)
    .to({},{duration:.14});
  sync(0);
  if(RM){ sync(1); }
  pinScene('#capture','300%',tl);
})();

/* ================= 04 TAPE ================= */
(function(){
  const strip=$('#strip'); const PX = MOBILE?11:16; const MIN=120, MAX=220;
  const W=(MAX-MIN)*PX, H=118;
  let svg='<svg width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" xmlns="http://www.w3.org/2000/svg">';
  for(let c=MIN;c<=MAX;c++){ const x=(c-MIN)*PX; const L=c%10===0?34:c%5===0?22:12;
    svg+='<line x1="'+x+'" y1="0" x2="'+x+'" y2="'+L+'" stroke="#050505" stroke-width="'+(c%10===0?1.4:1)+'"/>';
    if(c%10===0) svg+='<text x="'+(x+4)+'" y="50" font-family="JetBrains Mono,monospace" font-size="13" fill="#050505">'+c+'</text>'; }
  const inPx=PX*2.54;
  for(let i=Math.ceil(MIN/2.54);i<=MAX/2.54;i++){ const x=(i*2.54-MIN)*PX; const L=i%12===0?34:20;
    svg+='<line x1="'+x+'" y1="'+H+'" x2="'+x+'" y2="'+(H-L)+'" stroke="#050505" stroke-width="'+(i%12===0?1.4:1)+'"/>';
    for(let k=1;k<4;k++){ const xx=x+k*inPx/4; svg+='<line x1="'+xx+'" y1="'+H+'" x2="'+xx+'" y2="'+(H-(k===2?12:7))+'" stroke="#050505" stroke-width=".8"/>'; }
    const lab = i%12===0 ? (i/12)+' ft' : String(i%12);
    svg+='<text x="'+(x+4)+'" y="'+(H-40)+'" font-family="JetBrains Mono,monospace" font-size="'+(i%12===0?13:11)+'" fill="#050505" '+(i%12===0?'font-weight="600"':'')+'>'+lab+'</text>'; }
  svg+='</svg>'; strip.innerHTML=svg; strip.style.width=W+'px';
  const cm=$('#cm'), ft=$('#ft'); const v={c:150};
  function render(){ const c=v.c; const x = -((c-MIN)*PX) + strip.parentElement.clientWidth/2; strip.style.transform='translate3d('+x+'px,0,0)'; cm.textContent=Math.round(c); const inch=Math.round(c/2.54); ft.textContent=Math.floor(inch/12)+'′'+(inch%12)+'″'; }
  render(); on(window,'resize',render);
  const tl=gsap.timeline({defaults:{ease:'none'}});
  tl.from('.tp-top > *',{y:40,autoAlpha:0,stagger:.05,duration:.14,ease:'power2.out'},0)
    .to(v,{c:180,duration:.5,ease:'power3.out',onUpdate:render},.1)
    .to('#stats span',{autoAlpha:1,y:0,stagger:.035,duration:.08},.58)
    .from('.tp-foot > *',{autoAlpha:0,y:20,stagger:.05,duration:.1},.72)
    .to({},{duration:.1});
  pinScene('#tape','200%',tl);
  // drag the tape
  const tape=$('.tape'); let drag=null;
  tape.style.cursor='grab';
  tape.addEventListener('pointerdown',e=>{drag={x:e.clientX,c:v.c};tape.setPointerCapture(e.pointerId);tape.style.cursor='grabbing';});
  tape.addEventListener('pointermove',e=>{ if(!drag) return; v.c=Math.max(140,Math.min(205,drag.c-(e.clientX-drag.x)/PX)); render(); });
  const end=()=>{ if(!drag) return; drag=null; tape.style.cursor='grab'; gsap.to(v,{c:180,duration:1.4,delay:.9,ease:'elastic.out(1,.6)',onUpdate:render}); };
  tape.addEventListener('pointerup',end); tape.addEventListener('pointercancel',end);
})();

/* ================= 05 CARD ================= */
(function(){
  const eds=$$('.ed'), items=$$('#edlist li'), tag=$('#edtag'), card=$('#cdcard');
  const TAGS=[
    'The industry card. <em>One strong frame, a clean name band, a working back.</em>',
    'The working commercial card. <em>A full hero over a three-frame strip.</em>',
    'Museum register. <em>Deep mats, caption typography, air as material.</em>',
    'Magazine logic. <em>The name set as a masthead, the photograph under it.</em>',
    'Structural. <em>A visible modular grid, grotesque type, a spine rail.</em>',
    'Display type layered behind the figure. <em>The magazine-cover interlock.</em>',
    'Dark paper, reversed type, <em>gold that finally sings.</em>',
    'Two frames on a hinge. <em>A face and a figure, read together.</em>',
    'The figure lifted onto a flat plane, <em>type in the negative space.</em> Offered only when a clean matte exists.'
  ];
  let cur=0, flipped=false;
  function show(i){
    if(i===cur) return;
    const prev=eds[cur], next=eds[i]; cur=i;
    items.forEach((li,k)=>li.classList.toggle('on',k===i));
    eds.forEach(e=>e.style.zIndex=1); prev.style.zIndex=2; next.style.zIndex=3;
    gsap.killTweensOf(next);
    if(RM){ eds.forEach(e=>e.classList.remove('on')); next.classList.add('on'); gsap.set(next,{clipPath:'inset(0% 0 0 0)'}); }
    else{
      gsap.fromTo(next,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:.95,ease:'expo.out',onComplete:()=>{eds.forEach(e=>{if(e!==next){e.classList.remove('on');gsap.set(e,{clipPath:'inset(100% 0 0 0)'});}}); next.classList.add('on');}});
      gsap.fromTo(next.querySelectorAll('img'),{scale:1.14},{scale:1,duration:1.4,ease:'expo.out'});
      gsap.fromTo(next.querySelectorAll('.nm,.st,.wm,.big,.v,.v2,.band,.foot,.cap,.gst'),{y:14,autoAlpha:0},{y:0,autoAlpha:1,duration:.8,stagger:.04,ease:'power3.out',delay:.15});
    }
    gsap.fromTo(tag,{autoAlpha:0,y:8},{autoAlpha:1,y:0,duration:.5,ease:'power2.out'}); tag.innerHTML=TAGS[i];
    card.setAttribute('aria-label','Comp card for Elara Keats, '+items[i].textContent.replace(/^\d+/,'')+' edition');
  }
  function flip(to){ if(to===flipped) return; flipped=to; gsap.to(card,{rotateY:to?180:0,duration:RM?0:1.3,ease:'power3.inOut'}); $('#flip').innerHTML=to?'Turn to the front <span aria-hidden="true">↻</span>':'Turn the card <span aria-hidden="true">↻</span>'; }
  eds.forEach((e,k)=>{ if(k!==0) gsap.set(e,{clipPath:'inset(100% 0 0 0)'}); });
  let st=null;
  if(!RM){
    st=ScrollTrigger.create({trigger:'#card',start:'top top',end:'+=900%',pin:true,anticipatePin:1,onUpdate:self=>{
      const p=self.progress; const i=Math.min(8,Math.floor(p*9.6)); show(i); flip(p>.94);
    }});
    gsap.from('.cd-index > *, .cd-meta > *',{y:30,autoAlpha:0,stagger:.06,duration:1,ease:'power3.out',scrollTrigger:{trigger:'#card',start:'top 70%'}});
    gsap.from('#cdstage',{y:80,rotateX:18,autoAlpha:0,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'#card',start:'top 70%'}});
  }
  items.forEach((li,k)=>li.querySelector('button').addEventListener('click',()=>{
    if(st){ const y=st.start+(k+.5)/9.6*(st.end-st.start); scrollPageTo(y,{reduce:RM}); }
    else { flip(false); show(k); }
  }));
  $('#flip').addEventListener('click',()=>flip(!flipped));
  // tilt
  if(!MOBILE && !RM){
    const stage=$('#cdstage'), t=$('#cdtilt');
    const rx=gsap.quickTo(t,'rotateX',{duration:.8,ease:'power3'}), ry=gsap.quickTo(t,'rotateY',{duration:.8,ease:'power3'});
    stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect(); ry(((e.clientX-r.left)/r.width-.5)*14); rx(-((e.clientY-r.top)/r.height-.5)*10);});
    stage.addEventListener('pointerleave',()=>{rx(0);ry(0);});
  }
})();

/* ================= 05b PASS ================= */
(function(){
  // a QR-shaped mark (decorative): three finder squares and seeded modules
  const c=$('#qr'), x=c.getContext('2d'); const N=25; let s=7;
  const rnd=()=>{ s=(s*16807)%2147483647; return s/2147483647; };
  x.fillStyle='#fff'; x.fillRect(0,0,N,N); x.fillStyle='#111';
  const finder=(fx,fy)=>{ x.fillRect(fx,fy,7,7); x.fillStyle='#fff'; x.fillRect(fx+1,fy+1,5,5); x.fillStyle='#111'; x.fillRect(fx+2,fy+2,3,3); };
  const inF=(i,j)=>(i<8&&j<8)||(i>N-9&&j<8)||(i<8&&j>N-9);
  for(let i=0;i<N;i++) for(let j=0;j<N;j++){ if(!inF(i,j) && rnd()>.52) x.fillRect(i,j,1,1); }
  finder(0,0); finder(N-7,0); finder(0,N-7);
  const tl=gsap.timeline({defaults:{ease:'none'}});
  tl.from('.ps-copy > *',{y:40,autoAlpha:0,stagger:.03,duration:.1,ease:'power2.out'},0)
    .from('#pass .phone',{y:120,autoAlpha:0,duration:.14,ease:'power2.out'},0)
    .fromTo('#passcard',{yPercent:115,rotateX:18},{yPercent:0,rotateX:0,duration:.3,ease:'power3.out'},.08)
    .to('.wp',{y:-10,opacity:.6,stagger:.02,duration:.1},.2)
    .to('#pfscan',{opacity:1,duration:.02},.42)
    .fromTo('#pfscan',{top:'0%'},{top:'100%',duration:.14},.42)
    .to('#pfscan',{opacity:0,duration:.02},.56)
    .to('#passin',{rotateY:180,duration:.2,ease:'power2.inOut'},.62)
    .to({},{duration:.16});
  pinScene('#pass','260%',tl);
})();

/* ================= 06 MARKET ================= */
(function(){
  const keys=['hs','fl','pr','tq','bk','cu','sm','wv'];
  const lis=$$('#mklists li');
  function sync(p){
    const n = p<.22?0:Math.min(keys.length,Math.floor((p-.22)/.042)+1);
    const on=new Set(keys.slice(0,n));
    lis.forEach(li=>li.classList.toggle('hit',on.has(li.dataset.k)));
  }
  gsap.set('#mkunion',{autoAlpha:0});
  const tl=gsap.timeline({defaults:{ease:'none'},onUpdate:()=>sync(tl.progress())});
  tl.from('.br-copy > *',{y:40,autoAlpha:0,stagger:.04,duration:.12,ease:'power2.out'},0)
    .from('.mk-col',{y:50,autoAlpha:0,stagger:.025,duration:.12,ease:'power2.out'},.02)
    .to('#mklists',{autoAlpha:0,y:-24,scale:.97,duration:.08},.6)
    .to('#mkunion',{autoAlpha:1,duration:.04},.64)
    .from('.mk-verdict',{y:20,autoAlpha:0,duration:.06},.64)
    .from('.mk-rows li',{x:24,autoAlpha:0,stagger:.018,duration:.06,ease:'power2.out'},.68)
    .from('.mk-foot',{autoAlpha:0,duration:.05},.86)
    .to({},{duration:.08});
  if(RM){ tl.progress(1); sync(1); return; }
  pinScene('#brief','240%',tl);
})();

/* ================= 07 DOSSIER ================= */
(function(){
  const pages=$$('#dstack .pg').reverse(); // pages[0] = 01 / 07
  const tabs=$$('#dtabs li'), seal=$('#seal'), msg=$('#msg');
  const full=msg.dataset.text; let typed=false;
  function typeMsg(){ if(typed) return; typed=true; if(RM){ msg.textContent=full; return; } const o={n:0}; gsap.to(o,{n:full.length,duration:2.4,ease:'none',onUpdate:()=>{msg.innerHTML=full.slice(0,Math.round(o.n))+'<i class="caret"></i>';}}); }
  let cur=-1;
  function set(i){
    if(i===cur) return; const back=i<cur; cur=i;
    pages.forEach((p,k)=>{
      const gone=k<i;
      gsap.to(p,{rotateX:gone?-102:0,y:gone?-30:0,autoAlpha:gone?0:1,duration:RM?0:(back?.8:1),ease:'power3.inOut',delay:gone&&!back?0:.02});
    });
    tabs.forEach((t,k)=>{t.classList.toggle('on',k===i);t.classList.toggle('done',k<i);});
    if(i===5) typeMsg();
    if(i>=7){ gsap.to(seal,{autoAlpha:1,duration:RM?0:.5,delay:RM?0:.15}); gsap.to('.seal-c',{strokeDashoffset:0,duration:RM?0:.9,delay:RM?0:.3,ease:'power2.inOut'}); gsap.to('.seal-k',{strokeDashoffset:0,duration:RM?0:.5,delay:RM?0:.9,ease:'power2.out'}); gsap.fromTo('#seal > :not(svg)',{y:14,autoAlpha:0},{y:0,autoAlpha:1,stagger:.08,delay:RM?0:.45,duration:RM?0:.7}); }
    else { gsap.to(seal,{autoAlpha:0,duration:.3}); gsap.set(['.seal-c','.seal-k'],{strokeDashoffset:1}); }
  }
  if(RM){ set(7); return; }
  set(0);
  ScrollTrigger.create({trigger:'#dossier',start:'top top',end:'+=640%',pin:true,anticipatePin:1,onUpdate:self=>set(Math.min(7,Math.floor(self.progress*8.4)))});
  gsap.from('.ds-copy > *',{y:30,autoAlpha:0,stagger:.08,duration:1,ease:'power3.out',scrollTrigger:{trigger:'#dossier',start:'top 70%'}});
  gsap.from('#dstack',{y:90,autoAlpha:0,duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'#dossier',start:'top 70%'}});
})();

/* ================= 08 SILENCE ================= */
(function(){
  const g=$('#ticks'); let h='';
  const DAYS=30, P75=12, COLD=30;
  for(let d=0; d<DAYS; d+=1){ const a=d/DAYS*Math.PI*2; const r1=96, r2=d%5===0?104:100; h+='<line class="tk" x1="'+(100+r1*Math.cos(a))+'" y1="'+(100+r1*Math.sin(a))+'" x2="'+(100+r2*Math.cos(a))+'" y2="'+(100+r2*Math.sin(a))+'"/>'; }
  [P75,COLD].forEach(d=>{ const a=d/DAYS*Math.PI*2; h+='<line class="mk" x1="'+(100+84*Math.cos(a))+'" y1="'+(100+84*Math.sin(a))+'" x2="'+(100+108*Math.cos(a))+'" y2="'+(100+108*Math.sin(a))+'"/>'; });
  g.innerHTML=h;
  // labels placed around the ring
  const clock=$('#clock');
  [[P75,'Most reads have happened'],[COLD,'Window closes']].forEach(([d,t])=>{ const a=d/DAYS*Math.PI*2-Math.PI/2; const el=document.createElement('span'); el.className='clock-lbl'; el.textContent=t; const x=50+Math.cos(a)*58, y=50+Math.sin(a)*58; el.style.left=x+'%'; el.style.top=y+'%'; el.style.transform='translate('+(Math.cos(a)>0?'0':'-100%')+',-50%)'; clock.appendChild(el); });
  const day=$('#day'), cs=$('#cstate'), ce=$('#cexp'), arc=$('#arc'); const v={d:1};
  const S=[[P75,'Unread','Most first reads happen in this stretch.'],[COLD,'Late','Past the point by which most reads have happened.'],[999,'Closed','No decision within 30 days. Treat this as a pass.']];
  function render(){ const d=v.d; day.textContent=Math.round(d); arc.style.strokeDashoffset=1-d/DAYS; const s=S.find(x=>d<x[0]); if(cs.textContent!==s[1]){ cs.textContent=s[1]; ce.textContent=s[2]; if(!RM) gsap.fromTo([cs,ce],{autoAlpha:0,y:6},{autoAlpha:1,y:0,duration:.5}); } arc.style.stroke = d<P75?'#c9a55a':d<COLD?'#d4bc8a':'#faf7f2'; }
  render();
  const tl=gsap.timeline({defaults:{ease:'none'}});
  tl.from('.sl-copy > *',{y:40,autoAlpha:0,stagger:.05,duration:.12,ease:'power2.out'},0)
    .from('#clock',{scale:.9,autoAlpha:0,duration:.14,ease:'power2.out'},0)
    .to(v,{d:DAYS,duration:.7,onUpdate:render},.14).to({},{duration:.12});
  pinScene('#silence','280%',tl);
})();

/* ================= 09 LEDGER ================= */
(function(){
  const rows=$$('.lg-row');
  if(!RM){
    rows.forEach(r=>gsap.from(r,{y:30,autoAlpha:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:r,start:'top 92%'}}));
    gsap.from('.lg-head > * > *, .lg-filters',{y:30,autoAlpha:0,stagger:.08,duration:1,ease:'power3.out',scrollTrigger:{trigger:'#ledger',start:'top 70%'}});
    gsap.to('#spine',{scaleY:1,ease:'none',scrollTrigger:{trigger:'#lg',start:'top 70%',end:'bottom 70%',scrub:true}});
  }
  $$('#lgf button[data-f]').forEach(b=>b.addEventListener('click',()=>{
    $$('#lgf button[data-f]').forEach(x=>x.classList.toggle('on',x===b));
    const f=b.dataset.f;
    rows.forEach(r=>{ const show=f==='all'||r.dataset.c===f; r.classList.toggle('hide',!show); if(show&&!RM) gsap.fromTo(r,{autoAlpha:0,x:-12},{autoAlpha:1,x:0,duration:.5,ease:'power2.out'}); });
    $$('.lg-month').forEach(m=>{ let n=m.nextElementSibling, any=false; while(n&&n.classList.contains('lg-row')){ if(!n.classList.contains('hide')) any=true; n=n.nextElementSibling; } m.style.display=any?'':'none'; });
    ScrollTrigger.refresh();
  }));
})();

/* ================= 10 NEXT / 11 YOURS ================= */
if(!RM){
  gsap.from('.nx-head > *',{y:40,autoAlpha:0,stagger:.08,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'#next',start:'top 65%'}});
  $$('.nx-list li').forEach(li=>gsap.from(li,{y:40,autoAlpha:0,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:li,start:'top 88%'}}));
  gsap.from('.yr-copy > *, .perm-row, .yr-facts > div',{y:40,autoAlpha:0,stagger:.08,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'#yours',start:'top 65%'}});
}
$$('.tog').forEach(t=>t.addEventListener('click',()=>{
  const on=t.getAttribute('aria-checked')!=='true'; t.setAttribute('aria-checked',on);
  const p=t.parentElement.querySelector('p'); const now=new Date(); const stamp=now.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+', '+now.toTimeString().slice(0,5);
  p.textContent = on ? 'Granted '+stamp+' · recorded · withdraw any time' : 'Withdrawn '+stamp+' · recorded';
  p.classList.toggle('g',on);
}));


/* who sees what */
(function(){
  const tabs=$$('#lenstabs button'), rows=$$('#lensfields li');
  function set(l){ tabs.forEach(t=>{const on=t.dataset.l===l; t.classList.toggle('on',on); t.setAttribute('aria-selected',on);});
    rows.forEach(r=>{ const on=r.dataset.v.split(' ').includes(l); r.classList.toggle('off',!on); r.querySelector('span').textContent=on?'Shown':'Not shown'; }); }
  tabs.forEach(t=>t.addEventListener('click',()=>set(t.dataset.l))); set('pub');
})();
/* ================= 12 CLOSE ================= */
(function(){
  if(MOBILE){ if(!RM) gsap.from('.fn-giant, .fn-fig, .fn-copy, .fn-price',{y:40,autoAlpha:0,stagger:.1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:'#close',start:'top 70%'}}); return; }
  const tl=gsap.timeline({defaults:{ease:'none'}});
  tl.from('.fn-fig',{yPercent:18,autoAlpha:0,duration:.35,ease:'power2.out'},0)
    .from('.fn-giant',{scale:.8,autoAlpha:0,duration:.35,ease:'power2.out'},.05)
    .from('.fn-copy > *, .fn-price',{y:40,autoAlpha:0,stagger:.06,duration:.2,ease:'power2.out'},.3)
    .to({},{duration:.3});
  pinScene('#close','120%',tl);
})();

/* paper + HUD: created after every pin so positions include pin spacing.
   The active scene is whichever range holds the viewport's middle. */
const ranges = scenes.map(s=>ScrollTrigger.create({trigger:s,start:'top 55%',end:'bottom 55%'}));
let activeScene=null;
function syncScene(){
  const y=window.scrollY||document.documentElement.scrollTop;
  let i=0; ranges.forEach((t,k)=>{ if(y>=t.start) i=k; });
  const s=scenes[i]; if(s===activeScene) return; activeScene=s;
  gsap.to('#bg',{backgroundColor:COL[s.dataset.theme],duration:RM?0:.9,ease:'power2.out',overwrite:true});
  document.body.dataset.hud=s.dataset.theme; $('#chap').textContent=s.dataset.label;
}
ScrollTrigger.create({start:0,end:'max',onUpdate:self=>{ syncScene(); const n=Math.min(36,1+Math.floor(self.progress*35.999)); $('#fr').textContent=String(n).padStart(2,'0'); gsap.set('.hud-progress',{scaleX:self.progress}); }});
const onRefresh=()=>{activeScene=null;syncScene();}; ScrollTrigger.addEventListener('refresh',onRefresh); cleanups.push(()=>ScrollTrigger.removeEventListener('refresh',onRefresh));

on(window,'load',()=>ScrollTrigger.refresh());
if(document.fonts) document.fonts.ready.then(()=>{ if(alive) ScrollTrigger.refresh(); });

  }, root);
  return () => {
    alive = false;
    ctx.revert();
    cleanups.forEach((fn) => fn());
    document.documentElement.classList.remove("js-bg");
    delete document.body.dataset.hud;
  };
}
