const express = require('express');

router = express.Router();

const { uploadsController } = require('../app/controllers/uploads_controller');

router.use('/uploads', uploadsController);

module.exports = {
    routes: router
}


