// src/Pages/Settings.jsx

import { useState } from "react";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const Settings = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
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
          <Navbar pagename={"Dashboard"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="mt-4">
          <p>Settings</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
