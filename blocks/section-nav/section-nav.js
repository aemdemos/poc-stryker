export default async function decorate(block) {
  const links = [...block.querySelectorAll('a')];
  if (!links.length) return;

  const nav = document.createElement('nav');
  nav.className = 'section-nav-links';
  nav.setAttribute('aria-label', 'Section navigation');

  const ul = document.createElement('ul');
  links.forEach((link) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent;
    li.append(a);
    ul.append(li);
  });
  nav.append(ul);

  block.textContent = '';
  block.append(nav);

  const anchors = [...nav.querySelectorAll('a[href^="#"]')];
  const targets = anchors
    .map((a) => {
      const id = a.getAttribute('href').slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const { id } = entry.target;
        anchors.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-80px 0px -80% 0px', threshold: 0 },
  );

  targets.forEach((t) => observer.observe(t));

  anchors.forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}
