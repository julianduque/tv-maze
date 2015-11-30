var test = require('tape')
var tvmaze = require('../')

test('should create a client', function (t) {
  t.ok(tvmaze.createClient, 'should exist')
  t.equals(typeof tvmaze.createClient, 'function', 'should be a function')
  t.end()
})
