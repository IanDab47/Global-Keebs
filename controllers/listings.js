require('dotenv').config()
const functions = require('../public/js/functions')
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const { sequelize } = require('../models')
const db = require('../models')

const typeArr = ['selling', 'buying', 'store']

// load listings page
router.get('/', async (req, res) => {
  try {
    const user = res.locals.user
    const errorMsg = req.query.error || null
    const filterType = req.query.filter || ''
    const search = req.query.search || req.body.search || null
    const trueType = typeArr.filter(type => filterType === type)

    // console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`)
    
    if(filterType !== null && !trueType) { // Check for bad filter type
      const errorMsg = 'Something went wrong. Returning back home for safety'
      res.redirect(`/?message=${errorMsg}`)

    } else if(errorMsg !== null) { // Check for error message
      const errorMsg = 'Something went wrong. Returning back home for safety'
      res.redirect(`/?message=${errorMsg}`)

    } else { // Default here because everything else works (I think)
      let listings = null
      // Check for filter settings
      if(filterType) {
        listings = await db.listing.findAll({
          where: {
            flair_text: filterType.toUpperCase()
          },
          order: [
            [sequelize.col('created_utc'), 'DESC']
          ]
        })
      } else {
        listings = await db.listing.findAll()
      }

      // filter by keyword search
      if(search) {
        listings = listings.filter(listing => listing.dataValues.self_text.toLowerCase().includes(search.toLowerCase()))
      }

      res.render('listings/list', {
        webpage: 'listings',
        message: null,
        errorMsg,
        listings,
        filter: functions.capFirstLetter(filterType),
        user
      })
    }
  } catch(err) {
    console.log(err)
    const errorMsg = 'Something went wrong. Returning back here for safety'
    res.redirect(`/?error=${errorMsg}`)
  }
})

// load listing display page
router.get('/:page_id', async (req, res) => {
  try {
    const user = res.locals.user
    const listing = await db.listing.findOne({
      where: {
        page_id: req.params.page_id
      }
    })
    // console.log(listing)
    res.render('listings/show', {
      webpage: null,
      message: null,
      errorMsg: null,
      listing,
      user
    })
  } catch(err) {
    console.warn(err)
    const badListing = 'Listing does not exist...'
    res.redirect(`/listings/?error=${badListing}`)
  }
})

// post search on listings page
router.post('/', (req, res) => {
  console.log(req.body)
  res.redirect(`/listings/?search=${req.body.search}`)
})

router.post('/:pageId', async (req, res) => {
  try {
    const user = res.locals.user
    const page_id = req.params.pageId
    
    const currentListing = await db.listing.findOne({
      where: {
        page_id: page_id
      }
    })
    
    const comment = await db.comment.create({
      comment: req.body.comment,
      userId: user.id,
      listingId: currentListing.id
    })

    // console.log(comment)

    await user.createComment(comment)
    await currentListing.createComment(comment)

    res.redirect(`/listings/${page_id}`)
  } catch(err) {
    console.log(err)
    res.send('server error!')
  }
})

module.exports = router