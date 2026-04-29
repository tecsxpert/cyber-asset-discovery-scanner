import { useState } from "react";
import API from "../services/api";

function AddAsset() {
  const [form, setForm] = useState({
    name: "",
    type: "",
    ipAddress: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/assets", form);
      alert("Asset added successfully");
    } catch (error) {
      console.error(error);
      alert("Error adding asset");
    }
  };

  return (
  <div className="flex justify-center items-center h-screen bg-gray-100">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md w-80"
    >
      <h2 className="text-xl font-bold mb-4">Add Asset</h2>

      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        name="type"
        placeholder="Type"
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        name="ipAddress"
        placeholder="IP Address"
        onChange={handleChange}
        className="w-full mb-3 p-2 border rounded"
      />

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded"
      >
        Add Asset
      </button>
    </form>
  </div>
);
}

export default AddAsset;