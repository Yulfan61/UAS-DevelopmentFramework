// src/components/Search.jsx
import React from "react";

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="mb-4">
      <label htmlFor="search" className="block text-sm font-medium text-slate-900">
        Search
      </label>
      <input
        type="text"
        id="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-1 block w-full border border-slate-300 rounded-md p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Search records"
      />
    </div>
  );
};

export default Search;
