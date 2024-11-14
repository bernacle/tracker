const cliProgress = require('cli-progress');

const multibar = new cliProgress.MultiBar({
  clearOnComplete: false,
  hideCursor: true,
  format: '[{bar}] {percentage}% | {title} | {value}/{total} Records'
}, cliProgress.Presets.shades_grey);

module.exports = multibar;