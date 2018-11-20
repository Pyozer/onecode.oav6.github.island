const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/search', (req, res, next) => {
  res.render('search', { title: 'Search' });
});

module.exports = router;
