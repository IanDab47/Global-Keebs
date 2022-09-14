const express = require('express')
const router = express.Router()
const db = require('../models')

const typeArr = ['selling, buying, stores']

router.get('/', (req, res) => {
  const errorMsg = req.query.error || null
  const filterType = req.query.filter || null
  const trueType = typeArr.filter(type => filterType === type)

  if(trueType) {
    res.render('listings/list', { errorMsg })
  } else {
    const falseType = 'That listing does not exist.'
    res.redirect(`/?message=${falseType}`)
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