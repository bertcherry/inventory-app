const Category = require('../models/category');
const Product = require('../models/product');

const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.category_list = asyncHandler(async (req, res, next) => {
    const allCategories = await Category.find({}, 'name').sort({ name: 1 }).exec();
    res.render('category_list', { title: 'Category List', category_list: allCategories });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
    res.send('Not implemented - category detail');
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