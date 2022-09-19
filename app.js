// Required npm programs
require('dotenv').config()
const axios = require('axios')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const db = require('./models')

// Express variables go here
const app = express()
const HOST = process.env.HOST
const PORT = process.env.PORT

// Express middleware go here
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(cookieParser())

// Required functions for webpage operations
const functions = require('./public/js/functions')

// IMPORTANT URLS
// const redditAPI = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_SECRET_KEY}&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING`
// const imgurTest = 'https://api.imgur.com/3/image/i1GAmMC.json'

// Check user authentication
app.use(async (req, res, next) => {
  if (req.cookies.userId) {
    const decryptedId = crypto.AES.decrypt(req.cookies.userId.toString(), process.env.ENC_SECRET)
    const decryptedIdString = decryptedId.toString(crypto.enc.Utf8)
    
    const user = await db.user.findByPk(decryptedIdString)

    res.locals.user = user
  } else {
    res.locals.user = null
  }

  next()
})

app.get('/', async (req, res) => {
  try {
    const user = res.locals.user
    const error = req.query.error || null
    let message = req.query.message || null
    // const listings = functions.checkListings()
    await functions.checkListings()

    if(res.locals.user) {
      message = `Welcome ${user.username}!`
    }
  
    res.render('index', { 
      webpage: 'Home',
      errorMsg: error,
      message: message,
      user
    })
  } catch(err) {
    console.log(err)
  }
})

app.use('/user', require('./controllers/user'))
app.use('/listings', require('./controllers/listings'))

// listen on port #----
app.listen(PORT, HOST, () => {
  console.log(`${HOST} has entered financial discomfort in port ${PORT}`)
})