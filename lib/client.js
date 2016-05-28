var request = require('client-request')
var qs = require('querystring')

function Client(options) {
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

Client.prototype.shows = function (params, callback) {
    if (params)
        this._request('/shows', 'GET', params, callback)
    else
        this._request('/shows', 'GET', null, callback)
}

Client.prototype.search = function (show, callback) {
    this._request('/search/shows', 'GET', { q: show }, callback)
}

Client.prototype.cast = function (id, callback) {
    this._request('/shows/' + id + '/cast', 'GET', null, callback)
}

Client.prototype.episodes = function (id, callback) {
    this._request('/shows/' + id + '/episodes', 'GET', null, callback)
}

module.exports = Client
