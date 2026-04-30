import ProtectedRoute from "./components/ProtectedRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssetList from "./pages/AssetList";
import AddAsset from "./pages/AddAsset";
import EditAsset from "./pages/EditAsset";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AssetDetail from "./pages/AssetDetail";
import { AuthProvider } from "./context/AuthContext";
import Analytics from "./pages/Analytics";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<AssetList />} />
          <Route path="/assets/:id" element={<AssetDetail />} />
          <Route path="/add" element={<AddAsset />} />
          <Route path="/edit/:id" element={<EditAsset />} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute> }/>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;