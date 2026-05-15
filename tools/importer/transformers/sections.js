/* eslint-disable */
/* global WebImporter */

export default function transform(hookName, element, payload) {
  if (hookName !== 'afterTransform') return;

  const { document } = payload;
  const main = element;

  // After parsers run, blocks become tables. Insert <hr> between each top-level
  // table (block) and any sibling content groups to create section breaks.
  const tables = main.querySelectorAll(':scope > div > table, :scope table');

  // Collect all block tables in document order
  const blockTables = [];
  const walk = (node) => {
    if (node.tagName === 'TABLE') {
      blockTables.push(node);
      return;
    }
    if (node.children) {
      Array.from(node.children).forEach(walk);
    }
  };

  // Walk only direct children of main to find top-level tables
  Array.from(main.children).forEach((child) => {
    if (child.tagName === 'TABLE') {
      blockTables.push(child);
    } else {
      child.querySelectorAll('table').forEach((t) => blockTables.push(t));
    }
  });

  // Insert hr before each block table (except the first and Metadata table)
  let first = true;
  blockTables.forEach((table) => {
    // Skip the Metadata table (it's always last and separated by its own hr)
    const firstCell = table.querySelector('tr td, tr th');
    if (firstCell && firstCell.textContent.trim().toLowerCase() === 'metadata') return;

    if (first) {
      first = false;
      return;
    }

    const hr = document.createElement('hr');
    table.parentNode.insertBefore(hr, table);
  });
}
