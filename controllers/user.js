const Database = require('../data/database')

const findUser = (nickname, password) => {
    return Database.User.findOne({
        where: {
            $col: Database.whereLower('nickname', nickname),
            password: password,
        },
        attributes: ['id', 'nickname', 'email', 'password', 'fullname']
    })
}

const countNickName = (nickname) => {
    return Database.User.count({ where: { $col: Database.whereLower('nickname', nickname) } })
}

const countEmail = (email) => {
    return Database.User.count({ where: { $col: Database.whereLower('email', email) } })
}

const insert = (user) => {
    return Database.User.create(user)
}

module.exports = {
    findUser,
    countNickName,
    countEmail,
    insert
}