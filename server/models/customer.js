const mongoose = require("mongoose");
const { init } = require("./register");

// Define the schema for customer data with branches array
const customerSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  regNo: { type: String, unique: true, required: true },
  dateOfStart: { type: Date, required: true },
  modeOfAmc: { type: String, required: true },
  companyUsername: String,
  companyPassword: String,
  branches: [{
    branchId: { type: String, unique: true }, // Unique ID for each branch
    branchName: String,
    branchContactPerson: String,
    branchContactNumber: String,
    branchAddress: String,
    branchAmc: String,
    branchStartDate: Date,
    branchUniqueId: String,
    branchUsername: String,
    branchPassword: String,
  }]
});

const getCustomerModel = (companyName) => {
  const modelName = `COMPANY_${companyName.toUpperCase().replace(/[^a-zA-Z0-9]/g, '_')}`;
  
  if (!mongoose.models[modelName]) {
    return mongoose.model(modelName, customerSchema, modelName);
  }
  
  return mongoose.model(modelName);
};

// Function to search for a company by name
const searchCompanyByName = async (companyName) => {
  const Model = getCustomerModel(companyName);
  try {
    const company = await Model.findOne({ companyName: new RegExp(companyName, 'i') }).lean();
    if (!company) {
      return { success: false, message: 'Company not found' };
    }
    return { success: true, data: company };
  } catch (error) {
    console.error('Error fetching company details:', error);
    return { success: false, message: 'Server error' };
  }
};

module.exports = { getCustomerModel, searchCompanyByName };
