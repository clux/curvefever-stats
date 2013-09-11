# Curvefever-stats
Curvefever-stats is a stat calculator and match maker for the [curvefever game](http://curvefever.com).

## Usage
Either use the library programatically:

```javascript
var curve = require('curvefever-stats');
curve.addPlayer('ea', 'ealbrigt'); // 'ea' == irc nick, 'ealbrigt' == curve account name
curve.refresh(['ea'], function (err, data) {
  if (!err) {
    console.log(data); // -> [{name: 'ealbrigt', rank: 1400 }]
  }
});

curve.fairestMatch(['ob', 'ea', 'uu', 'aj']); // a few of my friends' accounts registered here
[ { teams: 'obone, usmate vs. ealbrigt, andyj',
    diff: 218 },
  { teams: 'ealbrigt, usmate vs. obone, andyj',
    diff: 284 },
  { teams: 'ealbrigt, obone vs. usmate, andyj',
    diff: 600 } ]
```

Or edit the connection details in `irc.js` and run `$ npm start`, then communicate with the curvebot on the specified channel.

TODO: separate out some of these files into modules so the bot can be used over different transports

## Note
At the moment, the curve stats are scraped of "curvefever.com/user/" and cached in `scores.json`.
TODO: perhaps generalize this

## Installation

```bash
$ git clone git@github.com:clux/curvefever-stats.git
```

## License
MIT-Licensed. See LICENSE file for details.
