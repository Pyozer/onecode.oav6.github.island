const express = require('express')
const Search = require('../controllers/search')
const router = express.Router()

router.get('/search', async (req, res, next) => {
  let users;
  if (req.query.search)
    users = await Search.search(req.query.search.trim())

  res.render('search', { title: 'Search', users: users })
})

module.exports = router
