import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Layout({ children }) {
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <nav className="bg-slate-900 text-white shadow-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-bold">Cyber Asset Scanner</h1>

          <div className="flex flex-wrap gap-2 text-sm">
            <Link className="rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600" to="/">
              Assets
            </Link>
            <Link className="rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600" to="/dashboard">
              Dashboard
            </Link>
            <Link className="rounded-lg bg-slate-700 px-3 py-2 hover:bg-slate-600" to="/analytics">
              Analytics
            </Link>
            <Link className="rounded-lg bg-blue-600 px-3 py-2 hover:bg-blue-500" to="/add">
              Add Asset
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-600 px-3 py-2 hover:bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}

export default Layout;