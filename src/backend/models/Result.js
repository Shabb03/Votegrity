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
            allowNull: true,
            references: {
                model: db.Candidate,
                key: 'id',
            },
        },
        voteCount: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    });

    return Result;
}