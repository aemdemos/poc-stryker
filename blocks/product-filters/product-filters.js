export default function decorate(block) {
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

  const section = block.closest('.section');
  if (!section) return;

  const cardsBlock = section.querySelector('.cards.product');
  if (!cardsBlock) return;

  const cards = [...cardsBlock.querySelectorAll('li')];

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
}
