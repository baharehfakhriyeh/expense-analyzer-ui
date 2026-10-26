import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "../pages/DashboardPage";
import { CategoriesPage } from "../pages/CategoriesPage";

export const AppRouts = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
      </Routes>
    </BrowserRouter>
  );
};
