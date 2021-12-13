const mongoose = require("mongoose");

const issueSchema = mongoose.Schema({
  project: String,
  assigned_to: String,
  status_text: String,
  open: Boolean,
  issue_title: String,
  issue_text: String,
  created_by: String,
  created_on: Date,
  updated_on: Date,
});

module.exports = mongoose.model("Issue", issueSchema);
