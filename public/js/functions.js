const axios = require("axios")

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

const displayDetails = (listing) => {
  // grab listing type and title
  const flair = listing.link_flair_text
  const title = listing.title

  // // grab and filter first link
  // const regExp = /\(([^)]+)\)/
  // let timestamp = ''
  // const listingText = regExp.exec(listing.selftext) || ['ha', 'no timestamp']
  // listingText[1].includes('imgur') ? timestamp = listingText[1] : timestamp = 'no timestamp'

  const someText = [
    listing.selftext
  ]
  const re_newLine = /.*(?!:\n)/gm
  const lineOne = re_newLine.exec(listing.selftext) || ['', 'no line']
  const re_imgur = /\(([^)]+)\)/gm
  const [zero, txt] = re_imgur.exec(lineOne) || ['', 'no timestamp']
  // console.log(txt[1])
  console.log(txt)
  // console.log(someText)
  console.log('------ NEW LISTING ------')

  // grab listing url and author
  const user = listing.author
  const url = listing.url

  // return [flair, title, timestamp, user, url]
}

const addListings = async (url) => {
  const date = Date.now() - 527040000

  // retrieve listing data
  let allListings = await axios.get(url)
    .then(response => {
      response.data.data.children.map((listing, index) => {
        // Add listings to array
        listings.push(listing.data)

        // check for final possible listing
        if(index === response.data.data.dist - 1 && response.data.data.after === null || listings.length === 1000) {
        // if(index === response.data.data.dist - 1) {
          console.log('done!')

          listings = filterListings(listings)
          console.log('filtered!')
          
          console.log(listing.data)

          listings.map((listing, index) => {
            listings[index] = displayDetails(listing)
          })
        } else if (index === response.data.data.dist - 1) { // Checks for end of page
          // Update url to load next page
          after = response.data.data.after
          url = `https://www.reddit.com/r/mechmarket/new/.json?after=${after}`

          // Recursively append listings
          console.log(response.data.data.after, listings.length)
          return addListings(url)
        }
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
  listings = listings.filter(listing => listing.link_flair_text.toUpperCase() !== 'INTEREST CHECK' && 
                                        listing.link_flair_text.toUpperCase() !== 'GROUP BUY' &&
                                        listing.link_flair_text.toUpperCase() !== 'PURCHASED' &&
                                        listing.link_flair_text.toUpperCase() !== 'SERVICE' &&
                                        listing.link_flair_text.toUpperCase() !== 'TRADED' &&
                                        listing.link_flair_text.toUpperCase() !== 'STORE' &&
                                        listing.link_flair_text.toUpperCase() !== 'SOLD' &&
                                        listing.link_flair_text.toUpperCase() !== 'BULK' &&
                                        listing.link_flair_text.toUpperCase() !== 'META')

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