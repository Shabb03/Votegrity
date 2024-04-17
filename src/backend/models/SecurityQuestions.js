const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const SecurityQuestions = sequelize.define('SecurityQuestions', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        questions: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return SecurityQuestions;
}