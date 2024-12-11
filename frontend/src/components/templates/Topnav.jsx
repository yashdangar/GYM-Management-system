import React from "react";
import { FaSearch } from "react-icons/fa";

function Topnav({title,searchActive = false}) {
  return (
    <div className="">
      <div className="text-center font-bold text-xl mb-3 mt-3">
        {title}
      </div>
      {searchActive &&
      <div className="flex justify-start items-center p-3">
        <FaSearch />
        <input
          type="text"
          className="w-[60%] lg:w-[45%] text-zinc-200 mx-3 p-3 text-md outline-none focus:ring-1 border-none bg-[#F4F5F6] rounded-xl"
          placeholder="Search Anything"
        />
      </div>}
    </div>
  );
}

export default Topnav;
