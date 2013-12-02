var tap = require('tap')
  , test = tap.test
  , scrape = require('../scraper');

test("user stats", function (t) {
  t.plan(3);
  scrape.user('ealbrigt', function (err, data) {
    t.equal(data.name, 'ealbrigt', 'fetching data for same player');
    t.notEqual(data.ffa, undefined, 'pretty decent at ffa');
    t.notEqual(data.team, undefined, 'not terrible at teamplay');
  });
});

test("last match id and match data", function (t) {
  t.plan(7);
  scrape.findLastMatchId('ealbrigt', function (err, id) {
    t.equal(err, null, 'no errors finding match id');
    t.type(id, 'number', 'last game i played had a numeric id');
    scrape.getLastMatch(id, function (err, data) {
      t.equal(err, null, 'no errors finding match data');
      t.ok(data.length, 'players existed in that game');
      var mes = data.filter(function (d) {
        return d.name === 'ealbrigt';
      });
      t.ok(mes.length === 1, 'exactly one me found');
      var i = mes[0];
      t.notEqual(i.rankChange, undefined, 'rankChange set');
      t.notEqual(i.score, undefined, 'score always set');
      // NB: teamScore not verified herein..
    });
  });
});
