import { useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";

function EditAsset() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState({
    name: "",
    type: "",
    ipAddress: ""
  });

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await API.put(`/assets/${id}`, asset);

    alert("Asset Updated!");
    navigate("/");
  };

  return (
    <div>
      <h2>Edit Asset</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="type" placeholder="Type" onChange={handleChange} />
        <input name="ipAddress" placeholder="IP Address" onChange={handleChange} />

        <button type="submit">Update</button>
      </form>
    </div>
  );
}

export default EditAsset;