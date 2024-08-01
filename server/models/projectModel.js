const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ProjectModel = sequelize.define('Project', {
    projectName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    hourlyRate: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalTime: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: false
});

module.exports = ProjectModel;
