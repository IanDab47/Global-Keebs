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

// TEST PRODUCTS
const shelby80 = new product.Keyboard('Shelby80', 'tkl', 'E-White', 349, 'Swagkeys', 'hotswap pcb, fr4 plate, daugther board')
const bobaU4T = new product.Switches('BobaU4T', '90', 110, 'Gazzew', true, true)
const dots = new product.Keycaps('Dots', 220, 'GMK', 'Cherry', 'base', 'sealed')
// console.log(shelby80, bobaU4T, dots)
// console.log(product.Keyboard.quantity, product.Switches.quantity, product.Keycaps.quantity)

// TEST USERS
const mark = new user.Buyer('mark', 'BobaU4T', 'Dots')
const dave = new user.Seller('dave', 'Dots', 'BobaU4T')
const swagkeys = new user.Market('swagkeys', 'Shelby80')
// console.log(shelby80, bobaU4T, dots)
// console.log(product.Keyboard.quantity, product.Switches.quantity, product.Keycaps.quantity)

// IMPORTANT URLS
const redditAPI = `https://www.reddit.com/api/v1/authorize?client_id=${process.env.REDDIT_SECRET_KEY}&response_type=TYPE&state=RANDOM_STRING&redirect_uri=URI&duration=DURATION&scope=SCOPE_STRING`

app.get('/', (req, res) => {
  // const listings = functions.checkListings()
  functions.checkListings()
  res.render('index', { 
    webpage: 'Home',
  })
})

app.get('/Keyboards', (req, res) => {
  
  res.render('products', { webpage: 'Keyboards' })
})

app.get('/Switches', (req, res) => {
  res.render('products', { webpage: 'Switches' })
})

app.get('/Keycaps', (req, res) => {
  res.render('products', { webpage: 'Keycaps' })
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