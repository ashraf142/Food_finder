module.exports = function(sequelize, DataTypes) {

    var Order    = sequelize.define("order", {
        id  : {
            type    : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey    : true
        },
        status    : {type: DataTypes.STRING}
    },	

    {
	    dialect: 'mysql'
	},

    {
        timestamps: true,
    });

    Order.associate = function( models ) {
        Order.belongsToMany(models.restaurant_has_food, { through : models.order_has_food })
    }

    Order.associate = function( models ) {
        Order.belongsTo( models.user, {
            foreignKey  : 'fk_userId',
            targetKey   : 'id'
        })
    }

    return Order;
};