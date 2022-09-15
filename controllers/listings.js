const express = require('express')
const router = express.Router()
const db = require('../models')

const typeArr = ['selling, buying, stores']

router.get('/', async (req, res) => {
  try {
    const errorMsg = req.query.error || null
    const filterType = req.query.filter || null
    const trueType = typeArr.filter(type => filterType === type)
  
    // Check for bad filter type
    if(filterType !== null && !trueType) {
      const errorMsg = 'Something went wrong. Returning back home for safety'
      res.redirect(`/?message=${errorMsg}`)

      // Check for error message
    } else if(errorMsg !== null) {
      const errorMsg = 'Something went wrong. Returning back home for safety'
      res.redirect(`/?message=${errorMsg}`)

      // Default here because everything else works (I think)
    } else {
      const listings = await db.listing.findAll({
        where: {
          flair_text: filterType.toUpperCase()
        }
      })
      // console.log(listings)
      res.render('listings/list', { 
        webpage: 'listings',
        message: null,
        errorMsg,
        listings
      })
    }
  } catch(err) {
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