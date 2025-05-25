
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AssetProvider } from "./contexts/AssetContext";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Purchases from "./pages/Purchases";
import Transfers from "./pages/Transfers";
import Assignments from "./pages/Assignments";
import Inventory from "./pages/Inventory";
import AdminPanel from "./pages/AdminPanel";
import NotFound from "./pages/NotFound";

// Layout
import Layout from "./components/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AssetProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/purchases" element={<Purchases />} />
                <Route path="/transfers" element={<Transfers />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Route>
              
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AssetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
