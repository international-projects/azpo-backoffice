/**
 * @typedef {Object} DocItemType
 * @property {string} area
 * @property {string|null} audio
 * @property {string|null} description
 * @property {string|null} header1
 * @property {null} header2
 * @property {number} id
 * @property {string|null} image
 * @property {string} location
 * @property {string|null} pdf
 * @property {string} tag
 * @property {string} type
 * @property {string|null} video
 * @property {string|null} title
 * @property {string|null} meta_description
 * @property {string|null} keywords
 * @property {Array.<{id: number, question: string, answer: string, pages_content_id: number}>} faqs
 */

/**
 * @typedef {Object} SearchContent
 * @property {Array.<DocItemType>} docs
 * @property {Array.<{id: number, location_name: string, location_key: string}>} locs
 * @property {Array.<{id: number, name: string, filter: string}>} types
 * @property {Array.<{id: number, name: string, tag_key: string, filter: string}>} tags
 * @property {DocItemType} docInfo
 */

/**
 * @typedef {Object} NewDocType
 * @property {Array.<{id: number, location_name: string, location_key: string}>} locs
 * @property {Array.<{id: number, name: string, filter: string}>} types
 * @property {Array.<{id: number, name: string, tag_key: string, filter: string}>} tags
 * @property {DocItemType} docInfo
 */

/**
 * @typedef {Object} EditDocType
 * @property {Array.<{id: number, location_name: string, location_key: string}>} locs
 * @property {Array.<{id: number, name: string, filter: string}>} types
 * @property {Array.<{id: number, name: string, tag_key: string, filter: string}>} tags
 */

/**
 * @typedef {Object} DocItemComType
 * @property {number} index
 * @property {string} area
 * @property {string|null} audio
 * @property {string|null} description
 * @property {string|null} header1
 * @property {null} header2
 * @property {number} id
 * @property {string|null} image
 * @property {string} location
 * @property {string|null} pdf
 * @property {string} tag
 * @property {string} type
 * @property {string|null} video
 * @property {string|null} title
 * @property {string|null} meta_description
 * @property {string|null} keywords
 */

module.exports = {};
