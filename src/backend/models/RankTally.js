const { DataTypes } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const RankTally = sequelize.define('RankTally', {
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
        sum: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 1n
        },
        rank: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    });
    return RankTally;
}