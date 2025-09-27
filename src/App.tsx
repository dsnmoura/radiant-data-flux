import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TemplateProvider } from "@/contexts/TemplateContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import ChooseTemplate from "./pages/ChooseTemplate";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import CreatePost from "./pages/dashboard/CreatePost";
import Templates from "./pages/dashboard/Templates";
import TemplateManager from "./pages/dashboard/TemplateManager";
import Schedule from "./pages/dashboard/Schedule";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TemplateProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/choose-template" element={<ChooseTemplate />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<DashboardOverview />} />
                <Route path="create" element={<CreatePost />} />
                <Route path="templates" element={<Templates />} />
                <Route path="template-manager" element={<TemplateManager />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TemplateProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
