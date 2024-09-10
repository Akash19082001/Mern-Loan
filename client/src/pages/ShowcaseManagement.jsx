import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const ShowcaseManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchId, setBranchId] = useState(""); // New state for branch ID
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

  const handleBranchIdChange = (event) => {
    setBranchId(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`http://localhost:5000/api/companies/search?companyName=${searchTerm}&branchId=${branchId}`);
      const data = await response.json();
      if (data.success) {
        setCompanyDetails(data.data);
      } else {
        setError(data.message || "No results found");
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
      setError("An error occurred while fetching data");
    }
    setLoading(false);
  };

  const handleEdit = (branchIndex) => {
    setEditing(branchIndex);
    // Add logic to handle editing the branch
  };

  const handleDelete = async (branchIndex) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        const branchId = companyDetails.branches[branchIndex].branchId;
        const response = await fetch(`http://localhost:5000/api/companies/${companyDetails._id}/branches/${branchId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
          // Remove the deleted branch from the state
          setCompanyDetails(prevDetails => ({
            ...prevDetails,
            branches: prevDetails.branches.filter((_, index) => index !== branchIndex)
          }));
        } else {
          setError(data.message || "Failed to delete branch");
        }
      } catch (error) {
        console.error("Error deleting branch:", error);
        setError("An error occurred while deleting the branch");
      }
    }
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
              value={branchId}
              onChange={handleBranchIdChange}
              placeholder="Branch ID (optional)"
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
              <h2 className="text-xl font-semibold">Company Details</h2>
              <p><strong>Name:</strong> {companyDetails.companyName}</p>
              <p><strong>Contact:</strong> {companyDetails.contactNumber}</p>
              <p><strong>Address:</strong> {companyDetails.address}</p>

              <h2 className="text-xl font-semibold mt-4">Branches</h2>
              {companyDetails.branches.length > 0 ? (
                <ul className="space-y-4">
                  {companyDetails.branches.map((branch, index) => (
                    <li key={branch.branchId} className="bg-gray-100 p-4 shadow-md rounded-md flex justify-between items-center">
                      <div>
                        <p><strong>Branch Name:</strong> {branch.branchName}</p>
                        <p><strong>Contact:</strong> {branch.branchContactNumber}</p>
                        <p><strong>Address:</strong> {branch.branchAddress}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(index)} className="text-blue-500 hover:text-blue-700">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(index)} className="text-red-500 hover:text-red-700">
                          <FaTrash />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No branches found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowcaseManagement;
