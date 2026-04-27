/* eslint-disable */
/* global WebImporter */

/**
 * Form parser for Stryker product pages.
 * Extracts Marketo form ID and creates a form block with a reference link.
 * Actual form JSON definitions are created separately.
 */
export default function parse(element, { document }) {
  const form = element.querySelector('form[id^="mktoForm_"]');
  const formId = form ? form.id.replace('mktoForm_', '') : 'contact';

  const formLink = document.createElement('a');
  formLink.href = `/forms/${formId}`;
  formLink.textContent = `/forms/${formId}`;

  const cells = [[formLink]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
