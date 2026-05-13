import { decorateIcons, getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function getDirectTextContent(menuItem) {
  const menuLink = menuItem.querySelector(':scope > :where(a,p)');
  if (menuLink) {
    return menuLink.textContent.trim();
  }
  return Array.from(menuItem.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE)
    .map((n) => n.textContent)
    .join(' ');
}

const MAX_BREADCRUMB_DEPTH = 20;

const MASTHEAD_SEARCH_INPUT_ID = 'masthead-site-search-q';

/** Matches stryker.com header `<form>`; override via page metadata `nav-search-url`. */
const DEFAULT_STRYKER_SEARCH_ACTION = 'https://www.stryker.com/us/en/search.html';

function mastheadSearchActionHref() {
  const raw = String(getMetadata('nav-search-url') || '').trim();
  if (!raw) return DEFAULT_STRYKER_SEARCH_ACTION;
  try {
    return new URL(raw, window.location.href).href;
  } catch {
    return DEFAULT_STRYKER_SEARCH_ACTION;
  }
}

/** @param {string} ariaMeta @param {string} labelText @param {string} placeholderMeta */
function readableSearchAria(ariaMeta, labelText, placeholderMeta) {
  const aria = String(ariaMeta || '').trim();
  if (aria) return aria;
  const label = String(labelText || '').trim();
  if (label) return label;
  const ph = String(placeholderMeta || '').trim();
  if (ph) return ph;
  return 'Site search';
}

/**
 * Mirrors source masthead globe before the trailing locale/language utility `<li>`.
 *
 * @param {Element | null} navBrand
 */
function prependGlobeIconToUtilityLocale(navBrand) {
  if (!(navBrand instanceof HTMLElement)) return;
  const ul = navBrand.querySelector(':scope .default-content-wrapper > ul');
  if (!ul) return;
  const lastLi = ul.querySelector(':scope > li:last-child');
  if (!(lastLi instanceof HTMLElement)) return;
  const anchor = lastLi.querySelector(':scope > a');
  const target = anchor || lastLi;
  if (target.querySelector(':scope > .icon-globe')) return;
  const globeSpan = document.createElement('span');
  globeSpan.className = 'icon icon-globe';
  globeSpan.setAttribute('aria-hidden', 'true');
  target.insertBefore(globeSpan, target.firstChild);
}

/**
 * GET search form (`name="q"`). Authors can omit; metadata keys optional — see AGENTS/nav docs.
 *
 * @param {Element | null} navBrand
 */
function ensureMastheadSearch(navBrand) {
  if (!(navBrand instanceof HTMLElement)) return;
  const wrapper = navBrand.querySelector(':scope > .default-content-wrapper');
  if (!(wrapper instanceof HTMLElement)) return;
  if (wrapper.querySelector(':scope > .masthead-search')) return;

  const labelText = String(getMetadata('nav-search-label') || '').trim();
  const placeholderMeta = String(getMetadata('nav-search-placeholder') || '').trim();
  const ariaMetaSearch = String(getMetadata('nav-search-aria-label') || '').trim();
  const ariaMetaSubmit = String(getMetadata('nav-search-submit-aria-label') || '').trim();

  const form = document.createElement('form');
  form.className = 'masthead-search nav-brand-slot-search';
  form.setAttribute('role', 'search');
  form.method = 'get';
  form.action = mastheadSearchActionHref();

  const input = document.createElement('input');
  input.type = 'search';
  input.name = 'q';
  input.id = MASTHEAD_SEARCH_INPUT_ID;
  input.className = 'masthead-search-input';
  input.autocomplete = 'off';
  input.setAttribute('enterkeyhint', 'search');
  if (placeholderMeta) input.setAttribute('placeholder', placeholderMeta);

  const labelBindingId = 'masthead-search-lbl';

  if (labelText) {
    const labelEl = document.createElement('label');
    labelEl.className = 'masthead-visually-hidden';
    labelEl.htmlFor = MASTHEAD_SEARCH_INPUT_ID;
    labelEl.id = labelBindingId;
    labelEl.textContent = labelText;
    input.setAttribute('aria-labelledby', labelBindingId);
    form.append(labelEl);
  } else {
    input.setAttribute('aria-label', readableSearchAria(ariaMetaSearch, '', placeholderMeta));
  }

  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'masthead-search-submit';
  submitBtn.setAttribute(
    'aria-label',
    String(ariaMetaSubmit || '').trim() || (labelText ? `Submit ${labelText}` : 'Submit search'),
  );

  const iconWrap = document.createElement('span');
  iconWrap.className = 'icon icon-search';
  iconWrap.setAttribute('aria-hidden', 'true');

  submitBtn.append(iconWrap);
  form.append(input, submitBtn);
  wrapper.append(form);
}

async function buildBreadcrumbsFromNavTree(nav, currentUrl) {
  const crumbs = [];

  const brandHomeAnchor = document.querySelector('.nav-brand a[href]');
  const homeUrl = brandHomeAnchor ? brandHomeAnchor.href : `${window.location.origin}/`;

  let menuItem = Array.from(nav.querySelectorAll('a')).find((a) => a.href === currentUrl);
  if (menuItem) {
    let depth = 0;
    do {
      const link = menuItem.querySelector(':scope > a');
      crumbs.unshift({ title: getDirectTextContent(menuItem), url: link ? link.href : null });
      menuItem = menuItem.closest('ul')?.closest('li');
      depth += 1;
    } while (menuItem && depth < MAX_BREADCRUMB_DEPTH);
  } else if (currentUrl !== homeUrl) {
    crumbs.unshift({ title: getMetadata('og:title'), url: currentUrl });
  }

  crumbs.unshift({ title: 'Home', url: homeUrl });

  // last link is current page and should not be linked
  if (crumbs.length > 1) {
    crumbs.at(-1).url = null;
  }
  crumbs.at(-1)['aria-current'] = 'page';
  return crumbs;
}

async function buildBreadcrumbs() {
  const breadcrumbs = document.createElement('nav');
  breadcrumbs.className = 'breadcrumbs';

  const crumbs = await buildBreadcrumbsFromNavTree(document.querySelector('.nav-sections'), document.location.href);

  const ol = document.createElement('ol');
  ol.append(...crumbs.map((item) => {
    const li = document.createElement('li');
    if (item['aria-current']) li.setAttribute('aria-current', item['aria-current']);
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.textContent = item.title;
      li.append(a);
    } else {
      li.textContent = item.title;
    }
    return li;
  }));

  breadcrumbs.append(ol);
  return breadcrumbs;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand instanceof HTMLElement) {
    const brandLink = navBrand.querySelector('.button');
    if (brandLink) {
      brandLink.className = '';
      brandLink.closest('.button-container').className = '';
    }

    prependGlobeIconToUtilityLocale(navBrand);
    ensureMastheadSearch(navBrand);
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
    navSections.querySelectorAll('.button-container').forEach((buttonContainer) => {
      buttonContainer.classList.remove('button-container');
      buttonContainer.querySelector('.button').classList.remove('button');
    });
  }

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const search = navTools.querySelector('a[href*="search"]');
    if (search && search.textContent === '') {
      search.setAttribute('aria-label', 'Search');
    }
  }

  decorateIcons(nav);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);

  if (getMetadata('breadcrumbs').toLowerCase() === 'true') {
    navWrapper.append(await buildBreadcrumbs());
  }
}
