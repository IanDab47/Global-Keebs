// Required npm programs
const express = require('express')

// Express variables go here
const app = express()
const HOST = 'localhost'
const PORT = '8001'

// Modules for users and products
const user = require('./user-module')
const product = require('./product-module')

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

app.get('/products', (req, res) => {
  res.send({ shelby80, bobaU4T, dots })
})

app.get('/users', (req, res) => {
  res.send({ mark, dave, swagkeys })
})

// listen on port #----
app.listen(PORT, HOST, () => {
  console.log(`${HOST} is listening on port ${PORT}`)
})