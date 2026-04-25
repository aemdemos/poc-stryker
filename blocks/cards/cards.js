import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation, getBlockId } from '../../scripts/scripts.js';
import { createCard } from '../card/card.js';

export default function decorate(block) {
  const blockId = getBlockId('cards');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `Cards for ${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Cards');

  /* change to ul, li */
  const ul = document.createElement('ul');
  // eslint-disable-next-line no-console
  console.log('[cards] rows:', block.children.length, 'first row children:', block.firstElementChild?.children.length, 'variant:', block.classList.toString());
  [...block.children].forEach((row) => {
    // eslint-disable-next-line no-console
    console.log('[cards] row children:', [...row.children].map((c) => `${c.tagName}(${c.children.length}): ${c.textContent.trim().substring(0, 60)}`));
    ul.append(createCard(row));
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.textContent = '';
  block.append(ul);
}
