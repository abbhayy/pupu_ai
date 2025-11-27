import { useState, useEffect } from "react";
import CodeGenerator from "./components/CodeGenerator";
import HistoryList from "./components/HistoryList";
import { FaCode, FaHistory, FaGithub } from "react-icons/fa";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("generate");
  const [refreshHistory, setRefreshHistory] = useState(0);

  const handleGenerationSuccess = () => {
    // Refresh history when new code is generated
    setRefreshHistory((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-200 to-gray-500 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <FaCode className="text-5xl text-gray-500 mr-3" />
            <h1 className="text-5xl font-bold text-gray-500">
              Intelligent Code Assistant
            </h1>
          </div>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">
            From text to code in seconds. Build, inspect, and maintain your code
            snippets with AI support.{" "}
          </p>
        </header>
        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
              activeTab === "generate"
                ? "bg-white  text-purple-600 shadow-lg scale-105"
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
            <span className="text-black">History</span>
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
        {/* Footer */}
        {/* <footer className="text-center mt-12 text-white/80">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <FaGithub className="text-2xl" />
            <span>Built with React, Express.js, and PostgreSQL</span>
          </div>
          {/* <p className="text-sm"></p> */}
        {/* </footer> */} 
      </div>
    </div>
  );
}

export default App;
