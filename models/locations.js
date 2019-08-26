module.exports = function(sequelize, DataTypes) {

    var Location    = sequelize.define("location", {
        id  : {
            type    : DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey    : true
        },
        house_no    : {type: DataTypes.STRING},
        block_no    : {type: DataTypes.STRING},
        road_no     : {type: DataTypes.STRING},
        thana       : {type: DataTypes.STRING},
        district    : {type: DataTypes.STRING},
        zip         : {type: DataTypes.STRING},
     
    },	

    {
	       	dialect: 'mysql'
	},

    {
        timestamps: true,
    }); 

    Location.associate = function( models ) {
        Location.belongsTo(models.user, { foreignKey: 'fk_userId', targetKey: 'id'})
    }

    Location.associate = function( models ) {
        Location.belongsToMany(models.restaurant, { through : models.restaurant_has_location })
    }

    return Location;
};