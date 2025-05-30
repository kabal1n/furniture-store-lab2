import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CatalogPage from "./pages/CatalogPage";
import ItemPage from "./pages/ItemPage";
import ConstructorPage from "./pages/ConstructorPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Navigate to="/catalog" replace />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route path="/constructor" element={<ConstructorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
