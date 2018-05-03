const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Basic Page Model Schema
const PageModelSchema = new Schema({
  title: {type: String, required:[true, 'Must provide a title to create entry!']},
  content: String,
  route: {type: String, required:[true, 'Must provide a route to create entry!']},
  links: [String]
});

// Hook up our model with collection name 'pages'
const PageModel = mongoose.model('pages', PageModelSchema);

// Export model
module.exports = PageModel;
