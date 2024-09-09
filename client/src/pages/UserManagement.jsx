import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const UserManagement = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [customers, setCustomers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleMenuToggle = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/customers");
      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }
      const data = await response.json();
      setCustomers(data.customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleBranchClick = (companyName) => {
    // Use navigate to redirect to BranchDetails page
    navigate(`/branches/${encodeURIComponent(companyName)}`);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`w-1/4 bg-gray-200 text-gray-500 ${
          showMenu ? "" : "hidden"
        } lg:block h-full`}
      >
        <Menubar />
      </div>
      <div className="flex-1 p-4">
        <Navbar pagename={"User Management"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="mt-4">
          
          <table className="min-w-full mt-4 bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Company Name</th>
                <th className="border px-4 py-2">Contact Person</th>
                <th className="border px-4 py-2">Contact Number</th>
                <th className="border px-4 py-2">Address</th>
                <th className="border px-4 py-2">Date of Start</th>
                <th className="border px-4 py-2">Mode of AMC</th>
                <th className="border px-4 py-2">Branch Count</th>{" "}
                {/* New Branch Count column */}
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer._id}>
                  <td className="border px-4 py-2">{customer.companyName}</td>
                  <td className="border px-4 py-2">{customer.contactPerson}</td>
                  <td className="border px-4 py-2">{customer.contactNumber}</td>
                  <td className="border px-4 py-2">{customer.address}</td>
                  <td className="border px-4 py-2">
                    {new Date(customer.dateOfStart).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">{customer.modeOfAmc}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleBranchClick(customer.companyName)}
                      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 ml-10"
                    >
                      {customer.branches ? customer.branches.length : 0}
                    </button>
                  </td>{" "}
                  {/* Branch count as a clickable button */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
