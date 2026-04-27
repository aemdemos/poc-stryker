export default async function decorate(block) {
  const taxonomy = [];
  const filters = [];
  const products = [];

  // Parse what the server delivers (2-column rows that survived server-side normalization)
  const serverRows = [...block.children];
  let currentFilter = null;

  serverRows.forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim();
    const raw = cells[1]?.textContent.trim() || '';
    const value = raw.replace(/\s*\[source:.*\]$/, '');
    const sourceMatch = raw.match(/\[source:\s*(.*)\]$/);
    const source = sourceMatch ? sourceMatch[1] : '';

    if (key.startsWith('Page ')) {
      taxonomy.push({ label: key.replace('Page ', ''), value, source });
    } else if (key === 'Filter' || key.startsWith('Filter:')) {
      currentFilter = { label: value, options: '', source };
      filters.push(currentFilter);
    } else if (key === 'Options' && currentFilter) {
      currentFilter.options = value;
      currentFilter.optionsSource = source;
    } else if (key.startsWith('Filter tag paths:')) {
      if (currentFilter) {
        currentFilter.tagPaths = value;
        currentFilter.tagPathsSource = source;
      }
    } else if (key === 'Product') {
      const parts = value.split(' :: ');
      products.push({ name: parts[0] || '', pagePath: parts[1] || '', tags: parts[2] || '', source });
    }
  });

  // If taxonomy/products are missing, fetch from .plain.html (server strips them)
  if (!taxonomy.length || !products.length) {
    try {
      const resp = await fetch(`${window.location.pathname}.plain.html`);
      if (resp.ok) {
        const html = await resp.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const pfBlock = doc.querySelector('.product-filters');
        if (pfBlock) {
          [...pfBlock.children].forEach((row) => {
            const cells = [...row.children];
            const key = cells[0]?.textContent.trim();
            const raw = cells[1]?.textContent.trim() || '';
            const value = raw.replace(/\s*\[source:.*\]$/, '');
            const sourceMatch = raw.match(/\[source:\s*(.*)\]$/);
            const source = sourceMatch ? sourceMatch[1] : '';

            if (key.startsWith('Page ') && !taxonomy.some((t) => t.label === key.replace('Page ', ''))) {
              taxonomy.push({ label: key.replace('Page ', ''), value, source });
            } else if (key.startsWith('Filter tag paths:') && filters.length) {
              const last = filters[filters.length - 1];
              if (!last.tagPaths) {
                last.tagPaths = value;
                last.tagPathsSource = source;
              }
            } else if (key === 'Product') {
              const parts = value.split(' :: ');
              products.push({ name: parts[0] || '', pagePath: parts[1] || '', tags: parts[2] || '', source });
            }
          });
        }
      }
    } catch {
      // fetch failed, show what we have
    }
  }

  block.textContent = '';

  const buildTable = (headers, data) => {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach((h) => {
      const th = document.createElement('th');
      th.textContent = h;
      headerRow.append(th);
    });
    thead.append(headerRow);
    table.append(thead);

    const tbody = document.createElement('tbody');
    data.forEach((rowData) => {
      const tr = document.createElement('tr');
      rowData.forEach((cellData) => {
        const td = document.createElement('td');
        td.textContent = cellData;
        tr.append(td);
      });
      tbody.append(tr);
    });
    table.append(tbody);
    return table;
  };

  if (taxonomy.length) {
    const heading = document.createElement('h3');
    heading.textContent = 'Page Taxonomy';
    block.append(heading);
    block.append(buildTable(
      ['Property', 'Value', 'Source'],
      taxonomy.map((t) => [t.label, t.value, t.source]),
    ));
  }

  if (filters.length) {
    const heading = document.createElement('h3');
    heading.textContent = 'Filters';
    block.append(heading);
    block.append(buildTable(
      ['Filter Name', 'Options', 'Source'],
      filters.flatMap((f) => {
        const r = [[f.label, f.options, f.optionsSource || f.source]];
        if (f.tagPaths) r.push([`${f.label} (tag paths)`, f.tagPaths, f.tagPathsSource || '']);
        return r;
      }),
    ));
  }

  if (products.length) {
    const heading = document.createElement('h3');
    heading.textContent = `Product Index (${products.length})`;
    block.append(heading);
    block.append(buildTable(
      ['Product', 'Page Path', 'Tags', 'Source'],
      products.map((p) => [p.name, p.pagePath, p.tags, p.source]),
    ));
  }
}
