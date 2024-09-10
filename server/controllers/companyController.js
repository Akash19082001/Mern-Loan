// controllers/companyController.js
const { getCustomerModel } = require('../models/customer'); // Import the getCustomerModel function

exports.searchCompany = async (req, res) => {
  const { companyName, branchUniqueId } = req.query;

  // Validate that companyName is provided
  if (!companyName) {
    return res.status(400).json({ success: false, message: 'Company name is required' });
  }

  // Get the customer model dynamically based on companyName
  const Model = getCustomerModel(companyName);

  try {
    // Find the company based on the provided companyName (case-insensitive)
    const company = await Model.findOne({ companyName: new RegExp(companyName, 'i') }).lean();
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // If branchUniqueId is provided, filter branches to find the specific one
    if (branchUniqueId) {
      const branch = company.branches.find(b => b.branchUniqueId == branchUniqueId);
      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }
      // Return the company with only the matched branch
      return res.json({ success: true, data: { ...company, branches: [branch] } });
    }

    // If no branchUniqueId is provided, return the full company details
    return res.json({ success: true, data: company });
  } catch (error) {
    console.error('Error fetching company details:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
