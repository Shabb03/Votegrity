const { DataTypes } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const Result = sequelize.define('Result', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        winner: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Candidate,
                key: 'id',
            },
        },
        electionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Election,
                key: 'id',
            },
        }
    });
    return Result;
}