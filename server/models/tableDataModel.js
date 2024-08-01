const { DataTypes } = require('sequelize');
const db = require('../db');
const CategoryModel = require('./CategoryModel');

const TableDataModel = db.define('TableData', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hours: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: CategoryModel,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

TableDataModel.belongsTo(CategoryModel, { foreignKey: 'categoryId' });

module.exports = TableDataModel;
