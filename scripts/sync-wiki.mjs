#!/usr/bin/env node

/**
 * sync-wiki.mjs — Ghost Sync Parser
 * 
 * Reads wiki.md from the repo root and writes per-section JSON files
 * to the data/ directory. Run at build time via `npm run sync`.
 *
 * FAIL-SAFE: If wiki.md is missing or malformed, this script logs a
 * warning and exits with code 0. Existing JSON files remain intact.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { validateSection, validateItem } from './wiki-validator.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// ─── Utility Parsers ────────────────────────────────────────────────

/**
 * Parses lines like `- key: value` into a flat object.
 */
function parseKeyValue(block) {
  const result = {};
  const lines = block.split('\n').filter(l => l.trim().startsWith('- '));
  for (const line of lines) {
    const trimmed = line.trim().slice(2); // Remove "- "
    const colonIdx = trimmed.indexOf(':');
    if (colonIdx === -1) continue;
    const key = trimmed.slice(0, colonIdx).trim();
    const value = trimmed.slice(colonIdx + 1).trim();
    result[key] = value;
  }
  return result;
}

/**
 * Splits a section block on `### ` to get individual items.
 * Returns array of { _header: string[], ...keyValues }
 */
function parseSubsections(block) {
  const items = block.split('\n### ').slice(1); // skip content before first ###
  return items.map(item => {
    const lines = item.split('\n');
    const header = lines[0].trim();
    const parts = header.split(' | ').map(p => p.trim());
    const kvBlock = lines.slice(1).join('\n');
    return { _header: parts, ...parseKeyValue(kvBlock) };
  });
}

/**
 * Normalizes image paths: strips `public/` prefix for Next.js serving.
 * `public/images/foo.png` → `/images/foo.png`
 */
function normalizePath(p) {
  if (!p) return '';
  if (p.startsWith('public/')) return '/' + p.slice(7);
  return p;
}

/**
 * Collects all tag_N values into an array.
 */
function collectTags(kv) {
  const tags = [];
  for (let i = 1; i <= 20; i++) {
    const key = `tag_${i}`;
    if (kv[key]) tags.push(kv[key]);
    else break;
  }
  return tags;
}

/**
 * Collects all skill_N values into an array.
 */
function collectSkills(kv) {
  const skills = [];
  for (let i = 1; i <= 30; i++) {
    const key = `skill_${i}`;
    if (kv[key]) skills.push(kv[key]);
    else break;
  }
  return skills;
}

// ─── Section Parsers ────────────────────────────────────────────────

function parseMeta(block) {
  const kv = parseKeyValue(block);
  const { valid, errors } = validateSection('META', kv);
  if (!valid) return { data: null, errors };

  return {
    data: {
      siteTitle: kv.site_title || '',
      siteDescription: kv.site_description || '',
      ogImage: normalizePath(kv.og_image),
      favicon: normalizePath(kv.favicon),
      canonicalUrl: kv.canonical_url || '',
      twitterHandle: kv.twitter_handle || '',
      linkedinUrl: kv.linkedin_url || '',
      githubUrl: kv.github_url || '',
      email: kv.email || '',
      topmateUrl: kv.topmate_url || '',
      calBookingUrl: kv.cal_booking_url || '',
      youtubeUrl: kv.youtube_url || '',
      newsletterUrl: kv.newsletter_url || '',
      phone: kv.phone || '',
    },
    errors: [],
  };
}

function parseHero(block) {
  const kv = parseKeyValue(block);
  const { valid, errors } = validateSection('HERO', kv);
  if (!valid) return { data: null, errors };

  // Collect badges
  const badges = [];
  for (let i = 1; i <= 10; i++) {
    if (kv[`badge_${i}`]) badges.push(kv[`badge_${i}`]);
    else break;
  }

  // Collect skills from hero section
  const skills = collectSkills(kv);

  return {
    data: {
      nameFirst: kv.name_first || '',
      nameLast: kv.name_last || '',
      headline: kv.headline || '',
      headlineHighlight: kv.headline_highlight || '',
      subheadline: kv.subheadline || '',
      ctaPrimaryLabel: kv.cta_primary_label || '',
      ctaPrimaryUrl: kv.cta_primary_url || '',
      ctaSecondaryLabel: kv.cta_secondary_label || '',
      ctaSecondaryUrl: kv.cta_secondary_url || '',
      heroImage: normalizePath(kv.hero_image),
      heroImageAlt: kv.hero_image_alt || '',
      badges,
      skills,
      scrollCtaLabel: kv.scroll_cta_label || '',
    },
    errors: [],
  };
}

