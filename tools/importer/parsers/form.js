/* eslint-disable */
/* global WebImporter */

/**
 * Parses the Marketo form into an EDS Form block.
 * Extracts the form ID, field labels, types, and required status.
 * @param {Element} element - The .marketoform element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const form = element.querySelector('form[id^="mktoForm_"]');
  const formId = form ? form.id.replace('mktoForm_', '') : '';

  const formContainer = element.querySelector('[data-marketo-form-id]');
  const munchkinId = formContainer ? formContainer.getAttribute('data-marketo-munchkin-id') : '';

  // Build header row with form identifier
  const cells = [['Form']];

  // Add form ID row
  const idCell = document.createElement('div');
  const idP = document.createElement('p');
  idP.textContent = `Form ID: ${formId}`;
  idCell.appendChild(idP);
  if (munchkinId) {
    const mP = document.createElement('p');
    mP.textContent = `Munchkin ID: ${munchkinId}`;
    idCell.appendChild(mP);
  }
  cells.push(['Configuration', idCell]);

  // Extract fields with labels and types
  if (form) {
    const fieldWraps = form.querySelectorAll('.mktoFieldWrap');
    fieldWraps.forEach((fieldWrap) => {
      const label = fieldWrap.querySelector('label');
      if (!label) return;

      const labelText = label.textContent.replace(/^\*/, '').trim();
      if (!labelText) return;

      const input = fieldWrap.querySelector('input:not([type="hidden"]):not([type="checkbox"]), select, textarea');
      const checkbox = fieldWrap.querySelector('.mktoCheckboxList');
      const isRequired = fieldWrap.classList.contains('mktoRequiredField');

      let fieldType = 'text';
      if (input) {
        if (input.tagName === 'SELECT') fieldType = 'select';
        else if (input.tagName === 'TEXTAREA') fieldType = 'textarea';
        else if (input.type === 'email') fieldType = 'email';
        else fieldType = input.type || 'text';
      } else if (checkbox) {
        fieldType = 'checkbox';
        // Get checkbox label text
        const checkLabel = checkbox.querySelector('label');
        if (checkLabel) {
          const checkText = checkLabel.textContent.trim();
          const fieldInfo = `${labelText}: ${checkText}`;
          const req = isRequired ? ' *' : '';
          cells.push([`${fieldInfo}${req}`, fieldType]);
          return;
        }
      }

      const req = isRequired ? ' *' : '';
      cells.push([`${labelText}${req}`, fieldType]);
    });
  }

  // Add submit button row
  const submitBtn = form ? form.querySelector('button[type="submit"], .mktoButton') : null;
  if (submitBtn) {
    cells.push(['Submit', submitBtn.textContent.trim()]);
  }

  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
