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

Client.prototype.search = function (show, options, callback) {
  var uri = ''
  var argCount = arguments.length - 1

  if (typeof arguments[argCount] !== 'function') throw new Error('The last arguments should be a function')

  callback = arguments[argCount]

  if (argCount === 1) uri = '/search/shows'
  else {
    if (typeof options.single === 'undefined' || options.toString() !== '[object Object]' || typeof options.single !== 'boolean') {
      return callback(new Error('The second argument must be a  JSON type and should contain an Boolean variable type called `single` or use the function with two arguments (string-search, callback)'))
    }

    if (options.single) uri = '/search/show'
    else uri = '/search/shows'
  }

  this._request(uri, 'GET', { q: show }, arguments[argCount])
}

Client.prototype.searchById = function (id, callback) {
  this._request('/search/show/' + id, 'GET', null, callback)
}

module.exports = Client
