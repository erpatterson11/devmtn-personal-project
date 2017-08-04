const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const request = require('request')
const session = require('express-session')
const massive = require('massive')
const passport = require('passport')
const Auth0Strategy = require('passport-auth0')
const config = require('./config')


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
app.get('/login', passport.authenticate('auth0'), function(req,res) {
  res.redirect('/#!/space')
})

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

// Get coordinates from a search using geocodio
app.get('/api/weather/search', function(req,res) {

  console.log(req)

    if (req.query.location) {
        let address = req.query.location
        let url = `https://api.geocod.io/v1/geocode?q=${address}+&api_key=${config.dev.geocodio.secret}`
        request(url, function(err, response, body) {
          res.status(200).send(body)
        })
    } else if (req.query.latitude && req.query.longitude) {
        let address = req.query.location
        let url = `https://api.geocod.io/v1/reverse?q=${req.query.latitude},${req.query.longitude}&api_key=${config.dev.geocodio.secret}`

        request(url, function(err, response, body) {
          res.status(200).send(body)
        })
    }

})


// Get weather from coordinates
app.get('/api/weather/coords/:lat/:long/', function(req,res) {
  let lat = req.params.lat
  let long = req.params.long
  let url = `https://api.darksky.net/forecast/${config.dev.darkSky.secret}/${lat},${long}`

  request(url, function(err, response, body) {
    res.status(200).send(body)
  })
})

app.get('/api/scores', function(req,res) {
  db.get_scores(function(err, scores) {
    if (err) {
      res.status(400).send(err)
    } else {
      res.status(200).send(scores)
    }
  })
})

app.post('/api/scores', function(req,res) {
  let score = req.body.score
  let nickname = req.body.nickname
  let auth0id = null
  if (req.body.auth0) {
    auth0id = req.body.auth0
  }

  if (typeof score !== 'number' || typeof nickname !== 'string') {
    res.status(400).send(`There was an error posting your score.
      This is the information you sent.
      Score: ${score},
      nickname: ${nickname},
      auth0id: ${auth0id}`
    )
  }
  else {
    db.add_score([score, nickname, auth0id], function(err, confirmation) {
      if (err) {
        res.send(err)
      } else {
        res.status(200).send(confirmation)
      }
    })
  }
})


//========================== Listen ================================

app.listen(config.dev.server.port, () => console.log(`Listening to Andre${config.dev.server.port}`))
