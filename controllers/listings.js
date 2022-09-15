const express = require('express')
const router = express.Router()
const db = require('../models')

const typeArr = ['selling, buying, stores']

router.get('/', async (req, res) => {
  try {
    const errorMsg = req.query.error || null
    const filterType = req.query.filter || null
    const trueType = typeArr.filter(type => filterType === type)
  
    
    if(trueType) {
      const listings = db.listing.findAll({
        where: {
          flair_text: filterType.toUpperCase()
        }
      })
      res.render('listings/list', { 
        webpage: 'listings',
        listings,
        errorMsg
      })
    } else {
      const errorMsg = 'Something went wrong. Returning back home for safety'
      res.redirect(`/?message=${errorMsg}`)
    }
  } catch(err) {
    const errorMsg = 'Something went wrong. Returning back home for safety'
    res.redirect(`/?error=${errorMsg}`)
  }
})

router.get('/:page_id', async (req, res) => {
  try {
    const listing = db.listing.findOne({
      where: {
        page_id: page_id
      }
    })
    res.render('listings/show', { listing })
  } catch(err) {
    console.warn(err)
    const badListing = 'Listing does not exist.'
    res.redirect(`/listings/?error=${badListing}`)
  }
})

module.exports = router