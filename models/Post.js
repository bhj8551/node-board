// models/Post.js
let mongoose = require('mongoose');

// schema
let postSchema = mongoose.Schema({
  title: {type: String, required: [true, 'Title is required!']},
  body: {type: String, required: [true, 'Body is required!']},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date},
});

// model & export
let Post = mongoose.model('post', postSchema);
module.exports = Post;
