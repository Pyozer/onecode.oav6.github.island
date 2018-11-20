const Sequelize = require('sequelize');
const { UserModel } = require('../models/user');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    storage: './oav06.db',
    operatorsAliases: false
});
const User = sequelize.define('user', UserModel)

function whereLower(column, value) {
    return sequelize.where(
        sequelize.fn('lower', sequelize.col(column)),
        sequelize.fn('lower', value)
    )
}

module.exports = {
    instance: sequelize,
    User,
    whereLower
}