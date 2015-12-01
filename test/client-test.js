var test = require('tape')
var tvmaze = require('../')
var Client = require('../lib/client')

test('should create a client', function (t) {
  t.ok(tvmaze.createClient, 'should exist')
  t.equals(typeof tvmaze.createClient, 'function', 'should be a function')

  var client = tvmaze.createClient()
  t.ok(client instanceof Client, 'should be instance of Client')
  t.end()
})
