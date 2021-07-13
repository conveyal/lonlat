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
 * (type)
 *
 * Object with x/y number values.
 * @typedef {Object} lonlat.types.point
 * @property {number} x
 * @property {number} y
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

import type { LatLng, LatLngLiteral } from 'leaflet'

export type LonLatOutput = {
  lat: number
  lon: number
}
type Point = {
  x: number
  y: number
}

export type LonLatInput =
  | LonLatOutput
  | Point
  | GeoJSON.Position
  | GeoJSON.Point
  | LatLng
  | LatLngLiteral
  | { lat: number | string; lng: number | string }
  | { lat: number | string; long: number | string }
  | { latitude: number | string; longitude: number | string }
  | string

export const normalize = function (unknown: LonLatInput): LonLatOutput {
  if (!unknown) throw new Error('Value must not be null or undefined.')
  if (Array.isArray(unknown)) return fromCoordinates(unknown)
  else if (typeof unknown === 'string') return fromString(unknown)
  else if ('coordinates' in unknown) return fromCoordinates(unknown.coordinates)
  else if (
    'x' in unknown &&
    'y' in unknown &&
    (unknown.x || unknown.x === 0) &&
    (unknown.y || unknown.y === 0)
  ) {
    return fromPoint(unknown)
  }
  return floatize(unknown)
}
export default normalize

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
export const fromCoordinates = function (
  coordinates: GeoJSON.Position
): LonLatOutput {
  return floatize({ lat: coordinates[1], lon: coordinates[0] })
}
export { fromCoordinates as fromGeoJSON }

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
export const fromLatlng = function (
  lonlat:
    | {
        longitude: number
        latitude: number
      }
    | { lat: number; lng: number }
): LonLatOutput {
  return floatize(lonlat)
}
export { fromLatlng as fromLeaflet }

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
export const fromPoint = function (point: Point): LonLatOutput {
  return floatize({ lat: point.y, lon: point.x })
}

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
export const fromString = function (str: string): LonLatOutput {
  const arr: Array<string> = str.split(',')
  return floatize({ lat: arr[1], lon: arr[0] })
}
export { fromString as fromLonFirstString }

/**
 * Tries to parse from a string where the latitude appears before the longitude.
 *
 * @memberof conveyal/lonlat
 * @param  {string} str           A string in the format: `latitude,longitude`
 * @return {lonlat.types.output}
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var position = lonlat.fromLatFirstString('12,34') // { lon: 34, lat: 12 }
 */
export const fromLatFirstString = function (str: string): LonLatOutput {
  const arr: Array<string> = str.split(',')
  return floatize({ lat: arr[0], lon: arr[1] })
}

/**
 * Determine if two inputs are equal to each other
 *
 * @param  {lonlat.types.input}  lonlat1
 * @param  {lonlat.types.input}  lonlat2
 * @param  {number} [epsilon=0] The maximum acceptable deviation to be considered equal.
 * @return {boolean}
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var isEqual = lonlat.isEqual('12,34', [12, 34])   // true
 */
export const isEqual = function (
  lonlat1: LonLatInput,
  lonlat2: LonLatInput,
  epsilon?: number
): boolean {
  lonlat1 = normalize(lonlat1)
  lonlat2 = normalize(lonlat2)
  epsilon = epsilon || 0
  return (
    Math.abs(lonlat1.lat - lonlat2.lat) <= epsilon &&
    Math.abs(lonlat1.lon - lonlat2.lon) <= epsilon
  )
}

/**
 * @param  {lonlat.types.input} input
 * @param  {number} [fixed=5] The number of decimal places to round to.
 * @return {string}           A string with in the format `longitude,latitude` rounded to
 *                            the number of decimal places as specified by `fixed`
 * @throws {lonlat.types.InvalidCoordinateException}
 * @example
 * var lonlat = require('@conveyal/lonlat')

 var pretty = lonlat.print('12.345678,34')   // '12.34568, 34.00000'
 */
