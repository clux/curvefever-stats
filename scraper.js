var request = require('request')
  , cheerio = require('cheerio');


module.exports = function (player, cb) {
  request("http://curvefever.com/users/" + player, function (err, resp, body) {
    if (!err && resp.statusCode === 200) {
      var $ = cheerio.load(body);
      var stats = $('.profile dd');
      cb(null, {
        name: player,
        ffa: $(stats[1]).text().slice(0, 4) | 0,
        team: $(stats[2]).text().slice(0, 4) | 0
      });
    }
    else {
      cb(new Error("Request for player " + player + " failed: " + resp.statusCode));
    }
  });

};
