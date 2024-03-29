const { DataTypes } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const Voter = sequelize.define('Voter', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        specialNumber: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        citizenship: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        document: {
            type: DataTypes.BLOB,
            allowNull: true,
        },
        authToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        authenticated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        voted: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        walletPrivateKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        walletAddress: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        securityQuestion1: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.SecurityQuestions,
                key: 'id',
            },
        },
        securityAnswer1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        securityQuestion2: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.SecurityQuestions,
                key: 'id',
            },
        },
        securityAnswer2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        resetToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tokenAuthenticated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    });

    return Voter;
}