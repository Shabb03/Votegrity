const { DataTypes } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const Candidate = sequelize.define('Candidate', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        voice: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        party: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        dateOfBirth: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        biography: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isWinner: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
            defaultValue: false,
        },   
        electionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Election,
                key: 'id',
            },
        },
        primeNumber: {
            type: DataTypes.BIGINT,
            allowNull: false,
        }
    
    });

    return Candidate;
}