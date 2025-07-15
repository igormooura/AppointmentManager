import { useState } from "react";
import { TfiClose, TfiAlignLeft } from "react-icons/tfi";
import { Link } from "react-router-dom";

const Header = () => {
  const [nav, setNav] = useState(false);

  const handleClick = () => {
    setNav(!nav);
  };

  return (
    <div className="flex justify-between items-center h-24 mx-auto px-4 bg-[#FAF9F6]">
      <h1 className="w-full text-3xl font-bold text-black">
        <Link to="/">Appointment Manager</Link>
      </h1>

      <ul className="hidden md:flex">
        <li className="p-4">
          <Link to="/">Home</Link>
        </li>
        <li className="p-4">
          <Link to="/login">Appointments</Link>
        </li>
        <li className="p-4">
          <Link to="/about">About</Link>
        </li>
      </ul>

      <div onClick={handleClick} className="block md:hidden cursor-pointer">
        {nav ? <TfiClose size={20} /> : <TfiAlignLeft size={20} />}
      </div>

      <ul
        className={
          nav
            ? "fixed left-0 top-0 w-[60%] h-full border-r border-[#e0e0dac4] bg-white ease-in-out duration-700 md:hidden"
            : "fixed left-[-100%] ease-in-out duration-500 md:hidden"
        }
      >
        <li className="p-4 border-b border-gray-600">
          <Link to="/" onClick={handleClick}>Home</Link>
        </li>
        <li className="p-4">
          <Link to="/login">Appointments</Link>
        </li>
        <li className="p-4 border-b border-gray-600">
          <Link to="/about" onClick={handleClick}>About</Link>
        </li>
      </ul>
    </div>
  );
};

export default Header;
