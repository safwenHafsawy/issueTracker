const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let testId;
const project = "testapi";

suite("Functional Tests", function () {
  suite("Testing Post Request", function () {
    test("Create an issue with every field", function (done) {
      this.timeout(5000);
      const testObj = {
        issue_title: "exmaple",
        issue_text: "text example",
        created_by: "name",
        assigned_to: "assigned to name",
        status_text: "status example",
      };
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send(testObj)
        .end(function (err, res) {
          testId = res.body._id;
          assert.strictEqual(err, null);
          assert.equal(res.status, 201);
          assert.isObject(res.body);
          assert.property(res.body, "assigned_to");
          assert.property(res.body, "issue_text");
          assert.property(res.body, "created_by");
          assert.property(res.body, "status_text");
          assert.property(res.body, "open");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "_id");
          done();
        });
    });
    test("Create an issue with only required fields", function (done) {
      this.timeout(5000);
      const testObj = {
        issue_title: "exmaple",
        issue_text: "text example",
        created_by: "name",
        assigned_to: "",
        status_text: "",
      };
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send(testObj)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.equal(res.status, 201);
          assert.isObject(res.body);
          assert.property(res.body, "assigned_to");
          assert.property(res.body, "issue_text");
          assert.property(res.body, "created_by");
          assert.property(res.body, "status_text");
          assert.property(res.body, "open");
          assert.property(res.body, "created_on");
          assert.property(res.body, "updated_on");
          assert.property(res.body, "_id");
          done();
        });
    });
    test("Create an issue with missing required fields", function (done) {
      this.timeout(5000);
      const testObj = {
        project: "apitest",
        issue_title: "",
        issue_text: "text example",
        assigned_to: "",
        status_text: "",
      };
      const expectedObj = { error: "required field(s) missing" };
      chai
        .request(server)
        .post(`/api/issues/${project}`)
        .send(testObj)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.deepEqual(res.body, expectedObj);
          done();
        });
    });
  });
  suite("Testing GET route", function () {
    test("View issues on a project", function (done) {
      this.timeout(5000);
      chai
        .request(server)
        .get(`/api/issues/${project}`)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
    test("View issues on a project with one filter", function (done) {
      this.timeout(5000);
      chai
        .request(server)
        .get(`/api/issues/${project}`)
        .query({ open: true })
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
    test("View issues on a project with multiple filter", function (done) {
      this.timeout(5000);
      const project = "testapi";
      chai
        .request(server)
        .get(`/api/issues/${project}`)
        .query({ open: true, created_by: "test" })
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          done();
        });
    });
  });
  suite("tetsing PUT route", function () {
    this.timeout(5000);
    test("Update one field on an issue", function (done) {
      const updatedObj = {
        _id: testId,
        issue_title: "functional testing",
      };
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updatedObj)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 201);
          assert.isObject(res.body);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, updatedObj._id);
          done();
        });
    });
    test("Update multiple fields on an issue", function (done) {
      this.timeout(5000);
      const updatedObj = {
        _id: testId,
        issue_title: "functional testing",
        created_by: "naruto",
      };
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updatedObj)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 201);
          assert.isObject(res.body);
          assert.equal(res.body.result, "successfully updated");
          assert.equal(res.body._id, updatedObj._id);
          done();
        });
    });
    test("Update an issue with missing _id", function (done) {
      this.timeout(5000);
      const updatedObj = {
        issue_title: "functional testing",
        created_by: "naruto",
      };
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updatedObj)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.deepEqual(res.body, { error: "missing _id" });
          done();
        });
    });
    test("Update an issue with no fields to update", function (done) {
      this.timeout(5000);
      const updatedObj = {
        _id: testId,
      };
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updatedObj)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.deepEqual(res.body, {
            error: "no update field(s) sent",
            _id: updatedObj._id,
          });
          done();
        });
    });
    test("Update an issue with an invalid _id", function (done) {
      this.timeout(5000);
      const updatedObj = {
        _id: 1,
        issue_text: "hello",
      };
      chai
        .request(server)
        .put(`/api/issues/${project}`)
        .send(updatedObj)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.isObject(res.body);
          assert.deepEqual(res.body, {
            error: "could not update",
            _id: updatedObj._id,
          });
          done();
        });
    });
  });
  suite("DELETE route test", function () {
    this.timeout(5000);
    test("Delete an issue", function (done) {
      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send({ _id: testId })
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.deepEqual(res.body, {
            result: "successfully deleted",
            _id: testId,
          });
          done();
        });
    });
    test("Delete an issue with an invalid _id", function (done) {
      this.timeout(5000);
      const invalidID = 1;
      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .send({ _id: invalidID })
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.deepEqual(res.body, {
            error: "could not delete",
            _id: invalidID,
          });
          done();
        });
    });
    test("Delete an issue with missing _id", function (done) {
      this.timeout(5000);
      chai
        .request(server)
        .delete(`/api/issues/${project}`)
        .end(function (err, res) {
          assert.strictEqual(err, null);
          assert.strictEqual(res.status, 200);
          assert.deepEqual(res.body, { error: "missing _id" });
          done();
        });
    });
  });
});
