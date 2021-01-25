// models/Post.js
let mongoose = require('mongoose');

// schema
let postSchema = mongoose.Schema({
  title: {type: String, required: [true, 'Title is required!']},
  body: {type: String, required: [true, 'Body is required!']},
  // author 추가, user collection의 id와 열결
  author: {type:mongoose.Schema.Types.ObjectId, ref:'user', required:true},
  createdAt: {type: Date, default: Date.now},
  updatedAt: {type: Date},
});

// model & export
let Post = mongoose.model('post', postSchema);
module.exports = Post;
