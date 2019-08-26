var moment = require("moment");
var application = require('./application');

var db     = require("./../models");
const {Op} = require('sequelize');

// eval(pry.it)

module.exports = function(app) {

    // reviews
    app.get("/reviews/:food_id", function(req, res) {
        
        var resFoodId = req.params.resFoodId  || 1;
        var userId    = req.params.userId || 1; 
        
        db.sequelize.query(`
            SELECT username, title, body, rating
            From reviews JOIN users
            WHERE reviews.fk_userId = users.id AND reviews.fk_userId = ${userId} AND reviews.fk_res_food_id = ${resFoodId}
        `, {type : db.sequelize.QueryTypes.SELECT})
        .then( function( reviews ) {
            
            // eval(pry.it)

            res.render('review', 
            {
                reviews: reviews
            });
        });
    });

    // works
    app.post("/insert_review/:resFoodId", (req, res) => {
        
        var resFoodId = req.params.resFoodId;
        var userId    = req.body.userId || 3; 

        var title   = req.body.title      ||  "Good Food"; 
        var body    = req.body.body       ||  "hmm.. very qualitiful food indeed";
        var rating  = req.body.rating     ||   4; 
        
        db.sequelize.query(`
            INSERT INTO reviews(title, body, rating, fk_res_food_id, fk_userId)
            VALUES('${title}','${body}', ${rating}, ${resFoodId}, ${userId})
        `, { type : db.sequelize.QueryTypes.INSERT })
        .then( () => {
            console.log('Review Inserted Successfully');
        })
        .catch(function(err) {
            console.log(err)
        })

       // eval(pry.it);
    });

    app.delete("delete_review/:reviewId", (req, res) => {
        var reviewId = req.params.id; 

        var deleteReview = db.sequelize.query(`
            DELETE FROM reviews 
            WHERE id = ${reviewId}
        `).then( () =>{
            console.log('review Deleted');s
        })
    });
}