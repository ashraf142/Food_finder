var db          = require("../models");
var moment      = require("moment")
var application = require('./application');

module.exports  = function(app) {
    
    // Location list
    
    app.get("/order/:food_id", function( req, res ) {

        // eval(pry.it)

        var food_id = req.params.food_id || 2

    })
    
    // // insert Location
    app.post("/insert_reviews", function(req,res) {
        var title       = req.body.titles
        var body        = req.body.bodys
        var rating      = req.body.rating
        var UserId      = req.body.UserId
        var orderId     = req.body.orderId
    
        db.review.create({
            title       : title,
            body        : body,
            rating      : rating,
            orderId     : orderId,
            fk_userId   : UserId
        })
        .then(function(resp) {

            eval(pry.it)

            res.redirect("/main")
        })
    })

    app.get("/all_reviews", function(req, res) {

        db.user.findAll({
            where: {
                userId : 0
            },
            include: [{ model: db.review }]
        })
        .then(function(resp) {
            eval(pry.it)
        })

    })
}
