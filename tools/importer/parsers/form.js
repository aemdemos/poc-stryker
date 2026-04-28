/* eslint-disable */
/* global WebImporter */

/**
 * Parser for Marketo form blocks.
 * Reusable across Stryker pages with .marketoform containers.
 * Selectors: .marketoform
 *
 * Extracts the Marketo form ID from the embedded form element (id="mktoForm_{id}")
 * and creates a Form block referencing it. The block decoration can later load
 * the Marketo embed script using this ID.
 *
 * Structure: .marketoform > .c-marketo-form > .marketo-form-content > form.mktoForm
 */
export default function parse(element, { document }) {
  const form = element.querySelector('form[id^="mktoForm_"]');
  if (!form) return;

  const formId = form.id.replace('mktoForm_', '');
  if (!formId) return;

  const p = document.createElement('p');
  p.textContent = `marketo-form-id: ${formId}`;

  const cells = [[p]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'form', cells });
  element.replaceWith(block);
}
