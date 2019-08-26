var db     = require("../models");
var moment = require("moment")
var application = require('./application');

module.exports = function(app) {
    
    // restaurant list working
    app.get("/restaurants", function(req,res) {
        db.restaurant.findAll({
            attributes: ['id', 'name','type']
        }).then(function(items) {
            res.render('sample_restaurant', {
                items:items 
            });
        })
        //eval(pry.it);

    })


    // Add restaurants
    app.get('/addRestaurantinfo', function(req,res) {
        var userInfo = { 
            username   : req.user.username, 
            first_name : req.user.first_name, 
            last_name  : req.user.last_name, 
            user_type  : req.user.user_role  
        }
        res.render("restaurantInformation", { userInfo : userInfo })
    })

    // Update restaurant information
    app.get("/updateRestaurantinfo", function(req, res) {

        var userId = req.user.id
        var userInfo = { 
            username   : req.user.username, 
            first_name : req.user.first_name, 
            last_name  : req.user.last_name, 
            user_type  : req.user.user_role  
        }
        
        db.sequelize.query(`
            SELECT * 
            FROM restaurants JOIN restaurant_has_locations JOIN locations 
            WHERE restaurants.id = restaurant_has_locations.restaurantId AND locations.id = restaurant_has_locations.locationId AND
            restaurants.fk_userId = ${userId}
        `, { type : db.sequelize.QueryTypes.SELECT } )
        .then( function( resp ) {
            if (resp) {
                // eval(pry.it)
                data = {
                    rname    : resp[0].name,
                    rtype    : resp[0].type,
                    op_time  : resp[0].openingTime,
                    cl_time  : resp[0].closingTime,
                    house_no : resp[0].house_no,
                    block_no : resp[0].block_no,
                    road_no  : resp[0].road_no,
                    thana    : resp[0].thana,
                    district : resp[0].district,
                    zip      : resp[0].zip    
                }
                
                res.render('restaurantInformationUp',
                {
                    data : data,
                    userInfo : userInfo
                })
            }
            else {
                res.redirect('/addRestaurantinfo')
            }
        })

    })

    app.post("/updateRestaurant", function(req, res) {

        var userId = req.user.id
        var resId  = req.params.resId

        var rname    = req.body.rname ,
            rtype    = req.body.rtype ,
            op_time  = req.body.op_time,
            cl_time  = req.body.cl_time ,
            house_no = req.body.house_no ,
            block_no = req.body.block_no ,
            road_no  = req.body.road_no  ,
            thana    = req.body.thana    ,
            district = req.body.district  ,
            zip      = req.body.zip       
        

        db.sequelize.query(`
            SELECT restaurants.id as id
            FROM restaurants JOIN users 
            WHERE restaurants.fk_userId = users.id AND users.id = ${userId}
        `, { type : db.sequelize.QueryTypes.SELECT } )
        .then(function(resIds) {

            var locInfo = db.sequelize.query(`
                SELECT locations.id as locId
                FROM restaurants JOIN restaurant_has_locations JOIN locations 
                WHERE restaurants.id = restaurant_has_locations.restaurantId AND locations.id = restaurant_has_locations.locationId AND
                restaurants.id = ${resIds[0].id}
            `, { type : db.sequelize.QueryTypes.SELECT })

            var resUpdate = db.sequelize.query(`

                UPDATE restaurants SET name = '${rname}', type = '${rtype}'  
                WHERE  fk_userId = ${userId} AND id = ${resIds[0].id}

            `, { type : db.sequelize.QueryTypes.UPDATE } )
            
            Promise.all([locInfo, resUpdate]).then(function([locRes, resUpdates]) {
                db.sequelize.query(`
                    UPDATE locations SET house_no = '${house_no}',
                                    block_no = '${block_no}',
                                    road_no  = '${road_no}' ,
                                    thana    = '${thana}'   ,
                                    district = '${district}',
                                    zip      = '${zip}'
                    WHERE id = ${locRes[0].locId}
                `, { type : db.sequelize.QueryTypes.UPDATE })
                .then(function(resp) {

                    db.sequelize.query(`
                        UPDATE restaurant_has_locations 
                        SET openingTime = '${op_time}', closingTime = '${cl_time}' 
                        WHERE locationId = ${locRes[0].locId} AND restaurantId = ${resIds[0].id}
                    `, { type : db.sequelize.QueryTypes.UPDATE })
                    .then(function( resp ) {
                        res.redirect('/dashboard')
                    })
                })
                .catch(function(err) {
                    console.log(err)
                })
            })
            .catch(function(err) {
                console.log(err)
            })


        })
    })

    // insert new restaurant
    app.post("/insert_restaurants", function(req,res) {

        var res_name    = req.body.rname  
        var res_type    = req.body.rtype 
        var UserId      = req.user.id

        var house_no = req.body.house_no 
        var block_no = req.body.block_no  
        var road_no  = req.body.road_no   
        var thana    = req.body.thana     
        var district = req.body.thana     
        var zip      = req.body.zip      

        var openingTime = req.body.op_time 
        var closingTime = req.body.cl_time  

        // eval(pry.it)

        var insertRes = db.sequelize.query(`
            INSERT INTO restaurants(name, type, fk_userId) values ('${res_name}', '${res_type}', '${UserId}')
        `, { type : db.sequelize.QueryTypes.INSERT }).then((resp) => {
            console.log(`Successfully restaurant Inserted.`);
            return resp
        });
        
        var insertLoc = db.sequelize.query(`
            INSERT INTO locations(house_no, block_no, road_no, thana, district, zip)
            values('${house_no}', '${block_no}', '${road_no}', '${thana}', '${district}', '${zip}')
        `, { type : db.sequelize.QueryTypes.INSERT }).then((resp) => {
            console.log(`Successfully location inserted.`);
            return resp
        }); 

        Promise.all([insertLoc, insertRes]).then(function([locId, resId]) {

            db.sequelize.query(`
                INSERT INTO restaurant_has_locations (openingTime, closingTime, locationId, restaurantId) 
                VALUES ('${openingTime}', '${closingTime}', '${locId[0]}', '${resId[0]}')
            `, { type : db.sequelize.QueryTypes.INSERT })
            .then(function(response) {
                // eval(pry.it)
                console.log("Succefully inserted Restaurant!")
                res.redirect('/dashboard');
            })
        }).catch(function(err) {
            console.log(err)
        })    
    });

    // delete restaurant by given restaurant id
    app.delete('/delete_restuarant/:res_id', (req, res) => {
    
        var res_id = req.params.res_id;      
        
        db.sequelize.query(`
        DELETE FROM restaurants WHERE id = ${res_id}
        `, { type : db.sequelize.QueryTypes.DELETE })
        .then(function(resp) {
            res.redirect('back')
        })
        .catch((err) =>{
            cosole.log(err);
        });
    });
}

