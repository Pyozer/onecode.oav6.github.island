const express = require('express')
const User = require('../controllers/user')
const { setFlash } = require('../utils/flash')
const authRouter = express.Router()

/* GET signIn */
authRouter.get('/signIn', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard')
    return
  }

  res.render('signIn', { title: "Sign In" })
  req.session.errorMsg = null
})

/* POST signIn */
authRouter.post('/signIn', async (req, res) => {
  const nickname = req.body.nickname
  const password = req.body.password

  if (!nickname || !password) {
    setFlash(req, 'danger', 'You must fill all input fields !')
    res.redirect('/signIn')
    return
  }

  const user = await User.findUser(nickname, password)
  if (!user) {
    setFlash(req, 'danger', 'Nickname or password is incorrect !')
    res.redirect('/signIn')
    return
  }
  req.session.user = user
  res.redirect('/dashboard')
})

/* GET signUp page */
authRouter.get('/signUp', (req, res) => {
  if (req.session.user) {
    res.redirect('/dashboard')
    return
  }
  res.render('signUp', { title: "Sign Up" })
})

/* POST signUp */
authRouter.post('/signUp', async (req, res) => {
  const user = {
    nickname: req.body.nickname,
    email: req.body.email,
    password: req.body.password,
    fullname: req.body.fullname
  }

  if (!user.nickname || !user.email || !user.password || !user.fullname) {
    setFlash(req, 'danger', 'You must fill all input fields !')
    res.redirect('/signUp')
    return
  }

  const nicknameCount = await User.countNickName(user.nickname)
  const emailCount = await User.countEmail(user.email)

  if (nicknameCount > 0 || emailCount > 0) {
    if (nicknameCount > 0 && emailCount > 0)
      setFlash(req, 'danger', 'Your nickname and email address are already taken !')
    else if (emailCount > 0)
      setFlash(req, 'danger', 'A user with the same email address already exists !')
    else
      setFlash(req, 'danger', 'A user with the same nickname already exists !')

    res.redirect('/signUp')
    return
  }

  const created = await User.insert(user)
  user.id = created.id

  req.session.user = user

  setFlash(req, 'success', 'You have been successfully registered.')
  res.redirect('/dashboard')
})

/* GET logout */
authRouter.get('/logout', (req, res, next) => {
  if (req.session.user) {
    req.session.user = null
    setFlash(req, 'success', 'You have been successfully disconnected.')
  }
  res.redirect('/signIn')
})

module.exports = authRouter