module.exports = function(sequelize, DataTypes) {

    var Food    = sequelize.define("food", {
        id      : {
            type    : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey    : true
        },
        name    : {type: DataTypes.STRING},
        type    : {type: DataTypes.STRING},
    },	

    {
	       	dialect: 'mysql'
    });
    
    Food.associate = function( models ) {
        Food.belongsToMany(models.restaurant, { through : models.restaurant_has_food })
    }

    return Food;
};
