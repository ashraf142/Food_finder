var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

//deliver static files without running into issues with routing

    app.get('/', function(res, req) {
        res.redirect('/main')
    })

    app.get('/foodResults', function(req,res) {
        res.render("foodList")
    })

    app.get('/searchResults', function(req,res) {
        res.render("searchResult")
    })

    app.get('/profilePage', function(req,res) {
        res.render("profilePage")
    })


    app.get('/submition', function(req,res) {
        res.render("submitRestaurant")
    })


    app.get('/check', function(req,res) {
        res.render("checkout")
    })

    app.get('/map', function(req,res) {
        res.render("mapResults")
    })

    // app.get('/dashboard', function(req,res) {
    //     res.render("dashboard")
    // })

      app.get('/user', function(req,res) {
        res.render("user")
    })

       app.get('/insert', function(req,res) {
        res.render("Foodinsert")
    })

    //   app.get('/review', function(req,res) {
    //     res.render("review")
    // })

       app.get('/update', function(req,res) {
        res.render("foodUpdate")
    })

    //    app.get('/restaurantinfo', function(req,res) {
    //     res.render("restaurantInformation")
    // })



  app.get("/assets", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/assets/css/style.css"));
  });
};