'use strict';
//password encryption occurs before its logged to the database
var bcrypt = require('bcrypt-nodejs')

module.exports = function(sequelize, DataTypes) {

    var User = sequelize.define("user", {
        id  : { 
            type        : DataTypes.INTEGER, 
            primaryKey  : true,
            unique      : true,
            autoIncrement : true  
        },
        username: {
            type        : DataTypes.STRING, 
            unique      : true, 
            allowNull   : false, 
            validate: { notEmpty : true } 
        },
        password: {
            type        : DataTypes.STRING, 
            allowNull   : false, 
            validate    : { notEmpty : true } 
        },
        first_name: {  
            type        : DataTypes.STRING
        },
        last_name: { 
            type        : DataTypes.STRING
        },
        user_role: {
            type        : DataTypes.STRING
        }
    },

    {
		dialect: 'mysql'
    }); 

    User.associate = function(models) {
        User.hasMany(models.review, {
            as          : 'userId',
            foreignKey  : 'fk_userId',
            targetKey   : 'id'
        })
    }

    User.associate = function(models) {
        User.hasMany(models.order, {
            foreignKey  : 'fk_userId',
            targetKey   : 'id'
        })
    }

    User.associate = function( models ) {
        User.hasOne(models.location, {
            foreignKey  : 'fk_userId',
            targetKey   : 'id'
        })
    }

    User.associate = function( models ) {
        User.hasOne(models.restaurant, {
            foreignKey  : 'fk_userId',
            targetKey   : 'id'
        })
    }

    User.validPassword = function(password, passwd, done, user){
        bcrypt.compare(password, passwd, function(err, isMatch){
            if (err) console.log(err)
            if (isMatch) {
                return done(null, user)
            } else {
                return done(null, false)
            }
        })
    };

  
    //encryption occurs here before password logged to database

    User.hook('beforeCreate', function(user, fn){
        var salt = bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
            return salt
        });
        bcrypt.hash(user.password, salt, null, function(err, hash){
            var fn = function fn() {};
            if(err) return err;
            console.log(user.password);
            User.update({password: hash}, {where: {username:user.username}})
            console.log(user.password);
            return fn(null, user)
        });
    });

    return User;
};
