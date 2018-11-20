const express = require('express')
const Github = require('../controllers/github_api')
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

  let options = { title: 'Dashboard', user: user, gitUser: null, gitUserRepos: null }
  try {
    const { gitUser, gitUserRepos } = await Github.getUserData(user.nickname)

    await Github.insertOrUpdate(gitUser)

    options.gitUser = gitUser
    options.gitUserRepos = gitUserRepos
  } catch (_) { }

  res.render('dashboard', options)
})

module.exports = router
