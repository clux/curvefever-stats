# curvefever-stats [![Build Status](https://secure.travis-ci.org/clux/curvefever-stats.png)](http://travis-ci.org/clux/curvefever-stats)
Curvefever-stats is a stat calculator and match maker library for the [curvefever game](http://curvefever.com).

## Usage
Use the library programatically:

```javascript
var curve = require('curvefever-stats')(cachedObj || {})
curve.addPlayer('ea', 'ealbrigt'); // 'ea' == chat name, 'ealbrigt' == curve account name
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

## Installation

```bash
$ npm install curvefever-stats
```

## License
MIT-Licensed. See LICENSE file for details.
