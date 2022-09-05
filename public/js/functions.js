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

exports.convUnix = convUnix
exports.ageCheck = ageCheck