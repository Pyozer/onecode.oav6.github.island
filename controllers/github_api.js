const request = require('request-promise-native')
const Database = require('../data/database')
const { GITHUB_API_KEY } = require('../api_keys')

const getUserData = (nickname) => {
    return new Promise(async (resolve, reject) => {
        const options = {
            uri: `https://api.github.com/users/${nickname}`,
            qs: { access_token: GITHUB_API_KEY },
            headers: { 'User-Agent': 'Request-Promise' },
            json: true // Automatically parses the JSON string in the response
        }

        let resultUser, resultUserRepos
        try {
            resultUser = await request(options)
            options.uri += '/repos'
            resultUserRepos = await request(options)
            resultUserRepos.sort((a, b) => {
                const dateA = new Date(a.updated_at).getTime()
                const dateB = new Date(b.updated_at).getTime()
                return dateA > dateB ? -1 : 1
            })
            resolve({ gitUser: resultUser, gitUserRepos: resultUserRepos })
        } catch (e) {
            reject(e)
        }
    })
}

const insertOrUpdate = (gitUser) => {
    return Database.Github.upsert(gitUser, { where: { 'login': gitUser.login } })
}

module.exports = {
    getUserData,
    insertOrUpdate
}