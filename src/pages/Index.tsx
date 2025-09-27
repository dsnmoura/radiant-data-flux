import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TemplateGrid from "@/components/TemplateGrid";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <TemplateGrid />
        <Features />
      </main>
      <Footer />
    </div>
  );
};

export default Index;