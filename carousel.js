document.querySelectorAll('.video-gallery').forEach(function(gallery){
  var items = Array.from(gallery.querySelectorAll('.gallery-item'));
  var lightbox = document.querySelector('.lightbox');
  if(!lightbox || items.length === 0) return;

  var stageVideo = lightbox.querySelector('.lightbox-stage video');
  var stageSource = stageVideo.querySelector('source');
  var stageImg = lightbox.querySelector('.lightbox-stage img');
  var prevBtn = lightbox.querySelector('[data-dir="prev"]');
  var nextBtn = lightbox.querySelector('[data-dir="next"]');
  var closeBtn = lightbox.querySelector('.lightbox-close');
  var index = 0;

  if(items.length <= 1){
    if(prevBtn) prevBtn.style.display = 'none';
    if(nextBtn) nextBtn.style.display = 'none';
  }

  function show(i){
    index = i;
    var item = items[i];
    var itemVideo = item.querySelector('video');
    var itemImg = item.querySelector('img');

    if(itemVideo){
      var src = itemVideo.querySelector('source').getAttribute('src');
      var poster = itemVideo.getAttribute('poster');
      stageSource.setAttribute('src', src);
      if(poster){ stageVideo.setAttribute('poster', poster); }
      else{ stageVideo.removeAttribute('poster'); }
      stageVideo.load();
      stageVideo.play().catch(function(){});
      stageVideo.style.display = '';
      stageImg.style.display = 'none';
    } else if(itemImg){
      stageVideo.pause();
      stageVideo.style.display = 'none';
      stageImg.setAttribute('src', itemImg.getAttribute('src'));
      stageImg.setAttribute('alt', itemImg.getAttribute('alt') || '');
      stageImg.style.display = '';
    }
  }

  function open(i){
    show(i);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close(){
    lightbox.classList.remove('is-open');
    stageVideo.pause();
    document.body.style.overflow = '';
  }

  items.forEach(function(item, i){
    item.addEventListener('click', function(){ open(i); });
  });

  if(prevBtn) prevBtn.addEventListener('click', function(){ show((index - 1 + items.length) % items.length); });
  if(nextBtn) nextBtn.addEventListener('click', function(){ show((index + 1) % items.length); });
  closeBtn.addEventListener('click', close);
  lightbox.addEventListener('click', function(e){ if(e.target === lightbox) close(); });
  document.addEventListener('keydown', function(e){
    if(!lightbox.classList.contains('is-open')) return;
    if(e.key === 'Escape') close();
    if(e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
    if(e.key === 'ArrowRight' && nextBtn) nextBtn.click();
  });
});
