"use strict";
const {
  createIssue,
  fetchAllIssues,
  updateIssue,
  deleteIssue,
} = require("../controllers/issueCntrl");
module.exports = function (app) {
  app
    .route("/api/issues/:project")
    .get(fetchAllIssues)

    .post(createIssue)

    .put(updateIssue)

    .delete(deleteIssue);
};
