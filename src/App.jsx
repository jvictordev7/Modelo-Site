import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BottomTabs from "./components/BottomTabs";
import CriarModelo from "./pages/CriarModelo";
import Futebol from "./pages/Futebol";
import Volei from "./pages/Volei";
import Basquete from "./pages/Basquete";

export default function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="app-content">
        <Routes>
          <Route path="/" element={<Navigate to="/criar-modelo" />} />
          <Route path="/criar-modelo" element={<CriarModelo />} />
          <Route path="/futebol" element={<Futebol />} />
          <Route path="/volei" element={<Volei />} />
          <Route path="/basquete" element={<Basquete />} />
        </Routes>
        <BottomTabs />
      </div>
    </BrowserRouter>
  );
}
