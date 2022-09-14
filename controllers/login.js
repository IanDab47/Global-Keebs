const express = require('express')
const router = express.Router()
const db = require('../models')

router.get('/', (req, res) => {
  res.render('user/login', { webpage: 'Login' })
})

router.get('/signup', (req, res) => {
  res.render('user/signup', { webpage: 'Sign-Up' })
})

router.post('/', async (req, res) => {
  try { 
    // Check for user email
    const loginUser = await db.user.findOne({
      where: {
        email: req.body.email
      }
    })

    const badLogin = 'Invalid or Non-Existent Email or Password'

    if(!loginUser) {
      console.log('Invalid or Non-Existent Email')
      res.redirect('/users/login?message=' + badLogin)

    } else if(!bcrypt.compareSync(req.body.password, loginUser.password)) {
      console.log('Invalid Password')
      res.redirect('/users/login?message=' + badLogin)
      
    } else {
      const encryptedUserId = crypto.AES.encrypt(loginUser.id.toString(), process.env.ENC_SECRET)
      const encryptedUserIdString = encryptedUserId.toString()
      res.cookie('userId',encryptedUserIdString)
      res.redirect('/user/profile')
    }
  } catch(err) {
    console.log(err)
    res.send('Server Error!')
  }
})

router.post('/signup', async (req, res) => {
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
      res.redirect(`/users/login?message=${acctExists}`)
    } else {
      const encryptedUserId = crypto.AES.encrypt(newUser.id.toString(), process.env.ENC_SECRET)
      const encryptedUserIdString = encryptedUserId.toString()
      res.cookie('userId',encryptedUserIdString)
      res.redirect('/users')
    }
  } catch(err) {
    console.log(err)
    res.send('server error!')
  }
})

module.exports = router