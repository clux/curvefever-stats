var request = require('request')
  , cheerio = require('cheerio');


module.exports = function (player, cb) {
  request("http://curvefever.com/users/" + player, function (err, resp, body) {
    if (!err && resp.statusCode === 200) {
      var $ = cheerio.load(body);
      var stats = $('.profile dd');
      var lastMatch = $(stats[3]).find('tbody tr td a');
      if (lastMatch) {
        var matchUrl = lastMatch.first().attr('href');

      }
      console.log(lastMatch);

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

var findLastMatchId = function (player, cb) {
  request("http://curvefever.com/users/" + player, function (err, resp, body) {
    if (!err && resp.statusCode === 200) {
      var $ = cheerio.load(body);
      var stats = $('.profile dd');
      var lastMatch, id;
      try {
        lastMatch = $(stats[3]).find('tbody tr td a');
        id = lastMatch.first().attr('href').match(/\match\/(\d*)/)[1] | 0;
      }
      catch (e) {
        cb(e);
        return;
      }
      cb(null, id);
    }
    else {
      cb(new Error("Request for player " + player + " failed: " + resp.statusCode));
    }
  });
};

var getLastMatch = function (id, cb) {
  request('http://curvefever.com/achtung/match/' + id, function (err, resp, body) {
    if (!err && resp.statusCode === 200) {
      var $ = cheerio.load(body);
      var stats = $('.content').find('table tbody tr');

      // sorted by players position in FFA
      // sorted by team, then by individual score within team (if teams)
      var scores = [];

      var scoreReg = /(\d*) \((\d*)\)/;
      for (var i = 0; i < stats.length; i += 1) {
        var player = $(stats[i]);
        var scoreString = $(player.children()[1]).text(); // if teams: '10 (65)'
        var isTeam = scoreReg.test(scoreString);
        var rankChange = $(player.children()[4]).text();
        var obj = { name: player.find('a').text() };
        if (isTeam) {
          var match = scoreString.match(scoreReg);
          obj.score = match[2] | 0;
          obj.teamScore = match[1] | 0;
        }
        else {
          obj.score = scoreString | 0;
        }
        obj.rankChange = rankChange;
        scores.push(obj);
      }
      cb(null, scores);
    }
    else {
      cb(new Error("Request for match " + id + " failed: " + resp.statusCode));
    }
  });
};

if (module === require.main) {
  //module.exports('ealbrigt', console.log);
  //findLastMatchId('ealbrigt', console.log)
  getLastMatch(9496358, console.log); // team game
  //getLastMatch(9469502, console.log); // ffa gam
}
