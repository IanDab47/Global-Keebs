const axios = require("axios")

let after = ''
let mmURL = `https://www.reddit.com/r/mechmarket/new/${after}.json`

const convUnix = (timestamp) => {
  const date = new Date(timestamp * 1000)

  const year = date.getFullYear()
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const month = months[date.getMonth()]
  const day = date.getDate()
  const hour = date.getHours()
  const min = date.getMinutes()
  const sec = date.getSeconds()

  return `${month} ${day}, ${year} - ${hour}:${min}:${sec}`
}

const ageCheck = (timestamp) => {
  const twoMonths = 5270400000 // two months in milliseconds
  return timestamp * 1000 >= Date.now() - twoMonths ? true : false
}

const checkListings = (after) => {
  // Declare necessary variables
  let listings = []
  // let after = ''
  let isNew = true

  // run site check for listings
  axios.get(mmURL)
    .then(response => {
      // retrieve listing data and filter to buyers, sellers, and traders
      // listings.push(response.data.data.children.map(listing => listing.data))
      listings.push(response.data.data.children[0].data)
      listings.sort()

      // filter irrelevant listings
      listings = listings.filter(listing => listing.link_flair_text.toUpperCase() !== 'INTEREST CHECK')
      listings = listings.filter(listing => listing.link_flair_text.toUpperCase() !== 'GROUP BUY')
      listings = listings.filter(listing => listing.link_flair_text.toUpperCase() !== 'BULK')
      listings = listings.filter(listing => listing.link_flair_text.toUpperCase() !== 'META')
      
      // console.log(listings.map(type => type))
      
      // extract after text for next page search
      after = response.data.data.after.slice(3)
    })
    .catch(console.warn)

  // Rerun function until a listing is older than 2 months
  // return isNew ? checkListings(after) : listings
  return listings
}

// export necessary functions
exports.convUnix = convUnix
exports.ageCheck = ageCheck
exports.checkListings = checkListings