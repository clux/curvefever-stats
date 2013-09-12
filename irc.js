var Gu = require('gu');
/*var gu = new Gu('irc.rd.tandberg.com', 'curve', {
  userName: 'curver',
  realName: 'curvefever bot',
  debug: false,
  // doesn't make sense to have this bot on more than one chan
  // as per-channel-state is kept in this file
  channels: ['#mario', '#testor']
}, require('path').join(__dirname, 'bot'), ['handlers.js']);
*/

var gu = new Gu('irc.quakenet.org', 'curveBot', {
  userName: 'curver',
  realName: 'curvefever bot',
  debug: false,
  // doesn't make sense to have this bot on more than one chan
  // as per-channel-state is kept in this file
  channels: ['#curveblah']
}, require('path').join(__dirname, 'bot'), ['handlers.js']);
