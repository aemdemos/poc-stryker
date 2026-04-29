export default function decorate(block) {
  const rows = [...block.children];
  const filters = [];

  rows.forEach((row) => {
    const cells = [...row.children];
    const key = cells[0]?.textContent.trim();
    const val = cells[1]?.textContent.trim() || '';

    if (key === 'Filter') {
      filters.push({ label: val, tagPaths: '' });
    } else if (key === 'Filter tag paths' && filters.length) {
      filters[filters.length - 1].tagPaths = val;
    }
  });

  if (!filters.length) {
    block.textContent = '';
    return;
  }

  block.textContent = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  ['Filter Name', 'Options', 'Tag Paths'].forEach((h) => {
    const th = document.createElement('th');
    th.textContent = h;
    headerRow.append(th);
  });
  thead.append(headerRow);
  table.append(thead);

  const tbody = document.createElement('tbody');
  filters.forEach((f) => {
    const colonIdx = f.label.indexOf(':');
    const name = colonIdx > 0 ? f.label.substring(0, colonIdx).trim() : f.label;
    const options = colonIdx > 0 ? f.label.substring(colonIdx + 1).trim() : '';

    const pathColonIdx = f.tagPaths.indexOf(':');
    const paths = pathColonIdx > 0 ? f.tagPaths.substring(pathColonIdx + 1).trim() : f.tagPaths;

    const tr = document.createElement('tr');
    [name, options, paths].forEach((cellData) => {
      const td = document.createElement('td');
      td.textContent = cellData;
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  block.append(table);
}
