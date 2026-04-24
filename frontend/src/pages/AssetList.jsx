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

      const res = await API.get(`/assets/all?page=${page}`);

      console.log("API RESPONSE:", res.data);

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
    try {
      await API.delete(`/assets/${id}`);
      alert("Asset Deleted!");

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
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Asset List</h1>

          <Link to="/add">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              + Add Asset
            </button>
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading assets...</p>
        ) : assets.length > 0 ? (
          <div className="space-y-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-gray-50"
              >
                <p className="text-lg">
                  <strong>Name:</strong> {asset.name}
                </p>

                <p>
                  <strong>Type:</strong> {asset.type}
                </p>

                <p>
                  <strong>IP:</strong> {asset.ipAddress}
                </p>

                <div className="mt-4 flex gap-3">
                  <Link to={`/edit/${asset.id}`}>
                    <button className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700">
                      Edit
                    </button>
                  </Link>

                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500">No assets found</p>
          </div>
        )}

        <div className="mt-6 flex justify-center items-center gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetList;