const express = require('express');
const {body} = require('express-validator');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// /admin/add-product => GET
router.get(
    '/add-product',
    isAuth,
    adminController.getAddProduct,
);

// /admin/products => GET
router.get('/products', isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
    '/add-product',
    [
      body('title', 'The title should be a minimum of 5 and a maximum of 15 characters.')
          .isLength({min: 5, max: 15})
          .isString()
          .trim(),
      body('price', 'Price can not be empty.')
          .isFloat(),
      body('description', 'Description must be minimum 5 characters.')
          .isLength({min: 5, max: 400})
          .trim(),
    ],
    isAuth,
    adminController.postAddProduct,
);

router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

router.post(
    '/edit-product',
    isAuth,
    [
      body(
          'title',
          'The title should be a minimum of 5 and a maximum of 15 characters.',
      )
          .isLength({min: 5, max: 15})
          .trim(),
      body('price', '').isFloat(),
      body('description', 'Description must be minimum 5 characters.')
          .trim()
          .isLength({min: 5, max: 400}),
    ],
    adminController.postEditProduct,
);

router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;
