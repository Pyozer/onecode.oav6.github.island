const express = require('express')
const request = require('request-promise-native')
const Database = require('../data/database')
const { GITHUB_API_KEY } = require('../api_keys')
const { setFlash } = require('../utils/flash')
const router = express.Router()

router.get('/', (req, res, next) => {
  res.redirect(req.session.user ? '/dashboard' : '/signIn')
})

router.get('/dashboard', async (req, res, next) => {
  const user = req.session.user

  if (!user) {
    setFlash(req, 'danger', 'You must be connected to access to the dashboard !')
    res.redirect('/signIn')
    return
  }

  const options = {
    uri: `https://api.github.com/users/${user.nickname}`,
    qs: { access_token: GITHUB_API_KEY },
    headers: { 'User-Agent': 'Request-Promise' },
    json: true // Automatically parses the JSON string in the response
  }

  let resultUser
  let resultUserRepos
  try {
    resultUser = await request(options)
    options.uri += '/repos'
    resultUserRepos = await request(options)
    resultUserRepos.sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime()
      const dateB = new Date(b.updated_at).getTime()
      return dateA > dateB ? -1 : 1
    })

    await Database.Github.upsert(resultUser, {
      where: { 'login': resultUser.login }
    })
  } catch (_) { }

  res.render('dashboard', { title: 'Dashboard', user: req.session.user, gitUser: resultUser, gitUserRepos: resultUserRepos })
})

module.exports = router
