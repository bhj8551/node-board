// models/Post.js
let mongoose = require('mongoose');

// schema
let postSchema = mongoose.Schema({
  title: {type: String, required: true},
  body: {type: String, required: true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date},
});

// model & export
let Post = mongoose.model('post', postSchema);
module.exports = Post;
