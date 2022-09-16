const express = require('express')
const { sequelize } = require('../models')
const router = express.Router()
const db = require('../models')

const typeArr = ['selling, buying, stores']

router.get('/', async (req, res) => {
  try {
    const errorMsg = req.query.error || null
    const filterType = req.query.filter || null
    const trueType = typeArr.filter(type => filterType === type)

    console.log(filterType)
  
    
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
      // console.log(listings)
      res.render('listings/list', { 
        webpage: 'listings',
        message: null,
        errorMsg,
        listings
      })
    }
  } catch(err) {
    console.log(err)
    const errorMsg = 'Something went wrong. Returning back here for safety'
    res.redirect(`/?error=${errorMsg}`)
  }
})

router.get('/:page_id', async (req, res) => {
  try {
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
      listing
    })
  } catch(err) {
    console.warn(err)
    const badListing = 'Listing does not exist...'
    res.redirect(`/listings/?error=${badListing}`)
  }
})

module.exports = router