const assert = require('assert')
const ll = require('./')

const lat = 38.13234
const lon = 70.01232
const lonlat = {lon, lat}
const point = {x: lon, y: lat}
const coordinates = [lon, lat]
const str = `${lon},${lat}`
const latlng = {lat, lng: lon}

const pairs = [
  // normalization
  [lonlat, ll(lonlat)],
  [lonlat, ll(point)],
  [lonlat, ll(coordinates)],
  [lonlat, ll(str)],

  // convert to type, normalizes to `latlng` first in each function
  [ll.toCoordinates(lonlat), coordinates],
  [ll.toPoint(lonlat), point],
  [ll.toString(lonlat), str],

  // if the type is known, use the specific convert function directly
  [lonlat, ll.fromLatlng(latlng)],
  [lonlat, ll.fromCoordinates(coordinates)],
  [lonlat, ll.fromPoint(point)],
  [lonlat, ll.fromString(str)]
]

pairs.forEach((pair) => assert.deepEqual(pair[0], pair[1]))
