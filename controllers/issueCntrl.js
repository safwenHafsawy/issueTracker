const issueModel = require("../models/issue");

const createIssue = (req, res) => {
  const optionalFields = { assigned_to: "", status_text: "" };
  const requiredFileds = { issue_title: "", issue_text: "", created_by: "" };
  const project = req.params.project;
  const reqFields = { ...req.body };

  //check if required fileds exits
  for (let field in requiredFileds) {
    if (!reqFields.hasOwnProperty(field)) {
      return res.json({ error: "required field(s) missing" });
    }
  }

  //check if optional fields are defined
  for (let field in optionalFields) {
    if (!reqFields.hasOwnProperty(field)) {
      reqFields[field] = "";
    }
  }

  //check if open is defined
  if (reqFields.open === undefined) reqFields.open = true;

  const issue = new issueModel({
    ...reqFields,
    created_on: new Date().toJSON(),
    updated_on: new Date().toJSON(),
    project,
  });
  issue.save((err, record) => {
    if (err) return res.json(err);
    const temp = { ...record._doc };
    delete temp.project;
    delete temp.__v;
    res.status(201).json(temp);
  });
};

const fetchAllIssues = (req, res) => {
  let result = new Array();
  const project = req.params.project;
  const queryParmas = req.query;
  issueModel.find({ project: project, ...queryParmas }, (err, docs) => {
    if (err) res.json(err);
    docs.forEach((record) => {
      const temp = { ...record._doc };
      delete temp.project;
      delete temp.__v;
      result.push(temp);
    });
    res.status(200).json(result);
  });
};

const updateIssue = (req, res) => {
  const updatedFields = req.body;
  for (let field in updatedFields) {
    if (updatedFields[field] === "") delete updatedFields[field];
  }
  if (updatedFields._id === undefined)
    return res.status(200).json({ error: "missing _id" });
  if (
    JSON.stringify(Object.keys(updatedFields)) ===
    JSON.stringify(Object.keys({ _id: "" }))
  )
    return res
      .status(200)
      .json({ error: "no update field(s) sent", _id: updatedFields._id });

  issueModel
    .findOne({ _id: updatedFields._id })
    .then((record) => {
      if (record === null)
        return res
          .status(200)
          .json({ error: "could not update", _id: updatedFields._id });
      issueModel
        .updateOne(
          { _id: updatedFields._id },
          { ...updatedFields, updated_on: new Date().toJSON() }
        )
        .then(() => {
          res.status(201).json({
            result: "successfully updated",
            _id: updatedFields._id,
          });
        });
    })
    .catch(() =>
      res.json({ error: "could not update", _id: updatedFields._id })
    );
};

const deleteIssue = (req, res) => {
  if (!req.body.hasOwnProperty("_id"))
    return res.status(200).json({ error: "missing _id" });
  const { _id } = req.body;
  issueModel
    .deleteOne({ _id: _id })
    .then(() => {
      res.json({ result: "successfully deleted", _id: _id });
    })
    .catch(() => res.json({ error: "could not delete", _id: _id }));
};

module.exports = { createIssue, fetchAllIssues, updateIssue, deleteIssue };
