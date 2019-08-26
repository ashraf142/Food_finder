var moment = require("moment");
var application = require('./application');
var db     = require("./../models");
const {Op} = require('sequelize');

// eval(pry.it)

module.exports = function(app) {


    app.get('/main', function(req,res) {

        var userInfo = { 
            user : req.user,
        }

        db.sequelize.query(`
            SELECT food.name as food_name, food.type as food_type, restaurants.name as res_name, restaurants.type as res_type, price, 
            image, house_no, block_no, road_no, thana, district, zip, openingTime as opTime, closingTime as clTime
            FROM food JOIN restaurants JOIN restaurant_has_foods JOIN locations JOIN restaurant_has_locations 
            WHERE food.id = restaurant_has_foods.foodId AND restaurants.id = restaurant_has_foods.restaurantId AND
            locations.id = restaurant_has_locations.locationId AND restaurants.id = restaurant_has_locations.restaurantId
        `,  { type : db.sequelize.QueryTypes.SELECT } )
        .then( function( results ) {
            var len = 3
            if( results.length < 3 ) 
                len = results.length

            res.render("mainHome", 
            {
                results: results,
                len : len,
                userInfo : userInfo
            })    
        } )


    })

    app.post("/search", function(req, res) {

        var searchQuery =  req.body.fname //req.body.fname

        var userInfo = { 
            user : req.user 
        }

        db.sequelize.query(`
            SELECT food.name as food_name, food.type as food_type, restaurants.name as res_name, restaurants.type as res_type, price, image
            image, house_no, block_no, road_no, thana, district, zip, openingTime as opTime, closingTime as clTime
            FROM food JOIN restaurants JOIN restaurant_has_foods JOIN locations JOIN restaurant_has_locations 
            WHERE food.id = restaurant_has_foods.foodId AND restaurants.id = restaurant_has_foods.restaurantId AND
            locations.id = restaurant_has_locations.locationId AND restaurants.id = restaurant_has_locations.restaurantId AND
            food.name LIKE '%${searchQuery}%'`, 
        { type: db.sequelize.QueryTypes.SELECT })
        .then(function(results) {

            // eval(pry.it)

            res.render('searchResults',
            {
                results : results,
                userInfo: userInfo
            })
        })

    })


    // food list
    app.get("/foods", function(req,res) {
        
        var userInfo = { 
            user : req.user 
        }

        db.sequelize.query(`
            SELECT food.name as food_name, food.type as food_type, restaurants.name as res_name, restaurants.type as res_type, price, image
            image, house_no, block_no, road_no, thana, district, zip, openingTime as opTime, closingTime as clTime
            FROM food JOIN restaurants JOIN restaurant_has_foods JOIN locations JOIN restaurant_has_locations 
            WHERE food.id = restaurant_has_foods.foodId AND restaurants.id = restaurant_has_foods.restaurantId AND
            locations.id = restaurant_has_locations.locationId AND restaurants.id = restaurant_has_locations.restaurantId`, 
        { type: db.sequelize.QueryTypes.SELECT })
        .then(function(results) {
            res.render('foodList',
            {
                results : results,
                userInfo : userInfo
            })
        })
    })
    
    

    app.get("/add_food", application.IsAuthenticated, function(req, res) {
        var userInfo = { 
            username   : req.user.username, 
            first_name : req.user.first_name, 
            last_name  : req.user.last_name, 
            user_type  : req.user.user_role  
        }

        res.render("foodInsert", {userInfo : userInfo});
    })

    // insert new food
    app.post("/insert_food", application.IsAuthenticated, function(req,res) {

        // The or'ed values acting here as dummy value
        // in realtime we will remove these values.

        var food_name = req.body.fname 
        var food_type = req.body.ftype 
        var userId    = req.user.id
        var price     = req.body.price
        var image     = req.body.image
        
        var restaurantIds = db.sequelize.query(`
            SELECT restaurants.id as res_id 
            FROM restaurants JOIN users 
            WHERE users.id = restaurants.fk_userId AND users.id = ` + userId, 
            { type: db.sequelize.QueryTypes.SELECT })

        var insertedFood = db.sequelize.query(`
                INSERT INTO food (name, type) values('${food_name}', '${food_type}')
            `, { type : db.sequelize.QueryTypes.INSERT })


        Promise.all([restaurantIds, insertedFood]).then(function([resIds, resFood]) {
            db.sequelize.query(`
                INSERT INTO restaurant_has_foods (price, image, foodId, restaurantId) 
                VALUES ('${price}', '${image}', '${resFood[0]}', '${resIds[0].res_id}')
            `, { type : db.sequelize.QueryTypes.INSERT })
            .then(function(response) {
                console.log("Succefully inserted food!")
                res.redirect('/dashboard')
            })
        }).catch(function(err) {
            console.log(err)
        })    
    })


    // app.get('/userSection', application.IsAuthenticated, function(req, res) {
    //     var userId   = req.user.id
    //     var userType = req.user.user_role 
        
    //     // eval(pry.it)
    //     var userInfo =  { 
    //         usernname : req.user.id, 
    //         first_name : req.user.first_name, 
    //         last_name : req.user.last_name,   
    //     }

    //     db.sequelize.query(`
    //         SELECT status, price, food.name as food_name, food.type as food_type, restaurants.name as res_name
    //         FROM orders JOIN order_has_foods JOIN restaurant_has_foods JOIN food JOIN restaurants JOIN users 
    //         WHERE orders.id = order_has_foods.orderId AND restaurant_has_foods.id = order_has_foods.restaurantHasFoodId AND
    //         food.id = restaurant_has_foods.foodId AND restaurants.id = restaurant_has_foods.restaurantId AND 
    //         orders.fk_userId = users.id AND users.id = ${userId}
    //     `, { type : db.sequelize.QueryTypes.SELECT })
    //     .then(function(ordersByUser) {

    //         res.render('userSection', {
    //             userInfo : userInfo,
    //             ordersByUser : ordersByUser 
    //         })
    //     })             
    // })


    app.get('/dashboard', application.IsAuthenticated, function(req,res) {
        
        var userId   = req.user.id
        var userType = req.user.user_role
        
        // eval(pry.it)
        var userInfo = { 
            username   : req.user.username, 
            first_name : req.user.first_name, 
            last_name  : req.user.last_name, 
            user_type  : req.user.user_role  
        }

        db.sequelize.query(`
            SELECT restaurants.id as res_id, restaurants.name as res_name  
            FROM restaurants JOIN users 
            WHERE users.id = restaurants.fk_userId AND users.id = ` + userId, 
            { type: db.sequelize.QueryTypes.SELECT })
        .then( function(restaurantIds) {

            // eval(pry.it)    
            
            if ( restaurantIds[0] ) {
                
                var orderOfRes = db.sequelize.query(`
                    SELECT username, food.name as food_name, price, thana, status
                    FROM users JOIN orders JOIN order_has_foods JOIN restaurant_has_foods JOIN food JOIN restaurants JOIN locations
                    WHERE orders.id = order_has_foods.orderId AND restaurant_has_foods.id = order_has_foods.restaurantHasFoodId AND
                    restaurants.id = restaurant_has_foods.restaurantId AND food.id = restaurant_has_foods.foodId AND users.id = locations.fk_userId
                    AND orders.fk_userId = users.id AND locations.fk_userId = orders.fk_userId AND restaurants.id = ${restaurantIds[0].res_id}
                `, { type : db.sequelize.QueryTypes.SELECT })

                var food_list = db.sequelize.query(`
                    SELECT food.id as fId, restaurants.id as rId, food.name as food_name, food.type as food_type, price
                    FROM food JOIN restaurants JOIN restaurant_has_foods 
                    WHERE food.id = restaurant_has_foods.foodId AND restaurants.id = restaurant_has_foods.restaurantId AND 
                    restaurants.id = ${restaurantIds[0].res_id}
                `, { type : db.sequelize.QueryTypes.SELECT })
                
                Promise.all([ orderOfRes, food_list ]).then(function([orders, foods]){
                    // eval(pry.it)    
                    res.render('ownerDash', 
                    {
                        foods   : foods,
                        orders  : orders,
                        hasRestaurant : true,
                        userInfo : userInfo,
                        res_name : restaurantIds[0].res_name
                    })
                })
                .catch(function(err) {
                    console.log(err)
                })   
            }
            else {
                res.render( 'ownerDash' , 
                {
                    foods    : [],
                    orders   : [],
                    hasRestaurant : false,
                    res_name : 'None',
                    userInfo : userInfo
                })
            }

        })
        .catch(function(err) {
            console.log(err)
        })  
    })

    // Delete food

    app.delete('/delete_food/:food_id/:res_id', application.IsAuthenticated, function(req, res) {

        var food_id = req.params.food_id
        var res_id  = req.params.res_id

        db.sequelize.query(`
            DELETE FROM food WHERE id = ${food_id}
        `, { type : db.sequelize.QueryTypes.DELETE })
        .then(function(resp) {
            db.sequelize.query(`
                DELETE FROM restaurant_has_foods WHERE foodId = ${food_id}
                AND restaurantId = ${res_id} 
            `, { type : db.sequelize.QueryTypes.DELETE })
            .then(function(resp) {
                res.redirect('back')
            })
        })
        .catch(function(err) {
            console.log(err)
        })
        
    })


    // user list for admin panel

    app.get('/adminDash', application.IsAuthenticated, function(req, res) {

        var userInfo = { 
            username   : req.user.username, 
            first_name : req.user.first_name, 
            last_name  : req.user.last_name, 
            user_type  : req.user.user_role  
        }

        db.sequelize.query(`
            SELECT * 
            FROM users 
            WHERE users.user_role != 'admin'
        `, { type: db.sequelize.QueryTypes.SELECT } )
        .then(function( users ) {
            res.render('adminDash', 
            {
                users : users,
                userInfo : userInfo
            })
        })

        
    })

    app.delete("/deleteUser/:userId", application.IsAuthenticated, function(req, res) {

        var userId = req.params.userId; 
        
        db.sequelize.query(`
            DELETE FROM users 
            WHERE users.id = ${userId}
        `, { type : db.sequelize.QueryTypes.DELETE  } )
        .then(function() {
            res.redirect('/adminDash')
        })
        .catch(function(err) {
            console.log(err)
        })
    })
    

}

