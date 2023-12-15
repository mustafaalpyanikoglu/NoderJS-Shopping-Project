const database = require('../util/database');

// const Cart = require('./cart');

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    return database.
        execute(
            'INSERT INTO products (title, price, imageUrl, description)' +
            ' VALUES (?, ?, ?, ?)',
            [this.title, this.price, this.imageUrl, this.description],
        );
  }

  deleteById(id) {
    return database.execute('DELETE FROM products WHERE id = ?', [id]);
  }

  static fetchAll(cb) {
    return database.execute('SELECT * FROM products');
  }
  // cb => call back
  static findByID(id, cb) {
    return database.execute('SELECT * FROM products WHERE id = ?', [id]);
  }
};
