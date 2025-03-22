import RoadComponent, {
    RoadComponentRef,
} from "@/components/RoadComponent/RoadComponent";
import AnimatedTransition from "@/components/AnimatedTransition";
import { Header } from "@/components/Header";
import { useRef, useState } from "react";
import Sound from "@/components/sound";

const SecondStage = () => {
    const carRef = useRef<RoadComponentRef>(null);

    return (
        <div className="min-h-screen w-full pt-20 pb-16 bg-[#0f172a]">
            <Header />

            <main className="container max-w-7xl mx-auto px-4">
                <>
                    {/* Game area */}
                    <AnimatedTransition animation="scale">
                        <div className="relative">
                            <RoadComponent ref={carRef} />
                            <div className="mt-4 flex gap-4 max-w-md mx-auto items-center justify-center ">
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
