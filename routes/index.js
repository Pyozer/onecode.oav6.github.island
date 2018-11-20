const express = require('express');
const request = require('request-promise-native')
const { GITHUB_API_KEY } = require('../api_keys')
const { setFlash } = require('../utils/flash')
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect(req.session.user ? '/dashboard' : '/signIn')
});

router.get('/dashboard', async (req, res, next) => {
  const user = req.session.user

  if (!user) {
    setFlash(req, 'danger', 'You must be connected to access to the dashboard !')
    res.redirect('/signIn')
    return;
  }

  const options = {
    uri: `https://api.github.com/users/${user.nickname}`,
    qs: { access_token: GITHUB_API_KEY },
    headers: { 'User-Agent': 'Request-Promise' },
    json: true // Automatically parses the JSON string in the response
  };

  let resultUser;
  let resultUserRepos;
  try {
    resultUser = await request(options)
    options.uri += '/repos'
    resultUserRepos = await request(options)
  } catch (_) {}

  res.render('dashboard', { title: 'Dashboard', user: req.session.user, gitUser: resultUser, gitUserRepos: resultUserRepos });
});

module.exports = router;
