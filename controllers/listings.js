const express = require('express')
const router = express.Router()
const db = require('../models')

const typeArr = ['selling, buying, stores']

router.get('/:type', (req, res) => {
  const listingType = req.params.type
  const trueType = typeArr.filter(type => listingType === type)

  if(trueType) {
    res.render('listings/show', { webpage: listingType })
  } else {
    const falseType = 'That listing does not exist.'
    res.redirect(`/?message=${falseType}`)
  }
})

module.exports = router