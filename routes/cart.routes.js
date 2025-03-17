const express = require('express');
const CartController = require('../controllers/cart.controller');
const cartRouter = express.Router();


cartRouter.put('/add', CartController.addToCart);
cartRouter.get('/:userId', CartController.getUserCart);
cartRouter.delete('', CartController.removeFromCart);
// cartRouter.delete('/delete/:id', categoryController.deleteCategory);
// cartRouter.get('/getFormat', categoryController.getFormat);
// cartRouter.get('/getAll', categoryController.getAllCategories);
// cartRouter.post('/get/:id?', categoryController.getCategoryDetails);


// view apis
// categoryRouter.get('/categoriesView', categoryController.getCategoryForView);
// categoryRouter.get('/categoriesBrands/:categoryId', categoryController.getCategoryBrands);

module.exports = cartRouter;