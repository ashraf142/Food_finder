module.exports = function(sequelize, DataTypes) {

    var OrderFoods    = sequelize.define("order_has_food", {
        id  : {
            type    : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey    : true
        },
        qty : { type: DataTypes.INTEGER },
    },	
    {
	    dialect: 'mysql'
	},
    {
        timestamps: true,
    }); 

    return OrderFoods;
};