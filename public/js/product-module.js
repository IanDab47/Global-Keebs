class Product {
  constructor(owner, model, price, make, type) {
    this.owner = owner
    this.model = model
    this.price = price
    this.make = make || 'N/A'
    this.type = type || 'N/A'
  }
}

module.exports = {
  Product: Product
}
