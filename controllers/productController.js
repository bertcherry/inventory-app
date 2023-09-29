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
    res.send('Not implemented - product list');
});

exports.product_detail = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - product detail');
});

exports.product_create_get = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - product create get');
});

exports.product_create_post = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - product create post');
});

exports.product_delete_get = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - product delete get');
});

exports.product_delete_post = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - product delete post');
});

exports.product_update_get = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - product update get');
});

exports.product_update_post = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - product update post');
});