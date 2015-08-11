/*Get Home page*/
module.exports.home = function(req, res){
	res.render('index', { title: 'Home Page' }); //call index.ejs
};

