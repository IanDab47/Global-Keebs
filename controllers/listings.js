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
    let filterType = req.query.filter || ''
    const tradeTrue = req.body.trade || null
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
        filterType = functions.capFirstLetter(filterType)
        if(tradeTrue && filterType !== 'store') {
          listings = await db.listing.findAll({
            where: {
              flair_text: filterType.toUpperCase() || 'TRADING'
            },
            order: [
              [sequelize.col('created_utc'), 'DESC']
            ]
          })
        } else if(filterType === 'store') {
          listings = await db.listing.findAll({
            where: {
              flair_text: !'SELLING' && !'BUYING' 
            },
            order: [
              [sequelize.col('created_utc'), 'DESC']
            ]
          })
        } else {
          listings = await db.listing.findAll({
            where: {
              flair_text: filterType.toUpperCase()
            },
            order: [
              [sequelize.col('created_utc'), 'DESC']
            ]
          })
        }
      } else {
        listings = await db.listing.findAll({
          order: [
            [sequelize.col('created_utc'), 'DESC']
          ]
        })
      }

      // filter by keyword search
      if(search) {
        listings = listings.filter(listing => listing.dataValues.self_text.toLowerCase().includes(search.toLowerCase()))
      }

      // functions.timeAgo(listings.map)

      res.render('listings/list', {
        webpage: filterType,
        message: null,
        errorMsg,
        listings,
        filter: functions.capFirstLetter(filterType),
        user,
        functions
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
    let favorite = null
    const user = res.locals.user
    const listing = await db.listing.findOne({
      where: {
        page_id: req.params.page_id
      }
    })
    const comments = await db.comment.findAll({
      where: {
        listingId: listing.id
      },
      include: [db.user]
    })
    if(user) {
      favorite = await db.users_listings.findOne({
        where: {
          userId: user.id,
          listingId: listing.id
        }
      })
    }
    console.log(comments.map(comment => comment.user))
    res.render('listings/show', {
      webpage: listing.title,
      message: null,
      errorMsg: null,
      listing,
      user,
      favorite,
      comments
    })
  } catch(err) {
    console.warn(err)
    const badListing = 'Listing does not exist...'
    res.redirect(`/listings/?error=${badListing}`)
  }
})

// post search on listings page
router.post('/', (req, res) => {
  res.redirect(`/listings/?filter=${req.query.filter}&search=${req.body.search}`)
})

// Creates comment for listing by user
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
    await user.addComment(comment)
    await currentListing.addComment(comment)

    res.redirect(`/listings/${page_id}`)
  } catch(err) {
    console.log(err)
    res.send('server error!')
  }
})

// Adds listing to user favorites
router.post('/:pageId/favorite', async (req, res) => {
  try {
    const listing = await db.listing.findOne({
      where: {
        page_id: req.params.pageId
      }
    })
    const user = await db.user.findOne({
      where: {
        id: res.locals.user.id
      }
    })
    const favorite = await db.users_listings.findOne({
      where: {
        listingId: listing.id,
        userId: user.id
      }
    })

    if(!favorite) await user.addListing(listing)
    else await db.users_listings.destroy({
      where: {
        listingId: listing.id,
        userId: user.id
      }
    })

    res.redirect(`/listings/${listing.page_id}`)
  } catch(err) {
    console.log(err)
    res.send(`ERROR: ${err}`)
  }
})

// Deletes specific comment
router.delete('/:pageId/delete', async (req, res) => {
  try {
    const pageId = req.params.pageId
    const commentId = req.body.comment

    await db.comment.destroy({
      where: {
        id: commentId
      }
    })

    res.redirect(`/listings/${pageId}`)
  } catch(err) {
    console.log(err)
  }
})

module.exports = router