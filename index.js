var http = require('http');
var qs = require('querystring');

function Tomato(key) {
  this.key = key;
}

Tomato.prototype._request = function(options, done) {
  var data = '';
  var base = options.base;
  var query = qs.stringify(options.params);

  http
    .get(base + query, onResponse)
    .on('error', onEnd);

  function onResponse(res) {
    res.on('data', onData);
    res.on('end', onEnd);
  }
  function onData(chunk) {
    data += chunk;
  }
  function onEnd(err) {
    var obj;
    if (data.length) {
      obj = JSON.parse(data).movies;
    }
    return done(err, obj);
  }
};

Tomato.prototype.search = function(title, done) {
  var options = {
    base: 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?',
    params: {
      q: title,
      apikey: this.key
    }
  };
  return this._request(options, function(err, obj) {
    var result = obj || [];
    return done(err, obj);
  });
};

Tomato.prototype.get = function(id, done) {

};

module.exports = function tomatoes(key) {
  return new Tomato(key);
};