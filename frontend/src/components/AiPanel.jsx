import { useState } from "react";
import API from "../services/api";

function AiPanel({ asset }) {
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!asset) {
      setError("No asset selected for analysis.");
      return;
    }

    setLoading(true);
    setError("");
    setAiResponse("");

    try {
      const res = await API.post("/ai/analyze", {
        assetName: asset.name,
        type: asset.type,
        status: asset.status,
      });

      setAiResponse(res.data.response);
    } catch (err) {
      setError("Failed to get AI analysis. Please check backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition hover:shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          
        </h3>
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Smart Analysis
        </span>
      </div>

      {/* Description */}
      <p className="mt-2 text-sm text-gray-500">
        Get AI-powered insights and security recommendations for this asset.
      </p>

      {/* Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="mt-4 w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 font-semibold text-white shadow-md transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Analyzing..." : "Analyze Asset"}
      </button>

      {/* Loading */}
      {loading && (
        <div className="mt-4 flex items-center justify-center gap-2 text-blue-600">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-sm">Analyzing asset...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          ⚠ {error}
        </div>
      )}

      {/* AI Response */}
      {aiResponse && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 shadow-inner">
          
          <h4 className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
            
          </h4>

          <div className="space-y-2 text-sm text-gray-700">
            {aiResponse.split("\n").map((line, index) => (
              <p key={index} className="leading-relaxed">
                {line}
              </p>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

export default AiPanel;