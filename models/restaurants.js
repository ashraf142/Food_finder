'use strict';
module.exports = function(sequelize, DataTypes) {

    var Restaurant    = sequelize.define("restaurant", {
        id  : {
            type    : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey    : true
        },
        name    : {type: DataTypes.STRING},
        type    : {type: DataTypes.STRING},
    },	

    {
	       	dialect: 'mysql'
	},

    {
        timestamps: true,
    });
    

    Restaurant.associate = function( models ) {
        Restaurant.belongsToMany(models.food, { through : models.restaurant_has_food })
    }

    Restaurant.associate = function( models ) {
        Restaurant.belongsToMany(models.location, { through : models.restaurant_has_location })
    }

    Restaurant.associate = function( models ) {
        Restaurant.belongsTo(models.user, { foreignKey: 'fk_userId', targetKey: 'id'})
    }

    return Restaurant;
};  