// Required npm programs
require('dotenv').config()
const axios = require('axios')
const express = require('express')
const ejsLayouts = require('express-ejs-layouts')

// Express variables go here
const app = express()
const HOST = process.env.HOST
const PORT = process.env.PORT
app.set('view engine', 'ejs')
app.use(ejsLayouts)
app.use(express.static('public'))

// Required functions for webpage operations
const functions = require('./public/js/functions')

// Modules for users and products
const user = require('./public/js/user-module')
const product = require('./public/js/product-module')

// IMPORTANT URLS
const redditAPI = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_SECRET_KEY}&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING`
const imgurTest = 'https://api.imgur.com/3/image/i1GAmMC.json'

app.get('/', async (req, res) => {
  const message = req.query.message || null
  // const listings = functions.checkListings()
  await functions.checkListings()

  res.render('index', { 
    webpage: 'Home',
    message: message
  })
})

app.get('/Login', (req, res) => {
  res.render('login', { webpage: 'Login' })
})

// listen on port #----
app.listen(PORT, HOST, () => {
  console.log(`${HOST} has entered financial discomfort in port ${PORT}`)
})