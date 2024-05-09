const { DataTypes } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const Vote = sequelize.define('Vote', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Voter,
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
        },
        blindedSignature: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
        r: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        encryptedVote: {
            type: DataTypes.BIGINT,
            allowNull: true,
        },
    });

    return Vote;
}