function parseNavbar(block) {
  const kv = parseKeyValue(block);
  
  // Collect nav links
  const navLinks = [];
  for (let i = 1; i <= 10; i++) {
    const label = kv[`nav_link_${i}_label`];
    const href = kv[`nav_link_${i}_href`];
    if (label && href) navLinks.push({ label, href });
    else break;
  }

  // Collect external links
  const externalLinks = [];
  for (let i = 1; i <= 10; i++) {
    const label = kv[`external_link_${i}_label`];
    const url = kv[`external_link_${i}_url`];
    if (label && url) externalLinks.push({ label, url });
    else break;
  }

  return {
    data: {
      logoText: kv.logo_text || '',
      logoImage: normalizePath(kv.logo_image),
      navLinks,
      externalLinks,
      ctaLabel: kv.cta_label || '',
      ctaHref: kv.cta_href || '',
    },
    errors: [],
  };
}

function parseExperience(block) {
  const items = parseSubsections(block);
  const allErrors = [];
  
  const data = items.map((item, idx) => {
    const { valid, errors } = validateItem('EXPERIENCE_ITEM', item, idx);
    if (!valid) {
      allErrors.push(...errors);
      return null;
    }

    // _header example: ["XSYS - The Systems Association of XIMB", "Coordinator", "Mar 2025 - Present"]
    const company = item._header[0] || '';
    const title = item._header[1] || '';
    const dates = item._header[2] || '';

    return {
      company,
      title,
      dates,
      type: item.type || 'full_time',
      logo: normalizePath(item.logo),
      location: item.location || '',
      description: item.description || '',
      tags: collectTags(item),
    };
  }).filter(Boolean);

  return { data, errors: allErrors };
}

function parseEducation(block) {
  const items = parseSubsections(block);
  const allErrors = [];

  const data = items.map((item, idx) => {
    // _header example: ["Xavier Institute of Management (XIM Bhubaneswar)", "MBA, Business management", "Jun 2024 - Jun 2026"]
    const university = item._header[0] || '';
    const degree = item._header[1] || '';
    const dates = item._header[2] || '';

    return {
      university,
      degree,
      dates,
      logo: normalizePath(item.logo),
      location: item.location || '',
      description: item.description || '',
      grade: item.grade || '',
    };
  });

  return { data, errors: allErrors };
}

function parseResearch(block) {
  const items = parseSubsections(block);
  const allErrors = [];

  const data = items.map((item, idx) => {
    const { valid, errors } = validateItem('RESEARCH_ITEM', item, idx);
    if (!valid) {
      allErrors.push(...errors);
      return null;
    }

    const title = item._header[0] || '';
    const year = item._header[1] || '';

    return {
      title,
      year: parseInt(year, 10) || year,
      authors: item.co_authors || '',
      journal: item.journal || '',
      status: item.status || '',
      abstract: item.abstract || '',
      link: item.link || '',
      citations: parseInt(item.citations, 10) || 0,
      tags: collectTags(item),
    };
  }).filter(Boolean);

  return { data, errors: allErrors };
}

function parseProjects(block) {
  const items = parseSubsections(block);
  const allErrors = [];

  const data = items.map((item, idx) => {
    const { valid, errors } = validateItem('PROJECTS_ITEM', item, idx);
    if (!valid) {
      allErrors.push(...errors);
      return null;
    }

    const title = item._header[0] || '';
    const year = item._header[1] || '';

    return {
      title,
      year,
      tagline: item.tagline || '',
      status: item.status || '',
      techStack: item.tech_stack || '',
      githubUrl: item.github_url || '',
      liveUrl: item.live_url || '',
      coverImage: normalizePath(item.cover_image),
      coverImageAlt: item.cover_image_alt || '',
      description: item.description || '',
      strategicInsight: item.strategic_insight || '',
      impact: item.impact || '',
      downloads: parseInt(item.downloads, 10) || 0,
      tags: collectTags(item),
      featured: item.featured === 'true',
    };
  }).filter(Boolean);

  return { data, errors: allErrors };
}

