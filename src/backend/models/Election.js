const { DataTypes } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const Election = sequelize.define('Election', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
        authenticationMethod: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        privateKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        publicKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        results: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: db.Result,
                key: 'id',
            },
        },
    });

    return Election;
}