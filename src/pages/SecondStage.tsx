import RoadComponent, { RoadComponentRef } from "@/components/RoadComponent/RoadComponent";
import AnimatedTransition from "@/components/AnimatedTransition";
import { Header } from "@/components/Header";
import { Card } from "@/components/Card";
import { Heart, Zap, Trophy, Car } from "lucide-react";
import { useRef } from "react";

const score = 32;
const lives = 2;
const SecondStage = () => {
    const carRef = useRef<RoadComponentRef>(null);
    
    return (
        <div className="min-h-screen w-full bg-background pt-20 pb-16">
      <Header />

      <main className="container max-w-7xl mx-auto px-4">
          <>
            {/* Game stats */}
            <AnimatedTransition animation="fade">
              <div className="mb-6 grid grid-cols-3 gap-4">
                <Card glass className="py-3">
                  <div className="flex flex-col items-center">
                    <Zap className="h-5 w-5 text-amber-500 mb-1" />
                    <p className="text-xs text-muted-foreground">SCORE</p>
                    <p className="font-bold">{score}</p>
                  </div>
                </Card>

                <Card glass className="py-3">
                  <div className="flex flex-col items-center">
                    <Heart className="h-5 w-5 text-red-500 mb-1" />
                    <p className="text-xs text-muted-foreground">LIVES</p>
                    <div className="flex">
                      {Array.from({ length: lives }).map((_, i) => (
                        <Heart
                          key={i}
                          className="h-4 w-4 text-red-500 fill-red-500 mr-1"
                        />
                      ))}
                      {Array.from({ length: 3 - lives }).map((_, i) => (
                        <Heart
                          key={i + lives}
                          className="h-4 w-4 text-red-200 mr-1"
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              </div>
            </AnimatedTransition>

            {/* Game area */}
            <AnimatedTransition animation="scale">
              <div className="relative">
              <RoadComponent ref={carRef}/>
              <div className="mt-4 flex gap-4">
        <button
          onMouseDown={() => carRef.current?.turnLeft(false)} 
          onMouseUp={() => carRef.current?.turnLeft(true)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          disabled={false}
        >
          Left
        </button>
        <button
          onMouseDown={() => carRef.current?.turnRight(false)} 
          onMouseUp={() => carRef.current?.turnRight(true)}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          disabled={false}
        >
          Right
        </button>
      </div>
            
              </div>
            </AnimatedTransition>
          </>
      </main>
    </div>
    );
};

export default SecondStage;