import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function LiveSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionDuration = location.state?.duration || 25;
  const [timeRemaining, setTimeRemaining] = useState(sessionDuration * 60);
  const [focusScore, setFocusScore] = useState(0);
  const [studyMode, setStudyMode] = useState("Screen Work");
  const [attentionData, setAttentionData] = useState([]); // 👈 For chart data
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Capture study mode from SessionSetup page
  useEffect(() => {
    if (location.state?.studyMode) {
      setStudyMode(location.state.studyMode);
    }
  }, [location.state]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          endSession();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate, attentionData]);

  // Start camera
  useEffect(() => {
    let stream;
    async function startCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Send frame to backend every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      sendFrameToBackend();
    }, 2000);
    return () => clearInterval(interval);
  }, [studyMode]);

  const sendFrameToBackend = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    try {
      const response = await fetch("https://neurofocus-04hz.onrender.com/analyze-frame", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageData,
          study_mode: studyMode,
        }),
      });

      const data = await response.json();
      if (data.attention_score !== undefined) {
        setFocusScore(data.attention_score);
        setAttentionData((prev) => [
          ...prev.slice(-20), // keep last 20 data points
          { time: new Date().toLocaleTimeString().split(" ")[0], score: data.attention_score },
        ]);
      }
    } catch (error) {
      console.error("Error sending frame:", error);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };

  const endSession = () => {
    const totalDuration = sessionDuration; // total session in minutes

    // Average focus score
    const avgFocusScore =
      attentionData.reduce((sum, d) => sum + d.score, 0) /
      (attentionData.length || 1);

    // Count for focus distribution
    const focusedCount = attentionData.filter((d) => d.score >= 70).length;
    const moderateCount = attentionData.filter((d) => d.score >= 40 && d.score < 70).length;
    const distractedCount = attentionData.filter((d) => d.score < 40).length;

    // Time focused as percentage
    const timeFocused = ((focusedCount / (attentionData.length || 1)) * 100).toFixed(0) + "%";

    // Focus distribution percentages
    const focusDistribution = {
      focused: ((focusedCount / (attentionData.length || 1)) * 100).toFixed(0),
      moderate: ((moderateCount / (attentionData.length || 1)) * 100).toFixed(0),
      distracted: ((distractedCount / (attentionData.length || 1)) * 100).toFixed(0),
    };

    // Navigate to summary with all metrics
    navigate("/summary", {
      state: {
        avgFocusScore: avgFocusScore.toFixed(0),
        totalDuration: `${totalDuration} min`,
        timeFocused,
        attentionData,
        focusDistribution,
        aiRecommendation: "Great work! Keep practicing 25-min sessions.",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-800">Live Session</h2>
        <button
          onClick={() => {
            const video = videoRef.current;
            if (video && video.srcObject) {
              video.srcObject.getTracks().forEach((track) => track.stop());
            }
            endSession();
          }}
          className="text-gray-600 hover:text-red-500 transition"
        >
          End Session ✖
        </button>
      </div>

      <p className="text-gray-500 mb-4">{formatTime(timeRemaining)} remaining</p>

      <div className="h-2 bg-gray-200 rounded-full mb-8">
        <div
          className="h-2 bg-green-500 rounded-full transition-all"
          style={{
            width: `${((sessionDuration * 60 - timeRemaining) / (25 * 60)) * 100}%`,
          }}
        ></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-100 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="rounded-lg w-full max-w-sm shadow"
          ></video>
          <canvas ref={canvasRef} width="320" height="240" className="hidden"></canvas>
          <p className="text-xs mt-2">Processing locally - No data stored</p>
        </div>

        {/* ✅ Recharts Attention Graph */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h3 className="font-semibold text-gray-700 mb-2">Attention Over Time</h3>
          <div className="border border-gray-200 rounded-lg h-48 flex items-center justify-center text-gray-400">
            {attentionData.length === 0 ? (
              <p>(Chart Placeholder)</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attentionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4CAF50" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <div className="w-40 h-40 rounded-full border-[10px] border-green-400 flex items-center justify-center shadow-inner">
          <p className="text-4xl font-bold text-green-500">{focusScore}</p>
        </div>
      </div>
    </div>
  );
}
