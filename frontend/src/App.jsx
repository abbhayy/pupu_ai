import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import CodeGenerator from "./components/CodeGenerator";
import HistoryList from "./components/HistoryList";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { FaCode, FaHistory, FaSignOutAlt } from "react-icons/fa";
import "./App.css";

function DashboardLayout({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState("generate");
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleGenerationSuccess = () => {
    setRefreshHistory((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-200 to-gray-500 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Logout */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center flex-1">
              <FaCode className="text-5xl text-gray-500 mr-3" />
              <h1 className="text-5xl font-bold text-gray-500">
                Intelligent Code Assistant
              </h1>
            </div>
            {user && (
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-semibold">
                  Welcome, {user.username}!
                </span>
                <button
                  onClick={onLogout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all duration-200"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            From text to code in seconds. Build, inspect, and maintain your code
            snippets with AI support.
          </p>
        </header>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "generate"
                ? "bg-white text-purple-600 shadow-lg scale-105"
                : "bg-black/10 text-white hover:bg-white/30"
            }`}
          >
            <FaCode />
            <span className="text-black">Generate Code</span>
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "history"
                ? "bg-white text-purple-600 shadow-lg scale-105"
                : "bg-black/10 text-white hover:bg-white/30"
            }`}
          >
            <FaHistory />
            <span className="text-black">My History</span>
          </button>
        </div>

        {/* Main Content */}
        <main>
          {activeTab === "generate" && (
            <CodeGenerator onSuccess={handleGenerationSuccess} />
          )}
          {activeTab === "history" && (
            <HistoryList refreshTrigger={refreshHistory} />
          )}
        </main>
      </div>
    </div>
  );
}

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication on mount and route changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-gray-200 to-gray-500">
        <div className="text-white text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login setUser={handleLoginSuccess} />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
