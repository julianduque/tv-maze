var Client = require('./lib/client')

function createClient (options) {
  return new Client(options)
}

module.exports = {
  createClient: createClient
}
