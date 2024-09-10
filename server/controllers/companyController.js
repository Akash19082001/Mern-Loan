// controllers/companyController.js
const { getCustomerModel } = require('../models/customer');

exports.searchCompany = async (req, res) => {
  const { companyName, branchId } = req.query;

  if (!companyName) {
    return res.status(400).json({ success: false, message: 'Company name is required' });
  }

  const Model = getCustomerModel(companyName);

  try {
    const company = await Model.findOne({ companyName: new RegExp(companyName, 'i') }).lean();
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (branchId) {
      const branch = company.branches.find(b => b.branchId == branchId);
      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }
      return res.json({ success: true, data: { ...company, branches: [branch] } });
    }

    return res.json({ success: true, data: company });
  } catch (error) {
    console.error('Error fetching company details:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
