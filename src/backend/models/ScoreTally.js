const { DataTypes } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const ScoreTally = sequelize.define('ScoreTally', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        electionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Election,
                key: 'id',
            },
        },
        candidateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Candidate,
                key: 'id',
            },
        },
        sum: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0
        }
    });
    return ScoreTally;
}