const assert = require('assert')
const ll = require('./')

const lat = 38.13234
const lon = 70.01232
const latlon = {lat, lon, lng: lon}
const point = {x: lon, y: lat}
const coordinates = [lon, lat]
const str = `${lon},${lat}`

const pairs = [
  // normalization
  [latlon, ll(latlon)],
  [latlon, ll(point)],
  [latlon, ll(coordinates)],
  [latlon, ll(str)],

  // convert to type, normalizes to `latlng` first in each function
  [ll.toCoordinates(latlon), coordinates],
  [ll.toPoint(latlon), point],
  [ll.toString(latlon), str],

  // if the type is known, use the specific convert function directly
  [latlon, ll.fromLatlng(latlon)],
  [latlon, ll.fromCoordinates(coordinates)],
  [latlon, ll.fromPoint(point)],
  [latlon, ll.fromString(str)]
]

pairs.forEach((pair) => assert.deepEqual(pair[0], pair[1]))
