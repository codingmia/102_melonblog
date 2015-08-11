var crypto = require('crypto');
var User = require('../models/user.js');

module.exports.welcome = function(req, res){
	res.render('register', { title: 'Sign Up' });
};

module.exports.createUser = function(req, res){
	var name = req.body.name,
		password = req.body.password,
		password_re = req.body['password-repeat']; //match the name in register.ejs
	
	//Verify user-input password are the same
	if(password_re !== password){
		req.flash('error', 'Try again?');
		return res.redirect('/reg');
	}
};
