const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
      .then(([rows, fieldData]) => {
        res.render('shop/product-list', {
          prods: rows,
          pageTitle: 'All Products',
          path: '/products',
        });
      })
      .catch((err) => {
        console.log(err);
      });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;
  Product.findByID(productId)
      .then(([result]) => {
        const product = result[0];
        res.render('shop/product-detail', {
          product: product,
          pageTitle: product.title,
          path: '/products',
        });
      })
      .catch((err) => {
        console.log(err);
      });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
      .then(([rows, fieldData]) => {
        res.render('shop/index', {
          prods: rows,
          pageTitle: 'Shop',
          path: '/',
        });
      })
      .catch((err) => {
        console.log(err);
      });
};

exports.getCart = (req, res, next) => {
  Cart.getCart( (cart) => {
    Product.fetchAll((p) => {
      const cartProducts = [];
      p.forEach((product) => {
        const cartProductData = cart.products.find((p) => p.id === product.id);
        if ( cartProductData ) {
          cartProducts.push({
            productData: product,
            quantity: cartProductData.qty,
          });
        }
      });
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByID(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.findByID(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};