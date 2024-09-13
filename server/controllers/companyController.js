const { getCustomerModel } = require('../models/customer'); 

// Search for company details and optionally filter by branchUniqueId
exports.searchCompany = async (req, res) => {
  const { companyName, branchUniqueId } = req.query;

  if (!companyName) {
    return res.status(400).json({ success: false, message: 'Company name is required' });
  }

  const Model = getCustomerModel(companyName);

  try {
    const company = await Model.findOne({ companyName: new RegExp(companyName, 'i') }).lean();
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    if (branchUniqueId) {
      const branch = company.branches.find(b => b.branchUniqueId === branchUniqueId);
      if (!branch) {
        return res.status(404).json({ success: false, message: 'Branch not found' });
      }
      return res.json({ success: true, data: branch });
    }

    return res.json({ success: true, data: company });
  } catch (error) {
    console.error('Error fetching company details:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update company details
exports.updateCompany = async (req, res) => {
  const { companyName, contactNumber, address } = req.body;

  try {
    const Model = getCustomerModel(companyName);
    const company = await Model.findOneAndUpdate(
      { companyName: new RegExp(companyName, 'i') },
      { contactNumber, address },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(200).json({ success: true, data: company });
  } catch (error) {
    console.error("Error updating company:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete a company and its associated data
exports.deleteCompany = async (req, res) => {
  const { companyName } = req.body;

  if (!companyName) {
    return res.status(400).json({ success: false, message: "Company name is required" });
  }

  try {
    const Model = getCustomerModel(companyName);
    await Model.collection.drop();

    res.status(200).json({ success: true, message: `Company '${companyName}' and its data have been deleted.` });
  } catch (error) {
    console.error("Error deleting company:", error);

    if (error.message === "ns not found") {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

