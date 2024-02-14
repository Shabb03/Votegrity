const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const Admin = sequelize.define('Admin', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        blindPrivateKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        blindPublicKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        paillierPrivateKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        paillierPublicKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });

    return Admin;
}