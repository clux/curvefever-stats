#!/usr/bin/env node
var cfgPath = require('confortable')('.curvestat.json', process.cwd());
if (!cfgPath) {
  throw new Error("When loading curvefever-stats externally, a local config is required");
}
var cfg = require(cfgPath);

var scriptdir = require('path').join(__dirname, 'bot');
var files = ['query.js', 'signup.js'];
var gu = require('gu')(scriptdir, files);

var ircStream = require('irc-stream')(cfg.server, cfg.name, {
  userName: 'curver',
  realName: 'curvefever bot',
  debug: false,
  channels: [cfg.chan]
});

ircStream.pipe(gu).pipe(ircStream);
