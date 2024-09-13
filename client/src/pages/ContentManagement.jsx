// src/Pages/ContentManagement.jsx

import React, { useState } from "react";
import Menubar from "../Components/Manubar";
import MenuToggle from "../Components/MenuToggle";
import Navbar from "../Components/Navbar";

const ContentManagement = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className="flex">
      <div
        className={`w-1/4 h-screen bg-gray-200 text-gray-500 ${
          showMenu ? "" : "hidden"
        } lg:block`}
      >
        <Menubar />
      </div>
      <div className="flex-1 h-screen p-4">
        <Navbar pagename={"Content Management"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="mt-4">
          <p>Content Management</p>
        </div>
      </div>
    </div>
  );
};
export default ContentManagement;
