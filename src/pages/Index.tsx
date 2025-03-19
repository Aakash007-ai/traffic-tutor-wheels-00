
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ArrowRight, Shield, Award, BookOpen } from 'lucide-react';
import { Button } from '@/components/Button';
import AnimatedTransition from '@/components/AnimatedTransition';
import Card from '@/components/Card';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-24">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-[30%] -left-[20%] w-[70%] h-[70%] rounded-full bg-blue-500/5 blur-3xl" />
        </div>
        
        <div className="w-full max-w-4xl flex flex-col items-center z-10">
          {/* Logo and Tagline */}
          <AnimatedTransition animation="slide-down" duration={800}>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Car className="h-8 w-8 text-primary animate-pulse-subtle" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">RoadRules</h1>
            </div>
            <p className="text-lg text-muted-foreground text-center max-w-xl text-balance mb-12">
              Learn traffic rules the fun way with interactive simulations and engaging quizzes
            </p>
          </AnimatedTransition>
          
          {/* CTA Buttons */}
          <AnimatedTransition animation="slide-up" duration={800} delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="font-medium gap-2"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => navigate('/quiz')}
                className="font-medium gap-2"
              >
                Take a Quiz <BookOpen className="h-4 w-4" />
              </Button>
            </div>
          </AnimatedTransition>
          
          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            <Card glass interactive delay={600}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-xl mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Learn Safety Rules</h3>
                <p className="text-muted-foreground text-sm">
                  Master essential traffic safety rules with visual examples and practical scenarios
                </p>
              </div>
            </Card>
            
            <Card glass interactive delay={700}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-xl mb-4">
                  <Car className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Virtual Driving</h3>
                <p className="text-muted-foreground text-sm">
                  Practice driving in realistic simulations with instant feedback on your decisions
                </p>
              </div>
            </Card>
            
            <Card glass interactive delay={800}>
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-xl mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium mb-2">Track Progress</h3>
                <p className="text-muted-foreground text-sm">
                  Earn achievements and track your learning progress through interactive challenges
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
