module.exports = process.env.CURVEFEVER_STATS_COV
  ? require('./lib-cov/curve.js')
  : require('./lib/curve.js');
