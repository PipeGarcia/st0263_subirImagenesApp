var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'public/uploads/'});

var Image = require('../models/image');

router.post('/', upload.any(), function(req, res, next){

	var username = req.user.username;
	var originalname = req.files[0].originalname;
	var destination = req.files[0].destination;

	var newImage = new Image({
		username: username,
		originalname: originalname,
		destination: destination
	});

	Image.saveImage(newImage, function(err, image){
		if(err) throw err;
		console.log(image);
		});

	console.log(req.user._id);
	console.log(originalname);
	res.send(req.files);
});

router.get('/myImages', function(req, res){
	res.render('myImages');
});


router.post('/myImages', function(req, res){

	Image.getImage(req.user.username, function(err, images){
		console.log(images);
		var namesOfImages = [];
		for (var i = 0; i < images.length; i++) {
			namesOfImages[i] = images[i].originalname;
		}
		console.log('nombre imagenes ' + JSON.stringify(namesOfImages));
		res.send(namesOfImages);
	});
	
	//res.redirect('/myImages');
	
});

router.get('/deleteImage', function(req, res){
	res.render('deleteImage');
});


/*router.post('/deleteImage', function(req, res){ //no se por que pongo el next
	//res.send(req.user.password);
	Image.removeImage(req.body.originalname, function(){
		console.log('hasta aca llego');
		return next();
		
   		
   		
   		//res.end();
   		res.send('hola');
   	});
});*/


router.post('/deleteImage', function(req, res){
	Image.getImageByUserAndName(req.user.username, req.body.originalname, function(err, image){
		if(err) throw err;
		console.log('<><><><><><>');
		//console.log(image.length);
		if(image){
			Image.removeImage(req.body.originalname, function(){
   				return next();
			});
			req.flash('success_msg', 'Imagen eliminada');
			res.redirect('/deleteImage');
		}else{
			req.flash('error_msg', 'Imagen no encontrada');
			res.redirect('/deleteImage');
		}
	});

	
});

module.exports = router;