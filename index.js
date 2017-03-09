/**
 * (type)
 *
 * An unknown type of input.  Must be one of the following:
 * - array: An array with 2 elements.  The first is longitude, the second is latitude.
 * - string: A string in the format `longitude,latitude`
 * - Object (x, y coordinates): An object with `x` and `y` properties.
 *   `x` represents longitude and `y` represents latitude.
 * - Object (lat, lon): An object with latitude and longitude properties.
 *   The properties can be named various things.
 *   For longitude any of the following are valid: `lon`, `lng` or `longitude`
 *   For latitude any of the following are valid: `lat` or `latitude`
 * @typedef {Array|string|Object} lonlat.types.input
 */

/**
 * (type)
 *
 * Standardized lon/lat object.
 * @typedef {Object} lonlat.types.output
 * @property {number} lat
 * @property {number} lon
 */

/**
 * (exception type)
 *
 * An error that is thrown upon providing invalid coordinates.
 * @typedef {Error} lonlat.types.InvalidCoordinateException
 */

/**
 * Parse an unknown type of input.
 *
 * @module conveyal/lonlat
 * @param {lonlat.types.input} unknown
 * @return {lonlat.types.output}
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 // Object with lon/lat-ish attributes
 var position = lonlat({ lon: 12, lat: 34 })         // { lon: 12, lat: 34 }
 position = lonlat({ lng: 12, lat: 34 })             // { lon: 12, lat: 34 }
 position = lonlat({ longitude: 12, latitude: 34 })  // { lon: 12, lat: 34 }
 position = lonlat({ lng: 12, latitude: 34 })        // { lon: 12, lat: 34 }

 // coordinate array
 position = lonlat([12, 34])   // { lon: 12, lat: 34 }

 // string
 position = lonlat('12,34')   // { lon: 12, lat: 34 }

 // object with x and y attributes
 position = lonlat({ x: 12, y: 34 })   // { lon: 12, lat: 34 }

 // the following will throw errors
 position = lonlat({ lon: 999, lat: 34 })   // Error: Invalid longitude value: 999
 position = lonlat({ lon: 12, lat: 999 })   // Error: Invalid latitude value: 999
 position = lonlat({})                      // Error: Invalid latitude value: undefined
 position = lonlat(null)                    // Error: Value must not be null or undefined
 */
function normalize (unknown) {
  if (!unknown) throw new Error('Value must not be null or undefined.')
  if (Array.isArray(unknown)) return fromCoordinates(unknown)
  else if (typeof unknown === 'string') return fromString(unknown)
  else if ((unknown.x || unknown.x === 0) && (unknown.y || unknown.y === 0)) return fromPoint(unknown)
  return floatize(unknown)
}
module.exports = normalize

/**
 * <b>aliases:</b> fromGeoJSON<br>
 *
 * Tries to parse from an array of coordinates.
 *
 * @memberof conveyal/lonlat
 * @param  {Array} coordinates  An array in the format: [longitude, latitude]
 * @return {lonlat.types.output}
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var position = lonlat.fromCoordinates([12, 34])   // { lon: 12, lat: 34 }
 position = lonlat.fromGeoJSON([12, 34])           // { lon: 12, lat: 34 }
 */
function fromCoordinates (coordinates) {
  return floatize({lon: coordinates[0], lat: coordinates[1]})
}
module.exports.fromCoordinates = module.exports.fromGeoJSON = fromCoordinates

/**
 * <b>aliases:</b> fromLeaflet<br>
 *
 * Tries to parse from an object.
 *
 * @param  {Object} lonlat  An object with a `lon`, `lng` or `longitude` attribute and a `lat` or `latitude` attribute
 * @return {lonlat.types.output}
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var position = lonlat.fromLatlng({ longitude: 12, latitude: 34 })   // { lon: 12, lat: 34 }
 position = lonlat.fromLeaflet({ lng: 12, lat: 34 })                 // { lon: 12, lat: 34 }
 */
module.exports.fromLatlng = module.exports.fromLeaflet = function fromLatlng (lonlat) {
  return floatize(lonlat)
}

/**
 * Tries to parse from an object.
 *
 * @memberof conveyal/lonlat
 * @param  {Object} point  An object with a `x` attribute representing `longitude`
 *                         and a `y` attribute representing `latitude`
 * @return {lonlat.types.output}
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var position = lonlat.fromPoint({ x: 12, y: 34 })   // { lon: 12, lat: 34 }
 */
function fromPoint (point) {
  return floatize({lon: point.x, lat: point.y})
}
module.exports.fromPoint = fromPoint

/**
 * <b>aliases:</b> fromLonFirstString<br>
 *
 * Tries to parse from a string where the longitude appears before the latitude.
 *
 * @memberof conveyal/lonlat
 * @param  {string} str          A string in the format: `longitude,latitude`
 * @return {lonlat.types.output}
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var position = lonlat.fromString('12,34')          // { lon: 12, lat: 34 }
 var position = lonlat.fromLonFirstString('12,34')  // { lon: 12, lat: 34 }
 */
function fromString (str) {
  var arr = str.split(',')
  return floatize({lon: arr[0], lat: arr[1]})
}
module.exports.fromString = module.exports.fromLonFirstString = fromString

