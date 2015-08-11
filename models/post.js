var mongodb = require('./db');

function Post(name, title, post) {
  this.name = name;
  this.title = title;
  this.post = post;
}

module.exports = Post;

//save posts
Post.prototype.save = function(callback) {
	var date = new Date();
	var time = {
		date: date,
		year : date.getFullYear(),
		month : date.getFullYear() + "-" + (date.getMonth() + 1),
		day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
		date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	};

	//data to be saved in db
	var post = {
		name: this.name,
		time: time,
		title: this.title,
		post: this.post
	};

	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);//Error, return err msg
		}
		//Read post collection
		db.collection('posts', function (err, collection) {
		if (err) {
			mongodb.close();
			return callback(err);//Error, return err msg
		}
		//Inser new post into posts collection
		collection.insert(post, {
			safe: true
			}, function (err) {
				mongodb.close();
				if (err) {
					return callback(err);
				}
				callback(null);//Success! set errror to null
			});
		});
	});
};

//Get posts info
Post.get = function(name, callback) {
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}

		db.collection('posts', function (err, collection) {
			if (err) {
				mongodb.close();
				return callback(err);
			}
			
			var query = {};
			if(name) {
				query.name = name;
			}
			collection.find(query).sort({time: -1}).toArray(function(err, docs){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null, docs);//success, return the query result as arrays
			});
		});
	});
};