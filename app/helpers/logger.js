const bunyan = require("bunyan");
const RotatingFileStream = require("bunyan-rotating-file-stream");
const fs = require("fs");

module.exports = (() => {
  // check if logs dir exists
  if ( !fs.existsSync(global.config.logger) ) {
    fs.mkdirSync( global.config.logger );
  }

  return bunyan.createLogger({
    name: "meme_station",
    streams: [
      {
        stream: new RotatingFileStream({
          path: `${global.config.logger}/%Y%m%d.log`,
          period: "1d",            // daily rotation
          level : 'warn',
          rotateExisting: true,
          gzip: true              // Compress the archive log files to save space
        })
      },
      {
        level: "info",
        stream: process.stdout
      }
    ]
  });
})();