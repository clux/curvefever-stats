var curve = require('./curve')

module.exports = function (gu) {

  gu.on(/^register (\w*) (\w*)$/, curve.addPlayer);
  gu.on(/^unregister (\w*)/, curve.removePlayer);

  gu.on(/^buzz/, function () {
    gu.say(curve.getPlayers().join(' '));
  });


  gu.on(/^check (.*)$/, function (aliases) {
    aliases = aliases.trim().split(" ").slice(0, 8); // max 8 at a time
    curve.refresh(aliases, function (err, objs) {
      if (err) {
        return console.error(err, objs);
      }
      objs.forEach(function (o) {
        gu.say(o.name + ': ' + o.rank);
      });
    });
  });

  gu.on(/^top (\d*)$/, function (n) {
    var top = curve.getTop(Math.min(n | 0, 15));
    top.forEach(function (p, i) {
      gu.say((i+1) + '. ' + p.name + ' (' + p.score + ')');
    });
  });

  gu.on(/^teams (\d*) (.*)/, function (num, aliases) {
    num = Math.max(Math.min(num | 0, 3), 1);
    aliases = aliases.trim().split(" ");
    var res = curve.fairestMatch(aliases);
    if ('string' === typeof res) {
      gu.say(res); // error message
    }
    else {
      res.slice(0, num).forEach(function (obj) {
        gu.say(obj.teams + ' (difference ' + obj.diff + ')');
      });
    }
  });


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
    var endForReg = '(?\:\\s+fr?o[rm]?\\s*(\\w*))?'; // for|from|fo player
    joinReg = new RegExp('^(' + positives.join('|') + ')\\w*' + endForReg, 'i');
    leaveReg = new RegExp('^(' + negatives.join('|') + ')\\w*' + endForReg, 'i');
  }());

  var added = []; // currently signed up people
  var limit = 6; // currentlimit

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
      gu.say('curve game starting soon - "curve: k" to join');
      gu.say('quick link: ' + 'http://curvefever.com/play2.php');
      gu.say('Room "langley", password "telepresence"');
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

  gu.on(/^help/, function () {
    gu.say('Create or join a game with "curve k", to sign up for someone else "curve yes for nick"');
    gu.say('"curve gogo" to generate, and "curve end" to clear state');
    gu.say('Extras: "buzz", "top n", "check nick1 ..", "teams n nick1 .."');
  });

};
