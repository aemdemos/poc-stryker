export default function decorate(block) {
  const rows = [...block.children];
  const taxonomy = [];
  const filters = [];
  const products = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim();
    const val = cells[1]?.textContent.trim();
    const src = cells[2]?.textContent.trim() || '';

    if (key.startsWith('Page ')) {
      taxonomy.push({ label: key.replace('Page ', ''), value: val, source: src });
    } else if (key.startsWith('Filter:')) {
      filters.push({ label: key.replace('Filter: ', ''), options: val, source: src });
    } else if (key.startsWith('Filter tag paths:')) {
      const last = filters[filters.length - 1];
      if (last) last.tagPaths = val;
    } else if (key === 'Product') {
      const parts = val.split(' :: ');
      products.push({
        name: parts[0] || '',
        pagePath: parts[1] || '',
        tags: parts[2] || '',
        source: src,
      });
    }
  });

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
        const rows2 = [[f.label, f.options, f.source]];
        if (f.tagPaths) rows2.push([`${f.label} (tag paths)`, f.tagPaths, 'JCR tag paths from <option> values']);
        return rows2;
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
