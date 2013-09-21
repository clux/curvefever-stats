var async = require('async');
var scraper = require('./scraper');
var League = require('./teams');

function Curver(cachedObj, saveCb, metricFn) {
  if (!(this instanceof Curver)) {
    return new Curver(cachedObj, saveCb, metricFn);
  }
  this.league = new League(cachedObj);
  // TODO: new metricFn needs to wipe this.scores... not ideal
  // how do we know if we changed the metric?
  this.metric = function (score) {
    score = score || 700; // 700 is default for new players
    return metricFn ? metricFn(score) : score;
  };
  var league = this.league;
  this.saveScores = function () {
    if (saveCb) {
      saveCb(league + '');
    }
  };
}

Curver.prototype.getTop = function (n) {
  return this.league.top(n);
};

Curver.prototype.getPlayers = function () {
  return Object.keys(this.league.aliases);
};

// refresh an array of users in parallel via the scraper
Curver.prototype.refresh = function (normalAliases, cb) {
  var that = this;
  var users = that.league.convert(normalAliases);
  var fns = users.map(function (u) {
    return scraper.user.bind(null, u);
  });
  async.parallel(fns, function (err, datas) {
    if (err) {
      return cb(err);
    }
    datas.map(function (data) {
      if (data.ffa > 0) {
        that.league.score(data.name, that.metric(data.ffa));
      }
    });
    that.saveScores();
    // NB: cached scores are now the metricified scores
    cb(null, datas.map(function (data) {
      return {
        name: data.name,
        rank: that.metric(data.ffa)
      };
    }));
  });
};

Curver.prototype.addPlayer = function (name, alias) {
  if (this.league.aliases[name] !== alias) {
    this.league.add(name, alias, this.metric()); // blank score
    this.refresh([name], this.saveScores); // until refresh finishes
  }
};

Curver.prototype.removePlayer = function (name) {
  this.league.remove(name);
  this.saveScores(); // can save immediately
};

Curver.prototype.fairestMatch = function (normalAliases) {
  return this.league.fairestMatch(normalAliases);
};

module.exports = Curver;
