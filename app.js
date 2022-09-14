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
  // const listings = functions.checkListings()
  // functions.checkListings()
  await axios.get(imgurTest)
    .then(response => {
      console.log(response.data.validateStatus)
    })
    .catch(console.warn)
  res.render('index', { 
    webpage: 'Home',
  })
})

app.get('/Keyboards', (req, res) => {
  
  res.render('listings', { webpage: 'Sellers' })
})

app.get('/Switches', (req, res) => {
  res.render('listings', { webpage: 'Buyers' })
})

app.get('/Keycaps', (req, res) => {
  res.render('listings', { webpage: 'Stores' })
})

app.get('/Login', (req, res) => {
  res.render('login', { webpage: 'Login' })
})

app.get('/products', (req, res) => {
  res.send({ shelby80, bobaU4T, dots })
})

app.get('/users', (req, res) => {
  res.send({ mark, dave, swagkeys })
})

// listen on port #----
app.listen(PORT, HOST, () => {
  console.log(`${HOST} has entered financial discomfort in port ${PORT}`)
})