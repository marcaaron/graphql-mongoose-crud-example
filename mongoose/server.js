const mongoose = require('mongoose');
const mongoURI = 'mongodb://admin:password@ds113700.mlab.com:13700/graphql-api';

module.exports = () => {

  mongoose.Promise = global.Promise;
  mongoose.connect(mongoURI)
    .then(res=>console.log('Mongo Connection Established...'))
    .catch(err=>console.log(err));

  const db = mongoose.connection;
  return db;
};
