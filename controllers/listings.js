require('dotenv').config()
const functions = require('../public/js/functions')
const express = require('express')
const router = express.Router()
const crypto = require('crypto-js')
const bcrypt = require('bcrypt')
const { sequelize } = require('../models')
const db = require('../models')

const typeArr = ['selling', 'buying', 'store']
const tmbs = [
  '/imgs/filler/iron180.jpg',
  '/imgs/filler/space65.jpg',
  '/imgs/filler/suit.jpg',
  '/imgs/filler/switches.jpg',
  '/imgs/filler/thera.jpg',
]

// load listings page
router.get('/', async (req, res) => {
  try {
    const user = res.locals.user
    const errorMsg = req.query.error || null
    let filterType = req.query.filter || ''
    const tradeTrue = req.query.trade || null
    const storeTrue = req.query.stores || null
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
        if(tradeTrue && filterType !== 'Store') {
          filterArr = [filterType.toUpperCase(), 'TRADING']
          listings = await db.listing.findAll({
            where: {
              flair_text: filterArr
            },
            order: [
              [sequelize.col('created_utc'), 'DESC']
            ]
          })
        } else if(storeTrue && filterType === 'Store') {
          console.log('working')
          filterArr = ['GROUP BUY', 'INTEREST CHECK', 'STORE', 'BULK', 'ARTISAN']
          listings = await db.listing.findAll({
            where: {
              flair_text: filterArr
            },
            order: [
              [sequelize.col('created_utc'), 'DESC']
            ]
          })
        } else if(filterType === 'Store') {
          filterArr = ['GROUP BUY', 'INTEREST CHECK']
          listings = await db.listing.findAll({
            where: {
              flair_text: filterArr
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
    let thumbnails = []
    const message = req.query.message || null
    const user = res.locals.user
    const listing = await db.listing.findOne({
      where: {
        page_id: req.params.page_id
      }
    })
    if(listing.timestamp) {
      // Continuously loop through an amount of images based on static key
      while(thumbnails.length <= listing.created_utc % 5) {
        // Generate random number between 1 <==> 5
        const rndArrPos = Math.ceil(Math.random() * 5) % 5
        // Check if img is inside array. Add if not included
        thumbnails.includes(tmbs[rndArrPos]) ? null : thumbnails.push(tmbs[rndArrPos]) 
      }
    }
    
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
    // console.log(comments.map(comment => comment.user))
    res.render('listings/show', {
      webpage: listing.title,
      message: message,
      errorMsg: null,
      listing,
      thumbnails,
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

// loads listing page with comment edit
router.get('/:page_id/edit/:commentId', async (req, res) => {
  const user = res.locals.user
  const listing = await db.listing.findOne({
    where: {
      page_id: req.params.page_id
    }
  })
  const comment = await db.comment.findOne({
    where: {
      id: req.params.commentId
    }
  })
  favorite = await db.users_listings.findOne({
    where: {
      userId: user.id,
      listingId: listing.id
    }
  })

  res.render('listings/edit', {
    webpage: 'Edit Comment',
    message: null,
    errorMsg: null,
    listing,
    user,
    favorite,
    comment
  })
})

// post search on listings page
router.post('/', (req, res) => {
  if(req.body.trade) {
    res.redirect(`/listings/?filter=${req.query.filter}&trade=ON&search=${req.body.search}`)
  } else if(req.body.other) {
    res.redirect(`/listings/?filter=${req.query.filter}&stores=ON&search=${req.body.search}`) 
  } else {
    res.redirect(`/listings/?filter=${req.query.filter}&search=${req.body.search}`)
  }
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

// Edit comment on listing
router.put('/:pageId/edit/:commentId', async (req, res) => {
  try {
    const user = res.locals.user
    let message = null
    const comment = await db.comment.findOne({
      where: {
        id: req.params.commentId
      }, 
      include: [db.user]
    })

    if(user.id == comment.user.id) {
      await db.comment.update({
        comment: req.body.comment
      },
      {
        where: {
          id: req.params.commentId
        }
      })
      message = 'Comment edited successfully! ✔'
    }
    
    res.redirect(`/listings/${req.params.pageId}/?message=${message}`)
  } catch(err) {
    console.log(err)
    res.send('SERVER ERROR!')
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