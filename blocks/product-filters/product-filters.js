export default async function decorate(block) {
  const rows = [...block.children];
  const filters = [];

  for (let i = 0; i < rows.length; i += 1) {
    const cells = [...rows[i].children];
    const key = cells[0]?.textContent.trim().toLowerCase();
    const val = cells[1]?.textContent.trim();

    if (key === 'filter') {
      filters.push({ label: val, options: [] });
    } else if (key === 'options' && filters.length > 0) {
      filters[filters.length - 1].options = val.split(',').map((o) => o.trim()).filter(Boolean);
    }
  }

  if (!filters.length) return;

  block.textContent = '';

  const wrapper = document.createElement('div');
  wrapper.classList.add('product-filters-bar');

  filters.forEach((filter) => {
    const group = document.createElement('div');
    group.classList.add('product-filters-group');

    const label = document.createElement('label');
    label.textContent = filter.label;
    label.setAttribute('for', `filter-${filter.label.toLowerCase().replace(/\s+/g, '-')}`);
    group.append(label);

    const select = document.createElement('select');
    select.id = `filter-${filter.label.toLowerCase().replace(/\s+/g, '-')}`;
    select.dataset.filter = filter.label;

    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.textContent = 'Show All';
    select.append(allOpt);

    filter.options.forEach((opt) => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      select.append(option);
    });

    group.append(select);
    wrapper.append(group);
  });

  block.append(wrapper);

  // Build href→tags map from .plain.html (server-side pipeline strips tag data from links)
  const tagsByHref = new Map();
  try {
    const resp = await fetch(`${window.location.pathname}.plain.html`);
    if (resp.ok) {
      const html = await resp.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      doc.querySelectorAll('.cards.product a[href*="#tags="]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        const hashIdx = href.indexOf('#tags=');
        const cleanHref = href.substring(0, hashIdx).replace(/\.html$/, '');
        try {
          tagsByHref.set(cleanHref, decodeURIComponent(href.substring(hashIdx + 6)));
        } catch {
          // malformed
        }
      });
    }
  } catch {
    // fetch failed, filtering disabled
  }

  if (!tagsByHref.size) return;

  const section = block.closest('.section');
  if (!section) return;

  // Defer until after the section finishes loading all blocks
  const observer = new MutationObserver(() => {
    const cardsBlock = section.querySelector('.cards.product[data-block-status="loaded"]');
    if (!cardsBlock) return;
    observer.disconnect();

    const cards = [...cardsBlock.querySelectorAll('li')];
    cards.forEach((card) => {
      const anchor = card.querySelector('a[href]');
      if (!anchor) return;
      const href = anchor.getAttribute('href').replace(/\.html$/, '');
      const tags = tagsByHref.get(href);
      if (tags) card.dataset.tags = tags;
    });

    wrapper.addEventListener('change', () => {
      const activeFilters = [...wrapper.querySelectorAll('select')].map((s) => ({
        label: s.dataset.filter,
        value: s.value,
      }));

      cards.forEach((card) => {
        const tagData = card.dataset.tags ? JSON.parse(card.dataset.tags) : {};
        const visible = activeFilters.every((f) => {
          if (f.value === 'all') return true;
          const cardValues = tagData[f.label] || [];
          return cardValues.includes(f.value);
        });
        card.style.display = visible ? '' : 'none';
      });
    });
  });

  observer.observe(section, { attributes: true, subtree: true, attributeFilter: ['data-block-status'] });
}
