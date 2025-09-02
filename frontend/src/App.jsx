import { useEffect, useState } from "react";

function App() {
  const [tyres, setTyres] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    fetch("/api/tyres")
      .then((res) => res.json())
      .then((data) => {
        setTyres(data);
        const uniqueBrands = [...new Set(data.map((t) => t.brand))];
        setBrands(uniqueBrands);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  // Filter tyres by search + brand
  const filteredTyres = tyres.filter((tyre) => {
    const matchesSearch = tyre.model
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter ? tyre.brand === brandFilter : true;
    return matchesSearch && matchesBrand;
  });

  // Autocomplete suggestions
  const suggestions = searchTerm
    ? tyres
        .filter((tyre) =>
          tyre.model.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 5)
    : [];

  // Copy tyre details in multi-line format
  const copyTyreDetails = (tyre) => {
    const text = `Brand: ${tyre.brand}
Model: ${tyre.model}
Type: ${tyre.type}
DP: ${tyre.dp}
MRP: ${tyre.mrp}`;
    navigator.clipboard.writeText(text)
      .then(() => alert("Tyre details copied to clipboard ✅"))
      .catch((err) => console.error("Failed to copy:", err));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tyre Inventory</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search with autocomplete */}
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by model..."
            className="w-full p-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="absolute bg-white border w-full mt-1 rounded-lg shadow-lg z-10">
              {suggestions.map((tyre) => (
                <li
                  key={tyre._id}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => setSearchTerm(tyre.model)}
                >
                  {tyre.model}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Brand Filter */}
        <select
          className="p-2 border rounded-lg md:w-1/4"
          value={brandFilter}
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Tyres Table */}
      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Brand</th>
              <th className="border p-2 text-left">Model</th>
              <th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">DP</th>
              <th className="border p-2 text-left">MRP</th>
              <th className="border p-2 text-left">Copy</th>
            </tr>
          </thead>
          <tbody>
            {filteredTyres.length > 0 ? (
              filteredTyres.map((tyre) => (
                <tr key={tyre._id} className="hover:bg-gray-50">
                  <td className="border p-2">{tyre.brand}</td>
                  <td className="border p-2">{tyre.model}</td>
                  <td className="border p-2">{tyre.type}</td>
                  <td className="border p-2">{tyre.dp}</td>
                  <td className="border p-2">{tyre.mrp}</td>
                  <td className="border p-2">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => copyTyreDetails(tyre)}
                    >
                      Copy
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border p-2 text-center text-gray-500">
                  No tyres found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
