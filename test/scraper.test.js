var tap = require('tap')
  , test = tap.test
  , scrape = require('../scraper');

test("user stats", function (t) {
  t.plan(3);
  scrape.user('ealbrigt', function (err, data) {
    t.equal(data.name, 'ealbrigt', 'fetching data for same player');
    t.ok(data.ffa > 1300, 'pretty decent at ffa');
    t.ok(data.team > 1200, 'not terrible at teamplay');
  });
});

test("last match id", function (t) {
  t.plan(1);
  scrape.findLastMatchId('ealbrigt', function (err, data) {
    t.ok(data > 9496350, 'last game i played had this id');
  });
});

test("get ffa match data", function (t) {
  scrape.getLastMatch(9469502, function (err, data) {
    t.equal(data.length, 6, '6 players in that game');
    t.equal(data[0].name, 'obone', 'obone 1st');
    t.equal(data[0].score, 50, 'obone score');
    t.equal(data[0].rankChange, '+3', 'obone rankchange');
    t.equal(data[1].name, 'ealbrigt', 'ealbrigt 2nd');
    t.equal(data[1].score, 36, 'ealbrigt score');
    t.equal(data[1].rankChange, '-1', 'ealbrigt rankchange');
    t.equal(data[2].name, 'usmate', 'usmate 3rd');
    t.equal(data[2].score, 29, 'usmate score');
    t.equal(data[2].rankChange, '+5', 'usmate rankchange');
    t.equal(data[3].name, 'Criffer', 'Criffer 4th');
    t.equal(data[3].score, 27, 'Criffer score');
    t.equal(data[3].rankChange, '+64', 'Criffer rankchange');
    t.equal(data[4].name, 'tjw', 'tjw 5th');
    t.equal(data[4].score, 20, 'tjw score');
    t.equal(data[4].rankChange, '-3', 'tjw rankchange');
    t.equal(data[5].name, 'JOSE-PANDA', 'JOSE-PANDA 6th');
    t.equal(data[5].score, 18, 'JOSE-PANDA score');
    t.equal(data[5].rankChange, '-4', 'JOSE-PANDA rankchange');

    t.end();
  });
});

test("get team match data", function (t) {
  scrape.getLastMatch(9496358, function (err, data) {
    t.equal(data.length, 8, '8 players in that game');
    t.equal(data[0].name, 'obone', 'obone 1st');
    t.equal(data[0].score, 65, 'obone score');
    t.equal(data[0].teamScore, 10, 'team 1 score obone');
    t.equal(data[1].name, 'andyj', 'andyj 2nd');
    t.equal(data[1].score, 56, 'andyj score');
    t.equal(data[1].teamScore, 10, 'team 1 score andyj');
    t.equal(data[2].name, 'aatukora', 'aatukora 3rd');
    t.equal(data[2].score, 33, 'aatukora score');
    t.equal(data[2].teamScore, 10, 'team 1 score aatukora');
    t.equal(data[3].name, 'rgd_9999', 'rgd_9999 4th');
    t.equal(data[3].score, 32, 'rgd_9999 score');
    t.equal(data[3].teamScore, 10, 'team 1 score rgd_9999');

    t.equal(data[4].name, 'jobrandh', 'jobrandh 5th');
    t.equal(data[4].score, 62, 'jobrandh score');
    t.equal(data[4].teamScore, 3, 'team 2 score jobrandh');
    t.equal(data[5].name, 'ealbrigt', 'ealbrigt 6th');
    t.equal(data[5].score, 53, 'ealbrigt score');
    t.equal(data[5].teamScore, 3, 'team 2 score ealbrigt');
    t.equal(data[6].name, 'Criffer', 'Criffer 7th');
    t.equal(data[6].score, 25, 'Criffer score');
    t.equal(data[6].teamScore, 3, 'team 2 score Criffer');
    t.equal(data[7].name, 'Jammie', 'Jammie 8th');
    t.equal(data[7].score, 21, 'Jammie score');
    t.equal(data[7].teamScore, 3, 'team 2 score Jammie');
    t.end();
  });
});
