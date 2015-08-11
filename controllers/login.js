module.exports.login = function(req, res){
	res.render('login', { title: 'Login' });
};
module.exports.todo = function(req, res){
	res.render('index', { title: 'TO DO' }); //call index.ejs
};





