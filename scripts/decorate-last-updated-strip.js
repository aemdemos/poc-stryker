/** Max `.section` nodes to scan when tagging last-updated strips (CWE-770). */
const MAX_LAST_UPDATED_STRIP_SECTIONS = 120;

/**
 * Adds `last-updated` to a section that is only a single paragraph starting with
 * "Last Updated" (case-insensitive). Matches common doc footer without section metadata.
 *
 * @param {Element | null | undefined} root Main, footer block subtree, etc.
 */
export default function decorateLastUpdatedStrip(root) {
  if (!(root instanceof HTMLElement)) return;
  let n = 0;
  root.querySelectorAll('.section').forEach((section) => {
    if (n >= MAX_LAST_UPDATED_STRIP_SECTIONS) return;
    n += 1;
    if (section.classList.contains('last-updated')) return;
    const wrap = section.querySelector(':scope > .default-content-wrapper');
    if (!wrap) return;
    if (wrap.childElementCount !== 1) return;
    const p = wrap.firstElementChild;
    if (!(p instanceof HTMLParagraphElement)) return;
    if (!/^last updated\b/i.test(p.textContent.trim())) return;
    section.classList.add('last-updated');
  });
}
