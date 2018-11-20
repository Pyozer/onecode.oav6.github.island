const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const session = require('express-session')
const Database = require('./data/database')
const { flash } = require('./utils/flash')

const indexRouter = require('./routes/index')
const searchRouter = require('./routes/search')
const authRouter = require('./routes/auth')

const app = express()
const PORT = 3000

Database.instance.sync().then(_ => console.log("Database initialized !"))

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  secret: 'VerySecureKey',
  cookie: { maxAge: 60000 }
}))

// Add flash messages on all routes
app.use((req, res, next) => {
  res.locals.flash = flash(req);
  next();
});

app.use('/', indexRouter)
app.use('/', authRouter)
app.use('/', searchRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // render the error page
  res.status(err.status || 500)
  res.render('error', { title: `${err.status} | ${err.message}`, err: err })
})

// Start server
app.listen(PORT, () => console.log(`Server running and listening on port ${PORT}!`))
