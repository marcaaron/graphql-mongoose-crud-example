const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Basic Page Model Schema
const EventModelSchema = new Schema({
  title: {type: String, required:[true, 'Must provide a title to create entry!']},
  eventDate: {type: String, required:[true, 'Must provide an event date to create entry!']},
  startTime: String,
  endTime: String,
  content: String,
  location: String,
  dateCreated: {type: String, required:[true, 'Must provide a creation date to create entry!']},
  lastModified: {type: String, required:[true, 'Must provide a last modified date to create entry!']},
  category: String,
  allDay: {type: Boolean, required: [true, 'allDay is required to create event']}
});

// Hook up our model with collection name 'pages'
const EventModel = mongoose.model('events', EventModelSchema);

// Export model
module.exports = EventModel;
