/**
 * @typedef {Object} FormData
 * @property {number} floor
 * @property {number} maxFloor
 * @property {string} ageOfBuilding
 * @property {string} distSea
 * @property {string} title
 * @property {number} minPrice
 * @property {number} maxPrice
 * @property {number} baths
 * @property {number} maxBaths
 * @property {number} beds
 * @property {number} maxBeds
 * @property {number} sqt
 * @property {number} maxSqt
 * @property {number} distShop
 * @property {number} distAirport
 * @property {number} distHospital
 * @property {string} buyPropertyLink
 * @property {string} availablePropertyLink
 * @property {string} mapLink
 * @property {"m"|"km"} shopType
 * @property {"m"|"km"} airportType
 * @property {"m"|"km"} hospitalType
 * @property {"m"|"km"} seaType
 */

/**
 * @typedef {Object} HeatType
 * @property {number} id
 * @property {string} name
 * @property {string} heating_type_key
 */

/**
 * @typedef {Object} LandType
 * @property {number} id
 * @property {string} name
 * @property {string} landscape_key
 */

/**
 * @typedef {Object} AddPropertyDataType
 * @property {Array.<{id: number, location_name: string, location_key: string}>} locs
 * @property {Array.<{id: number, name: string}>} types
 * @property {Array.<{id: number, name: string, tag_key: string}>} tags
 * @property {Array.<{id: number, name: string}>} features
 * @property {Array.<LandType>} landscapesData
 * @property {Array.<HeatType>} heating
 * @property {Array.<{id: number, name: string}>} typeHouses
 * @property {Object} propertyDetails
 */

/**
 * @typedef {Object} ImgsPropType
 * @property {number} id
 * @property {string} file_name
 * @property {number} image_order
 */

/**
 * @typedef {Object} TypeItemType
 * @property {number} id
 * @property {string} name
 * @property {number} type_id
 */

/**
 * @typedef {Object} PropItemType
 * @property {string} area
 * @property {number} bathroom
 * @property {string} bed_room
 * @property {number} id
 * @property {Array.<ImgsPropType>} images
 * @property {string} location
 * @property {number} metrage
 * @property {number} price
 * @property {string} title
 * @property {string|null} type
 * @property {"euro"|"ruble"|"dollar"} money_type
 * @property {0|1} is_multi
 * @property {Array.<TypeItemType>} types
 */

/**
 * @typedef {Object} GetRealEstatesType
 * @property {Array.<PropItemType>} properties
 * @property {number} count
 */

module.exports = {};
