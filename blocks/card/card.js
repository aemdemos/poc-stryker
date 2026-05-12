import { moveInstrumentation, embedYoutubeIframeFromUrl } from '../../scripts/scripts.js';

/**
 * Builds a single card (li) from a block row: moves content into the li and applies
 * cards-card-image / cards-card-body classes to its children.
 * @param {Element} row - A direct child of the cards block (author row)
 * @returns {Element} The card li element
 */
/* eslint-disable import/prefer-default-export */
export function createCard(row) {
  const li = document.createElement('li');
  moveInstrumentation(row, li);
  while (row.firstElementChild) li.append(row.firstElementChild);
  [...li.children].forEach((div) => {
    if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
    else div.className = 'cards-card-body';
  });
  return li;
}

/**
 * Hoists first YouTube link in a flattened TEACH-cards row into `.cards-card-image` with iframe embed.
 * @param {Element} li - Card `<li>`
 */
export function normalizeCardYoutubeMedia(li) {
  if (li.querySelector('.cards-card-image')) return;
  const body = li.querySelector(':scope > .cards-card-body');
  if (!body) return;
  const ytLink = body.querySelector('a[href*="youtube.com/watch"], a[href*="youtu.be"]');
  if (!ytLink) return;
  const holder = ytLink.closest('p') ?? ytLink;
  const iframeWrapper = embedYoutubeIframeFromUrl(ytLink.href);
  if (!iframeWrapper) return;

  const media = document.createElement('div');
  media.className = 'cards-card-image';
  media.append(iframeWrapper);
  holder.remove();
  body.before(media);
}
