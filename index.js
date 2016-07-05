
module.exports = normalize
module.exports.fromCoordinates = module.exports.fromGeoJSON = fromCoordinates
module.exports.fromLatlng = module.exports.fromLeaflet = fromLatlng
module.exports.fromPoint = fromPoint
module.exports.fromString = fromString

module.exports.print = function print (input, fixed) {
  var ll = normalize(input)
  return ll.lng.toFixed(fixed || 5) + ', ' + ll.lat.toFixed(fixed || 5)
}

module.exports.isEqual = function (latlng1, latlng2, epsilon) {
  latlng1 = normalize(latlng1)
  latlng2 = normalize(latlng2)
  epsilon = epsilon || 0
  return (Math.abs(latlng1.lat - latlng2.lat) <= epsilon) && (Math.abs(latlng1.lng - latlng2.lng) <= epsilon)
}

module.exports.toCoordinates = module.exports.toGeoJSON = function toCoordinates (input) {
  var ll = normalize(input)
  return [ll.lng, ll.lat]
}

module.exports.toLatlng = function toLatlng (input) {
  return normalize(input)
}

module.exports.toPoint = function toPoint (input) {
  var ll = normalize(input)
  return {x: ll.lat, y: ll.lng}
}

module.exports.toString = function toString (input) {
  var ll = normalize(input)
  return ll.lng + ',' + ll.lat
}

module.exports.toLeaflet = function toLeaflet (input) {
  if (!window.L) throw new Error('Leaflet not found.')
  var ll = normalize(input)
  return new window.L.Latlng(ll.lat, ll.lng)
}

function fromCoordinates (coordinates) {
  return floatize({lng: coordinates[0], lat: coordinates[1]})
}

function fromLatlng (latlng) {
  return floatize(latlng)
}

function fromPoint (point) {
  return floatize({lng: point.x, lat: point.y})
}

function fromString (str) {
  const arr = str.split(',')
  return floatize({lng: arr[0], lat: arr[1]})
}

function floatize (latlng) {
  return {lng: parseFloat(latlng.lng || latlng.lon || latlng.longitude), lat: parseFloat(latlng.lat || latlng.latitude)}
}

function normalize (unknown) {
  if (!unknown) throw new Error('Value must not be null or undefined.')
  if (Array.isArray(unknown)) return fromCoordinates(unknown)
  else if (typeof unknown === 'string') return fromString(unknown)
  else if (unknown.x && unknown.y) return fromPoint(unknown)
  return floatize(unknown)
}

