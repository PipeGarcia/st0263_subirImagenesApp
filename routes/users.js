var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var multer = require('multer');
//var upload = multer({dest:'public/uploads/'});

var User = require('../models/user');
//var Image = require('../models/image');


router.get('/register', function(req, res){
	res.render('register');
});


router.get('/login', function(req, res){
	res.render('login');
});


router.post('/register', function(req, res){
	
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Validaciones de campos
	req.checkBody('name', 'El Nombre es requerido').notEmpty();
	req.checkBody('email', 'El Email es requerido').notEmpty();
	req.checkBody('email', 'La dirección email no es válida').isEmail();
	req.checkBody('username', 'El Nombre de Usuario es requerido').notEmpty();
	req.checkBody('password', 'Contraseña requerida').notEmpty();
	req.checkBody('password2', 'Las contraseñas no coinciden').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email:email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'Registro exitoso! - Ya puedes iniciar sesión');

		res.redirect('/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUsername(username, function(err, user){
   	if(err) throw err;
   	if(!user){
   		return done(null, false, {message: 'Usuario desconocido'});
   	}

   	User.comparePassword(user.username, password, function(err, isMatch){
   		if(err) throw err;
   		if(isMatch){
   			return done(null, user);
   		} else {
   			return done(null, false, {message: 'Contraseña incorrecta'});
   		}
   	});
   });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req, res){
	req.logout();

	req.flash('success_msg', 'Cerraste sesión!');

	res.redirect('/login');
});

// router.post('/', upload.any(), function(req, res, next){

// 	var username = req.user.username;
// 	var originalname = req.files[0].originalname;
// 	var destination = req.files[0].destination;

// 	var newImage = new Image({
// 		username: username,
// 		originalname: originalname,
// 		destination: destination
// 	});

// 	Image.saveImage(newImage, function(err, image){
// 		if(err) throw err;
// 		console.log(image);
// 		});

// 	console.log(req.user._id);
// 	console.log(originalname);
// 	res.send(req.files);
// });

router.get('/settings1', function(req, res){
	res.render('settings1');
});

router.get('/settings2', function(req, res){
	res.render('settings2');
});

router.post('/settings2', function(req, res, next){
	//var a = req.user._id;
	console.log(req.user);
	console.log('oeeeeeeeeeee' + req.body.username);
	//res.send('Hola mundo');
	User.updateUsername(req.user._id, req.body.username, function(req, res){
		return next();
	});
	
	req.flash('success_msg', 'Se ha cambiado el nombre de usuario');
	res.redirect('/settings2');
});


router.get('/settingsEliminar', function(req, res){
	res.render('settingsEliminar');
});


router.post('/settingsEliminar', function(req, res){
	//res.send(req.user.password);
	User.comparePassword(req.user.username, req.body.password, function(err, isMatch){
		console.log('ismatch------------------------------------- ' + isMatch)
   		if(err) throw err;
   		if(isMatch){
   			User.removeUser(req.user._id, function(){
   				return next();
   			});
   			//res.send('login');
   			res.redirect('/login');
   			req.flash('success_msg', 'Usuario eliminado');
			
   			//return done(null, true, {message: 'Usuario eliminado'});
   		} else {
   			//return done(null, false, {message: 'Invalid password'});
   			req.flash('error_msg', 'Contraseña incorrecta');
			res.redirect('/settingsEliminar');
   			//res.send('la contraseña no concuerda');
   		}
   	});
});

/*router.get('/myImages', function(req, res){
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


router.post('/deleteImage', function(req, res){ //no se por que pongo el next
	//res.send(req.user.password);
	Image.removeImage(req.body.originalname, function(){
		console.log('hasta aca llego');
		return next();
		
   		
   		
   		//res.end();
   		res.send('hola');
   	});
});


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
			req.flash('success_msg', 'Imagen no encontrada');
			res.redirect('/deleteImage');
		}
	});

	
});*/

router.get('/settingsEmail', function(req, res){
	res.render('settingsEmail');
});

router.post('/settingsEmail', function(req, res, next){
	
	User.updateEmail(req.user._id, req.body.email, function(req, res){
		return next();
	});
	
	req.flash('success_msg', 'Se ha cambiado el email');
	res.redirect('/settingsEmail');
});

router.get('/settingsPassword', function(req, res){
	res.render('settingsPassword');
});

router.post('/settingsPassword', function(req, res){
	

	User.checkPassword(req.user.username, req.body.oldPassword, function(err, person){
		if(person){
			User.updatePassword(req.user.username, req.body.newPassword, function(){
				req.flash('success_msg', 'Contraseña cambiada!');
				res.redirect('/settingsPassword');
			});
		}else{
			req.flash('error_msg', 'Contraseña anterior incorrecta!');
			res.redirect('/settingsPassword');
		}
	});

	//req.flash('success_msg', 'Se ha cambiado la contraseña');
	//res.redirect('/settingsPassword');
});

module.exports = router;