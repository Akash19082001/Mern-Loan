const mongoose = require("mongoose");

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
    branchName: String,
    branchContactPerson: String,
    branchContactNumber: String,
    branchAddress: String,
    branchAmc: String,
    branchStartDate: Date,
    branchUniqueId: String,
  }]
});

// Function to create or use a collection for a specific company
const getCustomerModel = (companyName) => {
  const modelName = `Company_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}`;
  console.log("Generated Model Name:", modelName);
  
  // Check if the model already exists, if not create it
  if (!mongoose.models[modelName]) {
    return mongoose.model(modelName, customerSchema, modelName);
  }
  
  // Return the existing model
  return mongoose.model(modelName);
};

module.exports = { getCustomerModel };
