require('dotenv').config()
var config;

// keys.js - figure out what set of credentials to return
if (process.env.NODE_ENV === 'production') {
  // we are in production - return the prod set of keys
  config = process.env.DB_PROD
} else {
  // we are in development - return the dev keys!!!
  config = process.env.DB_DEV

}

module.exports = config;
