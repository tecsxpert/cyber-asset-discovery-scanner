import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function AssetList() {
  const [assets, setAssets] = useState([]);

  
  const fetchAssets = async () => {
    try {
      const res = await API.get("/assets");
      setAssets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

 
  const deleteAsset = async (id) => {
    try {
      await API.delete(`/assets/${id}`);
      alert("Asset Deleted!");

      
      fetchAssets();
    } catch (err) {
      console.error(err);
      alert("Delete failed!");
    }
  };

  return (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Asset List</h1>

    {assets.map((asset) => (
      <div
        key={asset.id}
        className="bg-white shadow-md rounded-lg p-4 mb-4 border"
      >
        <p><strong>Name:</strong> {asset.name}</p>
        <p><strong>Type:</strong> {asset.type}</p>
        <p><strong>IP:</strong> {asset.ipAddress}</p>

        <div className="mt-3 space-x-2">
          <Link to={`/edit/${asset.id}`}>
          <button className="bg-blue-500 text-white px-3 py-1 rounded">
          Edit
         </button>
         </Link>

          <button
          onClick={() => deleteAsset(asset.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
>
           Delete
          </button>
        </div>
      </div>
    ))}
  </div>
);

}

export default AssetList;