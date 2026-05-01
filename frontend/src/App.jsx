import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import AssetList from "./pages/AssetList";
import AddAsset from "./pages/AddAsset";
import EditAsset from "./pages/EditAsset";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AssetDetail from "./pages/AssetDetail";
import Analytics from "./pages/Analytics";

import { AuthProvider } from "./context/AuthContext";

function ProtectedPage({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedPage>
                <AssetList />
              </ProtectedPage>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedPage>
                <Dashboard />
              </ProtectedPage>
            }
          />

          <Route
            path="/assets/:id"
            element={
              <ProtectedPage>
                <AssetDetail />
              </ProtectedPage>
            }
          />

          <Route
            path="/add"
            element={
              <ProtectedPage>
                <AddAsset />
              </ProtectedPage>
            }
          />

          <Route
            path="/edit/:id"
            element={
              <ProtectedPage>
                <EditAsset />
              </ProtectedPage>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedPage>
                <Analytics />
              </ProtectedPage>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;