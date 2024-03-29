const { DataTypes } = require('sequelize');
const db = require('./index.js');

module.exports = (sequelize) => {
    const Blockchain = sequelize.define('Blockchain', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        chain: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: db.Block,
                key: 'id',
            },
        },
    });

    return Blockchain;
}