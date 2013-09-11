var async = require('async');
var fs = require('fs');

var scraper = require('./scraper');
var firstLoadData = require('./scores.json');
var League = require('./teams');
var league = new League(firstLoadData.scores, firstLoadData.aliases);

exports.getTop = function (n) {
  return league.top(n);
};

var metric = function (score) {
  return (score || 700);
};

var saveScores = function () {
  fs.writeFileSync('./scores.json', league + '');
};

exports.getPlayers = function () {
  return Object.keys(league.aliases);
};

// refresh an array of users in parallel via the scraper
exports.refresh = function (normalAliases, cb) {
  var users = league.convert(normalAliases);
  var fns = users.map(function (u) {
    return scraper.bind(null, u);
  });
  async.parallel(fns, function (err, datas) {
    if (err) {
      return cb(err);
    }
    datas.map(function (data) {
      if (data.ffa > 0) {
        league.score(data.name, metric(data.ffa));
      }
    });
    saveScores();
    // NB: cached scores are now the metricified scores
    cb(null, datas.map(function (data) {
      return {
        name: data.name,
        rank: metric(data.ffa)
      };
    }));
  });
};

exports.addPlayer = function (name, alias) {
  league.add(name, alias, metric()); // blank score
  exports.refresh([name], saveScores); // until refresh finishes
};

exports.removePlayer = function (name) {
  league.remove(name);
  saveScores(); // can save immediately
};

exports.fairestMatch = function (normalAliases) {
  return league.fairestMatch(normalAliases);
}
