import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [tyres, setTyres] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    fetchTyres();
  }, [selectedBrand, searchTerm]);

  const fetchTyres = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tyres", {
        params: { brand: selectedBrand, search: searchTerm },
      });
      setTyres(res.data);

      // Populate brand dropdown
      if (brands.length === 0) {
        const uniqueBrands = [
          ...new Set(res.data.map((tyre) => tyre.brand)),
        ];
        setBrands(uniqueBrands);
      }

      // Autocomplete suggestions
      if (searchTerm.length > 0) {
        const matches = res.data.filter((tyre) =>
          tyre.model.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setSuggestions(matches.slice(0, 5));
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tyre Inventory</h1>

      <div className="flex gap-4 mb-6">
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
              {suggestions.map((tyre) => (
                <li
                  key={tyre._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setSearchTerm(tyre.model);
                    setTyres([tyre]); // 👈 instantly show clicked item
                    setSuggestions([]); // close dropdown
                  }}
                >
                  {tyre.model}
                </li>
              ))}
            </ul>
          )}
        </div>

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
          {tyres.map((tyre) => (
            <tr key={tyre._id}>
              <td className="border p-2">{tyre.brand}</td>
              <td className="border p-2">{tyre.model}</td>
              <td className="border p-2">{tyre.type}</td>
              <td className="border p-2">{tyre.dp}</td>
              <td className="border p-2">{tyre.mrp}</td>
              <td className="border p-2">
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${tyre.brand} - ${tyre.model} - DP:${tyre.dp} - MRP:${tyre.mrp}`
                    )
                  }
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
