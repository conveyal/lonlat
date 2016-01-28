# lonlng
Lat/lon normalization cause...**sigh**.

No one has agreed on a standard way of representing lat/lng. This is a small normalization library. Use this to convert all outside input before processing internally and convert to an external format right when it's being output.

## Just use the `{lng: ${longitude}, lat: ${latitude}}` representation

Utilizing this won't always be possible/easiest, so please at least adopt the following conventions. Any variables or functions that contain the following names should be represented by the accompanying structure:

* `latlng`: `{lng: ${longitude}, lat: ${latitude}}`
* `coordinates`: `[${longitude}, ${latitude}]`
* `point`: `{x: ${longitude}, y: ${latitude}}`

If you must convert it to a string, put it in the following format:

* `'${longitude},${latitude}'`

## API

```js
import assert from 'assert'
import ll from 'lonlng'

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

pairs.forEach(pair => assert.deepEqual(pair[0], pair[1]))
```
