const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PageModelSchema = new Schema({
  title: {type: String, required:[true, 'Must provide a title to create entry!']},
  content: String,
  route: {type: String, required:[true, 'Must provide a route to create entry!']},
  pages: []
});

const PageModel = mongoose.model('pages', PageModelSchema);

module.exports = PageModel;
