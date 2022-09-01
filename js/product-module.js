class Product {
  constructor(model, price, make) {
    this.model = model
    this.price = price
    this.make = make || ''
  }
}

class Keyboard extends Product {
  static quantity = 0

  constructor(model, size, color, price, make, parts) {
    super(model, price, make)
    this.size = size.toUpperCase()
    this.color = color
    this.parts = parts || 'none'
    Keyboard.quantity++
  }
}

class Switches extends Product {
  static quantity = 0

  constructor(model, quantity, price, make, isLubed, isFilmed) {
    super(model, price, make)
    this.quantity = quantity
    this.isLubed = isLubed || false
    this.isFilmed = isFilmed || false
    Switches.quantity++
  }
}

class Keycaps extends Product {
  static quantity = 0

  constructor(model, price, make, profile, kit, quality) {
    super(model, price, make)
    this.profile = profile || ''
    this.quality = quality || ''
    this.kit = kit || ''
    Keycaps.quantity++
  }
}

module.exports = {
  Product: Product,
  Keyboard: Keyboard,
  Switches: Switches,
  Keycaps: Keycaps
}
