class User {
  static quantity

  constructor(name, items) {
    this.name = name
    this.items = 0
    User.quantity++
  }
}

class Buyer extends User {
  constructor(name, has, wants) {
    super(name)
    this.has = has
    this.wants = wants
  }
}

class Seller extends User {
  constructor(name, has, wants) {
    super(name)
    this.has = has
    this.wants = wants
  }

  negCheck() {
    if(this.items < 0) {
      console.warn(`${this.name}'s items has now gone negative!`)
    }
  }

  addItems() {
    this.has.forEach(item => {
      this.items++
    })
  }

  soldItem(item) {
    let filteredItems = []
    this.has = this.has.filter(hasItem => hasItem !== item)
    this.items--
    this.negCheck()
  }

}

class Market extends User {
  constructor(name, has) {
    super(name)
    this.has = has
  }
}

module.exports = {
  User: User,
  Buyer: Buyer,
  Seller: Seller,
  Market: Market
}