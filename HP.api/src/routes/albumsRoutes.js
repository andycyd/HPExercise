const express = require('express');
const { query } = require('express-validator');
const { getAlbums } = require('../controllers/albumsController');
const { validateRequest } = require('../middlewares/validationMiddleware');

const router = express.Router();

router.get(
    '/albums',
    [
        query('artist')
        .trim()
        .notEmpty()
        .withMessage('Artist name is required')
        .isLength({ min: 2 })
        .withMessage('Artist name must be at least 2 characters long'),
    ],
    validateRequest,
    getAlbums
);

module.exports = router;
