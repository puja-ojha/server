const mongoose = require('mongoose');
const Product = require('../models/product.model');

exports.getAllProducts = (req, res, next) => {
	Product
		.find()
		// .select('_id name price')
		.exec()
		.then(products => {
			const response = {
				count: products.length,
				products: products.map(product => {
					return {
						_id: product._id,
						name: product.name,
						price: product.price,
                        status: product.status,
						productImage: product.productImage
					}
				})
			};
			res.status(200).json(response);
		})
		.catch(error => {
			next(error);
		})
};

exports.getAllActiveProducts = (req, res, next) => {
	Product
		.find()
		// .select('_id name price')
		.exec()
		.then(products => {
            
            let activeProducts = products.filter((ele) => {
                return ele.status === 'active';
            });
            
			const response = {                
				count: activeProducts.length,
				products: activeProducts.map(product => {
					return {
						_id: product._id,
						name: product.name,
						price: product.price,
                        status: product.status,
						productImage: product.productImage
					}
				})
			};
			res.status(200).json(response);
		})
		.catch(error => {
			next(error);
		})
};


exports.createOneProduct = (req, res, next) => {
	const product = createProduct(req);

	product
		.save()
		.then(product => {
			res.status(200).json({
				message: 'Product Created Successfully!',
				product: {
					_id: product._id,
					name: product.name,
					price: product.price,
                    status: product.status,
					productImage: product.productImage
				}
			});
		})
		.catch(error => {
			next(error);
		});
};

exports.getOneProduct = (req, res, next) => {
	const id = req.params.productId;
	Product
		.findById(id)
		.select('_id name price status productImage')
		.exec()
		.then(product => {
			if (product) {
				res.status(200).json(product);
			}
			else {
				res.status(404).json({
					message: 'Product Not Found!'
				});
			}
		})
		.catch(error => {
			next(error);
		});
};

exports.updateOneProduct = (req, res, next) => {
	const productId = req.params.productId;
    const productName = req.body.name;
    const productPrice = req.body.price;
    const productStatus = req.body.status;
    const productImage = req.body.productImage;
    
	Product
        .findByIdAndUpdate({ _id: productId }, { name: productName, 
            price: productPrice, 
            status: productStatus, 
            productImage: productImage},
            (err, data) => {
                if(err){
                    console.log(err);
                }
                else{
                    res.send({message: 'Record updated..', result: data});
                    console.log("Data updated!");
                }
            })
};

exports.deleteOneProduct = (req, res, next) => {
	const productId = req.params.productId;
	Product
		.remove({ _id: productId })
		.exec()
		.then(result => {
			res.status(200).json({
				message: 'Deleted Product Successfully!',
				result: result
			});
		})
		.catch(error => {
			next(error);
		});
};

function createProduct(req) {
	return new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
        status: req.body.status,
		productImage: req.body.productImage
	});
}