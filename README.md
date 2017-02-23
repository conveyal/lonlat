# lonlat

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

Lon/lat normalization cause...**sigh**.

No one has agreed on a standard way of representing lon/lat. This is a small normalization library. Use this to convert all outside input before processing internally and convert to an external format right when it's being output.

## API

* [lonlat](#lonlatinput)
* [lonlat.fromCoordinates](#lonlatfromcoordinatesar-or-lonlatfromgeojsonarr)
* [lonlat.fromGeoJSON](#lonlatfromcoordinatesar-or-lonlatfromgeojsonarr)
* [lonlat.fromLatlng](#lonlatfromlatlngobj-or-lonlatfromleafletobj)
* [lonlat.fromLeaflet](#lonlatfromlatlngobj-or-lonlatfromleafletobj)
* [lonlat.fromPoint](#lonlatfrompointobj)
* [lonlat.fromString](#lonlatfromstringstr)
* [lonlat.print](#lonlatprintinput-fixed5)
* [lonlat.isEqual](#lonlatisequallonlat1-lonlat2-epsilon0)
* [lonlat.toCoordinates](#lonlattocoordinatesinput)
* [lonlat.toPoint](#lonlattopointinput)
* [lonlat.toString](#lonlattostringinput)
* [lonlat.toLeaflet](#lonlattoleafletinput)

### lonlat(input)

Tries parse input and transform to an output of normalized coordinates.  Will throw an error upon finding invalid coordinates.

#### Arguments

`input (*)`: Can be any of the following:
- an array in the format: [longitude, latitude]
- a string in the format: '{longitude},{latitude}'
- an object with a `x` attribute representing `longitude` and a `y` attribute representing `latitude`
- an object with a `lon`, `lng` or `longitude` attribute and a `lat` or `latitude` attribute

#### Returns

`(Object)`: An object with `lon` and `lat` attributes.

#### Example

```js
var lonlat = require('@conveyal/lonlat')

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
```

### lonlat.fromCoordinates(arr) or lonlat.fromGeoJSON(arr)

Tries to parse from an array of coordinates.  Will throw an error upon finding invalid coordinates.

#### Arguments

`arr (Array)`: An array in the format: [longitude, latitude]

#### Returns

`(Object)`: An object with `lon` and `lat` attributes.

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var position = lonlat.fromCoordinates([12, 34])   // { lon: 12, lat: 34 }
position = lonlat.fromGeoJSON([12, 34])           // { lon: 12, lat: 34 }
```

### lonlat.fromLatlng(obj) or lonlat.fromLeaflet(obj)

Tries to parse from an object.  Will throw an error upon finding invalid coordinates.

#### Arguments

`obj (Object)`: An object with a `lon`, `lng` or `longitude` attribute and a `lat` or `latitude` attribute

#### Returns

`(Object)`: An object with `lon` and `lat` attributes.

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var position = lonlat.fromLatlng({ longitude: 12, latitude: 34 })   // { lon: 12, lat: 34 }
position = lonlat.fromLeaflet({ lng: 12, lat: 34 })                 // { lon: 12, lat: 34 }
```

### lonlat.fromPoint(obj)

Tries to parse from an object.  Will throw an error upon finding invalid coordinates.

#### Arguments

`obj (Object)`: An object with a `x` attribute representing `longitude` and a `y` attribute representing `latitude`

#### Returns

`(Object)`: An object with `lon` and `lat` attributes.

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var position = lonlat.fromPoint({ x: 12, y: 34 })   // { lon: 12, lat: 34 }
```

### lonlat.fromString(str)

Tries to parse from a string.  Will throw an error upon finding invalid coordinates.

#### Arguments

`str (string)`: A string in the format: '{longitude},{latitude}'

#### Returns

`(Object)`: An object with `lon` and `lat` attributes.

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var position = lonlat.fromString('12,34')   // { lon: 12, lat: 34 }
```

### lonlat.print(input, [fixed=5])

Returns a pretty string

#### Arguments

- `input (*)`: Any format mentioned in [lonlat(input)](#lonlatinput)
- `[fixed=5] (Number)`:  The number of digits to round to

#### Returns

`(string)`: A string with the latitude and longitude rounded to the number of decimal places as specified by `fixed`

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var pretty = lonlat.print('12.345678,34')   // '12.34568, 34.00000'
```

### lonlat.isEqual(lonlat1, lonlat2, [epsilon=0])

Checks equality of two inputs within an allowable difference.

#### Arguments

- `lonlat1 (*)`: Any format mentioned in [lonlat(input)](#lonlatinput)
- `lonlat2 (*)`: Any format mentioned in [lonlat(input)](#lonlatinput)
- `[epsilon=0] (Number)`:  The maximum allowable difference of between each latitude and longitude

#### Returns

`(boolean)`: Returns `true` if the inputs are equal or `false` if they are not

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var isEqual = lonlat.isEqual('12,34', [12, 34])   // true
```

### lonlat.toCoordinates(input)

Translates to a coordinate array.

#### Arguments

`input (*)`: Any format mentioned in [lonlat(input)](#lonlatinput)

#### Returns

`(Array)`: An array in the format: [longitude, latitude]

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var coords = lonlat.toCoordinates('12,34')   // [12, 34]
```

### lonlat.toPoint(input)

Translates to point Object.

#### Arguments

`input (*)`: Any format mentioned in [lonlat(input)](#lonlatinput)

#### Returns

`(Object)`: An object with `x` and `y` attributes representing latitude and longitude respectively

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var point = lonlat.toPoint('12,34')   // { x: 12, y: 34 }
```

### lonlat.toString(input)

Translates to coordinate string.

#### Arguments

`input (*)`: Any format mentioned in [lonlat(input)](#lonlatinput)

#### Returns

`(string)`: A string in the format 'latitude,longitude'

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var str = lonlat.toString({ lat: 12, long: 34 })   // '12,34'
```

### lonlat.toLeaflet(input)

Translates to [Leaflet LatLng](http://leafletjs.com/reference.html#latlng) object.  This function requires Leaflet to be installed as a global variable `L` in the window environment.

#### Arguments

`input (*)`: Any format mentioned in [lonlat(input)](#lonlatinput)

#### Returns

`(Object)`: A [Leaflet LatLng](http://leafletjs.com/reference.html#latlng) object

#### Example

```js
var lonlat = require('@conveyal/lonlat')

var position = lonlat.toLeaflet({ lat: 12, long: 34 })   // Leaflet LatLng object
```


[npm-image]: https://img.shields.io/npm/v/@conveyal/lonlat.svg?maxAge=2592000&style=flat-square
[npm-url]: https://www.npmjs.com/package/@conveyal/lonlat
[travis-image]: https://img.shields.io/travis/conveyal/lonlat.svg?style=flat-square
[travis-url]: https://travis-ci.org/conveyal/lonlat
