const {DataTypes} = require('sequelize');
const db = require('../db');

const CategoryModel = db.define('Category', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isColumnVisible: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }

});

module.exports = CategoryModel;
