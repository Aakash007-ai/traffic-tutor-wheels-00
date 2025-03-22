import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Quiz from "./pages/Quiz";
import Simulation from "./pages/Simulation";
import NotFound from "./pages/NotFound";
import UserAuth from "./pages/login";
// import Test from './pages/test';
import SecondStage from "./pages/SecondStage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ProctoringSystem } from "./components/Proctoring";
import { ClusterSignals } from "./pages/ClusterQuestions";
import { ProctorTestScreen } from "./components/ProctoringTest";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={
            <ProtectedRoute>
              <Quiz />
            </ProtectedRoute>
          } />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <UserAuth />
            </ProtectedRoute>
          } />

          <Route path="/proctoring" element={<ProctorTestScreen />} />


          <Route path="/login" element={<UserAuth />} />
          <Route path="/stage" element={<SecondStage />} />
          <Route path="/cluster-signals" element={<ClusterSignals />} />
          {/* <Route path='/test' element={<Test />} /> */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);



export default App;