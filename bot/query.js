var curve = require('../');
var cfgPath = require('confortable')('.curvestat.json', process.cwd());
var cfg = require(cfgPath);
var admins = cfg.admins || [];
Object.keys(cfg.players).forEach(function (alias) {
  curve.addPlayer(alias, cfg.players[alias]);
});

module.exports = function (gu) {

  gu.on(/^register (\w*) (\w*)$/, function (alias, curveName, from) {
    if (!admins.length || admins.indexOf(from) >= 0) {
      curve.addPlayer(alias, curveName)
    }
  });
  gu.on(/^unregister (\w*)/, function (alias, from) {
    if (!admins.length || admins.indexOf(from) >= 0) {
      curve.removePlayer(alias);
    }
  });

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

  gu.on(/^help/, function () {
    gu.say('Create or join a game with "curve k", to sign up for someone else "curve yes for nick"');
    gu.say('"curve gogo" to generate, and "curve end" to clear state');
    gu.say('Extras: "buzz", "top n", "check nick1 ..", "teams n nick1 .."');
  });

};
