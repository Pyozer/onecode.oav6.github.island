const { STRING } = require('sequelize')

const GithubModel = {
    avatar_ul: STRING,
    url: STRING,
    ompany: STRING,
    location: STRING,
    bio: STRING,
    followers: STRING,
    following: STRING,
    public_repos: STRING,
    public_gists: STRING
}

module.exports = {
    GithubModel
}