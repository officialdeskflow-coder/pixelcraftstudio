(function(){
 var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
 /* contact details come from config.js */
 var phone=typeof PHONE_LINK!=='undefined'?PHONE_LINK:'',shown=typeof PHONE_SHOWN!=='undefined'?PHONE_SHOWN:'',handle=typeof HANDLE!=='undefined'?HANDLE:'@pixelcraft.studio';
 $$('a.wa').forEach(function(a){a.href='https://wa.me/'+phone+'?text='+encodeURIComponent(a.dataset.msg||'Hi PixelCraft Studio, I want a free sample.')});
 $$('[data-phone]').forEach(function(e){e.textContent=shown});
 $$('[data-handle]').forEach(function(e){e.textContent=handle});
 $$('a.ig').forEach(function(a){a.href='https://instagram.com/'+handle.replace('@','')});

 /* header */
 var header=$('.site-header');
 function onScroll(){header.classList.toggle('scrolled',window.scrollY>8)}
 onScroll();window.addEventListener('scroll',onScroll,{passive:true});

 /* mobile drawer */
 var btn=$('.menu-btn'),drawer=$('#drawer'),scrim=$('.scrim'),root=document.documentElement;
 drawer.inert=true;
 function setMenu(open,focusBack){
  btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close menu':'Open menu');
  drawer.classList.toggle('open',open);scrim.classList.toggle('show',open);root.classList.toggle('lock',open);drawer.inert=!open;
  if(open){setTimeout(function(){var f=$('.drawer-close',drawer);f&&f.focus()},60)}else if(focusBack){btn.focus()}
 }
 btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true')});
 $('.drawer-close',drawer).addEventListener('click',function(){setMenu(false,true)});
 scrim.addEventListener('click',function(){setMenu(false,true)});
 $$('a',drawer).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
 window.matchMedia('(min-width:900px)').addEventListener('change',function(e){if(e.matches)setMenu(false)});

 /* active section in nav */
 var links=$$('[data-nav]'),secs=$$('main section[id]');
 if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){links.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+en.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(function(s){io.observe(s)});
 }

 /* sliders */
 $$('[data-slider]').forEach(function(s){
  var sec=s.closest('section'),track=$('.track',s),prev=$('.prev',sec),next=$('.next',sec),bar=$('.progress i',s);
  function upd(){
   var max=track.scrollWidth-track.clientWidth;sec.classList.toggle('no-scroll',max<8);
   if(prev)prev.disabled=track.scrollLeft<=4;if(next)next.disabled=track.scrollLeft>=max-4;
   var vis=track.clientWidth/track.scrollWidth,p=vis+(max>0?track.scrollLeft/max*(1-vis):0);
   bar.style.width=Math.min(100,Math.max(14,p*100))+'%';
  }
  function by(d){track.scrollBy({left:d*Math.max(track.clientWidth*.8,260),behavior:'smooth'})}
  if(prev)prev.addEventListener('click',function(){by(-1)});if(next)next.addEventListener('click',function(){by(1)});
  track.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();window.addEventListener('load',upd);
  var down=false,sx=0,sl=0,moved=false;
  track.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.target.closest('video'))return;down=true;moved=false;sx=e.clientX;sl=track.scrollLeft});
  window.addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-sx;if(Math.abs(dx)>5){moved=true;track.classList.add('drag')}if(moved)track.scrollLeft=sl-dx});
  window.addEventListener('pointerup',function(){if(down){down=false;track.classList.remove('drag')}});
  track.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
 });

 /* image viewer */
 var lb=$('#lb'),lbImg=$('img',lb),lbCap=$('figcaption',lb),list=[],idx=0;
 lb.inert=true;
 function show(i){idx=(i+list.length)%list.length;var b=list[idx];lbImg.src=b.dataset.full;lbImg.alt=b.dataset.alt||'';lbCap.textContent=b.dataset.cap||''}
 function openLb(b){list=$$('[data-zoom]',b.closest('section'));show(list.indexOf(b));lb.classList.add('open');lb.inert=false;root.classList.add('lock');$('.x',lb).focus()}
 function closeLb(){lb.classList.remove('open');lb.inert=true;root.classList.remove('lock')}
 $$('[data-zoom]').forEach(function(b){b.addEventListener('click',function(){openLb(b)})});
 $('.x',lb).addEventListener('click',function(e){e.stopPropagation();closeLb()});
 $('.pv',lb).addEventListener('click',function(e){e.stopPropagation();show(idx-1)});
 $('.nx',lb).addEventListener('click',function(e){e.stopPropagation();show(idx+1)});
 lb.addEventListener('click',closeLb);
 document.addEventListener('keydown',function(e){
  if(e.key==='Escape'){if(lb.classList.contains('open'))closeLb();else if(btn.getAttribute('aria-expanded')==='true')setMenu(false,true)}
  if(lb.classList.contains('open')){if(e.key==='ArrowLeft')show(idx-1);if(e.key==='ArrowRight')show(idx+1)}
 });

 /* one video plays at a time */
 var vids=$$('video');vids.forEach(function(v){v.addEventListener('play',function(){vids.forEach(function(o){if(o!==v)o.pause()})})});

 /* light protection for previews */
 document.addEventListener('contextmenu',function(e){if(e.target.closest('img,video'))e.preventDefault()});
 document.addEventListener('dragstart',function(e){if(e.target.tagName==='IMG')e.preventDefault()});
})();
