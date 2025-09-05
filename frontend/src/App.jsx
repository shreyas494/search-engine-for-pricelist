import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // Fetch brands and types once on mount
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items");
        const allItems = res.data;

        setBrands([...new Set(allItems.map((item) => item.brand))]);
        setTypes([...new Set(allItems.map((item) => item.type))]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFilters();
  }, []);

  // Fetch table items whenever filters change
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/items", {
          params: { brand: selectedBrand, type: selectedType, search: searchTerm },
        });
        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, [selectedBrand, selectedType, searchTerm]);

  // Fetch autocomplete suggestions dynamically
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length === 0) return setSuggestions([]);
      try {
        const res = await axios.get("http://localhost:5000/api/items", {
          params: { brand: selectedBrand, type: selectedType, search: searchTerm },
        });
        setSuggestions(res.data.slice(0, 5)); // top 5 suggestions
      } catch (err) {
        console.error(err);
      }
    };
    fetchSuggestions();
  }, [searchTerm, selectedBrand, selectedType]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      <div className="flex gap-4 mb-6">
        {/* Brand Dropdown */}
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Brands</option>
          {brands.map((brand, i) => (
            <option key={i} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* Type Dropdown */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Types</option>
          {types.map((type, i) => (
            <option key={i} value={type}>
              {type}
            </option>
          ))}
        </select>

        {/* Search Bar */}
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search by model..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border w-full mt-1 rounded shadow-lg z-10">
              {suggestions.map((item) => (
                <li
                  key={item._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(item.model);
                    setItems([item]); // show selected item in table
                    setSuggestions([]); // close dropdown
                  }}
                >
                  {item.model}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Table */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Brand</th>
            <th className="border p-2">Model</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">DP</th>
            <th className="border p-2">MRP</th>
            <th className="border p-2">Copy</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item) => (
              <tr key={item._id}>
                <td className="border p-2">{item.brand}</td>
                <td className="border p-2">{item.model}</td>
                <td className="border p-2">{item.type}</td>
                <td className="border p-2">{item.dp}</td>
                <td className="border p-2">{item.mrp}</td>
                <td className="border p-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${item.brand} - ${item.model} - DP:${item.dp} - MRP:${item.mrp}`
                      )
                    }
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Copy
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center p-4">
                Data not found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
