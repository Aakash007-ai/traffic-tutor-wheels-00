
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Car, BookOpen, Award, BarChart3, 
  ShieldCheck, CircleAlert, TrafficCone
} from 'lucide-react';
import { Header } from '@/components/Header';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import AnimatedTransition from '@/components/AnimatedTransition';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Sample progress data
  const progress = {
    quizzesCompleted: 2,
    simulationsCompleted: 1,
    overallScore: 85,
  };
  
  // Sample course modules
  const modules = [
    {
      id: 1,
      title: "Basic Road Signs",
      icon: TrafficCone,
      description: "Learn the essential road signs every driver should know",
      progress: 60,
      color: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      id: 2,
      title: "Right of Way Rules",
      icon: ShieldCheck,
      description: "Master the rules of right of way at intersections and beyond",
      progress: 30,
      color: "bg-green-500/10",
      textColor: "text-green-500",
    },
    {
      id: 3,
      title: "Defensive Driving",
      icon: CircleAlert,
      description: "Techniques to anticipate hazards and prevent accidents",
      progress: 10,
      color: "bg-orange-500/10",
      textColor: "text-orange-500",
    }
  ];

  return (
    <div className="min-h-screen w-full bg-background pt-20 pb-16">
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4">
        {/* Welcome Section */}
        <AnimatedTransition animation="fade" duration={800}>
          <div className="mb-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
            <p className="text-muted-foreground">
              Continue your journey to becoming a traffic rules expert
            </p>
          </div>
        </AnimatedTransition>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card glass delay={200}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Quiz Score</p>
                <h3 className="text-3xl font-bold">{progress.overallScore}%</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
          
          <Card glass delay={300}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Quizzes Completed</p>
                <h3 className="text-3xl font-bold">{progress.quizzesCompleted}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
          
          <Card glass delay={400}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Simulations</p>
                <h3 className="text-3xl font-bold">{progress.simulationsCompleted}</h3>
              </div>
              <div className="bg-primary/10 p-2 rounded-full">
                <Car className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Learning Modules */}
        <AnimatedTransition animation="slide-up" duration={800} delay={500}>
          <h2 className="text-xl font-bold mb-6">Learning Modules</h2>
          
          <div className="space-y-4">
            {modules.map((module, index) => (
              <Card key={module.id} glass interactive delay={600 + (index * 100)}>
                <div className="flex items-center gap-4">
                  <div className={`${module.color} p-3 rounded-xl`}>
                    <module.icon className={`h-6 w-6 ${module.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{module.title}</h3>
                    <p className="text-muted-foreground text-sm">{module.description}</p>
                    <div className="w-full bg-secondary rounded-full h-1.5 mt-3">
                      <div 
                        className="bg-primary h-1.5 rounded-full" 
                        style={{ width: `${module.progress}%` }}
                      />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/quiz')}>
                    Continue
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </AnimatedTransition>
        
        {/* Quick Actions */}
        <AnimatedTransition animation="slide-up" duration={800} delay={800}>
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                className="h-auto py-4 px-6 justify-start gap-3"
                onClick={() => navigate('/quiz')}
              >
                <BookOpen className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Take a Quiz</p>
                  <p className="text-primary-foreground/80 text-xs">Test your knowledge</p>
                </div>
              </Button>
              
              <Button 
                className="h-auto py-4 px-6 justify-start gap-3"
                onClick={() => navigate('/simulation')}
              >
                <Car className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Start Simulation</p>
                  <p className="text-primary-foreground/80 text-xs">Practice your skills</p>
                </div>
              </Button>
            </div>
          </div>
        </AnimatedTransition>
      </main>
    </div>
  );
};

export default Dashboard;
