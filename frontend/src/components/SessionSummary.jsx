import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ResponsivePie } from "@nivo/pie";

export default function SessionSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionData = location.state || {};

  const [avgFocus, setAvgFocus] = useState(0);
  const [totalSession, setTotalSession] = useState("0 min");
  const [timeFocused, setTimeFocused] = useState("0%");

  useEffect(() => {
    if (sessionData) {
      setAvgFocus(sessionData.avgFocusScore || 0);
      setTotalSession(sessionData.totalDuration || "0 min");
      setTimeFocused(sessionData.timeFocused || "0%");
    }
  }, [sessionData]);

  const pieData = sessionData.focusDistribution
    ? [
        {
          id: "Focused",
          label: "Focused",
          value: sessionData.focusDistribution.focused,
          color: "#22c55e",
        },
        {
          id: "Moderate",
          label: "Moderate",
          value: sessionData.focusDistribution.moderate,
          color: "#a855f7",
        },
        {
          id: "Distracted",
          label: "Distracted",
          value: sessionData.focusDistribution.distracted,
          color: "#ef4444",
        },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Session Summary</h2>
        <button
          onClick={() => navigate("/")}
          className="text-gray-600 hover:text-blue-500 transition"
        >
          Home 🏠
        </button>
      </div>

      <p className="text-gray-500 mb-8">Great work! Here's how you did.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard label="Avg Focus Score" value={avgFocus} />
        <SummaryCard label="Total Session" value={totalSession} />
        <SummaryCard label="Time Focused" value={timeFocused} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Attention Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-2">Attention Timeline</h3>
          <div className="border border-gray-200 rounded-lg h-56 flex items-center justify-center text-gray-400">
            {sessionData.attentionData && sessionData.attentionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sessionData.attentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#4CAF50"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p>(Timeline Chart Placeholder)</p>
            )}
          </div>
        </div>

        {/* Focus Distribution Pie Chart with Nivo */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-2">Focus Distribution</h3>
          {pieData.length > 0 && pieData.some((d) => d.value > 0) ? (
            <div className="h-[300px]">
              <ResponsivePie
                data={pieData}
                colors={{ datum: "data.color" }}
                margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
                innerRadius={0.6}
                padAngle={1}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                borderWidth={1}
                borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
              />
            </div>
          ) : (
            <div className="w-[280px] h-[280px] flex items-center justify-center text-gray-400 border border-gray-200 rounded-lg">
              <p>(No data to display)</p>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-4 text-center">
            <span className="text-green-500">● Focused</span>{" "}
            {sessionData.focusDistribution?.focused || 0}% &nbsp;
            <span className="text-purple-500">● Moderate</span>{" "}
            {sessionData.focusDistribution?.moderate || 0}% &nbsp;
            <span className="text-red-500">● Distracted</span>{" "}
            {sessionData.focusDistribution?.distracted || 0}%
          </div>
        </div>
      </div>

      <div className="bg-blue-100 border border-blue-200 rounded-xl p-6 mt-10 text-center">
        <p className="font-medium text-blue-700">💡 AI Recommendation</p>
        <p className="text-gray-600 mt-2">
          {sessionData.aiRecommendation ||
            "Let's improve! Start with shorter 15-minute sessions and gradually increase duration as your focus improves."}
        </p>
      </div>

      <div className="flex justify-center mt-6">
        <button
          onClick={() => alert("Downloading report...")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md transition"
        >
          Download Report (PDF)
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="bg-white shadow-sm rounded-xl p-6 text-center border border-gray-100">
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <h2 className="text-2xl font-bold text-blue-800">{value}</h2>
    </div>
  );
}