/* globals describe, expect, jest, it */

const ll = require('./')

const lat = 38.13234
const lon = 70.01232
const lonlat = {lon, lat}
const point = {x: lon, y: lat}
const coordinates = [lon, lat]
const str = `${lon},${lat}`
const strLatFirst = `${lat},${lon}`
const latlng = {lat, lng: lon}

describe('lonlat', () => {
  describe('print', () => {
    it('should print basic input', () => {
      expect(ll.print(str)).toEqual('70.01232, 38.13234')
    })
  })

  describe('isEqual', () => {
    it('should not be equal for different coordinates', () => {
      expect(ll.isEqual('123.456,78.9', '123.4567,78.9')).toEqual(false)
    })

    it('should be equal for different coordinates with allowable epsilon', () => {
      expect(ll.isEqual('123.456,78.9', '123.4567,78.9', 0.001)).toEqual(true)
    })
  })

  describe('toLeaflet', () => {
    it('should create leaflet latLng', () => {
      window.L = {
        latLng: jest.fn((lat, lng) => { return { leaflet_lat: lat, leaflet_lng: lng } })
      }

      expect(ll.toLeaflet('0,0')).toEqual({ leaflet_lat: 0, leaflet_lng: 0 })

      window.L = undefined
    })
  })

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
        expect(test.calculated).toEqual(lonlat)
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
        expect(ll[test.method](lonlat)).toEqual(test.expected)
      })
    })
  })

  describe('known type parsing', () => {
    const testCases = [{
      calculated: ll.fromLatlng(latlng),
      description: 'Object with lng and lat keys'
    }, {
      calculated: ll.fromCoordinates(coordinates),
      description: 'Array of lon and lat'
    }, {
      calculated: ll.fromPoint(point),
      description: 'Object with x and y keys'
    }, {
      calculated: ll.fromString(str),
      description: 'String with comma separating lon and lat, respectively'
    }, {
      calculated: ll.fromString(strLatFirst, true),
      description: 'String with comma separating lat and lon, respectively'
    }]

    testCases.forEach((test) => {
      it(`should specifically parse from ${test.description}`, () => {
        expect(test.calculated).toEqual(lonlat)
      })
    })
  })

  describe('errors', () => {
    it('toLeaflet should throw error if leaflet is not loaded', () => {
      expect(() => ll.toLeaflet('0,0')).toThrowErrorMatchingSnapshot()
    })

    describe('invalid coordinates', () => {
      const badCoords = [
        '-999,999',
        '0,999',
        {},
        undefined,
        { lng: 1, latitude: 1234 }
      ]

      badCoords.forEach((data) => {
        it(`should throw error when parsing: ${JSON.stringify(data)}`, () => {
          expect(() => ll(data)).toThrowErrorMatchingSnapshot()
        })
      })
    })
  })

  describe('issues', () => {
    it('#3 - Does not parse coordinates with 0 for lat or lon', () => {
      expect(ll({ lat: 0, lng: 0 })).toEqual({ lat: 0, lon: 0 })
      expect(ll({ x: 0, y: 0 })).toEqual({ lat: 0, lon: 0 })
    })
  })
})
