/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {

    let bookId;
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        //done();
        chai
          .request(server)
          .post("/api/books")
          .send({
            title: "Harry Potter"
          })
          .end((err, res) => {
            bookId = res.body._id
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.equal(res.body.title, "Harry Potter");
            done();
          })
      });
      
      test('Test POST /api/books with no title given', function(done) {
        //done();
        chai
          .request(server)
          .post("/api/books")
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body);
            assert.equal(res.body, "missing required field title");
            done();
          })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        //done();
        chai
          .request(server)
          .get("/api/books")
          .end((err, res) => {
            assert.isArray(res.body);
            assert.equal(res.status, 200);
            assert.isObject(res.body[0]);
            res.body.forEach((obj) => {
              assert.property(obj, "title");
              assert.property(obj, "_id");
              assert.property(obj, "commentcount");
            })
            done();
          })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        //done();
        chai
          .request(server)
          .get("/api/books/idNotInDb")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body);
            assert.equal(res.body, "no book exists");
            done();
          })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        //done();
        chai
          .request(server)
          .get("/api/books/" + bookId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, "title");
            assert.property(res.body, "_id");
            assert.property(res.body, "comments");
            assert.isArray(res.body.comments);
            assert.equal(res.body._id, bookId);
            done();
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        //done();
        chai
          .request(server)
          .post("/api/books/" + bookId)
          .send({
            comment: "Comment Test 1"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isObject(res.body);
            assert.property(res.body, "_id");
            assert.property(res.body, "title");
            assert.property(res.body, "comments");
            assert.isArray(res.body.comments);
            assert.equal(res.body.comments[0], "Comment Test 1");
            assert.equal(res.body._id, bookId);
            done();
          })
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        //done();
        chai
          .request(server)
          .post("/api/books/" + bookId)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body);
            assert.equal(res.body, "missing required field comment");
            done();
          })
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        //done();
        chai
          .request(server)
          .post("/api/books/idNotInDb")
          .send({
            comment: "Comment Test 2"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body);
            assert.equal(res.body, "no book exists");
            done();
          })
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {

      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        //done();
        chai
          .request(server)
          .delete("/api/books/" + bookId)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body);
            assert.equal(res.body, "delete successful");
            // chai
            //   .request(server)
            //   .get("/api/books/" + bookId)
            //   .end((err, res) => {
            //     assert.equal(res.status, 200);
            //     assert.isString(res.body);
            //     assert.equal(res.body, "no book exists");
            //   })
            done();
          })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        //done();
        chai
          .request(server)
          .delete("/api/books/idNotInDb")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isString(res.body);
            assert.equal(res.body, "no book exists");
            done();
          })
      });

    });

  });

});
