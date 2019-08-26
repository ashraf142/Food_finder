var moment = require("moment");
var application = require('./application');

var db     = require("./../models");
const {Op} = require('sequelize');

// eval(pry.it)

module.exports = function(app) {


    app.get('/userDash', application.IsAuthenticated, function(req, res) {

        var userId   = req.user.id
        var userType = req.user.user_role 
        
        // eval(pry.it)
        var userInfo = { 
            username : req.user.username, 
            first_name : req.user.first_name, 
            last_name : req.user.last_name,
            user_typp : userType
        }

        db.sequelize.query(`
            SELECT status, price, food.name as food_name, food.type as food_type, restaurants.name as res_name
            FROM orders JOIN order_has_foods JOIN restaurant_has_foods JOIN food JOIN restaurants 
            WHERE orders.id = order_has_foods.orderId AND restaurant_has_foods.id = order_has_foods.restaurantHasFoodId AND
            food.id = restaurant_has_foods.id AND restaurants.id = restaurant_has_foods.restaurantId AND
            orders.fk_userId  = ${userId}
        `, { type: db.sequelize.QueryTypes.SELECT } )
        .then(function(allOrders) {

            // eval(pry.it)

            res.render('userDash', 
            {
                orders: allOrders,
                userInfo : userInfo
            })
        })
        
    })


}