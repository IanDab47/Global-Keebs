class User {
  static quantity

  constructor(name) {
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

  setItemCount() {
    this.items = this.has.length
  }

  soldItem(item) {
    this.has = this.has.filter(hasItem => hasItem !== item)
    this.setItemCount()
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