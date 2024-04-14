const { DataTypes, STRING } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const Election = sequelize.define('Election', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        adminId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        resultDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        candidateNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ageRestriction: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        authEmail: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        authCitizenship: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publishKey: {
            type: DataTypes.STRING,
            allowNull: false,
        }

    });
    return Election;
}