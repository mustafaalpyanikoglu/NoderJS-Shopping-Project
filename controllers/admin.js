const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/edit-product',
    editing: false,
  });
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   console.log(editMode);
//   if (!editMode) {
//     return res.redirect('/');
//   }
//   const productId = req.params.productId;
//   req.user
//       .getProducts({where: {id: productId}})
//       .then((products) => {
//         const product = products[0];
//         if (!product) {
//           return res.redirect('/');
//         }
//         res.render('admin/edit-product', {
//           pageTitle: 'Edit Product',
//           path: '/admin/edit-product',
//           editing: editMode === 'true',
//           product: product,
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//       });
// };

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product(title, price, description, imageUrl);
  product
      .save()
      .then((result) => {
        console.log('Created Product');
        res.redirect('/admin/products');
      })
      .catch((err) => {
        console.log(err);
      });
};

exports.postEditProduct = (req, res, next) => {
  const productId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedImageUrl = req.body.imageUrl;
  const updatedPrice = parseFloat(req.body.price);
  const updatedDescription = req.body.description;
  console.log(productId);
  console.log(1);
  Product.findByPk(productId)
      .then((product) => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product.save();
      })
      .then((result) => {
        console.log('Updated Product!');
        res.redirect('/admin/products');
      })
      .catch((err) => {
        console.log(err);
        console.log(2);
      });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = parseInt(req.body.productId);
  Product.findById(productId)
      .then((product) => {
        return product.destroy();
      })
      .then((result) => {
        console.log('Destroyed Product!');
        res.redirect('/admin/products');
      })
      .catch((err) => {
        console.log(err);
        console.log(2);
      });
};

exports.getProducts = (req, res, next) => {
  req.user
      .getProducts()
      .then((products) => {
        console.log(products);
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
        });
      })
      .catch((err) => {
        console.log(err);
      });
};
