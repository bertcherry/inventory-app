const Category = require('../models/category');
const Product = require('../models/product');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.index = asyncHandler(async (req, res, next) => {
    const [numCategories, numProducts] = await Promise.all([
        Category.countDocuments({}).exec(),
        Product.countDocuments({}).exec()
    ]);
    res.render('index', {
        title: 'Inventory Management',
        category_count: numCategories,
        product_count: numProducts
    });
});

exports.product_list = asyncHandler(async (req, res, next) => {
    const allProducts = await Product.find({}, 'name category')
        .sort({ name: 1 })
        .populate('category')
        .exec();
    res.render('product_list', { title: 'Product List', product_list: allProducts });
});

exports.product_detail = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category').exec();
    if (product === null) {
        const err = new Error('Product not found');
        err.status = 404;
        return next(err);
    }
    res.render('product_detail', {
        title: product.name,
        product
    });
});

exports.product_create_get = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find().exec();
    res.render('product_form', {
        title: 'Create Product',
        categories: allCategories,
    });
});

exports.product_create_post = [
    (req, res, next) => {
        if(!(req.body.category instanceof Array)) {
            if (typeof req.body.category === 'undefined') req.body.category = [];
            else req.body.category = new Array(req.body.category);
        }
        next();
    },
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('quantity_in_stock', 'Quantity in stock must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('category.*', 'Product must be in at least one category.').isLength({ min: 1 }).escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity_in_stock: req.body.quantity_in_stock,
            category: req.body.category,
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find().exec();
            for (const category of allCategories) {
                if (product.category.includes(category._id)) {
                    category.checked = 'true';
                }
            }
            res.render('product_form', {
                title: 'Create Product',
                categories: allCategories,
                product,
                errors: errors.array()
            });
        } else {
            await product.save();
            res.redirect(product.url);
        }
    }),
];

exports.product_delete_get = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id).populate('category').exec();
    if (product === null) {
        res.redirect('/inventory/products');
    }
    res.render('product_delete', {
        title: 'Delete Product',
        product,
    });
});

exports.product_delete_post = asyncHandler(async (req, res, next) => {
    await Product.findByIdAndRemove(req.body.productid);
    res.redirect('/inventory/products');
});

exports.product_update_get = asyncHandler(async (req, res, next) => {
    const [product, allCategories] = await Promise.all([
        Product.findById(req.params.id).populate('category').exec(),
        Category.find().exec(),
    ]);
    if (category === null) {
        const err = new Error('Product not found');
        err.status = 404;
        return next(err);
    }
    for (const category of allCategories) {
        for (const product_c of product.category) {
            if (category._id.toString() === product_c._id.toString()) {
                category.checked = 'true';
            }
        }
    }
    res.render('product_form', {
        title: 'Update Product',
        categories: allCategories,
        product,
    });
});

exports.product_update_post = [
    (req, res, next) => {
        if(!(req.body.category instanceof Array)) {
            if (typeof req.body.category === 'undefined') req.body.category = [];
            else req.body.category = new Array(req.body.category);
        }
        next();
    },
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('description', 'Description must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('price', 'Price must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('quantity_in_stock', 'Quantity in stock must not be empty.').trim().isLength({ min: 1 }).escape(),
    body('category.*', 'Product must be in at least one category.').isLength({ min: 1 }).escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        const product = new Product({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity_in_stock: req.body.quantity_in_stock,
            category: req.body.category,
            _id: req.params.id,
        });

        if (!errors.isEmpty()) {
            const allCategories = await Category.find().exec();
            for (const category of allCategories) {
                if (product.category.includes(category._id)) {
                    category.checked = 'true';
                }
            }
            res.render('product_form', {
                title: 'Update Product',
                categories: allCategories,
                product,
                errors: errors.array()
            });
        } else {
            const updatedProduct = await Product.findByIdAndUpdate(req.params.id, product, {});
            res.redirect(updatedProduct.url);
        }
    }),
];