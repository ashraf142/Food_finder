module.exports = function(sequelize, DataTypes) {

    var RestaurantLocation    = sequelize.define("restaurant_has_location", {
        id  : {
            type    : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey    : true
        },
        openingTime    : {type: DataTypes.STRING},
        closingTime    : {type: DataTypes.STRING},
    },	

    {
	       	dialect: 'mysql'
	},

    {
        timestamps: false,
    }); 

    return RestaurantLocation;
};