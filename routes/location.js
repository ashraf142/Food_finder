var db          = require("../models");
var moment      = require("moment")
var application = require('./application');

module.exports  = function(app) {
    
    // Location list
    app.get("/locations", function(req,res) {
        db.locations.findAll({
            attributes: ['house_no', 'block_no','road_no','thana','district']
        }).then(function(location) {
            res.render('sample_location', {
                location : location
            });
        })
    })
    
    app.get("/add_location", function(req, res) {
        res.render("sample_add_location");
    })

    // insert Location
    app.post("/insert_location", function(req,res) {
        var house       = req.body.house_no
        var block       = req.body.block_no 
        var road        = req.body.road_no
        var thana       = req.body.thana
        var district    = req.body.district
        var zip         = req.body.zip
        
        db.locations.create({
            house_no : house,
            block_no : block,
            road_no  : road,
            thana    : thana,
            district : district,
            zip      : zip
        }).then(function() {   
            res.redirect("/main")
        })
    })
}