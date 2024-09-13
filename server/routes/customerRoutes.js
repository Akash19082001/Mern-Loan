const express = require("express");
const { getCustomerModel } = require("../models/customer");
const router = express.Router();
const mongoose = require('mongoose');

// Helper function for error handling
const handleError = (res, error) => {
  console.error('Server Error:', error.message);
  res.status(500).json({ success: false, message: error.message });
};

// Verify if company with given regNo and companyName exists
router.post("/verify", async (req, res) => {
  const { companyName, regNo } = req.body;

  try {
    const CustomerModel = getCustomerModel(companyName); // Use dynamic model
    const existingCustomer = await CustomerModel.findOne({ regNo });

    if (existingCustomer) {
      return res.status(200).json({ success: true, data: existingCustomer });
    } else {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
  } catch (error) {
    handleError(res, error);
  }
});


// Add branch to existing customer with dynamic regNo for branch
router.post("/addBranch", async (req, res) => {
  const { companyName, branchName, branchContactPerson, branchContactNumber, branchAddress, branchAmc, branchStartDate, branchUniqueId } = req.body;

  try {
    const CustomerModel = getCustomerModel(companyName);
    const existingCustomer = await CustomerModel.findOne({ companyName });

    if (existingCustomer) {
      const branches = existingCustomer.branches || [];
      const branchCount = branches.length;

      // Use the company base regNo to generate the branch regNo
      const companyBaseRegNo = existingCustomer.regNo.split('.')[0];
      const newBranchRegNo = `${companyBaseRegNo}.${branchCount + 1}`; // Increment branch number

      existingCustomer.branches.push({
        branchName,
        branchContactPerson,
        branchContactNumber,
        branchAddress,
        branchAmc,
        branchStartDate,
        branchUniqueId,
        regNo: newBranchRegNo,  // Assign regNo for branch
      });

      await existingCustomer.save();
      res.status(200).json({ success: true, data: existingCustomer });
    } else {
      res.status(404).json({ success: false, message: "Company not found" });
    }
  } catch (error) {
    handleError(res, error);
  }
});



// Create new customer with dynamic regNo
router.post("/", async (req, res) => {
  const { companyName, branchName, branchContactPerson, branchContactNumber, branchAddress, branchAmc, branchStartDate, branchUniqueId } = req.body;

  try {
    // Get all customer models to count existing companies
    const allCustomers = await mongoose.connection.db.listCollections().toArray();
    const companyCount = allCustomers.filter(c => c.name.startsWith('Company_')).length; // Count companies

    // Generate regNo for the new company
    const newCompanyRegNo = `${companyCount + 1}.0`;

    const CustomerModel = getCustomerModel(companyName);
    const newCustomer = new CustomerModel({
      ...req.body,
      regNo: newCompanyRegNo,
      branches: branchName
        ? [{
            branchName,
            branchContactPerson,
            branchContactNumber,
            branchAddress,
            branchAmc,
            branchStartDate,
            branchUniqueId,
            regNo: `${companyCount + 1}.1`,  // First branch of new company
          }]
        : []
    });

    await newCustomer.save();
    res.status(201).json({ success: true, data: newCustomer });
  } catch (error) {
    handleError(res, error);
  }
});

// Fetch all customers
router.get("/", async (req, res) => {
  try {
    const allCustomers = [];
    const customerModels = await mongoose.connection.db.listCollections().toArray();
    
    for (const model of customerModels) {
      const modelName = model.name;
      if (modelName.startsWith('Company_')) {
        const normalizedName = modelName.replace('Company_', '').replace(/_/g, ' ');
        const CustomerModel = getCustomerModel(normalizedName);
        const customers = await CustomerModel.find({});
        allCustomers.push(...customers);
      }
    }
    
    res.status(200).json({ customers: allCustomers });
  } catch (error) {
    handleError(res, error);
  }
});

// New route to get company details by companyName
router.get("/company/:companyName", async (req, res) => {
  const { companyName } = req.params;
  try {
    const CustomerModel = getCustomerModel(companyName);
    const company = await CustomerModel.findOne({}); // Fetch a single company
  

    if (company) {
      res.status(200).json({ company });
    } else {
      res.status(404).json({ success: false, message: 'Company not found' });
    }
  } catch (error) {
    handleError(res, error);
  }
});

// Route to get the latest branch registration number for a specific company
router.get("/getLatestBranchRegNo/:companyName", async (req, res) => {
  const { companyName } = req.params;
  
  try {
    const CustomerModel = getCustomerModel(companyName);
    const company = await CustomerModel.findOne({ companyName });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    const branches = company.branches || [];
    const branchCount = branches.length;

    // Get the latest branch regNo
    const latestBranchRegNo = branchCount > 0
      ? `${company.regNo.split('.')[0]}.${branchCount + 1}` // Increment branch count
      : `${company.regNo.split('.')[0]}.1`; // Start with the first branch

    res.status(200).json({ success: true, regNo: latestBranchRegNo });
  } catch (error) {
    handleError(res, error);
  }
});


module.exports = router;
