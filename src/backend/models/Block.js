const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Block = sequelize.define('Block', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        /*
        previousHash: {
            type: DataTypes.STRING,
            allowNull: true,
            references: {
                model: Block,
                key: 'hash',
            },
        },
        */
        previousHash: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        proof: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return Block;
}