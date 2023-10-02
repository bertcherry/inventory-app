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
    res.render('category_form', {
        title: 'Create Category',
    });
});

exports.category_create_post = [
    body('name', 'Name must not be empty.').trim().isLength({ min: 1 }).escape(),

    asyncHandler(async(req, res, next) => {
        const errors = validationResult(req);
        const category = new Category({
            name: req.body.name,
        });

        if (!errors.isEmpty()) {
            res.render('category_form', {
                title: 'Create Category',
                category,
                errors: errors.array()
            });
        } else {
            const categoryExists = await Category.findOne({ name: req.body.name })
                .collation({ locale: 'en', strength: 2 })
                .exec();
            if (categoryExists) {
                res.redirect(categoryExists.url);
            } else {
                await category.save();
                res.redirect(category.url);
            }
        }
    }),
];

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