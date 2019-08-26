var passport        = require('passport')
, LocalStrategy     = require('passport-local').Strategy
, GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy
, FacebookStrategy  = require('passport-facebook').Strategy
, db                = require('../models')


// Serialize Sessions
passport.serializeUser(function(user, done){
  done(null, user);
});

//Deserialize Sessions
passport.deserializeUser(function(user, done){
  db.user.findOne({where: {id: user.id}}).then(function(user){
      done(null, user);
  }).error(function(err){
      done(err, null)
  });
});

// For Authentication Purposes

// Local Strategy
passport.use(new LocalStrategy(
  function(username, password, done){
      db.user.findOne({where: {username: username}}).then(function(user){
          passwd = user ? user.password : ''
          isMatch = db.user.validPassword(password, passwd, done, user)
      });
  }
));


// Google Strategy
passport.use(new GoogleStrategy({

    // Use the API access settings stored in ./config/auth.json. You must create
    // an OAuth 2 client ID and secret at: https://console.developers.google.com
        clientID: '770561109334-t878oh8pp4lv0tjit80efr8esq80f3jt.apps.googleusercontent.com',
        clientSecret: 'B_4kbf6k5ozSUXF_K7n3Nf_1',
        callbackURL: 'http://localhost:3000/auth/google/callback' 
    },
   
    function(accessToken, refreshToken, profile, done) {
  
      // Typically you would query the database to find the user record
      // associated with this Google profile, then pass that object to the `done`
      // callback.
      return done(null, profile);
    }
  ));


// Facebook Strategy

passport.use(new FacebookStrategy({
    clientID:   '834003923655123',
    clientSecret: '1b5c3bdb55b521c95687f1dda5c5ff6e',
    callbackURL: 'http://localhost:3000/login/facebook/return',
    profileFields: ['id', 'displayName', 'photos', 'email', 'friendlists']
  },
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user's Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    return cb(null, profile);
  }));



// Facebook
// APP SECRET : 1b5c3bdb55b521c95687f1dda5c5ff6e
// APP ID     : 834003923655123