// src/Pages/ShowcaseManagement.jsx

import { useState } from 'react';
import Menubar from '../Components/Manubar';
import MenuToggle from '../Components/MenuToggle';
import Navbar from '../Components/Navbar';

const ShowcaseManagement = () => {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(prevShowMenu => !prevShowMenu);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`w-1/4 bg-gray-200 text-gray-500 ${
          showMenu ? '' : 'hidden'
        } lg:block h-full`}>
        <Menubar />
      </div>
      <div className="flex-1 p-4">
        <Navbar pagename={"Showcase Management"} />
        <MenuToggle showMenu={showMenu} handleMenuToggle={handleMenuToggle} />
        <div className="mt-4">
          <p>User Management</p>
        </div>
      </div>
    </div>
  );
};

export default ShowcaseManagement;
