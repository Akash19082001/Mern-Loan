import { useState } from "react";
import { FiEdit, FiTrash } from "react-icons/fi";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const ShowcaseManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchUniqueId, setBranchUniqueId] = useState("");
  const [companyDetails, setCompanyDetails] = useState(null);
  const [branchDetails, setBranchDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCompanyEditModalOpen, setIsCompanyEditModalOpen] = useState(false);
  const [editCompanyDetails, setEditCompanyDetails] = useState({});
  const [isBranchEditModalOpen, setIsBranchEditModalOpen] = useState(false);
  const [editBranchDetails, setEditBranchDetails] = useState({});

  const handleMenuToggle = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleBranchUniqueIdChange = (event) => {
    setBranchUniqueId(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (!searchTerm) {
      setError("Please enter a company name.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let url = `http://localhost:5000/api/companies/search?companyName=${searchTerm}`;
      if (branchUniqueId) {
        url += `&branchUniqueId=${branchUniqueId}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        if (branchUniqueId) {
          setBranchDetails(data.data); // Set branch details
          setCompanyDetails(null); // Clear company details
        } else {
          setCompanyDetails(data.data); // Set company details
          setBranchDetails(null); // Clear branch details
        }
      } else {
        setError(data.message || "No results found.");
        setCompanyDetails(null);
        setBranchDetails(null);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
      setError("An error occurred while fetching data.");
      setCompanyDetails(null);
      setBranchDetails(null);
    }

    setLoading(false);
  };

  // Company Edit Handlers
  const handleEditCompany = () => {
    setEditCompanyDetails({
      companyName: companyDetails.companyName,
      contactNumber: companyDetails.contactNumber,
      address: companyDetails.address,
    });
    setIsCompanyEditModalOpen(true);
  };

  const handleCompanyEditChange = (e) => {
    const { name, value } = e.target;
    setEditCompanyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSaveCompanyEdit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/companies/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editCompanyDetails),
      });

      const data = await response.json();
      if (data.success) {
        setCompanyDetails(data.data);
        setIsCompanyEditModalOpen(false); // Close modal after saving
      } else {
        console.error("Failed to update company:", data.message);
      }
    } catch (error) {
      console.error("Error updating company details:", error);
    }
  };

  const handleDeleteCompany = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company? This will remove all associated data."
    );
    if (confirmDelete) {
      try {
        const response = await fetch("http://localhost:5000/api/companies/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ companyName: companyDetails.companyName }),
        });

        const data = await response.json();
        if (data.success) {
          alert(data.message);
          setCompanyDetails(null);
        } else {
          console.error("Failed to delete company:", data.message);
        }
      } catch (error) {
        console.error("Error deleting company:", error);
      }
    } 
  };

  // Branch Edit Handlers
  const handleEditBranch = () => {
    setEditBranchDetails({
      branchUniqueId: branchDetails.branchUniqueId, // Include the branchUniqueId to identify the branch for updating
      branchName: branchDetails.branchName,
      branchContactNumber: branchDetails.branchContactNumber,
      branchAddress: branchDetails.branchAddress,
    });
    setIsBranchEditModalOpen(true); // Open the modal for editing
  };
  
  const handleBranchEditChange = (e) => {
    const { name, value } = e.target;
    setEditBranchDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  
  const handleSaveBranchEdit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/branches/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: searchCompanyName, // Assuming this is passed from the parent component
          branchUniqueId: editBranchDetails.branchUniqueId, // Unique ID to identify the branch
          branchName: editBranchDetails.branchName,
          branchContactNumber: editBranchDetails.branchContactNumber,
          branchAddress: editBranchDetails.branchAddress,
        }),
      });
  
      const data = await response.json();
      if (data.success) {
        setBranchDetails(data.data); // Update the branch details in state
        setIsBranchEditModalOpen(false); // Close modal after successful edit
      } else {
        console.error("Failed to update branch:", data.message);
      }
    } catch (error) {
      console.error("Error updating branch details:", error);
    }
  };
  
  const handleDeleteBranch = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this branch?");
    if (confirmDelete) {
      try {
        const response = await fetch("http://localhost:5000/api/branches/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            companyName: searchCompanyName, // Assuming this is passed from the parent component
            branchUniqueId: branchDetails.branchUniqueId, // Unique ID to identify the branch for deletion
          }),
        });
  
        const data = await response.json();
        if (data.success) {
          alert(data.message);
          setBranchDetails(null); // Clear the branch details from state after successful deletion
        } else {
          console.error("Failed to delete branch:", data.message);
        }
      } catch (error) {
        console.error("Error deleting branch:", error);
      }
    }
  };
  
  // Close modals when cancel button is clicked
  const handleCancelEdit = () => {
    setIsBranchEditModalOpen(false); // Ensure only branch modal is closed
  };
  
  return (
    <div className="flex">
      {/* Fixed Menubar */}
      <div
        className={`fixed top-0 left-0 h-screen w-96 bg-gray-200 text-gray-500 lg:block ${
          showMenu ? "" : "hidden"
        }`}
      >
        <Menubar />
      </div>

      {/* Dashboard Content */}
      <div className="flex-1 ml-96 p-4">
        <Navbar pagename={"Search & Modifier"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="mt-4">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                className="input-box border border-gray-300 rounded px-4 py-2"
                placeholder="Search by company name"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <input
                type="text"
                className="input-box border border-gray-300 rounded px-4 py-2"
                placeholder="Optional: Enter branch unique ID"
                value={branchUniqueId}
                onChange={handleBranchUniqueIdChange}
              />
              <button
                type="submit"
                className="primary-button bg-blue-500 text-white rounded px-4 py-2"
              >
                Search
              </button>
            </div>
          </form>

          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {companyDetails && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-2">
                {companyDetails.companyName}
              </h2>
              <p>Contact Person: {companyDetails.contactPerson}</p>
              <p>Contact Number: {companyDetails.contactNumber}</p>
              <p>Address: {companyDetails.address}</p>

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleEditCompany}
                  className="edit-icon text-blue-600"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={handleDeleteCompany}
                  className="delete-icon text-red-600"
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          )}

          {branchDetails && (
            <div className="mt-4 bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-bold mb-2">
                {branchDetails.branchName}
              </h2>
              <p>Contact Number: {branchDetails.branchContactNumber}</p>
              <p>Address: {branchDetails.branchAddress}</p>
              

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleEditBranch}
                  className="edit-icon text-blue-600"
                >
                  <FiEdit />
                </button>
                <button
                  onClick={handleDeleteBranch}
                  className="delete-icon text-red-600"
                >
                  <FiTrash />
                </button>
              </div>
            </div>
          )}

          {/* Edit Company Modal */}
          {isCompanyEditModalOpen && (
            <div className="modal fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Edit Company</h3>
                <input
                  type="text"
                  name="companyName"
                  value={editCompanyDetails.companyName}
                  onChange={handleCompanyEditChange}
                  className="input-box border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                  placeholder="Company Name"
                />
                <input
                  type="text"
                  name="contactNumber"
                  value={editCompanyDetails.contactNumber}
                  onChange={handleCompanyEditChange}
                  className="input-box border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                  placeholder="Contact Number"
                />
                <input
                  type="text"
                  name="address"
                  value={editCompanyDetails.address}
                  onChange={handleCompanyEditChange}
                  className="input-box border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                  placeholder="Address"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleSaveCompanyEdit}
                    className="primary-button bg-blue-500 text-white rounded px-4 py-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="secondary-button bg-gray-300 text-black rounded px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Edit Branch Modal */}
          {isBranchEditModalOpen && (
            <div className="modal fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
              <div className="modal-content bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-bold mb-4">Edit Branch</h3>
                <input
                  type="text"
                  name="branchName"
                  value={editBranchDetails.branchName}
                  onChange={handleBranchEditChange}
                  className="input-box border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                  placeholder="Branch Name"
                />
                <input
                  type="text"
                  name="branchContactNumber"
                  value={editBranchDetails.branchContactNumber}
                  onChange={handleBranchEditChange}
                  className="input-box border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                  placeholder="Contact Number"
                />
                <input
                  type="text"
                  name="branchAddress"
                  value={editBranchDetails.branchAddress}
                  onChange={handleBranchEditChange}
                  className="input-box border border-gray-300 rounded px-4 py-2 mb-4 w-full"
                  placeholder="Address"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={handleSaveBranchEdit}
                    className="primary-button bg-blue-500 text-white rounded px-4 py-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="secondary-button bg-gray-300 text-black rounded px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseManagement;
