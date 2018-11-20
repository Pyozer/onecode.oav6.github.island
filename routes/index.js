const express = require('express');
const { setFlash } = require('../utils/flash')
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect(req.session.user ? '/dashboard' : '/signIn')
});

router.get('/dashboard', function (req, res, next) {
  if (!req.session.user) {
    setFlash(req, 'danger', 'You must be connected to access to the dashboard !')
    res.redirect('/signIn')
    return;
  }

  res.render('dashboard', { title: 'Dashboard', user: req.session.user });
});

module.exports = router;
