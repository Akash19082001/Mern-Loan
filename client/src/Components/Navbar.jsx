import { demouser } from "../Assets/index"; 
import { useEffect, useState } from "react";

const Navbar = ({ pagename }) => {
  const [name, setName] = useState(""); // State for storing the name

  useEffect(() => {
    // Get the name and role from localStorage after login or registration
    const userName = localStorage.getItem("name");
    setName(userName || "Guest"); // Default to "Guest" if no name is found
  }, []);

  return (
    <nav className="bg-white flex items-center justify-between h-20 px-8 shadow-sm">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold text-gray-500">{pagename}</h1>
      </div>
      <div className="flex items-center">
        <div className="rounded-full h-10 w-10 bg-gray-300 flex items-center justify-center mr-4">
          <img src={demouser} alt="avatar" className="rounded-full h-8 w-8" />
        </div>
        <div className="flex flex-col text-sm">
          <span className="font-medium">Gk MiCro</span> {/* Display the name */}
          <span>{name}</span> {/* Display the role */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
