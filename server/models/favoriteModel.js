const { DataTypes } = require('sequelize');
const db = require('../db');

const FavoriteModel = db.define('Favorite', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    header: {
        type: DataTypes.JSON,
        allowNull: false
    },
    table: {
        type: DataTypes.JSON,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = FavoriteModel;
