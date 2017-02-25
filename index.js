
module.exports = normalize
module.exports.fromCoordinates = module.exports.fromGeoJSON = fromCoordinates
module.exports.fromLatlng = module.exports.fromLeaflet = fromLatlng
module.exports.fromPoint = fromPoint
module.exports.fromString = fromString

module.exports.print = function print (input, fixed) {
  var ll = normalize(input)
  return ll.lon.toFixed(fixed || 5) + ', ' + ll.lat.toFixed(fixed || 5)
}

module.exports.isEqual = function (lonlat1, lonlat2, epsilon) {
  lonlat1 = normalize(lonlat1)
  lonlat2 = normalize(lonlat2)
  epsilon = epsilon || 0
  return (Math.abs(lonlat1.lat - lonlat2.lat) <= epsilon) && (Math.abs(lonlat1.lon - lonlat2.lon) <= epsilon)
}

module.exports.toCoordinates = module.exports.toGeoJSON = function toCoordinates (input) {
  var ll = normalize(input)
  return [ll.lon, ll.lat]
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

function fromLatlng (lonlat) {
  return floatize(lonlat)
}

function fromPoint (point) {
  return floatize({lon: point.x, lat: point.y})
}

function fromString (str) {
  var arr = str.split(',')
  return floatize({lon: arr[0], lat: arr[1]})
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

function normalize (unknown) {
  if (!unknown) throw new Error('Value must not be null or undefined.')
  if (Array.isArray(unknown)) return fromCoordinates(unknown)
  else if (typeof unknown === 'string') return fromString(unknown)
  else if ((unknown.x || unknown.x === 0) && (unknown.y || unknown.y === 0)) return fromPoint(unknown)
  return floatize(unknown)
}
