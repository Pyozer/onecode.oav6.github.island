const { STRING } = require('sequelize')

const UserModel = {
    nickname: STRING,
    email: STRING,
    password: STRING,
    fullname: STRING,
}

module.exports = {
    UserModel
}