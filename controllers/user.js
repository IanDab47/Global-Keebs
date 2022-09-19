require('dotenv').config()
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const db = require('../models')

// load account page
router.get('/', (req, res) => {
  const user = res.locals.user
  const message = req.query.message || null
  
  res.render('user/show', {
    webpage: user.username,
    message: message,
    errorMsg: null,
    user
  })
})

// load edit account page
router.get('/edit', (req, res) => {
  const user = res.locals.user

  res.render('user/edit', {
    webpage: user.username,
    message: null,
    errorMsg: null,
    user
  })
})

// delete current user
router.get('/delete', async (req, res) => {
  try {
    if(!res.locals.user) {
      const acctErr = 'Something went wrong. Please login to continue'
      res.redirect(`/user/login/?err=${acctErr}`)
    } else {
      await db.user.destroy({
        where: {
          id: res.locals.user.id
        }
      })
    
      const acctDelete = '✔ Account successfully deleted!'
      res.redirect(`/?message=${acctDelete}`)
    }
  } catch(err) {
    console.log(err)
    const errorMsg = 'Something went wrong. Returning back here for safety'
    res.redirect(`/?error=${errorMsg}`)
  }
})

// load page with all comments made
router.get('/comments', async (req, res) => {
  const user = res.locals.user
  const comments = await db.comment.findAll({
    where: {
      userId: user.id
    },
    // include: [db.listing]
  })

  console.log(comments)

  res.render('user/comments', {
    webpage: user.username,
    message: null,
    errorMsg: null,
    user
  })
})

// load login page
router.get('/login', (req, res) => {
  const user = res.locals.user
  const message = req.query.message || null
  const loginStatus = req.query.loginStatus || null

  res.render('user/login', {
    webpage: 'Login',
    message: message,
    errorMsg: null,
    user,
    loginStatus
  })
})

// load signup page
router.get('/signup', (req, res) => {
  const user = res.locals.user
  const loginStatus = req.query.status || null

  res.render('user/new', {
    webpage: 'Sign-Up',
    message: loginStatus,
    errorMsg: null,
    user
  })
})

// load logout page
router.get('/logout', (req, res) => {
  res.clearCookie('userId')
  res.redirect('/')
})

// Login to Account
router.post('/login', async (req, res) => {
  try {
    // Check for user email
    let loginUser = await db.user.findOne({
      where: {
        username: req.body.name
      }
    })
    if(!loginUser) {
      loginUser = await db.user.findOne({
        where: {
          email: req.body.name
        }
      })
    }

    const badLogin = 'Invalid or Non-Existent Account Info'

    if(!loginUser) {
      console.log('Invalid or Non-Existent Email')
      res.redirect('/user/login?loginStatus=' + badLogin)

    } else if(!bcrypt.compareSync(req.body.password, loginUser.password)) {
      console.log('Invalid Password')
      res.redirect('/user/login?loginStatus=' + badLogin)
      
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

// Create Account
router.post('/signup', async (req, res) => {
  try {
    const hashedPass = bcrypt.hashSync(req.body.password, 12)
    const [newUser, created] = await db.user.findOrCreate({
      where: {
        email: req.body.email,
      },
      defaults: {
        username: req.body.name,
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

// Edit user info
router.put('/', async (req, res) => {
  try {
    const user = res.locals.user
    const newUsername = req.body.name
    const newEmail = req.body.email
    
    await db.user.update({
      username: newUsername,
      email: newEmail
    },
    {
      where: {
        id: user.id
      }
    })

    const editComplete = `Your account has been edited successfully`
    res.redirect(`/user/?message=${editComplete}`)
  } catch(err) {
    console.log(err)
    const errorMsg = 'Something went wrong. Returning back here for safety'
    res.redirect(`/?error=${errorMsg}`)
  }
})

module.exports = router