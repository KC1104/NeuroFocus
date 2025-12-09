import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import SessionSetup from "./components/SessionSetup";
import LiveSession from "./components/LiveSession";
import SessionSummary from "./components/SessionSummary";
import React from "react";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/setup" element={<SessionSetup />} />
        <Route path="/live" element={<LiveSession />} />
        <Route path="/summary" element={<SessionSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
