document.querySelectorAll('[data-carousel]').forEach(function(carousel){
  var section = carousel.closest('.project-section');
  var slides = carousel.querySelectorAll('.slide');
  var counter = section.querySelector('.counter');
  var prevBtn = section.querySelector('[data-dir="prev"]');
  var nextBtn = section.querySelector('[data-dir="next"]');
  var index = 0;

  if(!prevBtn || !nextBtn) return;

  function show(i){
    slides.forEach(function(slide, si){
      var active = si === i;
      slide.classList.toggle('is-active', active);
      var video = slide.querySelector('video');
      if(video && !active) video.pause();
    });
    counter.textContent = (i + 1) + ' / ' + slides.length;
    index = i;
  }

  prevBtn.addEventListener('click', function(){
    show((index - 1 + slides.length) % slides.length);
  });
  nextBtn.addEventListener('click', function(){
    show((index + 1) % slides.length);
  });
});
