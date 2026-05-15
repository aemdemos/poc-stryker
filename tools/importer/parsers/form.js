/* eslint-disable */
/* global WebImporter */

/**
 * Parses the Marketo form into a contact-form block table.
 * Extracts field labels, types, and select options.
 * @param {Element} element - The .marketoform element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const form = element.querySelector('form[id^="mktoForm_"]');
  if (!form) return;

  const cells = [['Contact Form']];

  const fieldWraps = form.querySelectorAll('.mktoFieldWrap');
  fieldWraps.forEach((fieldWrap) => {
    const labelEl = fieldWrap.querySelector('label');
    if (!labelEl) return;

    const labelText = labelEl.textContent.replace(/^\*/, '').trim();
    if (!labelText) return;

    const input = fieldWrap.querySelector('input:not([type="hidden"]):not([type="checkbox"]), select, textarea');
    const checkbox = fieldWrap.querySelector('.mktoCheckboxList');
    const isRequired = fieldWrap.classList.contains('mktoRequiredField');
    const fieldLabel = isRequired ? `${labelText} *` : labelText;

    if (input) {
      let fieldType = 'text';
      if (input.tagName === 'SELECT') fieldType = 'select';
      else if (input.tagName === 'TEXTAREA') fieldType = 'textarea';
      else if (input.type === 'email') fieldType = 'email';

      // For select fields, encode options with pipe delimiter in the type cell
      let typeValue = fieldType;
      if (input.tagName === 'SELECT') {
        const options = [...input.querySelectorAll('option')]
          .filter((opt) => opt.value && !opt.disabled)
          .map((opt) => opt.textContent.trim());
        if (options.length > 0) typeValue = `${fieldType}|${options.join(',')}`;
      }

      cells.push([fieldLabel, typeValue]);
    } else if (checkbox) {
      const checkLabel = checkbox.querySelector('label');
      if (checkLabel) {
        cells.push([`${checkLabel.textContent.trim()} *`, 'checkbox']);
      }
    }
  });

  // Submit button
  const submitBtn = form.querySelector('button[type="submit"], .mktoButton');
  if (submitBtn) {
    cells.push([submitBtn.textContent.trim(), 'submit']);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
