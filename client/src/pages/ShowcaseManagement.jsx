import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const ShowcaseManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchUniqueId, setBranchUniqueId] = useState(""); // State for branch unique ID
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // Track which item is being edited

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
      const response = await fetch(
        `http://localhost:5000/api/companies/search?companyName=${searchTerm}&branchUniqueId=${branchUniqueId}`
      );
      const data = await response.json();
      
      if (data.success) {
        if (branchUniqueId) {
          // Update to only display the matched branch
          setCompanyDetails({ ...data.data, branches: data.data.branches });
        } else {
          setCompanyDetails(data.data); // Show full company details
        }
      } else {
        setError(data.message || "No results found.");
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      setError("An error occurred while fetching data.");
    }

    setLoading(false);
  };

  const handleEdit = (branchIndex) => {
    setEditing(branchIndex);
    // Add logic to handle editing the branch
  };

  return (
    <div className="flex">
      <div className={`w-1/4 h-screen bg-gray-200 text-gray-500 ${showMenu ? "" : "hidden"} lg:block`}>
        <Menubar />
      </div>
      <div className="flex-1 h-screen p-4">
        <Navbar pagename={"Showcase Management"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />

        {/* Search bar and Enter button */}
        <div className="flex items-center justify-center mt-10">
          <form onSubmit={handleSearchSubmit} className="flex items-center space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search for company..."
              className="border border-gray-300 p-3 rounded-full w-96 shadow-md focus:outline-none focus:ring-2 focus:ring-black-500 transition duration-200"
            />
            <input
              type="text"
              value={branchUniqueId}
              onChange={handleBranchUniqueIdChange}
              placeholder="Branch Unique ID (optional)"
              className="border border-gray-300 p-3 rounded-full w-32 shadow-md focus:outline-none focus:ring-2 focus:ring-black-500 transition duration-200"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-600 transition duration-200 focus:outline-none"
            >
              Search
            </button>
          </form>
        </div>

        {/* Display Search Results */}
        <div className="mt-8">
          {loading && <p className="text-center text-gray-500">Loading...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          {companyDetails && (
            <div className="bg-white p-4 shadow-md rounded-md">
              {branchUniqueId ? (
                <>
                  <h2 className="text-xl font-semibold">Branch Details</h2>
                  <div className="bg-gray-100 p-4 shadow-md rounded-md">
                    {companyDetails.branches.length > 0 ? (
                      <>
                        <p><strong>Branch Name:</strong> {companyDetails.branches[0].branchName}</p>
                        <p><strong>Contact:</strong> {companyDetails.branches[0].branchContactNumber}</p>
                        <p><strong>Address:</strong> {companyDetails.branches[0].branchAddress}</p>
                      </>
                    ) : (
                      <p>No matching branch found.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-semibold">Company Details</h2>
                  <p><strong>Name:</strong> {companyDetails.companyName}</p>
                  <p><strong>Contact:</strong> {companyDetails.contactNumber}</p>
                  <p><strong>Address:</strong> {companyDetails.address}</p>

                  <h2 className="text-xl font-semibold mt-4">Branches</h2>
                  {companyDetails.branches.length > 0 ? (
                    <ul className="space-y-4">
                      {companyDetails.branches.map((branch, index) => (
                        <li
                          key={branch.branchId}
                          className="bg-gray-100 p-4 shadow-md rounded-md flex justify-between items-center"
                        >
                          <div>
                            <p><strong>Branch Name:</strong> {branch.branchName}</p>
                            <p><strong>Contact:</strong> {branch.branchContactNumber}</p>
                            <p><strong>Address:</strong> {branch.branchAddress}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No branches found.</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseManagement;
