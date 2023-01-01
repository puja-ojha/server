const express = require('express');
const router = express.Router();
const multer = require('multer');

const ctrlUser = require('../controllers/user.controller');
const ctrlProduct = require('../controllers/product.controller')
const jwtHelper = require('../config/jwtHelper');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
    // fileFilter: fileFilter
});

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.get('/activeProducts', jwtHelper.verifyJwtToken, ctrlProduct.getAllActiveProducts);
router.get('/products', ctrlProduct.getAllProducts);
router.post('/product', jwtHelper.verifyJwtToken, upload.single('productImage'), ctrlProduct.createOneProduct);
router.get('/product/:productId', jwtHelper.verifyJwtToken, ctrlProduct.getOneProduct);
router.patch('/product/:productId', jwtHelper.verifyJwtToken,  ctrlProduct.updateOneProduct);
router.delete('/product/:productId', jwtHelper.verifyJwtToken, ctrlProduct.deleteOneProduct);

module.exports = router;