function parseWriting(block) {
  const items = parseSubsections(block);
  const allErrors = [];

  const data = items.map((item, idx) => {
    const { valid, errors } = validateItem('WRITING_ITEM', item, idx);
    if (!valid) {
      allErrors.push(...errors);
      return null;
    }

    const title = item._header[0] || '';
    const date = item._header[1] || '';

    return {
      title,
      date,
      publication: item.publication || '',
      coAuthor: item.co_author || '',
      url: item.url || '',
      coverImage: normalizePath(item.cover_image),
      description: item.description || '',
      readTime: item.read_time || '',
      tags: collectTags(item),
      featured: item.featured === 'true',
    };
  }).filter(Boolean);

  return { data, errors: allErrors };
}

function parseRecommendations(block) {
  const items = parseSubsections(block);
  const allErrors = [];

  const data = items.map((item, idx) => {
    const { valid, errors } = validateItem('RECOMMENDATIONS_ITEM', item, idx);
    if (!valid) {
      allErrors.push(...errors);
      return null;
    }

    // _header: ["Recommender Name", "Job Title", "Company", "Relationship"]
    const name = item._header[0] || '';
    const designation = item._header[1] || '';
    const company = item._header[2] || '';
    const relationship = item._header[3] || '';

    return {
      name,
      designation,
      company,
      relationship,
      photo: normalizePath(item.photo),
      photoAlt: item.photo_alt || `${name} headshot`,
      linkedinUrl: item.linkedin_url || '',
      shortQuote: item.short_quote || '',
      fullText: item.full_text || '',
      text: item.full_text || '', // backward compat — components use `text`
      date: item.date || '',
    };
  }).filter(Boolean);

  return { data, errors: allErrors };
}

function parseHackathons(block) {
  const items = parseSubsections(block);
  const allErrors = [];

  const data = items.map((item, idx) => {
    const { valid, errors } = validateItem('HACKATHONS_ITEM', item, idx);
    if (!valid) {
      allErrors.push(...errors);
      return null;
    }

    // _header: ["ETHIndia 2023", "Winner", "Ethereum Foundation", "Nov 2023"]
    const eventName = item._header[0] || '';
    const result = item._header[1] || '';
    const organizer = item._header[2] || '';
    const date = item._header[3] || '';

    return {
      eventName,
      result,
      organizer,
      date,
      prize: item.prize || '',
      projectName: item.project_name || '',
      projectDescription: item.project_description || '',
      teamSize: parseInt(item.team_size, 10) || 0,
      techStack: item.tech_stack || '',
      devpostUrl: item.devpost_url || '',
      logo: normalizePath(item.logo),
    };
  }).filter(Boolean);

  return { data, errors: allErrors };
}

function parseSkills(block) {
  const items = parseSubsections(block);
  
  const data = items.map(item => {
    const categoryName = item._header[0] || '';
    return {
      category: categoryName,
      skills: collectSkills(item),
    };
  });

  return { data, errors: [] };
}

function parseContact(block) {
  const kv = parseKeyValue(block);
  const { valid, errors } = validateSection('CONTACT', kv);
  if (!valid) return { data: null, errors };

  return {
    data: {
      sectionHeadline: kv.section_headline || '',
      sectionSubheadline: kv.section_subheadline || '',
      ctaBookLabel: kv.cta_book_label || '',
      ctaBookUrl: kv.cta_book_url || '',
      ctaEmailLabel: kv.cta_email_label || '',
      ctaEmailUrl: kv.cta_email_url || '',
      ctaTopmateLabel: kv.cta_topmate_label || '',
      ctaTopmateUrl: kv.cta_topmate_url || '',
      ctaNewsletterLabel: kv.cta_newsletter_label || '',
      ctaNewsletterUrl: kv.cta_newsletter_url || '',
    },
    errors: [],
  };
}

function parseFooter(block) {
  const kv = parseKeyValue(block);
  const { valid, errors } = validateSection('FOOTER', kv);
  if (!valid) return { data: null, errors };

  // Collect footer links
  const links = [];
  for (let i = 1; i <= 10; i++) {
    const label = kv[`footer_link_${i}_label`];
    const url = kv[`footer_link_${i}_url`];
    if (label && url) links.push({ label, url });
    else break;
  }

  return {
    data: {
      footerName: kv.footer_name || '',
      footerTagline: kv.footer_tagline || '',
      copyrightText: kv.copyright_text || '',
      links,
    },
    errors: [],
  };
}

function parseSectionNav(block) {
  const kv = parseKeyValue(block);

  const sections = [];
  for (let i = 1; i <= 20; i++) {
    const id = kv[`dot_${i}_id`];
    const label = kv[`dot_${i}_label`];
    if (id && label) sections.push({ id, label });
    else break;
  }

  return {
    data: { sections },
    errors: [],
  };
}

