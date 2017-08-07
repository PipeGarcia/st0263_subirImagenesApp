var mongoose = require('mongoose');

// Esquema de la Imagen
var imageSchema = mongoose.Schema({
	username: {
		type: String,
	},
	originalname: {
		type: String
	},
	destination: {
		type: String
	}
});


var Image = module.exports = mongoose.model('Image', imageSchema);

module.exports.saveImage = function(newImage, callback){
	
	newImage.save(callback);
}

module.exports.getImageByOriginalname = function(originalname, callback){
	var query = {originalname: originalname};
	Image.findOne(query, callback);
}

module.exports.getImage = function(username, callback){
	var query = {username: username};
	Image.find(query, callback);
}

module.exports.removeImage = function(originalname, callback){
	Image.remove({ originalname: originalname }, function (err) {
  		if (err) return handleError(err);
  		
  		console.log('Muy bien campeón');
	});
}

module.exports.getImageByUserAndName = function(username, originalname, callback){
	var query = {username: username, originalname: originalname};
	Image.findOne(query, callback);
}