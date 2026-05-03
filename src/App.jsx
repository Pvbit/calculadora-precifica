import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ui/ProtectedRoute";
import Calculadora from "./pages/CalculadoraA/index";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      <Route
        path="/app/calculadora"
        element={
          <ProtectedRoute>
            <Calculadora />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}