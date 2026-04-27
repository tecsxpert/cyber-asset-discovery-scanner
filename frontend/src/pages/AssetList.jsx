import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function AssetList() {
  const [assets, setAssets] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/assets/all?page=${page}&size=2`);

      setAssets(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setAssets([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [page]);

  const deleteAsset = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this asset?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/assets/${id}`);
      alert("Asset deleted!");

      if (assets.length === 1 && page > 0) {
        setPage(page - 1);
      } else {
        fetchAssets();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-6 py-8 shadow">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Asset List</h1>
            <p className="text-blue-100 mt-1">
              Manage discovered cyber assets
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              to="/dashboard"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Dashboard
            </Link>

            <Link
              to="/add"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              + Add Asset
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {loading ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-500 font-semibold">Loading assets...</p>
          </div>
        ) : assets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="bg-white rounded-2xl shadow p-6 border border-slate-200 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-bold text-blue-900 mb-3">
                  {asset.name}
                </h2>

                <p className="text-gray-700">
                  <strong>Type:</strong> {asset.type}
                </p>

                <p className="text-gray-700">
                  <strong>IP Address:</strong> {asset.ipAddress}
                </p>

                <p className="text-gray-700">
                  <strong>Status:</strong> {asset.status || "N/A"}
                </p>

                <p className="text-gray-700">
                  <strong>Risk Score:</strong> {asset.riskScore ?? 0}
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    to={`/assets/${asset.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    View
                  </Link>

                  <Link
                    to={`/edit/${asset.id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-white rounded-xl shadow">
            <p className="text-gray-500 font-semibold">No assets found</p>
          </div>
        )}

        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold text-gray-700">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetList;