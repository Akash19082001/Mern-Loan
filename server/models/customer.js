const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  companyName: String,
  contactPerson: String,
  contactNumber: String,
  address: String,
  regNo: { type: String, unique: true },
  dateOfStart: Date,
  modeOfAmc: String,
  branches: [{
    branchId: { type: Number, unique: true },
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

module.exports = { getCustomerModel };
