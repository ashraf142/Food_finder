var express = require("express");
var app = express();
app.set('view engine', 'ejs');
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var session = require('express-session');
var methodOverride = require("method-override");
var path = require("path");
var http = require('http');
var passport = require('passport');
var passportConfig = require('./config/passport');
var application = require('./routes/application');

var morgan = require('morgan');
// var routes = require("./routes");

global.pry = require('pryjs')

var expressLayouts = require('express-ejs-layouts');

SALT_WORK_FACTOR = 12;
var PORT = process.env.PORT || 3000;
// var db  = require("./models");
var app = express();

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//added from passport.js authentication example
app.use(cookieParser());
//settings from express-session
app.use(session({
    secret: 'yumyumkeepsyoulogged',
    resave: false,
    saveUninitialized: false}))
app.use(passport.initialize())
app.use(passport.session())

app.use(methodOverride("_method"));

// Set Handlebars.
// var exphbs = require("express-handlebars");

// require('./public/assets/javascript/handlebars.js')(exphbs);
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);

app.use(morgan('dev')); // for loggin every request	

// app.use(routes);
require("./routes/authenticate.js")(app);
require("./routes/public-routes.js")(app);
require("./routes/foods.js")(app)
require("./routes/location.js")(app)
require("./routes/restaurant.js")(app)
require("./routes/orders.js")(app)
require("./routes/review.js")(app)
require("./routes/user_panel.js")(app)

function errorHandler (err, req, res, next) {
	res.status(500)
	res.render('error', { error: err })
  }
//listener
db.sequelize.sync()//{force:true}
	.then(function(err){
		// if (err) {
		// 	throw err[0]
		// } else {
		db.user.find({where: {username: 'admin'}}).then(function (user){
			if (!user) {
				db.user.build({
					username: 'admin', 
					password: 'admin', 
					first_name: 'Test', 
					last_name: 'User'}).save();
			};
		});
		app.listen(PORT, function() {
			console.log("App listening on PORT: " + PORT);
	});
})
