import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { BookmarkProvider } from "@/contexts/BookmarkContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Dashboard from "./pages/kettlebell/Dashboard";
import SessionRunner from "./pages/kettlebell/SessionRunner";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BookmarkProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            {/* Kettlebell program is the home experience */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/session/:weekId/:sessionId" element={<SessionRunner />} />
            {/* Original Lenny's Mind Map, kept reachable */}
            <Route path="/mindmap" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </BookmarkProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
