const axios = require("axios")
const db = require('../../models')

let mmURL = `https://www.reddit.com/r/mechmarket/new/.json`
let pageCount = 0
let listings = []

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

const createListing = async (listing) => {
  // grab immediate values
  const author = listing.author
  const author_ref = listing.author_fullname
  const created_utc = listing.created_utc
  const downs = listing.downs
  const flair_text = listing.link_flair_text.toUpperCase()
  const page_id = listing.id || null
  const page_name = listing.name
  const self_text = listing.selftext
  const title = listing.title
  const ups = listing.ups
  const upvote_ratio = listing.upvote_ratio
  const url = listing.url

  // grab first bracket for location
  const re_local = /\[([^]]+)\]/
  let location = ''
  const titleText = re_local.exec(title) || ['ha', null ]
  titleText[1] ? location = titleText[1] : location = 'N/A'

  // grab first link and filter for imgur link
  const re_imgur = /\(([^)]+)\)/
  let timestamp = ''
  const listingText = re_imgur.exec(listing.selftext) || ['ha', 'no timestamp']
  listingText[1].includes('imgur') ? timestamp = listingText[1] : timestamp = 'no timestamp'

  const [newListing, created] = await db.listing.findOrCreate({
    where: {
      page_id: page_id,
    },
    defaults: {
      author: author,
      author_ref: author_ref,
      created_utc: created_utc,
      downs: downs,
      flair_text: flair_text,
      location: location,
      page_name: page_name,
      self_text: self_text,
      timestamp: timestamp,
      title: title,
      ups: ups,
      upvote_ratio: upvote_ratio,
      url: url
    }
  })

  return created
  // const someText = [
  //   listing.selftext
  // ]
  // const re_newLine = /.*(?!:\n)/gm
  // const lineOne = re_newLine.exec(listing.selftext) || ['', 'no line']
  // const re_imgur = /\(([^)]+)\)/gm
  // const [zero, txt] = re_imgur.exec(lineOne) || ['', 'no timestamp']
  // // console.log(txt[1])
  // console.log(txt)
  // console.log(someText)
  // console.log('------ NEW LISTING ------')
}

const addListings = async (url) => {
  const date = Date.now() - 527040000

  // retrieve listing data
  let allListings = await axios.get(url)
    .then(response => {
      response.data.data.children.map((listing, index) => {
        // let newListing = null
        // Add listings to array
        listings.push(listing.data)
        // if(listing.data && listing.data.link_flair_text) {
        //   newListing = createListing(listing)
        // }

        // if(newListing) {
          // check for final possible listing
          if(index === response.data.data.dist - 1 && response.data.data.after === null || listings.length === 1000) {
          // if(index === response.data.data.dist - 1) {
            console.log('done!')
  
            listings = filterListings(listings)
            console.log('filtered!')
  
            listings.map((listing, index) => {
              listings[index] = createListing(listing)
            })
          } else if (index === response.data.data.dist - 1) { // Checks for end of page
            // Update url to load next page
            after = response.data.data.after
            url = `https://www.reddit.com/r/mechmarket/new/.json?after=${after}`
  
            // Recursively append listings
            // console.log(response.data.data.after, listings.length)
            return addListings(url)
          }
        // }
      })
    })
    .catch(console.warn)

  return allListings
}

// filter for necessary listings
const filterListings = (listings) => {
  // Remove null objects to check flair text
  listings = listings.filter(listing => listing !== null)
  listings = listings.filter(listing => listing.link_flair_text !== null)

  // Remove irrelevant listings
  // listings = listings.filter(listing => listing.link_flair_text.toUpperCase() !== 'INTEREST CHECK' && 
  //                                       listing.link_flair_text.toUpperCase() !== 'GROUP BUY' &&
  //                                       listing.link_flair_text.toUpperCase() !== 'PURCHASED' &&
  //                                       listing.link_flair_text.toUpperCase() !== 'SERVICE' &&
  //                                       listing.link_flair_text.toUpperCase() !== 'TRADED' &&
  //                                       listing.link_flair_text.toUpperCase() !== 'STORE' &&
  //                                       listing.link_flair_text.toUpperCase() !== 'SOLD' &&
  //                                       listing.link_flair_text.toUpperCase() !== 'BULK' &&
  //                                       listing.link_flair_text.toUpperCase() !== 'META')

  return listings
}

const checkListings = async () => {
  // Declare necessary variables
  let listings = await addListings(mmURL)
  console.log(listings)
  // listings = filterListings(listings)
}

// export necessary functions
exports.convUnix = convUnix
exports.ageCheck = ageCheck
exports.checkListings = checkListings