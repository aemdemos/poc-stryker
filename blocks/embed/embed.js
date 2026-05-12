/*
 * Embed Block
 * Show videos and social posts directly on your page
 * https://www.hlx.live/developer/block-collection/embed
 */
import { DOMPURIFY } from '../../scripts/aem.js';
import { createYoutubeIframeWrapper, createVimeoIframeWrapper } from '../../scripts/utils.js';

const loadScript = (url, callback, type) => {
  const head = document.querySelector('head');
  const script = document.createElement('script');
  script.src = url;
  if (type) {
    script.setAttribute('type', type);
  }
  script.onload = callback;
  head.append(script);
  return script;
};

/* Add iframe wrapper to the embed */
const getDefaultEmbed = (url) => `<div class="iframe-wrapper">
    <iframe src="${url.href}" allowfullscreen=""
      scrolling="no" allow="encrypted-media" title="Content from ${url.hostname}" loading="lazy">
    </iframe>
  </div>`;

const embedTwitter = (url) => {
  if (!url.href.startsWith('https://twitter.com')) {
    url.href = url.href.replace('https://x.com', 'https://twitter.com');
  }
  const embedHTML = `<blockquote class="twitter-tweet"><a href="${url.href}"></a></blockquote>`;
  loadScript('https://platform.twitter.com/widgets.js');
  return embedHTML;
};

const loadEmbed = (block, link, autoplay) => {
  if (block.classList.contains('embed-is-loaded')) {
    return;
  }

  const url = new URL(link);
  const isYoutube = link.includes('youtube') || link.includes('youtu.be');
  const isVimeo = link.includes('vimeo');
  const isTwitter = link.includes('twitter') || link.includes('x.com');

  if (isYoutube) {
    block.textContent = '';
    block.append(createYoutubeIframeWrapper(url, autoplay, false));
    block.className = 'block embed embed-youtube';
    block.classList.add('embed-is-loaded');
    return;
  }

  if (isVimeo) {
    block.textContent = '';
    block.append(createVimeoIframeWrapper(url, autoplay, false));
    block.className = 'block embed embed-vimeo';
    block.classList.add('embed-is-loaded');
    return;
  }

  if (isTwitter) {
    const embedHtml = embedTwitter(url);
    block.innerHTML = (window.DOMPurify?.sanitize(embedHtml, DOMPURIFY))
      ?? embedHtml;
    block.classList = 'block embed embed-twitter';
    block.classList.add('embed-is-loaded');
    return;
  }

  const defaultHtml = getDefaultEmbed(url);
  block.innerHTML = (window.DOMPurify?.sanitize(defaultHtml, DOMPURIFY))
    ?? defaultHtml;
  block.className = 'block embed';
  block.classList.add('embed-is-loaded');
};

export default function decorate(block) {
  const placeholder = block.querySelector('picture');
  const link = block.querySelector('a').href;
  block.textContent = '';

  if (placeholder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'embed-placeholder';
    const placeholderHtml = '<div class="embed-placeholder-play"><button type="button" title="Play"></button></div>';
    wrapper.innerHTML = (window.DOMPurify?.sanitize(placeholderHtml, DOMPURIFY))
      ?? placeholderHtml;
    wrapper.prepend(placeholder);
    wrapper.addEventListener('click', () => {
      loadEmbed(block, link, true);
    });
    block.append(wrapper);
  } else {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        observer.disconnect();
        loadEmbed(block, link);
      }
    });
    observer.observe(block);
  }
}
