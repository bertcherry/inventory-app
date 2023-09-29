const Category = require('../models/category');
const Product = require('../models/product');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, 'name').sort({ name: 1 }).exec();
    res.render('category_list', { title: 'Category List', category_list: allCategories });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    const [category, productsInCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Product.find({ category: req.params.id }, 'name').exec(),
    ]);
    if (category === null) {
        const err = new Error('Category not found');
        err.status = 404;
        return next(err);
    }
    res.render('category_detail', {
        title: category.name,
        category,
        category_products: productsInCategory,
    });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - category create get');
});

exports.category_create_post = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - category create post');
});

exports.category_delete_get = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - category delete get');
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - category delete post');
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - category update get');
});

exports.category_update_post = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - category update post');
});