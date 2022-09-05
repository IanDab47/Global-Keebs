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

const checkListings = () => {
  let listings = []
  let after = []
  axios.get(mmURL)
    .then(response => {
      listings = response.data.data.children.map(listing => listing.data)
      listings = listings.filter(listing => listing.link_flair_text.toUpperCase() !== 'INTEREST CHECK')
      listings = listings.filter(listing => listing.link_flair_text.toUpperCase() !== 'META')
      after = response.data.data.after.slice(3)
      console.log(after)
    })
    .catch(console.warn)
  
  return listings
}

exports.convUnix = convUnix
exports.ageCheck = ageCheck
exports.checkListings = checkListings