import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import AiPanel from "../components/AiPanel";

function AssetList() {
  const [assets, setAssets] = useState([]);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");

  const size = 2;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchAssets = async () => {
    try {
      setLoading(true);

      const res = await API.get("/assets/search", {
        params: {
          q: debouncedSearch,
          status,
          startDate,
          endDate,
          page,
          size,
        },
      });

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
  }, [debouncedSearch, status, startDate, endDate, page]);

  const resetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatus("");
    setStartDate("");
    setEndDate("");
    setPage(0);
  };

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

  const getStatusBadge = (assetStatus) => {
    if (assetStatus === "ACTIVE") {
      return "bg-green-100 text-green-700 border-green-200";
    }

    if (assetStatus === "INACTIVE") {
      return "bg-gray-100 text-gray-700 border-gray-200";
    }

    if (assetStatus === "RISKY") {
      return "bg-red-100 text-red-700 border-red-200";
    }

    return "bg-blue-100 text-blue-700 border-blue-200";
  };

  const getRiskBadge = (score) => {
    if (score >= 70) return "bg-red-100 text-red-700";
    if (score >= 40) return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const handleExportCsv = async () => {
    try {
      const response = await API.get("/assets/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", "assets.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("CSV export failed");
    }
  };

  const handleUploadCsv = async () => {
    if (!uploadFile) {
      alert("Please select a CSV file");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadFile);

    try {
      const response = await API.post("/assets/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUploadMessage(response.data);
      fetchAssets();
    } catch (error) {
      setUploadMessage(error.response?.data || "Upload failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-700 px-4 py-6 text-white shadow sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">Asset List</h1>
            <p className="mt-1 text-sm text-blue-100 sm:text-base">
              Search, filter and manage discovered cyber assets
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              to="/dashboard"
              className="rounded-lg bg-purple-600 px-4 py-3 text-center text-white shadow hover:bg-purple-700"
            >
              Dashboard
            </Link>

            <Link
              to="/add"
              className="rounded-lg bg-green-600 px-4 py-3 text-center text-white shadow hover:bg-green-700"
            >
              + Add Asset
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-xl border bg-white p-4 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            Day 9 CSV Tools
          </h2>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <button
              onClick={handleExportCsv}
              className="w-full rounded-lg bg-green-600 px-4 py-3 text-white shadow hover:bg-green-700 md:w-auto"
            >
              Export CSV
            </button>

            <input
              type="file"
              accept=".csv"
              onChange={(e) => setUploadFile(e.target.files[0])}
              className="w-full rounded-lg border px-3 py-3 text-sm md:w-auto"
            />

            <button
              onClick={handleUploadCsv}
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-white shadow hover:bg-blue-700 md:w-auto"
            >
              Upload CSV
            </button>
          </div>

          {uploadMessage && (
            <p className="mt-3 rounded bg-gray-100 p-2 text-sm text-gray-700">
              {uploadMessage}
            </p>
          )}
        </div>

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow sm:p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-900">
                Search & Filters
              </h2>
              <p className="text-sm text-gray-500">
                Debounced search, status filter and date range filter
              </p>
            </div>

            <button
              onClick={resetFilters}
              className="w-full rounded-lg bg-slate-800 px-4 py-3 text-white hover:bg-slate-900 md:w-auto"
            >
              Reset Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, type, IP..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(0);
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="RISKY">RISKY</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(0);
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-gray-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(0);
                }}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border bg-white shadow"
              ></div>
            ))}
          </div>
        ) : assets.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-2">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow transition hover:shadow-lg sm:p-6"
              >
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <h2 className="break-words text-xl font-bold text-blue-900">
                      {asset.name}
                    </h2>
                    <p className="text-sm text-gray-500">Asset ID: {asset.id}</p>
                  </div>

                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-bold ${getStatusBadge(
                      asset.status
                    )}`}
                  >
                    {asset.status || "N/A"}
                  </span>
                </div>

                <div className="space-y-2 text-sm sm:text-base">
                  <p className="break-words text-gray-700">
                    <strong>Type:</strong> {asset.type}
                  </p>

                  <p className="break-words text-gray-700">
                    <strong>IP Address:</strong> {asset.ipAddress}
                  </p>

                  <p className="text-gray-700">
                    <strong>Risk Score:</strong>{" "}
                    <span
                      className={`rounded px-2 py-1 font-bold ${getRiskBadge(
                        asset.riskScore ?? 0
                      )}`}
                    >
                      {asset.riskScore ?? 0}
                    </span>
                  </p>
                </div>

                <div className="mt-4 overflow-hidden">
                  <AiPanel asset={asset} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
                  <Link
                    to={`/assets/${asset.id}`}
                    className="rounded-lg bg-blue-600 px-4 py-3 text-center text-white hover:bg-blue-700"
                  >
                    View
                  </Link>

                  <Link
                    to={`/edit/${asset.id}`}
                    className="rounded-lg bg-yellow-500 px-4 py-3 text-center text-white hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  <Link
                    to="/analytics"
                    className="rounded-lg bg-purple-600 px-4 py-3 text-center text-white hover:bg-purple-700"
                  >
                    Analytics
                  </Link>

                  <button
                    onClick={() => deleteAsset(asset.id)}
                    className="rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            <p className="font-semibold text-gray-500">No assets found</p>
          </div>
        )}

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="w-full rounded-lg bg-gray-300 px-5 py-3 hover:bg-gray-400 disabled:opacity-50 sm:w-auto"
          >
            Prev
          </button>

          <span className="font-semibold text-gray-700">
            Page {page + 1} of {totalPages}
          </span>

          <button
            onClick={() => setPage(page + 1)}
            disabled={page + 1 >= totalPages}
            className="w-full rounded-lg bg-gray-300 px-5 py-3 hover:bg-gray-400 disabled:opacity-50 sm:w-auto"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AssetList;