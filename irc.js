#!/usr/bin/env node
var cfgPath = require('confortable')('.curvestat.json', process.cwd());

if (!cfgPath) {
  throw new Error(
    "When loading curvefever-stats externally, a local config is required"
  );
}
var cfg = require(cfgPath);

require('gu')(cfg.server, cfg.name, {
  userName: 'curver',
  realName: 'curvefever bot',
  debug: false,
  // doesn't make sense to have this bot on more than one chan
  // as per-channel-state is kept in this file
  channels: [cfg.chan]
}, require('path').join(__dirname, 'bot'), ['query.js', 'signup.js']);
