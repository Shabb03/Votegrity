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
        blindPublicKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        blindPrivateKeyPath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        paillierPublicKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        paillierPrivateKeyPath: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    });
    return Admin;
}