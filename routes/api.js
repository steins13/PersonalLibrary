/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

module.exports = function (app) {

  const mongoose = require('mongoose');
  mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }) 
    .then(() => {
      console.log("MongoDB connected")
    }) 
    .catch((err) => console.log(err));

  let bookSchema = new mongoose.Schema({
    title: String,
    comments: Array,
    commentcount: Number
  })    

  let Book = new mongoose.model("Book", bookSchema)

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}).select("-comments -__v").exec((err, doc) => {
        if (err) {
          return console.log(err);
        }
        return res.json(doc);
      })
      return 0;
    })
    
    .post(function (req, res){
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (title === undefined || title === '') {
        return res.json("missing required field title")
      }

      let newBook = new Book({
        title: title,
        commentcount: 0
      })
      newBook.save();
      return res.json({
        _id: newBook._id,
        title: title
      });
    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'

      Book.deleteMany({}, (err, doc) => {
        if (err) {
          return console.log(err);
        }
        return res.json("complete delete successful");
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}

      Book.findOne({_id: bookid}).select("-commentcount -__v").exec((err, doc) => {
        if (doc === undefined || doc === '' || doc === null) {
          return res.json("no book exists");
        }
        if (err) {
          return res.json("no book exists")
        }
        return res.json(doc);
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      Book.findOne({_id: bookid}, (err, doc) => {
        if (doc === undefined || doc === null || doc === '') {
          return res.json("no book exists")
        }
        if (comment === '' || comment === undefined || comment === null) {
          return res.json("missing required field comment");
        }
        if (err) {
          return console.log("error");
        }
        let previousComments = doc.comments
        Book.findByIdAndUpdate(bookid, {comments: [...previousComments, comment]}, {new: true}, (err, updatedDoc) => {
          if (err) {
            return console.log(err);
          }
          let commentCount = updatedDoc.comments.length;
          Book.findByIdAndUpdate(bookid, {commentcount: commentCount}, {new: true}, (err, updatedDoc2) => {
            if (err) {
              return console.log(err);
            }
            return res.json({
              comments: updatedDoc2.comments,
              _id: bookid,
              title: updatedDoc2.title
            })
          })
        })
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'

      Book.findByIdAndRemove(bookid, (err, doc) => {
        if (doc === undefined || doc === null || doc === '') {
          return res.json("no book exists");
        }
        if (err) {
          return res.json("no book exists");
        }
        return res.json("delete successful");
      })
    });
  
};