function parseLoading(block) {
  const kv = parseKeyValue(block);

  return {
    data: {
      loadingText: kv.loading_text || 'Loading',
      loadingTagline: kv.loading_tagline || '',
      loadingBio: kv.loading_bio || '',
    },
    errors: [],
  };
}

// ─── Section → Parser Mapping ───────────────────────────────────────

const SECTION_MAP = {
  'META': { parser: parseMeta, file: 'meta.json' },
  'HERO': { parser: parseHero, file: 'hero.json' },
  'NAVBAR': { parser: parseNavbar, file: 'navbar.json' },
  'EXPERIENCE': { parser: parseExperience, file: 'experience.json' },
  'EDUCATION': { parser: parseEducation, file: 'education.json' },
  'RESEARCH': { parser: parseResearch, file: 'research.json' },
  'PROJECTS': { parser: parseProjects, file: 'projects.json' },
  'WRITING': { parser: parseWriting, file: 'writing.json' },
  'RECOMMENDATIONS': { parser: parseRecommendations, file: 'recommendations.json' },
  'HACKATHONS': { parser: parseHackathons, file: 'hackathons.json' },
  'SKILLS': { parser: parseSkills, file: 'skills.json' },
  'CONTACT': { parser: parseContact, file: 'contact.json' },
  'FOOTER': { parser: parseFooter, file: 'footer.json' },
  'SECTION_NAV_LABELS': { parser: parseSectionNav, file: 'section-nav.json' },
  'LOADING_SCREEN': { parser: parseLoading, file: 'loading.json' },
};

// ─── Main Entry Point ───────────────────────────────────────────────

function main() {
  const wikiPath = join(ROOT, 'wiki.md');

  // FAIL-SAFE: If wiki.md is missing, warn and exit clean
  if (!existsSync(wikiPath)) {
    console.warn('⚠️  wiki.md not found. Using existing data files. Skipping sync.');
    process.exit(0);
  }

  let raw;
  try {
    raw = readFileSync(wikiPath, 'utf-8');
  } catch (err) {
    console.warn(`⚠️  Could not read wiki.md: ${err.message}. Skipping sync.`);
    process.exit(0);
  }

  console.log('🔄 Syncing wiki.md → data/*.json ...\n');

  // Split on `\n## ` to extract top-level sections
  const rawSections = raw.split(/\n## /);
  const allErrors = [];
  let sectionsUpdated = 0;
  let sectionsSkipped = 0;

  for (const rawSection of rawSections) {
    // Extract section name (first line, trimmed)
    const firstLine = rawSection.split('\n')[0].trim();
    
    // Remove everything after <!-- SECTION_END -->
    const sectionEndIdx = rawSection.indexOf('<!-- SECTION_END -->');
    const cleanBlock = sectionEndIdx !== -1
      ? rawSection.slice(0, sectionEndIdx)
      : rawSection;

    // Find matching parser
    const sectionConfig = SECTION_MAP[firstLine];
    if (!sectionConfig) continue;

    const { parser, file } = sectionConfig;

    try {
      const { data, errors } = parser(cleanBlock);

      if (errors.length > 0) {
        allErrors.push(...errors);
      }

      if (data === null) {
        console.warn(`  ⚠️  ${firstLine}: Validation failed, skipping JSON update`);
        sectionsSkipped++;
        continue;
      }

      const outPath = join(DATA_DIR, file);
      writeFileSync(outPath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
      console.log(`  ✅ ${firstLine} → ${file}`);
      sectionsUpdated++;
    } catch (err) {
      console.error(`  ❌ ${firstLine}: Parser error — ${err.message}`);
      allErrors.push(`[${firstLine}] Parser error: ${err.message}`);
      sectionsSkipped++;
    }
  }

  // Summary
  console.log(`\n─── Sync Complete ───`);
  console.log(`  Sections updated: ${sectionsUpdated}`);
  console.log(`  Sections skipped: ${sectionsSkipped}`);

  if (allErrors.length > 0) {
    console.warn(`\n⚠️  ${allErrors.length} validation warning(s):`);
    for (const err of allErrors) {
      console.warn(`    • ${err}`);
    }
  }

  console.log('');
  
  // Always exit 0 — fail-safe
  process.exit(0);
}

main();
