import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssetList from "./pages/AssetList";
import AddAsset from "./pages/AddAsset";
import EditAsset from "./pages/EditAsset";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssetList />} />
        <Route path="/add" element={<AddAsset />} />
        <Route path="/edit/:id" element={<EditAsset />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;