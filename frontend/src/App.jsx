import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [tyres, setTyres] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchTyres(selectedBrand, "");
    }
  }, [selectedBrand]);

  const fetchTyres = async (brand = "", search = "") => {
    try {
      const params = {};
      if (brand) params.brand = brand;
      if (search) params.search = search;

      const res = await axios.get("http://localhost:5000/api/tyres", { params });
      setTyres(res.data);

      if (brands.length === 0 && res.data.length > 0) {
        setBrands([...new Set(res.data.map((t) => t.brand))]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onSearchChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchTyres(selectedBrand, val);
    }, 300);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tyre Inventory - Real-time Search</h1>

      <form autoComplete="off" style={{ position: "relative" }}>
        {/* Hidden inputs to trick browsers */}
        <input
          type="text"
          name="fakeusernameremembered"
          autoComplete="off"
          style={{ display: "none" }}
        />
        <input
          type="password"
          name="fakepasswordremembered"
          autoComplete="new-password"
          style={{ display: "none" }}
        />

        <input
          type="text"
          name="search_model_unique"
          autoComplete="off"
          spellCheck="false"
          placeholder="Type to search by model..."
          value={searchTerm}
          onChange={onSearchChange}
          className="border p-2 rounded w-1/2"
          // optionally add key to force React to remount on input reset:
          key="search-input"
        />

        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="border p-2 rounded ml-4"
        >
          <option value="">All Brands</option>
          {brands.map((b, i) => (
            <option key={i} value={b}>
              {b}
            </option>
          ))}
        </select>
      </form>

      <table className="w-full border mt-6">
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
              <td colSpan={6} className="border p-2 text-center">
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
