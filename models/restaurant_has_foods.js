module.exports = function(sequelize, DataTypes) {

    var RestaurantFood    = sequelize.define("restaurant_has_food", {
        id  : {
            type    : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey    : true
        },
        price    : {type: DataTypes.FLOAT},
        image    : {type: DataTypes.STRING},
    },	

    {
	       	dialect: 'mysql'
	},

    {
        timestamps: true,
    }); 


    RestaurantFood.associate = function( models ) {
        RestaurantFood.belongsToMany(models.order, { through : models.order_has_food })
    }

    RestaurantFood.associate = function( models ) {
        RestaurantFood.hasMany(models.review, {
            as          : 'res_food_id',
            foreignKey  : 'fk_res_food_id',
            targetKey   : 'id'
        })
    }

    return RestaurantFood;
};