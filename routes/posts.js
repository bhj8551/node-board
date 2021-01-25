// routes/posts.js

let express = require('express');
let router = express.Router();
let Post = require('../models/Post');
let util = require('../util');

// index
router.get('/', (req, res) => {
  Post.find({})
  // user의 값을 author에 생성
  .populate('author')
  .sort('-createdAt')
  .exec((err, posts) => {
    if(err) return res.json(err);
    res.render('posts/index', {posts:posts});
  });
});

// New
router.get('/new', util.isLoggedin, (req, res) => {
  let post = req.flash('post')[0] || {};
  let errors = req.flash('errors')[0] || {};
  res.render('posts/new', { post:post, errors:errors });
});

// create
router.post('/', util.isLoggedin, (req, res) => {
  // 로그인을 하면 passport에서 자동으로 생성해주는 req.user
  req.body.author = req.user._id;
  Post.create(req.body, (err, post) => {
    if(err) {
      req.flash('post', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/posts/new');
    }
    res.redirect('/posts');
  });
});

// show
router.get('/:id', (req, res) => {
  Post.findOne({_id:req.params.id})
    .populate('author')
    .exec((err, post) => {
      if(err) return res.json(err);
      res.render('posts/show', {post:post});
    });
});

// edit
router.get('/:id/edit', util.isLoggedin, checkPermission, (req, res) => {
  let post = req.flash('post')[0];
  let errors = req.flash('errors')[0] || {};
  if(!post){
    Post.findOne({_id:req.params.id}, (err, post) => {
      if(err) return res.json(err);
      res.render('posts/edit', {post:post, errors:errors});
    });
  }
  else {
    post._id = req.params.id;
    res.render('posts/edit', {post:post, errors:errors});
  }
});

// update
router.put('/:id', util.isLoggedin, checkPermission, (req, res) => {
  req.body.updatedAt = Date.now();
  Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, (err, post) => {
    if(err) {
      req.flash('post', req.body);
      req.flash('errors', util.parseError(err));
      return res.redirect('/posts/'+req.params.id+'/edit');
    }
    res.redirect('/posts/'+req.params.id);
  });
});

// destroy
router.delete('/:id', util.isLoggedin, checkPermission, (req, res) => {
  Post.deleteOne({_id:req.params.id}, (err) => {
    if(err) return res.json(err);
    res.redirect('/posts');
  });
});

module.exports = router;

// private functions
function checkPermission(req, res, next){
  Post.findOne({_id:req.params.id}, (err, post) =>{
    if(err) return res.json(err);
    if(post.author != req.user.id) return util.noPermission(req, res);

    next();
  });
}
