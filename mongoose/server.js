// dotenv required so we can pull our mongo db uri out of .env (environment variables)
require('dotenv').config();
const mongoose = require('mongoose');

// Add your mongodb URI in the .env file as MONGODB_URI
const mongoURI = process.env.MONGODB_URI;

// Export our mongodb server so we can call it in our root server file
module.exports = () => {

  mongoose.Promise = global.Promise;
  mongoose.connect(mongoURI)
    .then(res=>console.log('Mongo Connection Established...'))
    .catch(err=>console.log(err));

  const db = mongoose.connection;
  return db;
};
