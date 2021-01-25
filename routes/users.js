// routes/users.js
let express = require('express');
let router = express.Router();
let User = require('../models/User');

// index
router.get('/', (req, res) => {
  User.find({})
  .sort({username:1})
  .exec((err, users) => {
    if(err) return res.json(err);
    res.render('users/index', {users:users});
  });
});

// New
router.get('/new', (req, res) => {
  let user = req.flash('user')[0] || {};
  let errors = req.flash('errors')[0] || {};
  res.render('users/new', {user:user, errors:errors});
});

// create
router.post('/', (req, res) => {
  User.create(req.body, (err, user) => {
    // user 생성 시 오류가 있으면 user, error flash를 만들고 new페이지로 redirect
    if(err){
      req.flash('user', req.body);
      req.flash('errors', parseError(err));
      return res.redirect('/users/new');
    }
    res.redirect('/users');
  });
});

// show
router.get('/:username', (req, res) => {
  User.findOne({username:req.params.username}, (err, user) => {
    if(err) return res.json(err);
    res.render('users/show', {user:user});
  });
});

// edit
router.get('/:username/edit', (req, res) => {
  let user = req.flash('user')[0];
  let errors = req.flash('errors')[0] || {};
  if(!user){
  User.findOne({username:req.params.username}, (err, user) => {
      if(err) return res.json(err);
      res.render('users/edit', {username:req.params.username, user:user, errors:errors});
    });
  }
  else {
    res.render('users/edit', { username:req.params.username, user:user, errors:errors});
  }
});

// update
router.put('/:username', (req, res, next) => {
  User.findOne({username:req.params.username})
  .select('password')
  .exec((err, user) => {
    if(err) return res.json(err);

    // update user object
    user.originalPassword = user.password;
    user.password = req.body.newPassword? req.body.newPassword : user.password;
    for(let p in req.body){
      user[p] = req.body[p];
    }

    // save updated user
    user.save((err, user) => {
      if(err)
      {
        req.flash('user', req.body);
        req.flash('errors', parseError(err));
        return res.redirect('/users/'+req.params.username+'/edit');
      }
      res.redirect('/users/'+user.username);
    });
  });
});

// destroy
router.delete('/:username', (req, res) => {
  User.deleteOne({username:req.params.username}, (err) => {
    if(err) return res.json(err);
    res.redirect('/users');
  });
});

// functions
let parseError = errors => {
  console.log("errors: ", errors);
  let parsed = {};
  if(errors.name == 'ValidationError'){
    for(let name in errors.errors){
      let validationError = errors.errors[name];
      parsed[name] = {message:validationError.message};
    }
  }
  else if(errors.code == '11000' && errors.errmsg.indexOf('username') > 0) {
    parsed.username = { message:'This username already exists!' };
  }
  else {
    parsed.unhandled = JSON.stringify(errors);
  }
  return parsed;
}

module.exports = router;
