/* eslint-disable */
/* global WebImporter */

/**
 * Stryker procedure-landing sections transformer.
 *
 * Dynamically derives section IDs from the heading text that follows each
 * .section-title boundary (slugified). Works with any number of jumpbar
 * sections regardless of page content.
 *
 * Section boundaries are identified by class patterns in serialized innerHTML,
 * then HTML is split and restructured into flat body-level sections with <hr>.
 */

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function sectionMetadataHtml(dataId) {
  return '<table><tr><th colspan="2">Section Metadata</th></tr>'
    + '<tr><td>data-id</td><td>' + dataId + '</td></tr></table>';
}

/**
 * Extract the section heading text from a chunk of HTML following a .section-title.
 * Looks for the first heading (h1-h3) inside .largeheadline or .c-largeheadline.
 */
function extractHeadingFromChunk(chunk) {
  // Try h2 first (most common), then h1, then h3
  const headingMatch = chunk.match(/<h[123][^>]*>([\s\S]*?)<\/h[123]>/i);
  if (headingMatch) {
    const text = headingMatch[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (text) return text;
  }
  return null;
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
  // Derive data-id from the heading text that follows each boundary
  const sectionTitleStr = 'class="section-title"';
  let searchFrom = 0;
  const sectionTitlePositions = [];

  while (searchFrom < html.length) {
    const pos = html.indexOf(sectionTitleStr, searchFrom);
    if (pos === -1) break;

    const tagOpen = html.lastIndexOf('<', pos);
    if (tagOpen !== -1) {
      sectionTitlePositions.push(tagOpen);
    }

    searchFrom = pos + sectionTitleStr.length;
  }

  // For each section-title position, look ahead to find the heading text
  sectionTitlePositions.forEach((pos, idx) => {
    // Get the chunk between this position and the next section-title (or end)
    const nextPos = idx < sectionTitlePositions.length - 1
      ? sectionTitlePositions[idx + 1]
      : Math.min(pos + 5000, html.length);
    const chunk = html.substring(pos, nextPos);

    const headingText = extractHeadingFromChunk(chunk);
    const dataId = headingText ? slugify(headingText) : ('section-' + (idx + 1));

    splits.push({ pos, dataId });
  });

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
