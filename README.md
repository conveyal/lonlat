# lonlat

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]

Lon/lat normalization cause...**sigh**.

No one has agreed on a standard way of representing lon/lat. This is a small normalization library. Use this to convert all outside input before processing internally and convert to an external format right when it's being output.

## Just use the `{lon: ${longitude}, lat: ${latitude}}` representation

Utilizing this won't always be possible/easiest, so please at least adopt the following conventions. Any variables or functions that contain the following names should be represented by the accompanying structure:

* `lonlat`: `{lon: ${longitude}, lat: ${latitude}}`
* `coordinates`: `[${longitude}, ${latitude}]`
* `point`: `{x: ${longitude}, y: ${latitude}}`

If you must convert it to a string, put it in the following format:

* `'${longitude},${latitude}'`

## API

```js
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
```

[npm-image]: https://img.shields.io/npm/v/@conveyal/lonlat.svg?maxAge=2592000&style=flat-square
[npm-url]: https://www.npmjs.com/package/@conveyal/lonlat
[travis-image]: https://img.shields.io/travis/conveyal/lonlat.svg?style=flat-square
[travis-url]: https://travis-ci.org/conveyal/lonlat