export const print = function (input: LonLatInput, fixed?: number): string {
  const ll: LonLatOutput = normalize(input)
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
export const toCoordinates = function (input: LonLatInput): [number, number] {
  const ll: LonLatOutput = normalize(input)
  return [ll.lon, ll.lat]
}
export { toCoordinates as toGeoJSON }
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
export const toLeaflet = function (input: LonLatInput): LatLng {
  if (!window.L) throw new Error('Leaflet not found.')
  const ll: LonLatOutput = normalize(input)
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
export const toPoint = function (input: LonLatInput): Point {
  const ll: LonLatOutput = normalize(input)
  return { x: ll.lon, y: ll.lat }
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
export const toString = function (input: LonLatInput): string {
  const ll: LonLatOutput = normalize(input)
  return ll.lon + ',' + ll.lat
}
export { toString as toLonFirstString }

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
export const toLatFirstString = function (input: LonLatInput): string {
  const ll: LonLatOutput = normalize(input)
  return ll.lat + ',' + ll.lon
}

/**
 * Pixel conversions and constants taken from
 * https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Implementations
 */

/**
 * Pixels per tile.
 */
export const PIXELS_PER_TILE = 256

// 2^z represents the tile number. Scale that by the number of pixels in each tile.
function zScale(z: number): number {
  return Math.pow(2, z) * PIXELS_PER_TILE
}

// Converts from degrees to radians
function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180
}

// Converts from radians to degrees.
function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI
}

/**
 * Convert a longitude to it's pixel value given a `zoom` level.
 *
 * @param {number} longitude
 * @param {number} zoom
 * @return {number} pixel
 * @example
 * var xPixel = lonlat.longitudeToPixel(-70, 9) //= 40049.77777777778
 */
export const longitudeToPixel = function (
  longitude: number,
  zoom: number
): number {
  return ((longitude + 180) / 360) * zScale(zoom)
}

/**
 * Convert a latitude to it's pixel value given a `zoom` level.
 *
 * @param {number} latitude
 * @param {number} zoom
 * @return {number} pixel
 * @example
 * var yPixel = lonlat.latitudeToPixel(40, 9) //= 49621.12736343896
 */
export const latitudeToPixel = function (
  latitude: number,
  zoom: number
): number {
  const latRad: number = toRadians(latitude)
  return (
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
    zScale(zoom)
  )
}

/**
 * Maximum Latitude for valid Mercator projection conversion.
 */
const MAX_LAT = toDegrees(Math.atan(Math.sinh(Math.PI)))

/**
 * Convert a coordinate to a pixel.
 *
 * @param {lonlat.types.input} input
 * @param {number} zoom
 * @return {Object} An object with `x` and `y` attributes representing pixel coordinates
 * @throws {lonlat.types.InvalidCoordinateException}
 * @throws {Error} If latitude is above or below `MAX_LAT`
 * @throws {Error} If `zoom` is undefined.
 * @example
 * var pixel = lonlat.toPixel({lon: -70, lat: 40}, 9) //= {x: 40049.77777777778, y:49621.12736343896}
 */
export const toPixel = function (input: LonLatInput, zoom: number): Point {
  const ll: LonLatOutput = normalize(input)
  if (ll.lat > MAX_LAT || ll.lat < -MAX_LAT) {
    throw new Error(
      'Pixel conversion only works between ' +
        MAX_LAT +
        'N and -' +
        MAX_LAT +
        'S'
    )
  }

  return {
    x: longitudeToPixel(ll.lon, zoom),
    y: latitudeToPixel(ll.lat, zoom)
  }
}

/**
 * Convert a pixel to it's longitude value given a zoom level.
 *
 * @param {number} x
 * @param {number} zoom
 * @return {number} longitude
 * @example
 * var lon = lonlat.pixelToLongitude(40000, 9) //= -70.13671875
 */
export const pixelToLongitude = function (x: number, zoom: number): number {
  return (x / zScale(zoom)) * 360 - 180
}

/**
 * Convert a pixel to it's latitude value given a zoom level.
 *
 * @param {number} y
 * @param {number} zoom
 * @return {number} latitude
 * @example
 * var lat = lonlat.pixelToLatitude(50000, 9) //= 39.1982053488948
 */
export const pixelToLatitude = function (y: number, zoom: number): number {
  const latRad: number = Math.atan(
    Math.sinh(Math.PI * (1 - (2 * y) / zScale(zoom)))
  )
  return toDegrees(latRad)
}

/**
 * From pixel.
 *
 * @param {lonlat.types.point} pixel
 * @param {number} zoom
 * @return {lonlat.types.output}
 * @example
 * var ll = lonlat.fromPixel({x: 40000, y: 50000}, 9) //= {lon: -70.13671875, lat: 39.1982053488948}
 */
export const fromPixel = function (pixel: Point, zoom: number): LonLatOutput {
  return {
    lat: pixelToLatitude(pixel.y, zoom),
    lon: pixelToLongitude(pixel.x, zoom)
  }
}

// Can the various ways in which lat/long pairs can be expressed to this
// method be expressed as a type?
// eslint-disable-next-line complexity
function floatize(lonlat: Record<string, unknown>): LonLatOutput {
  const lon = parseFloatWithAlternates([
    lonlat.lon,
    lonlat.lng,
    lonlat.longitude
  ])
  const lat = parseFloatWithAlternates([lonlat.lat, lonlat.latitude])
  if ((!lon || lon > 180 || lon < -180) && lon !== 0) {
    throw new Error(
      'Invalid longitude value: ' +
        (lonlat.lon || lonlat.lng || lonlat.longitude)
    )
  }
  if ((!lat || lat > 90 || lat < -90) && lat !== 0) {
    throw new Error(
      'Invalid latitude value: ' + (lonlat.lat || lonlat.latitude)
    )
  }
  return { lat: lat, lon: lon }
}

function parseFloatWithAlternates(alternates: Array<unknown>): number | null {
  if (Array.isArray(alternates) && alternates.length > 0) {
    const num = parseFloat(alternates[0])
    if (isNaN(num)) {
      return parseFloatWithAlternates(alternates.slice(1))
    } else {
      return num
    }
  }
  return null
}
