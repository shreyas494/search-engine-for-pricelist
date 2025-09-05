import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [tyres, setTyres] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debounceRef = useRef(null);

  useEffect(() => {
    fetchTyres(selectedBrand);
    setSearchTerm("");
    setSuggestions([]);
  }, [selectedBrand]);

  const fetchTyres = async (brand = "", search = "") => {
    try {
      const params = {};
      if (brand) params.brand = brand;
      if (search) params.search = search;

      const res = await axios.get("http://localhost:5000/api/tyres", { params });
      setTyres(res.data);

      if (brands.length === 0 && res.data.length > 0) {
        const uniqueBrands = [...new Set(res.data.map(t => t.brand))];
        setBrands(uniqueBrands);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSuggestions = async (input) => {
    if (!input) {
      setSuggestions([]);
      return;
    }

    try {
      const params = { search: input };
      if (selectedBrand) params.brand = selectedBrand;

      const res = await axios.get("http://localhost:5000/api/tyres", { params });

      const models = Array.from(new Set(res.data.map(t => t.model)));
      setSuggestions(models.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const onSelectSuggestion = (model) => {
    setSearchTerm(model);
    setSuggestions([]);
    fetchTyres("", model); // search by model only, no brand filter
    setSelectedBrand("");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tyre Inventory</h1>

      <div className="flex gap-4 mb-6">
        <div className="relative w-1/2">
          <input
            type="text"
            placeholder="Search by model..."
            value={searchTerm}
            onChange={onSearchChange}
            className="border p-2 rounded w-full"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border w-full mt-1 rounded shadow-lg z-10 max-h-48 overflow-auto">
              {suggestions.map((model, i) => (
                <li
                  key={i}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => onSelectSuggestion(model)}
                >
                  {model}
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Brands</option>
          {brands.map((b, i) => (
            <option key={i} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

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
          {tyres.length > 0 ? (
            tyres.map((tyre) => (
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
            ))
          ) : (
            <tr>
              <td className="border p-2 text-center" colSpan={6}>
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
