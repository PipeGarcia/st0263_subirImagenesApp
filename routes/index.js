var express = require('express');
var router = express.Router();

router.get('/', checkIfLogged, function(req, res){
	res.render('index');
});

function checkIfLogged(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {		
		res.redirect('/login');
	}
}

module.exports = router;