
var crypto = require('crypto'),
    User = require('../models/user.js');
    Post = require('../models/post.js'),
   // Comment = require('../models/comment.js');

module.exports = function(app) {
	app.get('/', function (req, res) {
		Post.get(null, function(err, posts){
			if(err){
				posts = [];
			}
			res.render('index', {
				title: 'homepage',
				user: req.session.user,
				posts: posts,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});
	//Disable register, login for Login User
	app.get('/reg', checkNotLogin); 
	app.get('/reg', function (req, res) {
		res.render('register', {
			title: 'register',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/reg', checkNotLogin); //disable register for login user
	app.post('/reg', function (req, res) {
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		//check pass word match
		if(password_re != password){
			req.flash('error', 'These passwords do not match!'); 
			return res.redirect('/reg');
		}
		//Generate md5 of passwords
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
		});
		User.get(newUser.name, function (err, user) {
		if (err) {
			req.flash('error', err);
			return res.redirect('/');
		}
		if (user) {
			req.flash('error', 'The user has already existed!');
			return res.redirect('/reg');//return to register page
		}
		//Create new user if doesn't exist
		newUser.save(function (err, user) {
			if (err) {
				req.flash('error', err);
				return res.redirect('/reg');
			}
			req.session.user = user;//Store user info in session
			req.flash('success', 'Register success!');
			res.redirect('/');//Redirect to Homepage
			});
		});
	});
	app.get('/login', checkNotLogin);
	app.get('/login', function (req, res) {
		res.render('login', {
			title: 'Login',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString() });
	});

	app.post('/login', checkNotLogin);
	app.post('/login', function (req, res) {
	//res.render('login', { title: 'Login' });
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		User.get(req.body.name, function(err, user){
			if(!user){
				req.flash('error', 'The user doesn\'t exist!');
				return res.redirect('/login');
			}
			if(user.password != password){
				req.flash('error', 'The password is incorrect!');
				return res.redirect('/login');
			}
			req.session.user = user;
			req.flash('success', 'Login Success!');
			res.redirect('/');
		});
	});
	//Enable post and logout for Login user
	app.get('/logout', checkLogin);
	app.get('/logout', function (req, res) {
		req.session.user = null;
		req.flash('success', 'Logout success!');
		res.redirect('/');
	});

	app.get('/upload', checkLogin);
	app.get('/upload', function(req, res){
		res.render('upload',{
			title: 'file upload',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	app.post('/upload',checkLogin);
	app.post('/upload', function(req, res){
		req.flash('success', 'File upload success!');
		res.redirect('/upload');
	});

	app.get('/post', checkLogin);
	app.get('/post', function (req, res) {
		res.render('post', { 
			title: 'Create Post',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString() });
	});
	app.post('/post', checkLogin);
	app.post('/post', function (req, res) {
		var curUser = req.session.user,
			post = new Post(curUser.name, req.body.title, req.body.post);
		post.save(function(err){
			if(err){
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', 'Create posts successfully!');
			res.redirect('/');
		});
	});

	//Utility Methods

	function checkLogin(req, res, next){
		if(!req.session.user){
			req.flash('error', 'You do not login, please login to get access!');
			res.redirect('/login');			
		}
		next(); //go to next callback
	}

	function checkNotLogin(req, res, next){
		if(req.session.user){
			req.flash('error', 'You already login successfully.');
			res.redirect('back');
		}
		next();
	}
};