/**
 * Tries to parse from a string where the latitude appears before the longitude.
 *
 * @memberof conveyal/lonlat
 * @param  {string} str           A string in the format: `latitude,longitude`
 * @return {lonlat.types.output}
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var position = lonlat.fromLatFirstString('12,34) // { lon: 34, lat: 12 }
 */
function fromLatFirstString (str) {
  var arr = str.split(',')
  return floatize({lat: arr[0], lon: arr[1]})
}
module.exports.fromLatFirstString = fromLatFirstString

/**
 * Determine if two inputs are equal to each other
 *
 * @param  {input}  lonlat1
 * @param  {input}  lonlat2
 * @param  {number} [epsilon=0] The maximum acceptable deviation to be considered equal.
 * @return {boolean}
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var isEqual = lonlat.isEqual('12,34', [12, 34])   // true
 */
module.exports.isEqual = function (lonlat1, lonlat2, epsilon) {
  lonlat1 = normalize(lonlat1)
  lonlat2 = normalize(lonlat2)
  epsilon = epsilon || 0
  return (Math.abs(lonlat1.lat - lonlat2.lat) <= epsilon) && (Math.abs(lonlat1.lon - lonlat2.lon) <= epsilon)
}

/**
 * @param  {input} input
 * @param  {number} [fixed=5] The number of decimal places to round to.
 * @return {string}           A string with in the format `longitude,latitude` rounded to
 *                            the number of decimal places as specified by `fixed`
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var pretty = lonlat.print('12.345678,34')   // '12.34568, 34.00000'
 */
module.exports.print = function print (input, fixed) {
  var ll = normalize(input)
  return ll.lon.toFixed(fixed || 5) + ', ' + ll.lat.toFixed(fixed || 5)
}

/**
 * <b>aliases:</b> toGeoJSON<br>
 *
 * Translates to a coordinate array.
 *
 * @param {lonlat.types.input} input
 * @return {Array}      An array in the format [longitude, latitude]
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var coords = lonlat.toCoordinates('12,34')   // [12, 34]
 */
module.exports.toCoordinates = module.exports.toGeoJSON = function toCoordinates (input) {
  var ll = normalize(input)
  return [ll.lon, ll.lat]
}

/**
 * Translates to {@link http://leafletjs.com/reference-1.0.3.html#latlng|Leaflet LatLng} object.
 * This function requires Leaflet to be installed as a global variable `L` in the window environment.
 *
 * @param {lonlat.types.input} input
 * @return {Object}      A Leaflet LatLng object
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var position = lonlat.toLeaflet({ lat: 12, long: 34 })   // Leaflet LatLng object
 */
module.exports.toLeaflet = function toLeaflet (input) {
  if (!window.L) throw new Error('Leaflet not found.')
  var ll = normalize(input)
  return window.L.latLng(ll.lat, ll.lon)
}

/**
 * Translates to point Object.
 *
 * @param {lonlat.types.input} input
 * @return {Object}      An object with `x` and `y` attributes representing latitude and longitude respectively
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var point = lonlat.toPoint('12,34')   // { x: 12, y: 34 }
 */
module.exports.toPoint = function toPoint (input) {
  var ll = normalize(input)
  return {x: ll.lon, y: ll.lat}
}

/**
 * <b>aliases:</b> toLonFirstString<br>
 *
 * Translates to coordinate string where the longitude appears before latitude.
 *
 * @param {lonlat.types.input} input
 * @return {string}     A string in the format 'longitude,latitude'
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var str = lonlat.toString({ lat: 12, longitude: 34 })          // '34,12'
 var str = lonlat.toLonFirstString({ lat: 12, longitude: 34 })  // '34,12'
 */
module.exports.toString = module.exports.toLonFirstString = function toString (input) {
  var ll = normalize(input)
  return ll.lon + ',' + ll.lat
}

/**
 * Translates to coordinate string where the latitude appears before longitude.
 *
 * @param {lonlat.types.input} input
 * @return {string}     A string in the format 'longitude,latitude'
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var str = lonlat.toLatFirstString({ lat: 12, longitude: 34 })  // '12,34'
 */
module.exports.toLatFirstString = function toLatFirstString (input) {
  var ll = normalize(input)
  return ll.lat + ',' + ll.lon
}

function floatize (lonlat) {
  var lon = parseFloatWithAlternates([lonlat.lon, lonlat.lng, lonlat.longitude])
  var lat = parseFloatWithAlternates([lonlat.lat, lonlat.latitude])
  if ((!lon || lon > 180 || lon < -180) && lon !== 0) {
    throw new Error('Invalid longitude value: ' + (lonlat.lon || lonlat.lng || lonlat.longitude))
  }
  if ((!lat || lat > 90 || lat < -90) && lat !== 0) {
    throw new Error('Invalid latitude value: ' + (lonlat.lat || lonlat.latitude))
  }
  return {lon: lon, lat: lat}
}

function parseFloatWithAlternates (alternates) {
  if (alternates.length > 0) {
    var num = parseFloat(alternates[0])
    if (isNaN(num)) {
      return parseFloatWithAlternates(alternates.slice(1))
    } else {
      return num
    }
  }
}
