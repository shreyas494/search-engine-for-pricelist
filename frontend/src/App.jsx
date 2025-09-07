import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      fetchProducts(selectedBrand, "");
    }
  }, [selectedBrand]);

  const fetchProducts = async (brand = "", search = "") => {
    try {
      const params = {};
      if (brand) params.brand = brand;
      if (search) params.search = search;

      const res = await axios.get("http://localhost:5000/api/tyres", { params });
      setProducts(res.data);

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
      fetchProducts(selectedBrand, val);
    }, 300);
  };

  // ✅ Dynamically detect all keys in the first product
  const columns = products.length > 0 ? Object.keys(products[0]).filter(k => k !== "_id" && k !== "__v") : [];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory - Real-time Search</h1>

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
          {products.length > 0 ? (
            products.map((item, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col} className="border p-2">
                    {item[col] ?? "-"}
                  </td>
                ))}
                <td className="border p-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(
                        columns.map((col) => `${col}: ${item[col] ?? "-"}`).join(" | ")
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
