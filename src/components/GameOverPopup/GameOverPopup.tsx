import { useState } from "react";
import AnimatedTransition from "../AnimatedTransition";
import { Trophy } from "lucide-react";
import "./GameOverPopup.css"

const GameOverPopup = ({onPressStart = () => {}, score, toggleLang = (_ : "ENGLISH" | "HINDI") => {}}) => {
    const [language, setLanguage] = useState<"ENGLISH" | "HINDI">("ENGLISH");

    const module2Unlocked = true;
    return (
        <div className="gameOver">
            <AnimatedTransition animation="scale">
            <div className="relative glass-card p-8 md:p-10 rounded-2xl shadow-2xl backdrop-blur-lg bg-[#0f172a] border border-white/20 mx-auto ">
                {/* Smaller Toggle Button Positioned in Top Right */}
                <div className="absolute top-4 right-4">
                    <div
                        onClick={() => {
                            setLanguage(language === "ENGLISH" ? "HINDI" : "ENGLISH");
                            toggleLang(language === "ENGLISH" ? "HINDI" : "ENGLISH");
                        }}
                        className="relative w-24 h-7 cursor-pointer rounded-full bg-white flex items-center transition duration-300 ease-in-out shadow-md px-1"
                    >
                        {/* Language Text Inside Toggle */}
                        <span
                            className={`absolute uppercase text-xs font-semibold transition-all duration-300 ease-in-out ${language === "ENGLISH"
                                ? "left-7 text-[#0f172a]"
                                : "right-8 text-[#22c55e]"
                                }`}
                        >
                            {language}
                        </span>

                        {/* Sliding Toggle Circle */}
                        <div
                            className={`absolute w-5 h-5 rounded-full bg-[#22c55e] transition-all duration-300 ease-in-out shadow-lg ${language === "ENGLISH"
                                ? "left-1"
                                : "left-[calc(100%-1.75rem)] bg-[#0f172a]"
                                }`}
                        ></div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col items-center text-center mt-6">
                    <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                        <Trophy className="h-8 w-8 text-[#22c55e]" />
                    </div>

                    <h2 className="text-4xl font-fredoka mb-3 text-white">
                        {"Traffic Safety Quiz"}
                    </h2>

                    {score && <p className="text-gray-300 mb-8 text-lg">
                        You scored {score} points!
                    </p>}

                    <div className="flex flex-col gap-4 w-full max-w-md mx-auto">
                        <button
                            onClick={onPressStart}
                            className="bg-[#22c55e] hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-[#22c55e]/20"
                        >
                            Start
                        </button>

                    </div>
                </div>
            </div>
        </AnimatedTransition>
        </div>
        
    );
};

export default GameOverPopup;