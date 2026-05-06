import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AddAsset() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "",
    ipAddress: "",
    status: "ACTIVE",
    riskScore: 0,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.name === "riskScore" ? Number(e.target.value) : e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/assets", form);
      alert("Asset added successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Error adding asset");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">Add Asset</h2>

        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <input name="ipAddress" placeholder="IP Address" value={form.ipAddress} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <select name="status" value={form.status} onChange={handleChange} className="w-full mb-3 p-2 border rounded">
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
          <option value="MAINTENANCE">MAINTENANCE</option>
        </select>

        <input name="riskScore" type="number" min="0" max="100" placeholder="Risk Score" value={form.riskScore} onChange={handleChange} className="w-full mb-3 p-2 border rounded" />

        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded">
          Add Asset
        </button>
      </form>
    </div>
  );
}

export default AddAsset;