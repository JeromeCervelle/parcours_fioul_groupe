/* Parcours Fioul Groupé — script partagé des pages de parcours
   Thème clair/sombre, menu mobile, et surlignage de l'étape courante. */
(function(){
  var root=document.documentElement;

  // --- thème ---
  var btn=document.getElementById('theme');
  try{var saved=localStorage.getItem('fg-theme'); if(saved) root.setAttribute('data-theme',saved);}catch(e){}
  if(btn) btn.addEventListener('click',function(){
    var cur=root.getAttribute('data-theme');
    var next = cur==='dark' ? 'light' : (cur==='light' ? 'dark' :
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark'));
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('fg-theme',next);}catch(e){}
  });

  // --- menu mobile ---
  var burger=document.getElementById('burger'), nav=document.getElementById('nav');
  if(burger&&nav){
    burger.addEventListener('click',function(){
      var open=nav.classList.toggle('open'); burger.setAttribute('aria-expanded',open);
    });
    nav.addEventListener('click',function(e){ if(e.target.tagName==='A') nav.classList.remove('open'); });
  }

  // --- surlignage de l'étape courante dans la barre d'étapes ---
  var bar=document.getElementById('stepnav');
  if(bar && 'IntersectionObserver' in window){
    var links=[].slice.call(bar.querySelectorAll('a')), map={};
    links.forEach(function(a){var id=a.getAttribute('href').slice(1),el=document.getElementById(id); if(el) map[id]=a;});
    var obs=new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(en.isIntersecting){
          links.forEach(function(a){a.classList.remove('on')});
          var a=map[en.target.id]; if(a){ a.classList.add('on'); a.scrollIntoView({block:'nearest',inline:'center'}); }
        }
      });
    },{rootMargin:'-25% 0px -60% 0px'});
    Object.keys(map).forEach(function(id){obs.observe(document.getElementById(id))});
  }
})();
