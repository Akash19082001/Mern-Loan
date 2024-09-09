import { useState } from "react";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const CustomerManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [branch, setBranch] = useState("No");
  const [companyType, setCompanyType] = useState(""); // Track whether it's an existing or new company
  const [formData, setFormData] = useState({
    companyName: "", // Initialize with empty string
    regNo: "",
    contactPerson: "",
    contactNumber: "",
    address: "",
    dateOfStart: "", // Initialize with empty string for the date
    modeOfAmc: "No AMC",
    branchName: "",
    branchContactPerson: "",
    branchContactNumber: "",
    branchAddress: "",
    branchAmc: "No AMC", // New field for branch AMC
    branchStartDate: "", // New field for branch Start Date
    branchUniqueId: "", // New field for branch Unique ID
  });

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const customerData = { ...formData, branch };

    // If the branch is set to "No", remove branch-related data
    if (branch === "No") {
      delete customerData.branchName;
      delete customerData.branchContactPerson;
      delete customerData.branchContactNumber;
      delete customerData.branchAddress;
      delete customerData.branchAmc; // Ensure to delete if not used
      delete customerData.branchStartDate; // Ensure to delete if not used
      delete customerData.branchUniqueId; // Ensure to delete if not used
      customerData.branches = [];
    } else {
      // If branch is set to "Yes", structure branch data into an array
      customerData.branches = [
        {
          branchName: formData.branchName,
          branchContactPerson: formData.branchContactPerson,
          branchContactNumber: formData.branchContactNumber,
          branchAddress: formData.branchAddress,
          branchAmc: formData.branchAmc,
          branchStartDate: formData.branchStartDate,
          branchUniqueId: formData.branchUniqueId,
        },
      ];
    }

    // Different API endpoints or logic for new/existing company
    let response;
    if (companyType === "Existing") {
      // Verify if company exists
      response = await fetch(`http://localhost:5000/api/customers/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          regNo: formData.regNo,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        // Add branch to existing company
        response = await fetch(
          `http://localhost:5000/api/customers/addBranch`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              companyName: formData.companyName,
              regNo: formData.regNo,
              branchName: formData.branchName,
              branchContactPerson: formData.branchContactPerson,
              branchContactNumber: formData.branchContactNumber,
              branchAddress: formData.branchAddress,
              branchAmc: formData.branchAmc,
             branchStartDate: formData.branchStartDate,
             branchUniqueId: formData.branchUniqueId,
            }),
          }
        );
      }
    } else {
      // Create a new company
      response = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });
    }

    if (response.ok) {
      const data = await response.json();
      console.log("Customer saved:", data);

      setFormData({
        companyName: "",
        regNo: "",
        contactPerson: "",
        contactNumber: "",
        address: "",
        dateOfStart: "",
        modeOfAmc: "No AMC",
        branchName: "",
        branchContactPerson: "",
        branchContactNumber: "",
        branchAddress: "",
        branchAmc: "No AMC", // Reset new field
        branchStartDate: "", // Reset new field
        branchUniqueId: "", // Reset new field
      });

      setBranch("No");
    } else {
      console.error("Failed to save customer");
    }
  };

  return (
    <div className="flex">
      <div
        className={`w-1/4 bg-gray-200 text-gray-500 ${
          showMenu ? "" : "hidden"
        } lg:block`}
      >
        <Menubar />
      </div>
      <div className="w-3/4 h-screen p-4">
        <Navbar pagename={"Customer Management"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Select Existing or New Company */}
          <div>
            <label className="block text-gray-700">Select Company Type</label>
            <select
              name="companyType"
              value={companyType}
              onChange={(e) => setCompanyType(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            >
              <option value="">Select</option>
              <option value="Existing">Existing Company</option>
              <option value="New">New Company</option>
            </select>
          </div>

          {companyType === "Existing" && (
            <>
              <div>
                <label className="block text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Reg No</label>
                <input
                  type="text"
                  name="regNo"
                  value={formData.regNo || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            </>
          )}

          {companyType === "New" && (
            <>
              <div>
                <label className="block text-gray-700">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Contact Person</label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Address</label>
                <textarea
                  name="address"
                  value={formData.address || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Reg No</label>
                <input
                  type="text"
                  name="regNo"
                  value={formData.regNo || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Date of Start</label>
                <input
                  type="date"
                  name="dateOfStart"
                  value={formData.dateOfStart || ""} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-gray-700">Mode of AMC</label>
                <select
                  name="modeOfAmc"
                  value={formData.modeOfAmc || "No AMC"} // Ensure a controlled value
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="No AMC">No AMC</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Halfly">Halfly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            </>
          )}

          {companyType && (
            <>
              <div>
                <label className="block text-gray-700">Branch</label>
                <select
                  name="branch"
                  value={branch || "No"} // Ensure a controlled value
                  onChange={(e) => setBranch(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>

              {branch === "Yes" && (
                <>
                  <div>
                    <label className="block text-gray-700">Branch Name</label>
                    <input
                      type="text"
                      name="branchName"
                      value={formData.branchName || ""} // Ensure a controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Contact Person
                    </label>
                    <input
                      type="text"
                      name="branchContactPerson"
                      value={formData.branchContactPerson || ""} // Ensure a controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Contact Number
                    </label>
                    <input
                      type="tel"
                      name="branchContactNumber"
                      value={formData.branchContactNumber || ""} // Ensure a controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Address
                    </label>
                    <textarea
                      name="branchAddress"
                      value={formData.branchAddress || ""} // Ensure a controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">Branch AMC</label>
                    <select
                      
                      name="branchAmc"
                      value={formData.branchAmc || "No AMC"} // Ensure controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                      <option value="No AMC">No AMC</option>
                  <option value="Quarterly">Quarterly</option>
                  <option value="Halfly">Halfly</option>
                  <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Start Date
                    </label>
                    <input
                      type="date"
                      name="branchStartDate"
                      value={formData.branchStartDate || ""} // Ensure controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700">
                      Branch Unique ID
                    </label>
                    <input
                      type="text"
                      name="branchUniqueId"
                      value={formData.branchUniqueId || ""} // Ensure controlled value
                      onChange={handleChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </>
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerManagement;
