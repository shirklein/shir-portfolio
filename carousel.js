document.querySelectorAll('.frame-row:not(.frame-row--static)').forEach(function(row){
  var imgs = Array.from(row.querySelectorAll('img'));
  if(imgs.length < 2) return;

  var original = imgs.map(function(img){ return img.getAttribute('src'); });
  var offset = 0;
  var timer = null;

  function apply(){
    offset = (offset + 1) % original.length;
    imgs.forEach(function(img, i){
      img.src = original[(i + offset) % original.length];
    });
  }

  function reset(){
    offset = 0;
    imgs.forEach(function(img, i){ img.src = original[i]; });
  }

  row.addEventListener('mouseenter', function(){
    if(timer) return;
    timer = setInterval(apply, 180);
  });
  row.addEventListener('mouseleave', function(){
    clearInterval(timer);
    timer = null;
    reset();
  });
});

document.querySelectorAll('.gallery-item:not(.gallery-item--sound)').forEach(function(item){
  var video = item.querySelector('video');
  if(!video || video.hasAttribute('autoplay')) return;

  item.addEventListener('mouseenter', function(){
    video.play().catch(function(){});
  });
  item.addEventListener('mouseleave', function(){
    video.pause();
    video.currentTime = 0;
  });
});

document.querySelectorAll('.video-gallery--hover-play video[autoplay]').forEach(function(video){
  var item = video.closest('.gallery-item');
  video.pause();
  video.currentTime = 0;
  if(!item) return;

  item.addEventListener('mouseenter', function(){
    video.play().catch(function(){});
  });
  item.addEventListener('mouseleave', function(){
    video.pause();
    video.currentTime = 0;
  });
});

document.querySelectorAll('.sound-toggle').forEach(function(toggle){
  var item = toggle.closest('.gallery-item');
  var video = item ? item.querySelector('video') : null;
  var iconMuted = toggle.querySelector('.icon-muted');
  var iconUnmuted = toggle.querySelector('.icon-unmuted');
  if(!video) return;

  function setMuted(muted){
    video.muted = muted;
    toggle.setAttribute('aria-pressed', String(!muted));
    toggle.setAttribute('aria-label', muted ? 'Play with sound' : 'Mute sound');
    iconMuted.style.display = muted ? '' : 'none';
    iconUnmuted.style.display = muted ? 'none' : '';
  }
  video._setMuted = setMuted;

  function toggleSound(e){
    e.stopPropagation();
    e.preventDefault();
    setMuted(!video.muted);
  }

  toggle.addEventListener('click', toggleSound);
  toggle.addEventListener('keydown', function(e){
    if(e.key === 'Enter' || e.key === ' '){
      toggleSound(e);
    }
  });
});

document.querySelectorAll('.gallery-item--sound video[autoplay]').forEach(function(video){
  var item = video.closest('.gallery-item--sound');
  if(!item || !item.parentElement) return;
  var siblings = Array.from(item.parentElement.children).filter(function(el){
    return el !== item && el.classList.contains('gallery-item--sound');
  });
  if(siblings.length === 0) return;

  item.addEventListener('mouseenter', function(){
    siblings.forEach(function(sib){
      var sibVideo = sib.querySelector('video');
      if(sibVideo) sibVideo.pause();
    });
  });
  item.addEventListener('mouseleave', function(){
    siblings.forEach(function(sib){
      var sibVideo = sib.querySelector('video');
      if(sibVideo) sibVideo.play().catch(function(){});
    });
  });
});

document.querySelectorAll('video.project-nav__thumb').forEach(function(video){
  var link = video.closest('.project-nav__link');
  if(!link) return;

  link.addEventListener('mouseenter', function(){
    video.play().catch(function(){});
  });
  link.addEventListener('mouseleave', function(){
    video.pause();
    video.currentTime = 0;
  });
});

var allGalleryVideos = Array.from(document.querySelectorAll('.video-gallery video'));

document.querySelectorAll('.video-gallery').forEach(function(gallery){
  var allItems = Array.from(gallery.querySelectorAll('.gallery-item:not(.gallery-item--static)'));

  // Video items play inline, in place, instead of opening the lightbox.
  allItems.forEach(function(item){
    var itemVideo = item.querySelector('video');
    if(!itemVideo) return;

    item.addEventListener('click', function(){
      if(itemVideo.paused || itemVideo.ended){
        allGalleryVideos.forEach(function(v){ if(v !== itemVideo) v.pause(); });
        itemVideo.dataset.pausedByScroll = '';
        if(typeof itemVideo._setMuted === 'function'){ itemVideo._setMuted(false); }
        else { itemVideo.muted = false; }
        itemVideo.play().catch(function(){});
      } else {
        itemVideo.pause();
      }
    });
    itemVideo.addEventListener('play', function(){ item.classList.add('is-playing'); });
    itemVideo.addEventListener('pause', function(){ item.classList.remove('is-playing'); });
  });

  // Image items still open in the lightbox for a larger view.
  var items = allItems.filter(function(item){ return !item.querySelector('video'); });
  var lightbox = document.querySelector('.lightbox');
  if(!lightbox || items.length === 0) return;

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
    var itemImg = items[i].querySelector('img');
    stageImg.setAttribute('src', itemImg.getAttribute('src'));
    stageImg.setAttribute('alt', itemImg.getAttribute('alt') || '');
  }

  function open(i){
    show(i);
    lightbox.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function close(){
    lightbox.classList.remove('is-open');
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

// A video only keeps playing while at least half of it is on screen;
// scrolling more than half of it out of view pauses it, and it resumes
// once back in view — but only if it was this observer that paused it,
// not if the viewer paused it on purpose.
if('IntersectionObserver' in window){
  var scrollObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var video = entry.target;
      if(entry.intersectionRatio < 0.5){
        if(!video.paused){
          video.dataset.pausedByScroll = 'true';
          video.pause();
        }
      } else if(video.dataset.pausedByScroll === 'true'){
        video.dataset.pausedByScroll = '';
        video.play().catch(function(){});
      }
    });
  }, { threshold: [0, 0.5, 1] });

  document.querySelectorAll('.video-gallery video').forEach(function(video){
    scrollObserver.observe(video);
    // A video (e.g. one whose autoplay only kicks in after the observer's
    // first check) can start playing without a new intersection change —
    // re-observing forces a fresh visibility check whenever it starts.
    video.addEventListener('play', function(){
      scrollObserver.unobserve(video);
      scrollObserver.observe(video);
    });
  });
}
