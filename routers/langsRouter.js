const express = require('express');
const {
  getEnglishTranslate,
  getUkrainianTranslate,
} = require('../services/langsService');

const router = express.Router();

router.get('/en', getEnglishTranslate);
router.get('/ua', getUkrainianTranslate);

module.exports = {
  langsRouter: router,
};
