module.exports = function(sequelize, DataTypes) {

    var Review    = sequelize.define("review", {
        id  : {
            type    : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey    : true
        },
        title    : {
            type        : DataTypes.STRING,
            validate    : { notEmpty: true }
        },
        body     : {
            type        : DataTypes.TEXT, 
            validate    : { notEmpty: true }
        },
        rating   : {
            type        : DataTypes.INTEGER, 
            validate    : { isInt: true }
        },
    },	

    {
	    dialect: 'mysql'
	},

    {
        timestamps: true,
    }); 


    Review.associate = function( models ) {
        Review.belongsTo(models.restaurant_has_food, {
            as          : 'res_food_id',
            foreignKey  : 'fk_res_food_id',
            targetKey   : 'rfid'
        })
    }

    Review.associate = function( models ) {
        Review.belongsTo(models.user, {
            as          : 'userId',
            foreignKey  : 'fk_userId',
            targetKey   : 'id'
        })
    }


    return Review;
};