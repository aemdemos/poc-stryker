import { embedYoutubeIframeFromUrl, getBlockId } from '../../scripts/scripts.js';

/** @param {Element} col */
function columnHasYoutubeOnly(col) {
  const yt = col.querySelector('a[href*="youtube.com/watch"], a[href*="youtu.be"]');
  if (!yt || col.querySelector('picture')) return false;
  const direct = [...col.children];
  if (direct.length === 1 && direct[0].tagName === 'A') return direct[0] === yt;
  if (direct.length === 1 && direct[0].tagName === 'P') {
    const p = direct[0];
    return p.childElementCount === 1 && p.firstElementChild === yt;
  }
  return false;
}

/** @param {Element} col */
function mountDeferredYoutubeEmbed(col) {
  const link = col.querySelector('a[href*="youtube.com/watch"], a[href*="youtu.be"]');
  if (!link) return;

  col.classList.add('columns-video-col', 'columns-img-col');

  const href = link.href;
  col.replaceChildren();

  const mount = document.createElement('div');
  mount.className = 'columns-youtube-mount';
  col.append(mount);

  let loaded = false;
  const load = () => {
    if (loaded) return;
    loaded = true;
    const frame = embedYoutubeIframeFromUrl(href);
    if (frame) mount.append(frame);
  };

  if (!('IntersectionObserver' in window)) {
    load();
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    obs.disconnect();
    load();
  }, { rootMargin: '280px 0px' });

  observer.observe(mount);
}

export default function decorate(block) {
  const blockId = getBlockId('columns');
  block.setAttribute('id', blockId);
  block.setAttribute('aria-label', `columns-${blockId}`);
  block.setAttribute('role', 'region');
  block.setAttribute('aria-roledescription', 'Columns');

  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
        }
      } else if (columnHasYoutubeOnly(col)) {
        mountDeferredYoutubeEmbed(col);
      }
    });
  });
}
