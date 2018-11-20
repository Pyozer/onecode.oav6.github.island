const express = require('express')
const Database = require('../data/database')
const router = express.Router()

router.get('/search', async (req, res, next) => {
  let users;
  if (req.query.search) {
    users = await Database.Github.findAll({
      where: {
        login: Database.instance.where(Database.instance.fn('LOWER', Database.instance.col('login')), 'LIKE', '%' + req.query.search + '%')
      }
    })
  }

  res.render('search', { title: 'Search', users: users })
})

module.exports = router
