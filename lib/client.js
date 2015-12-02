var request = require('client-request')
var qs = require('querystring')

function Client (options) {
  this.options = options || {}
  this.endpoint = this.options.endpoint || 'http://api.tvmaze.com'
}

Client.prototype._request = function (path, method, params, callback) {
  var uri = this.endpoint + path

  if (params) {
    uri = uri + '?' + qs.encode(params)
  }

  request({
    uri: uri,
    method: method,
    json: true
  }, function (err, res, body) {
    if (err) return callback(err)

    if (res.statusCode !== 200) return callback(new Error('An error ocurred in the request'))

    callback(null, body)
  })
}

Client.prototype.shows = function (callback) {
  this._request('/shows', 'GET', null, callback)
}

Client.prototype.search = function (show, once, callback) {
  var uri = ''

  if (!callback) {
    callback = once
    uri = '/search/shows'
  } else {
    if (typeof once.single === 'undefined' || typeof once.single !== 'boolean') {
      return callback(new Error('The second argument must be a  JSON type and should contain an Boolean variable type called `single` or use the function with two arguments (string-search, callback)'))
    }

    if (once.single) uri = '/search/show'
    else uri = '/search/shows'
  }

  this._request(uri, 'GET', { q: show }, callback)
}

Client.prototype.searchById = function (id, callback) {
  this._request('/search/show', 'GET', {id: id}, callback)
}

module.exports = Client
