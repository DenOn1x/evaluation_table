const express = require('express');
const router = express.Router();
const {getData} = require('../controllers/dataController');
const {saveData} = require('../controllers/saveDataController')


router.get('/', getData);
router.post('/save', saveData);


module.exports = router;
