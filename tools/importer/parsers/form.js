/* eslint-disable */
/* global WebImporter */

/**
 * Parses the Marketo form into a simple text representation.
 * Since EDS strips HTML form elements, we output the form fields
 * as structured default content that shows labels clearly.
 * @param {Element} element - The .marketoform element
 * @param {Object} context - { document, url, params }
 */
export default function parse(element, { document }) {
  const form = element.querySelector('form[id^="mktoForm_"]');
  if (!form) return;

  const wrapper = document.createElement('div');

  // Extract each field as a paragraph with label
  const fieldWraps = form.querySelectorAll('.mktoFieldWrap');
  fieldWraps.forEach((fieldWrap) => {
    const labelEl = fieldWrap.querySelector('label');
    if (!labelEl) return;

    const labelText = labelEl.textContent.replace(/^\*/, '').trim();
    if (!labelText) return;

    const input = fieldWrap.querySelector('input:not([type="hidden"]):not([type="checkbox"]), select, textarea');
    const checkbox = fieldWrap.querySelector('.mktoCheckboxList');
    const isRequired = fieldWrap.classList.contains('mktoRequiredField');

    if (input) {
      const p = document.createElement('p');
      const text = isRequired ? `${labelText} *` : labelText;
      p.textContent = text;
      wrapper.appendChild(p);
    } else if (checkbox) {
      const checkLabel = checkbox.querySelector('label');
      if (checkLabel) {
        const p = document.createElement('p');
        p.textContent = `${checkLabel.textContent.trim()}`;
        wrapper.appendChild(p);
      }
    }
  });

  // Add submit button
  const submitBtn = form.querySelector('button[type="submit"], .mktoButton');
  if (submitBtn) {
    const p = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = submitBtn.textContent.trim();
    p.appendChild(strong);
    wrapper.appendChild(p);
  }

  element.replaceWith(wrapper);
}
