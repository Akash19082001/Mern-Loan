const express = require('express');
const router = express.Router();
const { searchCompany, updateCompany, deleteCompany} = require('../controllers/companyController');

router.get('/search', searchCompany);
router.put('/update', updateCompany);
router.delete('/delete', deleteCompany);


module.exports = router;
