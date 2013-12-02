var tap = require('tap')
  , test = tap.test
  , Curver = require('../')
  , curve = new Curver({aliases: {'myNick': 'ealbrigt'}});

test("curver.getLastMatch", function (t) {
  curve.getLastMatch(['myNick'], function (err, res) {
    if (err) {
      t.equal(err, null, "fetch last match");
      t.end();
      return;
    }

    t.equal(typeof res, 'object', "res is an object");
    t.ok(res.scores.length > 1, "got all results data");
    t.ok(res.scores[0].score > 0, "winner has positive score");
    t.notEqual(['+', '-', '0'].indexOf(res.scores[0].rankChange[0]), -1, 'change set');
    t.notEqual(['+', '-', '0'].indexOf(res.maxChange.rankChange[0]), -1, 'maxChange set');
    t.ok(res.id > 0, "id is included");
    if (res.teamData) {
      t.ok(res.teamData.winners.score >= 10, "winners won");
      t.ok(res.teamData.winners.score > res.teamData.losers.score, "losers lost");
    }
    else {
      t.equal(res.scores[0].teamScore, undefined, "not a team game");
    }
    t.end();
  });
});
