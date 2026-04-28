export default function decorate(block) {
  const links = block.querySelectorAll('a');
  if (links.length < 2) {
    block.closest('.section')?.remove();
    return;
  }

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Page sections');

  links.forEach((link) => {
    nav.append(link);
  });

  block.textContent = '';
  block.append(nav);

  const section = block.closest('.section');
  let stuck = false;
  let placeholder = null;

  function onScroll() {
    const rect = (stuck ? placeholder : section).getBoundingClientRect();
    if (!stuck && rect.top <= 0) {
      stuck = true;
      placeholder = document.createElement('div');
      placeholder.style.height = `${section.offsetHeight}px`;
      section.before(placeholder);
      section.classList.add('sticky');
    } else if (stuck && placeholder.getBoundingClientRect().top > 0) {
      stuck = false;
      placeholder.remove();
      placeholder = null;
      section.classList.remove('sticky');
    }
  }

  function updateActive() {
    const ids = [...links].map((l) => l.getAttribute('href')?.slice(1)).filter(Boolean);
    let current = null;
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) current = id;
    });
    links.forEach((l) => {
      l.classList.toggle('active', l.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', () => {
    onScroll();
    updateActive();
  }, { passive: true });
}
