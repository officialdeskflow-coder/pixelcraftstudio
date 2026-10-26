(function(){
 var $=function(s,c){return (c||document).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};
 /* contact details come from config.js */
 var phone=typeof PHONE_LINK!=='undefined'?PHONE_LINK:'',shown=typeof PHONE_SHOWN!=='undefined'?PHONE_SHOWN:'',handle=typeof HANDLE!=='undefined'?HANDLE:'@pixelcraft.studio';
 function wa(msg){return 'https://wa.me/'+phone+'?text='+encodeURIComponent(msg)}
 $$('a.wa').forEach(function(a){a.href=wa(a.dataset.msg||'Hi PixelCraft Studio, I want a free sample.')});
 $$('[data-phone]').forEach(function(e){e.textContent=shown});
 $$('[data-handle]').forEach(function(e){e.textContent=handle});
 $$('a.ig').forEach(function(a){a.href='https://instagram.com/'+handle.replace('@','')});

 /* giant wordmark fits its container exactly */
 function fit(){$$('.word').forEach(function(w){w.style.fontSize='100px';var t=w.firstElementChild||w;var r=document.createRange();r.selectNodeContents(w);var width=r.getBoundingClientRect().width;var cs=getComputedStyle(w.parentElement);var box=w.parentElement.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);if(width>0)w.style.fontSize=(100*box/width)+'px'})}
 fit();window.addEventListener('resize',fit);window.addEventListener('load',fit);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);

 /* mobile drawer */
 var btn=$('.burger'),drawer=$('#drawer'),scrim=$('.scrim'),root=document.documentElement;
 drawer.inert=true;
 function setMenu(open,back){
  btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close menu':'Open menu');
  drawer.classList.toggle('open',open);scrim.classList.toggle('show',open);root.classList.toggle('lock',open);drawer.inert=!open;
  if(open){setTimeout(function(){var f=$('.dclose',drawer);f&&f.focus()},60)}else if(back){btn.focus()}
 }
 btn.addEventListener('click',function(){setMenu(btn.getAttribute('aria-expanded')!=='true')});
 $('.dclose',drawer).addEventListener('click',function(){setMenu(false,true)});
 scrim.addEventListener('click',function(){setMenu(false,true)});
 $$('a',drawer).forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
 window.matchMedia('(min-width:900px)').addEventListener('change',function(e){if(e.matches)setMenu(false)});

 /* active section in nav */
 var links=$$('[data-nav]'),secs=$$('main section[id]');
 if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){links.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+en.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(function(s){io.observe(s)});
 }

 /* show fewer items on phones */
 var small=window.matchMedia('(max-width:699px)');
 function limit(grid){var n=+grid.dataset.limit||0,open=grid.classList.contains('open'),c=0;$$(':scope > figure',grid).forEach(function(it){if(it.hidden||open||!small.matches||!n){it.classList.remove('xtra');if(!it.hidden)c++;return}c++;it.classList.toggle('xtra',c>n)})}
 /* filters */
 $$('[data-filters]').forEach(function(box){
  var grid=$(box.dataset.filters),items=$$('[data-cat]',grid),count=$('.count',box),pills=$$('.pill',box);
  function apply(cat){var n=0;items.forEach(function(it){var show=cat==='all'||it.dataset.cat===cat;it.hidden=!show;if(show)n++});if(grid.dataset.limit)limit(grid);if(count)count.textContent=n+(n===1?' ad':' ads')}
  pills.forEach(function(p){p.addEventListener('click',function(){pills.forEach(function(o){o.setAttribute('aria-pressed',o===p)});apply(p.dataset.f)})});
  apply('all');
 });

 $$('[data-limit]').forEach(function(g){limit(g);var b=$('[data-more="#'+g.id+'"]');if(b)b.addEventListener('click',function(){g.classList.toggle('open');b.textContent=g.classList.contains('open')?'Show fewer':b.dataset.label;limit(g)});if(b)b.dataset.label=b.textContent});
 small.addEventListener('change',function(){$$('[data-limit]').forEach(limit)});

 /* pack configurator */
 var opts=$$('.opt[data-pk]'),pks=$$('.pk'),cta=$('#cfgCta');
 function pick(id){opts.forEach(function(o){o.setAttribute('aria-pressed',o.dataset.pk===id)});pks.forEach(function(p){p.classList.toggle('on',p.id==='pk-'+id)});var p=$('#pk-'+id);if(cta&&p){cta.dataset.msg=p.dataset.msg;cta.href=wa(p.dataset.msg)}}
 opts.forEach(function(o){o.addEventListener('click',function(){pick(o.dataset.pk)})});
 if(opts.length)pick(opts[1]?opts[1].dataset.pk:opts[0].dataset.pk);

 /* image viewer */
 var lb=$('#lb'),lbImg=$('img',lb),lbCap=$('figcaption',lb),list=[],idx=0;
 lb.inert=true;
 function show(i){idx=(i+list.length)%list.length;var b=list[idx];lbImg.src=b.dataset.full;lbImg.alt=b.dataset.alt||'';lbCap.textContent=b.dataset.cap||''}
 function openLb(b){list=$$('[data-zoom]',b.closest('section')).filter(function(x){return !x.closest('[hidden]')});show(list.indexOf(b));lb.classList.add('open');lb.inert=false;root.classList.add('lock');$('.x',lb).focus()}
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

 /* one video at a time */
 var vids=$$('video');vids.forEach(function(v){v.addEventListener('play',function(){vids.forEach(function(o){if(o!==v)o.pause()})})});
 /* light protection for previews */
 document.addEventListener('contextmenu',function(e){if(e.target.closest('img,video'))e.preventDefault()});
 document.addEventListener('dragstart',function(e){if(e.target.tagName==='IMG')e.preventDefault()});
})();
