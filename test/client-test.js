var test = require('tape')
var nock = require('nock')
var tvmaze = require('../')
var Client = require('../lib/client')

var endpoint = 'http://api.tvmaze.test'

test('should create a client', function (t) {
  t.ok(tvmaze.createClient, 'should exist')
  t.equals(typeof tvmaze.createClient, 'function', 'should be a function')

  var client = tvmaze.createClient()
  t.ok(client instanceof Client, 'should be instance of Client')
  t.end()
})

test('should fail with unknown endpoint', function (t) {
  var client = tvmaze.createClient({ endpoint: endpoint })
  nock(endpoint)
    .get('/foo')
    .reply(404)

  client._request('/foo', 'GET', null, function (err, body) {
    t.ok(err, 'request failed')
    t.end()
  })
})

test('should list shows', function (t) {
  var client = tvmaze.createClient({ endpoint: endpoint })
  t.equals(typeof client.shows, 'function', 'should be a function')

  nock(endpoint)
    .get('/shows')
    .reply(200, [])

  client.shows(function (err, shows) {
    t.error(err, 'should not be an error')
    t.ok(Array.isArray(shows), 'should be an array')
    t.end()
  })
})

test('should search shows', function (t) {
  var client = tvmaze.createClient({ endpoint: endpoint })
  t.equals(typeof client.search, 'function', 'should be a function')

  nock(endpoint)
    .get('/search/shows')
    .query({ q: 'limitless' })
    .reply(200, [{ name: 'Limitless' }])

  client.search('limitless', function (err, shows) {
    t.error(err, 'should not be an error')
    t.ok(Array.isArray(shows), 'should be an array')
    t.equals(shows[0].name, 'Limitless', 'should retrieve a show name')
    t.end()
  })
})

test('should fail if not query is passed', function (t) {
  var client = tvmaze.createClient({ endpoint: endpoint })

  nock(endpoint)
    .get('/search/shows')
    .reply(400, {
      code: 0,
      message: 'Missing required parameters: q',
      name: 'Bad request',
      status: 400
    })

  client._request('/search/shows', 'GET', null, function (err, res) {
    t.ok(err, 'bad request error')
    t.notOk(res, 'reply should be null')
    t.end()
  })
})

test('should search a show', function (t) {
  var client = tvmaze.createClient({endpoint: endpoint})
  t.equals(typeof client.search, 'function', 'should be a function')

  nock(endpoint)
    .get('/search/show')
    .query({q: 'lost'})
    .reply(200, {name: 'lost'})

  client.search('lost', {single: true}, function (err, show) {
    t.error(err, 'should not be an error')
    t.equals(show.toString(), '[object Object]', 'should by an object')
    t.equals(show.name, 'lost', 'should retrieve a show name')
    t.end()
  })
})

test('should search a shows when the single parameter is false', function (t) {
  var client = tvmaze.createClient({endpoint: endpoint})
  t.equals(typeof client.search, 'function', 'should be a function')

  nock(endpoint)
    .get('/search/shows')
    .query({q: 'The Simpsons'})
    .reply(200, [{name: 'The Simpsons'}])

  client.search('The Simpsons', {single: false}, function (err, shows) {
    t.error(err, 'should not be an error')
    t.ok(Array.isArray(shows), 'should be an array')
    t.equals(shows[0].name, 'The Simpsons', 'should retrieve a show name')
    t.end()
  })
})

test('should fail if not exist a single variable in the JSON parameter', function (t) {
  var client = tvmaze.createClient({endpoint: endpoint})
  t.equals(typeof client.search, 'function', 'should be a function')

  nock(endpoint)
    .get('/search/shows')
    .query({q: 'The Simpsons'})
    .reply(200, [{name: 'The Simpsons'}])

  client.search('The Simpsons', {name: false}, function (err, shows) {
    t.ok(err, 'should be an error')
    t.end()
  })
})

test('should search a show Object', function (t) {
  var client = tvmaze.createClient({endpoint: endpoint})
  t.equals(typeof client.searchById, 'function', 'should be a function')

  nock(endpoint)
    .get('/search/show/1')
    .reply(200, {_id: 1, name: 'lost'})

  client.searchById(1, function (err, show) {
    t.error(err, 'should not be an error')
    t.equals(show.toString(), '[object Object]', 'should be a JSON object')
    t.equals(typeof show._id, 'number', 'the _id variable should be a number')
    t.equals(show._id, 1, 'should retrieve a show _id')
    t.equals(show.name, 'lost', 'show retrieve a show name')
    t.end()
  })
})
