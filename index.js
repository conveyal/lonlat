
module.exports = normalize
module.exports.fromCoordinates = module.exports.fromGeoJSON = fromCoordinates
module.exports.fromLatlng = module.exports.fromLatlon = module.exports.fromLeaflet = fromLatlon
module.exports.fromPoint = fromPoint
module.exports.fromString = fromString

module.exports.print = function print (input, fixed) {
  var ll = normalize(input)
  return ll.lon.toFixed(fixed || 5) + ', ' + ll.lat.toFixed(fixed || 5)
}

module.exports.isEqual = function (latlon1, latlon2, epsilon) {
  latlon1 = normalize(latlon1)
  latlon2 = normalize(latlon2)
  epsilon = epsilon || 0
  return (Math.abs(latlon1.lat - latlon2.lat) <= epsilon) && (Math.abs(latlon1.lon - latlon2.lon) <= epsilon)
}

module.exports.toCoordinates = module.exports.toGeoJSON = function toCoordinates (input) {
  var ll = normalize(input)
  return [ll.lon, ll.lat]
}

module.exports.tolatlon = function tolatlon (input) {
  return normalize(input)
}

module.exports.toPoint = function toPoint (input) {
  var ll = normalize(input)
  return {x: ll.lon, y: ll.lat}
}

module.exports.toString = function toString (input) {
  var ll = normalize(input)
  return ll.lon + ',' + ll.lat
}

module.exports.toLeaflet = function toLeaflet (input) {
  if (!window.L) throw new Error('Leaflet not found.')
  var ll = normalize(input)
  return window.L.latLng(ll.lat, ll.lon)
}

function fromCoordinates (coordinates) {
  return floatize({lon: coordinates[0], lat: coordinates[1]})
}

function fromLatlon (latlon) {
  return floatize(latlon)
}

function fromPoint (point) {
  return floatize({lon: point.x, lat: point.y})
}

function fromString (str) {
  const arr = str.split(',')
  return floatize({lon: arr[0], lat: arr[1]})
}

function floatize (latlon) {
  const lon = parseFloat(latlon.lon || latlon.lng || latlon.longitude)
  return {lng: lon, lon: lon, lat: parseFloat(latlon.lat || latlon.latitude)}
}

function normalize (unknown) {
  if (!unknown) throw new Error('Value must not be null or undefined.')
  if (Array.isArray(unknown)) return fromCoordinates(unknown)
  else if (typeof unknown === 'string') return fromString(unknown)
  else if (unknown.x && unknown.y) return fromPoint(unknown)
  return floatize(unknown)
}
