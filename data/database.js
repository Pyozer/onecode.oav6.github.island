const Sequelize = require('sequelize')
const { UserModel } = require('../models/user')
const { GithubModel } = require('../models/github')

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

    storage: './data/oav06.db',
    operatorsAliases: false
})

const User = sequelize.define('user', UserModel)
const Github = sequelize.define('github', GithubModel)

const whereLower = (column, value) => {
    return sequelize.where(
        sequelize.fn('lower', sequelize.col(column)),
        sequelize.fn('lower', value)
    )
}

const lowerLike = (column, value) => {
    return sequelize.where(sequelize.fn('LOWER', sequelize.col(column)), 'LIKE', `%${value}%`)
}

module.exports = {
    instance: sequelize,
    User,
    Github,
    whereLower,
    lowerLike
}