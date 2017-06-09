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

const massiveInstance = massive.connectSync({
  connectionString: config.dev.database.connectionString
})
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

// login endpoint
app.get('/login', passport.authenticate('auth0'))

app.get('/auth/callback',
passport.authenticate('auth0', {
  successRedirect: '/#!/space',
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
  db.get_scores([], function(err, scores) {
    if (err) {
      res.send(err)
    } else {
      res.send(scores)
    }
  })
})

app.post('/api/scores', function(req,res) {

  console.log(req.body);

  let score = req.body.score
  let nickname = req.body.nickname
  let auth0id = req.body.auth0id.data

  if (!score || !nickname) {
    console.log('error');
    res.send(`There was an error posting your score.
      This is the information you sent.
      Score: ${score},
      nickname: ${nickname},
      auth0id: ${auth0id}
      `)
  }

  else {
    db.add_score([score, nickname, auth0id], function(err, confirmation) {
      if (err) {
        console.log(err);
        res.send(err)
      } else {
        res.send(confirmation, req.body)
      }
    })
  }
})


//========================== Listen ================================

app.listen(config.dev.server.port, () => console.log(`Listening to Andre${config.dev.server.port}`))
