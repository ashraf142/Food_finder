var db          = require("../models");
var passport    = require("passport");
var application = require('./application');
const { body }  = require('express-validator/check');


module.exports = function(app) {
    app.get('/login', application.IsAuthenticated, function(req,res) {

        if( req.user.user_role == 'user' ) {
            res.redirect("/userDash")
        }
        else if(req.user.user_role == 'owner'){
            res.redirect("/dashboard")
        }
        else {
            res.redirect("/adminDash")
        }

    })

    app.post('/authenticate',
        passport.authenticate('local',{
            successRedirect: '/login',
            failureRedirect: '/main'
        })
    )

    app.get('/logout', application.destroySession)
    app.get('/signup', function(req,res) {
        res.render("signup")
    })


    // app.post('/register', body('cpassword').custom((value, { req }) => {

    //     if (value !== req.body.password) {
        
    //         throw new Error('Password confirmation does not match password');
    //     }
    //   }), (req, res) => {
    //     // Handle the request
    //     eval(pry.it)

    //   });

    app.post('/register', function(req, res){

        var username  = req.body.username
        var password  = req.body.password
        // var cpassword = req.body.cpassword
        var user_type = req.body.user_type
        
        // eval(pry.it)

        db.user.find({where: {username: username}}).then(function (user){
			if (!user) {
				db.user.build({
					username  : username, 
					password  : password, 
                    user_role : user_type }).save()
                    .then((resp) => {
                        res.redirect('/main')
                    })
            }
            else {
                res.redirect('/main')
            }
        })
        .catch((err) => {
            console.log(err)
        })

        // db.sequelize.query(`
        //     INSERT INTO users (username, password, user_role) VALUE ( '${username}', '${password}', '${user_type}' ) 
        // `, { type : db.sequelize.QueryTypes.INSERT })
        // .then(function (user){
        
        //     // eval(pry.it)

        //     if(user_type == 'owner') {
        //         res.redirect('/dashboard')
        //     }
        //     else if(user_type == 'user') {
        //         res.redirect('/userDash')
        //     }
        
        // })
    });


    // Login with Facebook

    app.get('/login/facebook',
        passport.authenticate('facebook'));

    app.get('/login/facebook/return', 
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            // eval(pry.it)
            res.render('user_profile', { user: req.user.displayName });
            // res.redirect('/profile')
    });

    app.get('/profile',
        application.IsAuthenticated,
        function(req, res){
            res.render('user_profile', { user: req.user.displayName });
    });

    // Login with Google
    app.get('/', function(req, res) {
        res.render('index', {
            user: req.user
        });
    });

    app.get('/login', function(req, res) {
        res.render('login', {
            user: req.user
        });
    });

    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve
    //   redirecting the user to google.com.  After authorization, Google
    //   will redirect the user back to this application at /auth/google/callback
    app.get('/auth/google',
        passport.authenticate('google', { scope: ['openid email profile'] }));

    // GET /auth/google/callback
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            failureRedirect: '/login'
        }),
        function(req, res) {
            // Authenticated successfully
            // res.redirect('/');
            // eval(pry.it)

            res.render('user_profile', {
                user: req.user.displayName
            })
    });
  
    app.get('/profile', application.IsAuthenticated, function(req, res) {
        res.render('user_profile', {
            user: req.user
        });
    });
  
}