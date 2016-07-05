const assert = require('assert')
const ll = require('./')

const lat = 38.13234
const lng = 70.01232
const latlng = {lat, lng}
const point = {x: lng, y: lat}
const coordinates = [lng, lat]
const str = `${lng},${lat}`

const pairs = [
  // normalization
  [latlng, ll(latlng)],
  [latlng, ll(point)],
  [latlng, ll(coordinates)],
  [latlng, ll(str)],

  // convert to type, normalizes to `latlng` first in each function
  [ll.toCoordinates(latlng), coordinates],
  [ll.toPoint(latlng), point],
  [ll.toString(latlng), str],

  // if the type is known, use the specific convert function directly
  [latlng, ll.fromLatlng(latlng)],
  [latlng, ll.fromCoordinates(coordinates)],
  [latlng, ll.fromPoint(point)],
  [latlng, ll.fromString(str)]
]

pairs.forEach((pair) => assert.deepEqual(pair[0], pair[1]))
