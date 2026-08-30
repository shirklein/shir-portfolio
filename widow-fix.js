document.addEventListener('DOMContentLoaded', function(){
  var NBSP = ' ';

  var selector = [
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li',
    '.tag', '.case-heading', '.case-subheading',
    '.hero-role', '.hero-tagline', '.section-label', '.project-nav__title'
  ].join(', ');

  document.querySelectorAll(selector).forEach(function(el){
    if(el.children.length) return;

    var text = el.textContent;
    var trimmed = text.replace(/\s+$/, '');
    var lastSpace = trimmed.lastIndexOf(' ');
    if(lastSpace === -1) return;

    el.textContent = trimmed.slice(0, lastSpace) + NBSP + trimmed.slice(lastSpace + 1) + text.slice(trimmed.length);
  });
});
