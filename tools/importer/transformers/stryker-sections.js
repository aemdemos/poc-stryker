/* eslint-disable */
/* global WebImporter */

/**
 * Stryker DART sections transformer.
 *
 * Uses .section-title class (stable) rather than random jumpbar IDs
 * (which change on each page load). Maps sections by their ordinal
 * position in the DOM.
 *
 * Section boundaries are identified by their class patterns in the
 * serialized innerHTML, then the HTML is split and reconstructured
 * into flat body-level sections with <hr> separators.
 */

// Ordered list of jumpbar section data-ids (matches the 7 .section-title elements in DOM order)
const JUMPBAR_SECTION_IDS = [
  'procedural-overview',
  'videos',
  'medical-education',
  'implants',
  'mako-smartrobotics',
  'instrumentation',
  'patient-positioning-equipment',
];

function sectionMetadataHtml(dataId) {
  return '<table><tr><th colspan="2">Section Metadata</th></tr>'
    + '<tr><td>data-id</td><td>' + dataId + '</td></tr></table>';
}

export default function transform(hookName, element, payload) {
  if (hookName !== 'beforeTransform') return;

  const document = element.ownerDocument;
  const body = document.body;
  const html = body.innerHTML;

  // Find all split positions using stable class patterns
  const splits = [];

  // Hero: first .carouselslidegroup
  const heroPos = html.indexOf('class="carouselslidegroup');
  if (heroPos !== -1) {
    const tagOpen = html.lastIndexOf('<', heroPos);
    splits.push({ pos: tagOpen !== -1 ? tagOpen : heroPos, dataId: 'hero' });
  }

  // Section nav: .c-navigation-bar
  const navPos = html.indexOf('class="c-navigation-bar"');
  if (navPos !== -1) {
    const tagOpen = html.lastIndexOf('<', navPos);
    splits.push({ pos: tagOpen !== -1 ? tagOpen : navPos, dataId: 'section-nav' });
  }

  // Jumpbar sections: find ALL occurrences of class="section-title"
  // and map them by ordinal position to the JUMPBAR_SECTION_IDS array
  const sectionTitleStr = 'class="section-title"';
  let searchFrom = 0;
  let sectionIdx = 0;

  while (searchFrom < html.length && sectionIdx < JUMPBAR_SECTION_IDS.length) {
    const pos = html.indexOf(sectionTitleStr, searchFrom);
    if (pos === -1) break;

    const tagOpen = html.lastIndexOf('<', pos);
    if (tagOpen !== -1) {
      splits.push({ pos: tagOpen, dataId: JUMPBAR_SECTION_IDS[sectionIdx] });
    }

    sectionIdx += 1;
    searchFrom = pos + sectionTitleStr.length;
  }

  // ASC promotion: second .sectionseparator
  const sepStr = 'class="sectionseparator"';
  const firstSep = html.indexOf(sepStr);
  if (firstSep !== -1) {
    const secondSep = html.indexOf(sepStr, firstSep + sepStr.length);
    if (secondSep !== -1) {
      const tagOpen = html.lastIndexOf('<', secondSep);
      splits.push({ pos: tagOpen !== -1 ? tagOpen : secondSep, dataId: 'asc-promotion' });
    }
  }

  // References: .c-disclaimer containing <ol>
  const disclaimerStr = 'class="c-disclaimer';
  let dPos = html.indexOf(disclaimerStr);
  while (dPos !== -1) {
    const chunk = html.substring(dPos, Math.min(dPos + 3000, html.length));
    if (chunk.includes('<ol') || chunk.includes('<ol>')) {
      const tagOpen = html.lastIndexOf('<', dPos);
      splits.push({ pos: tagOpen !== -1 ? tagOpen : dPos, dataId: 'references' });
      break;
    }
    dPos = html.indexOf(disclaimerStr, dPos + 1);
  }

  if (splits.length < 2) return;

  // Sort by position and deduplicate
  splits.sort((a, b) => a.pos - b.pos);
  const unique = [splits[0]];
  for (let i = 1; i < splits.length; i += 1) {
    if (splits[i].pos > unique[unique.length - 1].pos) {
      unique.push(splits[i]);
    }
  }

  // Split HTML into sections and rebuild as flat body-level divs with <hr>
  const parts = [];
  for (let i = 0; i < unique.length; i += 1) {
    const start = unique[i].pos;
    const end = i < unique.length - 1 ? unique[i + 1].pos : html.length;

    if (i > 0) {
      parts.push('<hr>');
    }
    parts.push('<div>');
    parts.push(html.substring(start, end));
    parts.push(sectionMetadataHtml(unique[i].dataId));
    parts.push('</div>');
  }

  body.innerHTML = parts.join('');
}
