import { BrowserRouter, Routes, Route } from "react-router-dom";
import AssetList from "./pages/AssetList";
import AddAsset from "./pages/AddAsset";
import EditAsset from "./pages/EditAsset";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          
          <Route path="/login" element={<Login />} />

          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AssetList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/add"
            element={
              <ProtectedRoute>
                <AddAsset />
              </ProtectedRoute>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditAsset />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
 

}

export default App;