const { STRING } = require('sequelize')

const GithubModel = {
    login: STRING,
    avatar_url: STRING,
    url: STRING,
    company: STRING,
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