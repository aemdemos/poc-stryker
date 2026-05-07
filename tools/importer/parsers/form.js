/* eslint-disable */
/* global WebImporter */

/**
 * Parses the Marketo form into an EDS Form block.
 * Creates a Form block with a link to the form JSON definition and a submit endpoint.
 * @param {Element} element - The .marketoform element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document, url, params }) {
  // Determine the form JSON path based on the page path
  const originalURL = (params && params.originalURL) || url || 'https://www.stryker.com/us/en/sage/products/sage-air-pump.html';
  const pageUrl = new URL(originalURL);
  const pagePath = pageUrl.pathname.replace(/\.html$/, '').replace(/\/$/, '');
  const formJsonPath = `${pagePath}-form.json`;

  // Extract submit URL from the Marketo form
  const formContainer = element.querySelector('[data-marketo-form-id]');
  const baseUrl = formContainer ? formContainer.getAttribute('data-marketo-base-url') : '//lp.stryker.com';
  const munchkinId = formContainer ? formContainer.getAttribute('data-marketo-munchkin-id') : '338-WAP-571';
  const formId = formContainer ? formContainer.getAttribute('data-marketo-form-id') : '2327';
  const submitUrl = `https:${baseUrl}/form/${munchkinId}/${formId}`;

  // Create links for the form block
  const formLink = document.createElement('a');
  formLink.href = formJsonPath;
  formLink.textContent = formJsonPath;

  const submitLink = document.createElement('a');
  submitLink.href = submitUrl;
  submitLink.textContent = submitUrl;

  const contentCell = document.createElement('div');
  const p1 = document.createElement('p');
  p1.appendChild(formLink);
  contentCell.appendChild(p1);
  const p2 = document.createElement('p');
  p2.appendChild(submitLink);
  contentCell.appendChild(p2);

  const cells = [
    ['Form'],
    [contentCell],
  ];

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
