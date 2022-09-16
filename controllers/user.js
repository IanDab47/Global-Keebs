require('dotenv').config()
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const db = require('../models')

router.get('/', (req, res) => {
  const user = res.locals.user

  res.render('user/main', {
    webpage: user.username,
    message: null,
    errorMsg: null,
    user
  })
})

router.get('/login', (req, res) => {
  const loginStatus = req.query.status || null

  res.render('user/login', {
    webpage: 'Login',
    message: loginStatus,
    errorMsg: null,
  })
  
  router.get('/signup', (req, res) => {
    res.render('user/new', {
      webpage: 'Sign-Up',
      message: null,
      errorMsg: null,
    })
  })
})

router.get('/logout', (req, res) => {
  res.clearCookie('userId')
  res.redirect('/')
})

router.post('/', async (req, res) => {
  try { 
    // Check for user email
    const loginUser = await db.user.findOne({
      where: {
        username: req.body.name
      }
    })

    const badLogin = 'Invalid or Non-Existent Email or Password'

    if(!loginUser) {
      console.log('Invalid or Non-Existent Email')
      res.redirect('/user/login?message=' + badLogin)

    } else if(!bcrypt.compareSync(req.body.password, loginUser.password)) {
      console.log('Invalid Password')
      res.redirect('/user/login?message=' + badLogin)
      
    } else {
      const encryptedUserId = crypto.AES.encrypt(loginUser.id.toString(), process.env.ENC_SECRET)
      const encryptedUserIdString = encryptedUserId.toString()
      res.cookie('userId',encryptedUserIdString)
      res.redirect('/')
    }
  } catch(err) {
    console.log(err)
    res.send('Server Error!')
  }
})

router.post('/login', async (req, res) => {
  try {
    const hashedPass = bcrypt.hashSync(req.body.password, 12)
    const [newUser, created] = await db.user.findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        password: hashedPass
      }
    })
    if (!created) {
      const acctExists = 'Account exists. Please login to continue.'
      res.redirect(`/user/login?message=${acctExists}`)
    } else {
      const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET)
      const encryptedUserIdString = encryptedUserId.toString()
      res.cookie('userId',encryptedUserIdString)
      res.redirect('/')
    }
  } catch(err) {
    console.log(err)
    res.send('server error!')
  }
})

module.exports = router