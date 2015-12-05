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

Client.prototype.show = function (id, callback) {
  this._request('/shows/' + id, 'GET', null, callback)
}

Client.prototype.shows = function (callback) {
  this._request('/shows', 'GET', null, callback)
}

Client.prototype.search = function (show, options, callback) {
  var defaultSearch = false

  if (typeof (options) === 'function' && callback === undefined) {
    callback = options
  }

  if (typeof (options) === 'object') {
    defaultSearch = options.single || false
  }

  if (defaultSearch) {
    this._request('/singlesearch/shows', 'GET', { q: show }, callback)
  } else {
    this._request('/search/shows', 'GET', { q: show }, callback)
  }
}

module.exports = Client
