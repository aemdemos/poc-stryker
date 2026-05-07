function createLabel(cleanLabel, required) {
  const labelEl = document.createElement('label');
  labelEl.textContent = cleanLabel;
  if (required) labelEl.dataset.required = true;
  return labelEl;
}

function createSubmitField(cleanLabel) {
  const button = document.createElement('button');
  button.type = 'submit';
  button.textContent = cleanLabel;
  button.className = 'button';
  return button;
}

function createCheckboxField(cleanLabel, required) {
  const labelEl = document.createElement('label');
  const input = document.createElement('input');
  input.type = 'checkbox';
  if (required) input.required = true;
  labelEl.appendChild(input);
  labelEl.appendChild(document.createTextNode(` ${cleanLabel}`));
  return labelEl;
}

function createSelectField(cleanLabel, required) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createLabel(cleanLabel, required));
  const select = document.createElement('select');
  if (required) select.required = true;
  const opt = document.createElement('option');
  opt.value = '';
  opt.textContent = 'Select...';
  opt.disabled = true;
  opt.selected = true;
  select.appendChild(opt);
  fragment.appendChild(select);
  return fragment;
}

function createTextareaField(cleanLabel, required) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createLabel(cleanLabel, required));
  const textarea = document.createElement('textarea');
  textarea.placeholder = cleanLabel;
  textarea.rows = 4;
  if (required) textarea.required = true;
  fragment.appendChild(textarea);
  return fragment;
}

function createInputField(cleanLabel, required, type) {
  const fragment = document.createDocumentFragment();
  fragment.appendChild(createLabel(cleanLabel, required));
  const input = document.createElement('input');
  input.type = type === 'email' ? 'email' : 'text';
  input.placeholder = cleanLabel;
  if (required) input.required = true;
  fragment.appendChild(input);
  return fragment;
}

export default function decorate(block) {
  const rows = [...block.children];
  const form = document.createElement('form');

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const label = cells[0].textContent.trim();
    const type = cells[1].textContent.trim().toLowerCase();
    const required = label.endsWith('*');
    const cleanLabel = required ? label.slice(0, -1).trim() : label;

    const fieldWrapper = document.createElement('div');
    fieldWrapper.className = 'field-wrapper';

    if (type === 'submit') fieldWrapper.appendChild(createSubmitField(cleanLabel));
    else if (type === 'checkbox') fieldWrapper.appendChild(createCheckboxField(cleanLabel, required));
    else if (type === 'select') fieldWrapper.appendChild(createSelectField(cleanLabel, required));
    else if (type === 'textarea') fieldWrapper.appendChild(createTextareaField(cleanLabel, required));
    else fieldWrapper.appendChild(createInputField(cleanLabel, required, type));

    form.appendChild(fieldWrapper);
  });

  block.textContent = '';
  block.appendChild(form);
}
