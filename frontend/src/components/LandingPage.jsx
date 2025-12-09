import { useNavigate } from "react-router-dom";
import React from "react";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center text-center p-6">
      <p className="text-blue-500 text-sm font-medium mb-2">
        🔹 AI-Powered Focus Training
      </p>

      <h1 className="text-4xl sm:text-5xl font-bold text-blue-800 mb-4">
        NeuroFocus – Train Your Attention
      </h1>

      <p className="text-gray-600 max-w-xl mb-6">
        Track your focus in real time and improve your productivity with
        AI-powered attention monitoring.
      </p>

      <button
        onClick={() => navigate("/setup")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition"
      >
        Start Session
      </button>

      <section className="mt-16 max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6">
        <InfoCard
          title="Camera Tracking"
          text="Your camera monitors attention patterns. All processing happens locally."
          icon="📷"
        />
        <InfoCard
          title="Real-Time Analysis"
          text="Get instant feedback on your focus levels with live scoring."
          icon="📈"
        />
        <InfoCard
          title="Privacy First"
          text="No data is stored or transmitted. Your privacy is our priority."
          icon="🔒"
        />
      </section>
    </div>
  );
}

function InfoCard({ title, text, icon }) {
  return (
    <div className="bg-white shadow-sm rounded-2xl p-6 border border-gray-100 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm">{text}</p>
    </div>
  );
}
