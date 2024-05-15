const express = require('express');
const UserController = require('../controllers/user.controller')
const userRoutes = express.Router();



userRoutes.post('/create', UserController.create);
userRoutes.put('/update', UserController.updateUser);
userRoutes.delete('/delete/:id', UserController.deleteUser);
userRoutes.get('/getFormat', UserController.getFormat);
userRoutes.get('/get/:id', UserController.getUserDetails);
userRoutes.post('/page');



module.exports = userRoutes;
