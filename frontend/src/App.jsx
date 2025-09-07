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

  // Dynamic column order (preferred if exists)
  const preferredColumns = ["brand", "model", "type", "rp", "rp1", "dp", "mrp"];
  const columns =
    tyres.length > 0
      ? preferredColumns.filter((col) => col in tyres[0])
      : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Tyre Inventory - Real-time Search</h1>

      <form autoComplete="off" style={{ position: "relative" }}>
        <input
          type="text"
          name="search_model_unique"
          autoComplete="off"
          spellCheck="false"
          placeholder="Search by model..."
          value={searchTerm}
          onChange={onSearchChange}
          className="border p-2 rounded w-1/2"
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
            {columns.map((col) => (
              <th key={col} className="border p-2 uppercase">
                {col}
              </th>
            ))}
            <th className="border p-2">Copy</th>
          </tr>
        </thead>
        <tbody>
          {tyres.length > 0 ? (
            tyres.map((tyre, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col} className="border p-2">
                    {tyre[col] ?? "-"}
                  </td>
                ))}
                <td className="border p-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        columns.map((col) => `${col}: ${tyre[col] ?? "-"}`).join(" | ")
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
              <td colSpan={columns.length + 1} className="border p-2 text-center">
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
