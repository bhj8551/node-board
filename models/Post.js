// models/Post.js
let mongoose = require('mongoose');

// schema
let postSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  createAt: {type: Date, default: Date.now},
  updateAt: {type: Date},
});

// model & export
let Post = mongoose.model('post', postSchema);
module.exports = Post;
