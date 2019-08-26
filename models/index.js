'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(module.filename);
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname + '/../config/config.json')[env];
var db        = {};
var pry       = require('pryjs')

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    // eval(pry.it)
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    // eval(pry.it)
    db[modelName].associate(db);
  }
});

// eval(pry.it)

db.sequelize = sequelize;

// Declaration Association among models
// db.user = require('../models/user.js')(sequelize, Sequelize);   
// db.location = require('../models/location.js')(sequelize, Sequelize);  
// db.food = require('../models/foods.js')(sequelize, Sequelize);
// db.restaurant = require('../models/restaurants')(sequelize, Sequelize);
// db.restaurantfood = require('../models/restaurant_has_foods')(sequelize, Sequelize);
// db.restaurantlocation = require('../models/restaurant_has_locations')(sequelize, Sequelize);
// db.order = require('../models/order')(sequelize, Sequelize);
// db.review = require('../models/reviews')(sequelize, Sequelize);


// db.user.hasOne(db.location, {
//   foreignkey: 'fk_userid',
//   targetKey: 'id'
// });
// db.location.belongsTo(db.user), {
//   foreignkey: 'fk_userid',
//   targetKey: 'id'
// };

// db.restaurant.belongsToMany(db.food, {
//   as: 'foods',
//   through: db.restaurantfood, 
//   foreignkey: 'Restaurant_restaurantId'
// });
// db.food.belongsToMany(db.restaurant, {
//     as: 'restaurants',
//     through: db.restaurantfood, 
//     foreignkey: 'Foods_foodsId'  
// });

// db.restaurant.belongsToMany(db.location, {
//   as: 'locations', 
//   through: db.restaurantlocation, 
//   foreignkey: 'Restaurant_restaurantId'
// }); 
// db.location.belongsToMany(db.restaurant, {
//   as: 'restaurant', 
//   through: db.restaurantlocation, 
//   foreignkey: 'Location_locationId'
// }); 

// db.user.hasMany(db.order); 
// db.order.belongsTo(db.user);

// db.user.hasMany(db.review);
// db.review.belongsTo(db.user);

// db.order.hasOne(db.review);
// db.review.belongsTo(db.order);

// db.order.hasMany(db.restaurantfood);
// db.restaurantfood.belongsTo(db.order);

module.exports = db;

