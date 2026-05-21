import { createContext, useContext, useState, ReactNode } from "react";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import DashboardLayout from "./components/DashboardLayout";
import DashboardHome from "./components/DashboardHome";
import AnalysisPage from "./components/AnalysisPage";
import AnalyticsPage from "./components/AnalyticsPage";
import AdminPage from "./components/AdminPage";

export type Page = "landing" | "login" | "signup" | "dashboard" | "analysis" | "analytics" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  plan: "free" | "pro" | "enterprise";
  avatar: string;
  role: "user" | "admin";
  joinDate: string;
  analyses: number;
  avgScore: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  currentPage: Page;
  navigate: (page: Page) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>("landing");

  const navigate = (page: Page) => {
    if (["dashboard", "analysis", "analytics", "admin"].includes(page) && !user) {
      setCurrentPage("login");
      return;
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const login = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 1200));
    setUser({
      id: "usr_01",
      name: email.toLowerCase().includes("admin") ? "Admin User" : "Alex Johnson",
      email,
      plan: "pro",
      avatar: email.toLowerCase().includes("admin") ? "AU" : "AJ",
      role: email.toLowerCase().includes("admin") ? "admin" : "user",
      joinDate: "Jan 2026",
      analyses: 47,
      avgScore: 87,
    });
    setCurrentPage("dashboard");
  };

  const signup = async (name: string, email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 1200));
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    setUser({
      id: "usr_02",
      name,
      email,
      plan: "free",
      avatar: initials,
      role: "user",
      joinDate: "May 2026",
      analyses: 0,
      avgScore: 0,
    });
    setCurrentPage("dashboard");
  };

  const logout = () => {
    setUser(null);
    setCurrentPage("landing");
  };

  const ctx: AuthContextType = {
    user,
    isAuthenticated: !!user,
    currentPage,
    navigate,
    login,
    signup,
    logout,
  };

  const renderPage = () => {
    if (["dashboard", "analysis", "analytics", "admin"].includes(currentPage)) {
      return (
        <DashboardLayout>
          {currentPage === "dashboard" && <DashboardHome />}
          {currentPage === "analysis" && <AnalysisPage />}
          {currentPage === "analytics" && <AnalyticsPage />}
          {currentPage === "admin" && <AdminPage />}
        </DashboardLayout>
      );
    }
    switch (currentPage) {
      case "landing": return <LandingPage />;
      case "login": return <LoginPage />;
      case "signup": return <SignupPage />;
      default: return <LandingPage />;
    }
  };

  return (
    <AuthContext.Provider value={ctx}>
      <div style={{ background: "#080810", minHeight: "100vh", color: "#f0f0ff" }}>
        {renderPage()}
      </div>
    </AuthContext.Provider>
  );
}
