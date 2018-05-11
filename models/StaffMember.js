const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// Basic Staff Member Model Schema
const StaffMemberModelSchema = new Schema({
  firstName: {type: String, required:[true, 'Must provide a first name to create entry!']},
  lastName: {type: String, required:[true, 'Must provide a last name to create entry!']},
  dept: {type: String, required:[true, 'Must provide a department name to create entry!']},
  description: String,
  contact: String,
  avatarUrl: String,
  route: {type: String, required:[true, 'Must provide a route to create entry!']}
});

// Hook up our model with collection name 'pages'
const StaffMemberModel = mongoose.model('staff', StaffMemberModelSchema);

// Export model
module.exports = StaffMemberModel;
