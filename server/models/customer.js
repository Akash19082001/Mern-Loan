const mongoose = require("mongoose");
const { init } = require("./register");

// Define the schema for customer data with branches array
const customerSchema = new mongoose.Schema({
  companyName: String,
  contactPerson: String,
  contactNumber: String,
  address: String,
  regNo: { type: String, unique: true },
  dateOfStart: Date,
  modeOfAmc: String,
  branches: [{
    branchId: { type: Number, unique: true }, // Unique ID for each branch
    branchName: String,
    branchContactPerson: String,
    branchContactNumber: String,
    branchAddress: String,
    branchAmc: String,
    branchStartDate: Date,
    branchUniqueId: String,
  }]
});

const getCustomerModel = (companyName) => {
  const modelName = `Company_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  
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
