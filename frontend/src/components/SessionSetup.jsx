import { useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

export default function SessionSetup() {
  const [duration, setDuration] = useState(25);
  const [studyMode, setStudyMode] = useState("Screen Work");
  const [nudgeType, setNudgeType] = useState("Popup");
  const [consent, setConsent] = useState(false);

  const navigate = useNavigate();

  const handleStart = () => {
    if (!consent) {
      alert("Please provide camera consent to continue.");
      return;
    }
    navigate("/live", { state: { studyMode, duration } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100">
        <button
          onClick={() => window.history.back()}
          className="text-sm text-gray-500 mb-4 hover:text-gray-700"
        >
          ← Back
        </button>

        <h2 className="text-2xl font-bold text-blue-800 mb-1">Session Setup</h2>
        <p className="text-gray-500 mb-6">
          Configure your focus tracking session
        </p>

        <div className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1">Study Mode</label>
            <select
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option>Screen Work</option>
              <option>Writing</option>
              <option>Reading</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">
              Session Duration: {duration} minutes
            </label>
            <input
              type="range"
              min="10"
              max="60"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full accent-green-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Nudge Type</label>
            <select
              value={nudgeType}
              onChange={(e) => setNudgeType(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              <option>Popup</option>
              <option>Sound</option>
              <option>Visual Overlay</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={consent}
              onChange={() => setConsent(!consent)}
              className="accent-blue-600"
            />
            <label className="text-gray-600 text-sm">
              I consent to camera access. <br />
              <span className="text-gray-400">
                Camera data is processed locally only. No data is stored or
                transmitted.
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium shadow-md transition"
        >
          Begin Session
        </button>
      </div>
    </div>
  );
}
