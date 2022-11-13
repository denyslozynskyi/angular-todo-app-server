const englishTranslateFile = require('../i18n/en.json');
const ukrainianTranslateFile = require('../i18n/ua.json');

function getEnglishTranslate(req, res) {
  res.json(englishTranslateFile);
}

function getUkrainianTranslate(req, res) {
  res.json(ukrainianTranslateFile);
}

module.exports = {
  getEnglishTranslate,
  getUkrainianTranslate,
};
