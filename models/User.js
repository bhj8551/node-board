// models/User.js
let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');

// schema
let userSchema = mongoose.Schema({
  username: {type: String, required:[true, 'Username is required!'], unique:true},
  password: {type: String, required:[true, 'Password is required!'], select:false},
  name: {type: String, required:[true, 'Nmae is required!']},
  email: {type: String},
}, {
  toObject: {virtuals:true}
});

// virtuals
userSchema.virtual('passwordConfirmation')
  .get(function(){ return this._passwordConfirmation; })
  .set(function(value){ this._passwordConfirmation=value; });

userSchema.virtual('originalPassword')
  .get(function(){ return this._originalPassword; })
  .set(function(value){ this._originalPassword=value; });

userSchema.virtual('currentPassword')
  .get(function(){ return this._currentPassword; })
  .set(function(value){ this._currentPassword=value; });

userSchema.virtual('newPassword')
  .get(function(){ return this._newPassword; })
  .set(function(value){ this._newPassword=value; });

// password validation
userSchema.path('password').validate(function(v) {
  let user = this; // 3-1
  // create user
  if(user.isNew){ // 3-2
    if(!user.passwordConfirmation){
      user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
    }

    if(user.password !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
  // update user
  if(!user.isNew){
    if(!user.currentPassword){
      user.invalidate('currentPassword', 'Current Password is required!');
    }
    else if(bcrypt.compareSync(user.currentPassword != user.originalPassword)){
      user.invalidate('currentPassword', 'Current Password is invalid!');
    }

    if(user.newPassword !== user.passwordConfirmation) {
      user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
    }
  }
});

// hash password
userSchema.pre('save', function (next){
  let user = this;
  if(!user.isModified('password')){ // 3-1
    return next();
  }
  else {
    user.password = bcrypt.hashSync(user.password); //3-2
    return next();
  }
});

// model methods // 4
userSchema.methods.authenticate = function (password) {
  var user = this;
  return bcrypt.compareSync(password,user.password);
};

// model & export
let User = mongoose.model('user', userSchema);
module.exports = User;
