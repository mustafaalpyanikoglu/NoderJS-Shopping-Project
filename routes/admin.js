const path = require("path");

const express = require("express");

const adminController = require("../controllers/admin");

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get("/add-product", adminController.getAddProduct);

// /admin/products => GET
router.get("/products", adminController.getProductsAll);

// /admin/add-product => POST
router.post("/add-product", adminController.postAddProduct);

router.get("/users", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "users.html"));
});

module.exports = router;
