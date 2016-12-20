/* globals describe, it */

const assert = require('assert')
const ll = require('./')

const lat = 38.13234
const lon = 70.01232
const lonlat = {lon, lat}
const point = {x: lon, y: lat}
const coordinates = [lon, lat]
const str = `${lon},${lat}`
const latlng = {lat, lng: lon}

describe('lonlat', () => {
  describe('normalization', () => {
    const testCases = [{
      calculated: ll(lonlat),
      description: 'Object with lon and lat keys'
    }, {
      calculated: ll(point),
      description: 'Object with x and y keys'
    }, {
      calculated: ll(coordinates),
      description: 'Array of lon and lat'
    }, {
      calculated: ll(str),
      description: 'String with comma separating lon and lat'
    }]

    testCases.forEach((test) => {
      it(`should normalize from ${test.description}`, () => {
        assert.deepEqual(test.calculated, lonlat)
      })
    })
  })

  describe('translations', () => {
    const testCases = [{
      expected: coordinates,
      method: 'toCoordinates'
    }, {
      expected: point,
      method: 'toPoint'
    }, {
      expected: str,
      method: 'toString'
    }]

    testCases.forEach((test) => {
      it(`should translate using ${test.method}`, () => {
        assert.deepEqual(ll[test.method](lonlat), test.expected)
      })
    })
  })

  describe('known type parsing', () => {
    const testCases = [{
      calculated: ll.fromLatlng(latlng),
      description: 'Object with lon and lat keys'
    }, {
      calculated: ll.fromCoordinates(coordinates),
      description: 'Array of lon and lat'
    }, {
      calculated: ll.fromPoint(point),
      description: 'Object with x and y keys'
    }, {
      calculated: ll.fromString(str),
      description: 'String with comma separating lon and lat'
    }]

    testCases.forEach((test) => {
      it(`should normalize from ${test.description}`, () => {
        assert.deepEqual(test.calculated, lonlat)
      })
    })
  })

  describe('issues', () => {
    it('#3 - Does not parse coordinates with 0 for lat or lon', () => {
      assert.deepEqual(ll({ lat: 0, lng: 0 }), { lat: 0, lon: 0 })
    })
  })
})
