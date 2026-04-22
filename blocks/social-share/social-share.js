/**
 * Social Share Block
 * Renders social sharing links as a horizontal row of icon buttons.
 *
 * Content model (each row = one platform):
 *   | Platform name | Share URL |
 *
 * The block reads platform names and URLs from authored content.
 * No text, links, or images are hardcoded.
 * @param {Element} block
 */
export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const cells = [...row.children];
    if (cells.length < 2) return;

    const platform = cells[0].textContent.trim().toLowerCase().replace(/\s+/g, '-');
    const link = cells[1].querySelector('a') || cells[1];
    const url = link.href || cells[1].textContent.trim();

    row.innerHTML = '';
    row.className = `social-share-item social-share-${platform}`;

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.title = cells[0].textContent.trim();
    anchor.setAttribute('aria-label', `Share via ${cells[0].textContent.trim()}`);

    if (platform !== 'copy-link') {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    } else {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        navigator.clipboard.writeText(window.location.href);
      });
    }

    const icon = document.createElement('span');
    icon.className = `icon icon-${platform}`;
    anchor.append(icon);
    row.append(anchor);
  });
}
