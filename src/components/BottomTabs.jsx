import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function BottomTabs() {
  const { pathname } = useLocation();
  return (
    <nav className="bottom-tabs">
      <Link to="/criar-modelo" className={pathname === "/criar-modelo" ? "active" : ""}>Crie seu modelo</Link>
      <Link to="/futebol" className={pathname === "/futebol" ? "active" : ""}>Futebol</Link>
      <Link to="/volei" className={pathname === "/volei" ? "active" : ""}>Vôlei</Link>
      <Link to="/basquete" className={pathname === "/basquete" ? "active" : ""}>Basquete</Link>
    </nav>
  );
}
