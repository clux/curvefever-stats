var curve = require('../');

// join/leave code
var joinReg, leaveReg;
(function () {
  var positives = [
    'yes+z*', 'yu+p+', 'ye+r*p?', 'ya+r*', 'ye*a*h*',
    'aye', 'ja+', 'si', 'oui', 'okay', 'o?k+',
    'a?l?right', 'sure', 'fine', 'jawohl'
  ];
  var negatives = [
    'nein?', 'na+[hw]*', 'nowa[yi]?', 'no?p?e?', 'never', 'later'
  ];
  var straggler = '\\w{0,5}'; // allow some stray characters as well
  var endForReg = straggler + '(?:\\s+fr?o[rm]?\\s*(\\w*))?'; // for|from|fo player
  joinReg = new RegExp('^(' + positives.join('|') + ')' + endForReg, 'i');
  leaveReg = new RegExp('^(' + negatives.join('|') + ')' + endForReg, 'i');
}());

var added = []; // currently signed up people
var limit = 6; // currentlimit

module.exports = function (gu) {

  gu.on(joinReg, function (sentiment, participant, from) {
    var guy = participant || from;
    console.log('yes for', guy);
    if (added.length === limit) {
      var hint = limit < 8 ? ' - say "limit 8" to raise the limit' : '';
      gu.say('Game is full' + hint);
      return;
    }
    if (added.indexOf(guy) >= 0) {
      return; // no double signups
    }
    added.push(guy);
    if (added.length === 1) {
      var link = 'http://curvefever.com/play2.php';
      var room = 'langley:telepresence';
      gu.say('curve game starting soon - "curve: yes" to join');
      gu.say('Register on: ' + link + ' - then join: ' + room);
    }
    gu.say(guy + ' joined (' + added.length + ' / ' + limit + ')');
    if (added.length === limit) {
      gogoFn();
    }
  });

  gu.on(leaveReg, function (sentiment, participant, from) {
    var guy = participant || from;
    console.log('no for', guy);
    if (added.indexOf(guy) >= 0) {
      added.splice(added.indexOf(guy), 1);
      gu.say(guy + ' left (' + added.length + ' / ' + limit + ')');
    }
  });

  var gogoFn = function () {
    if (added.length) {
      gu.say('curve game starting - ' + added.join(', ') + ' - Go go go!');
      if (added.length >= 4) {
        var res = curve.fairestMatch(added);
        if ('string' === typeof res) {
          gu.say('Not generating teams:' + res);
        }
        else {
          var r = res[0];
          gu.say('If teams: ' + r.teams + ' (difference ' + r.diff + ')');
        }
      }
    }
  };
  gu.on(/^gogo/, gogoFn);

  gu.on(/^limit (\d)/, function (n) {
    limit = Math.max(added.length, n | 0);
    gu.say(added.length + ' / ' + limit);
    if (limit === added.length) {
      gogoFn();
    }
  });

  gu.on(/^end/, function () {
    // TODO: could scrape for last result?
    gu.say('game over - "curve: k" to start a new one');
    //curve.refresh(null, function () {}); // TODO: only refresh added
    added = [];
    limit = 6;
  });

};
