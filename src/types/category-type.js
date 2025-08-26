/**
 * @typedef {Object} CategoryDataType
 * @property {Object} categories
 * @property {Array} categories._data
 */

/**
 * @typedef {Object} CategoryProps
 * @property {Function} deleteCategory
 * @property {Object} categories
 * @property {Array.<{id: number, name: string}>} categories.data
 * @property {number} categories.totalRecords
 */

/**
 * @typedef {Object} ModalType
 * @property {boolean} [isClose]
 * @property {boolean} isOpen
 * @property {Function} open
 * @property {string} title
 * @property {string} body
 * @property {React.ReactNode} children
 * @property {string} [classBody]
 */

module.exports = {};
