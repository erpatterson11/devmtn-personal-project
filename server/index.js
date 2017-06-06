const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const session = require('express-session')
const massive = require('massive')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const config = require(__dirname + '/config')


//========================== Setup ================================

// express setup
let app = module.exports = express()
app.use(express.static('dist'))
app.use(bodyParser.json())
app.use(cors())

const massiveInstance = massive.connectSync({connectionString: config.dev.database.connectionString})
// massive set-up
app.set('db', massiveInstance)

let db = app.get('db')

// auth0 setup
app.use(session({
  secret: config.dev.session.secret,
  resave: true,
  saveUninitialized:false
}))

// initialize passport and Auth0
app.use(passport.initialize())
app.use(passport.session())
passport.use(new Auth0Strategy(config.dev.auth0Strategy, function(accessToken, refreshToken, extraParams, profile, done) {
  return done(null, profile)
}))

app.get('/login', passport.authenticate('auth0'))

app.get('/auth/callback',
passport.authenticate('auth0', {
  successRedirect: '/index.html',
  failureRedirect: '/login'
}))

passport.serializeUser(function(user,done) {
  done(null, user)
})

passport.deserializeUser(function(user,done) {
  done(null, user)
})

// import controller module
const controller = require('./servCtrl')

//========================== Endpoints ================================

// Get user info from Auth0
app.get('/api/auth0', function(req,res) {
  res.send(req.user)
})

app.get('/api/scores', function(req,res) {
  db.get_scores.sql([], function(err, scores) {
    res.send(scores)
  })
})

app.get('/api/users', function(req,res) {
  db.get_users.sql([], function(err, users) {
    res.send(users)
  })
})

app.post('/api/scores', function(req,res) {
  let userId = req.body.userId
  let score = req.body.scores
  let timestamp = req.body.scores
  db.add_score.sql([userId,score,timestamp], function(err, confirmation) {
    res.send(confirmation)
  })
})

app.post('/api/users', function(req,res) {
  let nickname = req.body.nickname
  let authId = req.body.authId || null
  db.add_user.sql([nickname, authId], function(err, confirmation) {
    res.send(confirmation)
  })
})


//========================== Listen ================================

app.listen(config.dev.server.port, () => console.log(`Listening to Andre${config.dev.server.port}`))
