# lonlng
Lat/lon normalization cause...**sigh**.

No one has agreed on a standard way of representing lat/lon. This is a small normalization library. Use this to convert all outside input before processing internally and convert to an external format right when it's being output.

## Just use the `{lon: ${longitude}, lat: ${latitude}}` representation

Utilizing this won't always be possible/easiest, so please at least adopt the following conventions. Any variables or functions that contain the following names should be represented by the accompanying structure:

* `latlon`: `{lon: ${longitude}, lat: ${latitude}}`
* `coordinates`: `[${longitude}, ${latitude}]`
* `point`: `{x: ${longitude}, y: ${latitude}}`

If you must convert it to a string, put it in the following format:

* `'${longitude},${latitude}'`

## API

```js
import assert from 'assert'
import ll from 'lonlng'

const lat = 38.13234
const lon = 70.01232
const latlon = {lat, lon}
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

pairs.forEach(pair => assert.deepEqual(pair[0], pair[1]))
```
