import React from "react";
import { FaSearch } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import "./search.less";

function Search({ search, handleSearch, setSearch, placeholder, showIcon }) {
  return (
    <div className="search-container">
      <input
        type="text"
        onChange={(e) => handleSearch(e.target.value)}
        value={search}
        placeholder={placeholder}
      />
      {showIcon &&
        (search ? (
          <MdOutlineCancel onClick={() => setSearch("")} />
        ) : (
          <FaSearch />
        ))}
    </div>
  );
}

export default Search;
