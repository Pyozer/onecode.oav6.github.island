const Database = require('../data/database')

const search = (search) => {
    return Database.Github.findAll({
        where: {
            login: Database.lowerLike('login', search)
        }
    })
}

module.exports = {
    search
}