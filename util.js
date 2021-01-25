// util.js
﻿
let util = {};

util.parseError = (errors) => {
  let parsed = {};
  if(errors.name == 'ValidationError'){
    for(let name in errors.errors){
      let validationError = errors.errors[name];
      parsed[name] = { message:validationError.message };
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

// 사용자가 로그인 되어있는지 아닌지 판별, 로그인 x면 에러메시지와 함께 로그인 페이지로
util.isLoggedin = (req, res, next) => {
  if(req.isAuthenticated()){
    next();
  }
  else {
    req.flash('errors', {login:'Please login first'});
    res.redirect('/login');
  }
}

// 어떠한 route에 접근권한이 없다고 판단된 경우에 호출되어 에러메시지와 함께 로그인 페이지로
// callback으로 사용하지는 않고 일반 함수로 사용
util.noPermission = (req, res) => {
  req.flash('errors', {login:"You don't have permission"});
  req.logout();
  res.redirect('/login');
}
module.exports = util;
