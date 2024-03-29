const { DataTypes } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        blockId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Block,
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
        voterId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: db.Voter,
                key: 'id',
            },
        },
        privateKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publicKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        signature: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    });

    return Transaction;
}