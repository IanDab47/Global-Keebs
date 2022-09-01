class User {
  static quantity

  constructor(name) {
    this.name = name
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