const Product = require('../models/product');
const fileHelper = require('../util/file');

const {validationResult} = require('express-validator');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  console.log(req.file);
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  if (!image) {
    return res.status(422)
        .render('admin/edit-product', {
          path: 'admin/add-product',
          pageTitle: 'Add Product',
          editing: false,
          hasError: true,
          errorMessage: 'Attached file is not an image.',
          product: {
            title: title,
            price: price,
            description: description,
          },
          validationErrors: [],
        });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422)
        .render('admin/edit-product', {
          path: 'admin/add-product',
          pageTitle: 'Add Product',
          editing: false,
          hasError: true,
          errorMessage: 'Attached file is not an image.',
          product: {
            title: title,
            price: price,
            description: description,
          },
          validationErrors: [],
        });
  }

  const imageUrl = image.path;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
  });
  product
      .save()
      .then((_) => {
        res.redirect('/admin/products');
      })
      .catch((err) => {
        /* Hatayı kullanıcıya iletiyoruz*/
        // return res.status(500)
        //     .render('admin/edit-product', {
        //       path: 'admin/add-product',
        //       pageTitle: 'Add Product',
        //       editing: false,
        //       hasError: true,
        //       errorMessage: 'Database operation failed, please try again.',
        //       product: {
        //         title: title,
        //         imageUrl: imageUrl,
        //         price: price,
        //         description: description,
        //       },
        //       validationErrors: [],
        //     });

        /* Hatayı yönetmek için farklı sayfaya yönlendiriyoruz */
        // res.redirect('/500');

        /* Hatayı yönetmek için ara katman'a iletiyoruz. */
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }

  const prodId = req.params.productId;
  Product.findById(prodId)
      .then((product) => {
        if (!product) {
          return res.redirect('/');
        }
        res.render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product: product,
          hasError: false,
          errorMessage: null,
          validationErrors: [],
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.postEditProduct = (req, res, next) => {
  console.log('edit');
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const image = req.file;
  const updatedDesc = req.body.description;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
        .render('admin/edit-product', {
          path: '/edit-product',
          pageTitle: 'Add Product',
          editing: true,
          hasError: true,
          errorMessage: errors.array()[0].msg,
          product: {
            title: updatedTitle,
            price: updatedPrice,
            description: updatedDesc,
            _id: prodId,
          },
          validationErrors: errors.array(),
        });
  }

  Product.findById(prodId)
      .then((product) => {
        if ( product.userId.toString() !== (req.user._id.toString()) ) {
          return res.redirect('/');
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        if (image) {
          fileHelper.deleteFile(product.imageUrl);
          product.imageUrl = image.path;
        }
        product.updatedDesc = updatedDesc;
        return product.save()
            .then((_) => {
              console.log('UPDATED PRODUCT!');
              res.redirect('/admin/products');
            });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.getProducts = (req, res, next) => {
  Product
      .find({userId: req.user._id})
      // .select('title price -_id')
      // .populate('userId', 'name')
      .then((products) => {
        console.log(products);
        res.render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
      });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  console.log('prodId: '+ prodId);
  Product
      .findById(prodId)
      .then((product) => {
        if (!product) {
          return next(new Error('Product not found'));
        }
        fileHelper.deleteFile(product.imageUrl);
        return Product.deleteOne({_id: prodId, userId: req.user._id});
      })
      .then(() => {
        console.log('DESTROYED PRODUCT');
        res.status(200).json({message: 'Success!'});
      })
      .catch((err) => {
        res.status(500).json({message: 'Deleting product failed.'});
      });
};
