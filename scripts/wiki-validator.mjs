/**
 * wiki-validator.mjs — Schema validation helpers for wiki.md parser
 * Validates required fields per section before JSON output.
 */

/**
 * Required fields per section type.
 * If a field is missing, the section is skipped and an error is logged.
 */
export const REQUIRED_FIELDS = {
  META: ['site_title', 'site_description', 'canonical_url'],
  HERO: ['headline', 'subheadline', 'cta_primary_label'],
  EXPERIENCE_ITEM: ['description'],
  EDUCATION_ITEM: [],
  RESEARCH_ITEM: ['abstract', 'status'],
  PROJECTS_ITEM: ['tagline', 'github_url'],
  WRITING_ITEM: ['url'],
  RECOMMENDATIONS_ITEM: ['short_quote', 'full_text'],
  HACKATHONS_ITEM: ['prize', 'project_name'],
  SKILLS_CATEGORY: [],
  CONTACT: ['section_headline'],
  FOOTER: ['footer_name'],
  NAVBAR: [],
  SECTION_NAV_LABELS: [],
  LOADING_SCREEN: [],
};

/**
 * Validates a flat key-value object against required fields.
 * @param {string} sectionName - The section being validated (e.g., 'META')
 * @param {object} data - The parsed key-value data
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSection(sectionName, data) {
  const required = REQUIRED_FIELDS[sectionName] || [];
  const errors = [];

  for (const field of required) {
    if (!data[field] || data[field].trim() === '') {
      errors.push(`[${sectionName}] Missing required field: "${field}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates an item within a multi-item section (e.g., an individual experience entry).
 * @param {string} sectionName - The item type (e.g., 'EXPERIENCE_ITEM')
 * @param {object} item - The parsed item data
 * @param {number} index - Item index for error reporting
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateItem(sectionName, item, index) {
  const required = REQUIRED_FIELDS[sectionName] || [];
  const errors = [];

  for (const field of required) {
    if (!item[field] || String(item[field]).trim() === '') {
      errors.push(`[${sectionName} #${index + 1}] Missing required field: "${field}"`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
