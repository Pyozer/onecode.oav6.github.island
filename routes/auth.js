const express = require('express');
const Database = require('../data/database')
const { Op } = require('sequelize')
const { setFlash, flash } = require('../utils/flash')
const authRouter = express.Router();

authRouter.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard')
    return;
  }

  res.render('login', { title: "Login" })
  req.session.errorMsg = null
})

authRouter.post('/login', async (req, res) => {
  const nickname = req.body.nickname
  const password = req.body.password

  if (!nickname || !password) {
    setFlash(req, 'danger', 'You must fill all input fields !')
    res.redirect('/login')
    return;
  }

  const user = await Database.User.findOne({
    where: { 'nickname': nickname, 'password': password },
    attributes: ['id', 'nickname', 'email', 'password', 'fullname']
  })

  if (!user) {
    setFlash(req, 'danger', 'Nickname or password is incorrect !')
    res.redirect('/login')
    return;
  }
  req.session.user = user

  res.redirect('/dashboard')
})

/* GET register page */
authRouter.get('/register', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard')
    return;
  }

  res.render('register', { title: "Register" })
})

authRouter.post('/register', async (req, res) => {
  const user = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password,
    fullname: req.body.fullname
  }

  if (!user.nickname || !user.email || !user.password || !user.fullname) {
    setFlash(req, 'danger', 'You must fill all input fields !')
    res.redirect('/register')
    return;
  }

  const isNickname = await Database.User.findOne({ where: { 'nickname': user.nickname } })
  const isEmail = await Database.User.findOne({ where: { 'email': user.email } })
  console.log(isNickname)
  console.log(isEmail)

  if (isNickname || isEmail) {
    if (isNickname && isEmail)
      setFlash(req, 'danger', 'Your nickname and email address are already taken !')
    else if (isEmail)
      setFlash(req, 'danger', 'A user with the same email address already exists !')
    else
      setFlash(req, 'danger', 'A user with the same nickname already exists !')

    res.redirect('/register')
    return;
  }

  const created = await Database.User.create({
    nickname: user.nickname,
    email: user.email,
    password: user.password,
    fullname: user.fullname
  })
  user.id = created.id

  req.session.user = user

  setFlash(req, 'success', 'You have been successfully registered.')
  res.redirect('/dashboard')
})

authRouter.get('/logout', function (req, res, next) {
  if (req.session.user) {
    req.session.user = null
    setFlash(req, 'success', 'You have been successfully disconnected.')
  }
  res.redirect('/login')
})

module.exports = authRouter