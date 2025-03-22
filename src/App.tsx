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
import { ProctoringSystem } from "./components/Proctoring";
import { ProctorTestScreen } from "./components/ProctoringTest";
// import Test from './pages/Test';
// import Proctor from "./pages/proctor";
import SecondStage from './pages/SecondStage';
import { ClusterSignals } from "./pages/ClusterQuestions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="bottom-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/proctor" element={<ProctorTestScreen />} />
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