var $ = require('subset');

// NB: Score numbers are sorted descending, i.e. higher number => higher rank
function League(cache) {
  if (!(this instanceof League)) {
    return new League(cache);
  }
  this.scores = cache.scores || {};   // { 'gameAlias': Score }
  this.aliases = cache.aliases || {}; // { 'normalAlias' : 'gameAlias' }
  this.users = Object.keys(this.scores); // keys of scores
}

League.prototype.convert = function (normalAliases) {
  // nub in case one gameAlias has many normalAliases
  var that = this;
  return $.nub((normalAliases || Object.keys(this.aliases)).map(function (nA) {
    return that.aliases[nA];
  }).filter(function (a) {
    return a !== undefined;
  }));
};

League.prototype.toString = function () {
  return JSON.stringify({
    aliases: this.aliases,
    scores: this.scores
  }, null, " ");
};

League.prototype.top = function (n) {
  var that = this;
  return this.users.sort(function (x, y) {
    return that.scores[y] - that.scores[x];
  }).slice(0, n).map(function (u) {
    return { name: u, score: that.scores[u] };
  });
};

// so we don't have to remember the gameAlias any more
League.prototype.add = function (normalAlias, gameAlias, score) {
  this.aliases[normalAlias] = gameAlias;
  this.scores[gameAlias] = score;
  this.users.push(gameAlias);
};

League.prototype.remove = function (normalAlias) {
  var gameAlias = this.aliases[normalAlias];
  delete this.aliases[normalAlias];
  if (gameAlias) {
    delete this.scores[gameAlias];
    this.users.splice(this.users.indexOf(gameAlias), 1);
  }
};

// score with gameAlias because it comes from a scraper
League.prototype.score = function (gameAlias, newScore) {
  this.scores[gameAlias] = newScore;
};

var powerSet = function (input) {
  return input.reduce(function (powerset, item) {
    // for every subset in the current power set, make a new one that combines item
    return powerset.reduce(function(powerset, subset) {
      powerset.push(subset.concat(item));
      return powerset;
    }, powerset);
  }, [[]]);
};

var makeTeams = function (players) {
  var minLen = Math.floor(players.length/2);
  var maxLen = Math.ceil(players.length/2);

  return powerSet(players).filter(function (subset) {
    // start out with a subset of the powerSet (with sensible teamRed length)
    return minLen <= subset.length && subset.length <= maxLen;
  }).map(function (team) {
    // combine the subset with the remaining players so that we have partitioned them
    return [team.sort($.compare()), $.difference(players, team).sort($.compare())];
  }).reduce(function (acc, teams) {
    // remove de facto duplicates (i.e. teamRed == teamBlue earlier on)
    var exists = acc.some(function (ts) {
      return ts[0].join('') === teams[1].join('');
    });
    if (!exists) {
      acc.push(teams);
    }
    return acc;
  }, []);
};

// team is an array of aliases
var computeTeamSum = function (scores, team) {
  return team.reduce(function (acc, alias) {
    return acc + scores[alias];
  }, 0);
};
// teams is a pair of two teams
var computeTeamDiff = function (scores, teams) {
  var sumA = computeTeamSum(scores, teams[0]);
  var sumB = computeTeamSum(scores, teams[1]);
  return Math.abs(sumA - sumB);
};

League.prototype.fairestMatch = function (namesInUse) {
// ensure all namesInUse have scores
  var usedAliases = [];
  for (var i = 0; i < namesInUse.length; i += 1) {
    var name = namesInUse[i];
    var alias = this.aliases[name];
    if (!alias) {
      return 'No player information for ' + name;
    }
    if (usedAliases.indexOf(alias) >= 0) {
      return 'Cannot use `' + alias + '` twice';
    }
    usedAliases.push(alias);
  }
  if (usedAliases.length < 2) {
    return "Need at least two players to compute best team options";
  }

  // take every possible combination of Math.floor(usedAliases.length/2)
  // then match every combination up with the missing players
  var possibleCombos = makeTeams(usedAliases);

  // sort possible combos based on how the two teams fare in terms of handicap sum
  var differ = computeTeamDiff.bind(null, this.scores);
  possibleCombos.sort(function (x, y) {
    return differ(x) - differ(y);
  });

  var best = []; // collect (up to) the 5 best combos
  for (var k = 0; best.length < 5 && k < possibleCombos.length; k += 1) {
    var teams = possibleCombos[k];
    best.push({
      teams: teams[0].join(', ') + ' vs. ' + teams[1].join(', '),
      diff: computeTeamDiff(this.scores, teams)
    });
  }
  return best; // will contain best 3 guesses if at least 3 players
};

module.exports = League;
