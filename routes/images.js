var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, (Math.floor(Math.random() * 10000) + 1) + file.originalname);
  }
})

var upload = multer({ storage: storage })

var Image = require('../models/image');

const NodeCache = require( "node-cache" );
const myCache = new NodeCache({ stdTTL: 60});

router.post('/', upload.any(), function(req, res, next){
	console.log(req.files[0]);
	var key = req.user.username + '-key';
	var username = req.user.username;
	var originalname = req.files[0].filename;
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

	req.flash('success_msg', 'Imagen subida exitosamente!');
	res.redirect('/');
});

router.get('/myImages', function(req, res){
	res.render('myImages');
});

router.get('/imagesList', function(req, res){
	res.render('imagesList');
});

router.get('/myImages1', function(req, res){

	var key = req.user.username + '-key';

	myCache.get( key, function( err, value ){
		if( !err ){
			if(value == undefined){
				Image.getImage(req.user.username, function(err, images){
					if(images.length > 0) {
						myCache.set( key, images, function( err, success ){
  							if( !err && success ){
				    			console.log( 'no encontro la cache, pero la creo' );
				    			
				  			}
						}); 
					}
					res.render('imagesList', {images: images});
				});
			}else{
  				console.log( 'encontro la cache' );
  				res.render('imagesList', {images: value});
			}				
		}
	});

		/*console.log(images);
		var namesOfImages = [];
		for (var i = 0; i < images.length; i++) {
			namesOfImages[i] = images[i].originalname;
		}
		console.log('nombre imagenes ' + JSON.stringify(namesOfImages[0]));*/		
	
});

router.get('/deleteImage', function(req, res){
	res.render('deleteImage');
});

router.post('/deleteImage', function(req, res){
	var imagesArray = [];
	Image.getImageByUserAndName(req.user.username, req.body.originalname, function(err, image){
		if(err) throw err;
		console.log('<><><><><><>');
		//console.log(image.length);
		if(image){
			Image.removeImage(req.body.originalname, function(){
				var key = req.user.username + '-key';
				myCache.get( key, function( err, value ){
					if( !err ){
						if(value == undefined){
							console.log('no encontro cache, entonces no hace nada');
						}else{
							var finalImages= [];
							imagesArray = value;
							finalImages = imagesArray.filter(function(image){
								return image.originalname !== req.body.originalname; 	
							});
							myCache.set( key, finalImages, function( err, success ){
	  							if( !err && success ){
					    			console.log( 'elimino imagen de cache' );
					  			}
							}); 
						}				
					}
				});
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