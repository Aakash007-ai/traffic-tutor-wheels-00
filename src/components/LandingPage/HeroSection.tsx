import { motion } from "framer-motion";
import { Play } from "lucide-react";
import car from "../../assets/images/landing_car.png";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative pt-12 lg:pt-16 pb-32 overflow-hidden">
      {/* Decorative road line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-black">
        <div className="road-dash h-2 absolute top-3 left-0 right-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]"></div>
      </div>

      {/* Moving car animation */}
      <motion.div
        className="absolute bottom-4 z-10"
        initial={{ x: -100 }}
        animate={{ x: "100vw" }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      >
        <img src={car} alt="Car" className="h-20" />
      </motion.div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side with text */}
          <div className="lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0">
            <motion.h1
              className="font-fredoka text-4xl md:text-5xl lg:text-7xl mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Road Safety{" "}
              <span className="text-[#22c55e]">For Better Drives</span>
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl mb-8 text-gray-100 max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Join our interactive adventure and learn essential road safety
              rules through engaging challenges and recognize important traffic
              signs in an interactive way!
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link
                to={"/quiz"}
                className="bg-[#22c55e] hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center justify-center"
              >
                <Play className="mr-2 h-5 w-5" /> Play Now
              </Link>
              <Link
                to={"/stage"}
                className="border-[#22c55e] border  text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center justify-center"
              >
                <Play className="mr-2 h-5 w-5" /> Demo
              </Link>
            </motion.div>
          </div>

          {/* Right side with image */}
          <motion.div
            className="lg:w-1/2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative shadow-[0_4px_20px_rgba(0,0,0,0.15)] rounded-xl overflow-hidden">
              <svg
                width="500"
                height="300"
                viewBox="0 0 500 300"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="500" height="300" fill="#fff" rx="10" ry="10" />

                {/* Background */}
                <rect width="500" height="220" fill="#e0f2fe" />
                <rect y="220" width="500" height="80" fill="#84cc16" />

                {/* Road */}
                <rect y="190" width="500" height="60" fill="#4b5563" />
                <rect x="20" y="218" width="40" height="5" fill="#fff" />
                <rect x="90" y="218" width="40" height="5" fill="#fff" />
                <rect x="160" y="218" width="40" height="5" fill="#fff" />
                <rect x="230" y="218" width="40" height="5" fill="#fff" />
                <rect x="300" y="218" width="40" height="5" fill="#fff" />
                <rect x="370" y="218" width="40" height="5" fill="#fff" />
                <rect x="440" y="218" width="40" height="5" fill="#fff" />

                {/* Traffic lights */}
                <rect
                  x="120"
                  y="130"
                  width="30"
                  height="60"
                  fill="#1e293b"
                  rx="5"
                  ry="5"
                />
                <circle cx="135" cy="145" r="8" fill="#ef4444" />
                <circle cx="135" cy="165" r="8" fill="#22c55e" />

                {/* Car */}
                <rect
                  x="180"
                  y="200"
                  width="70"
                  height="25"
                  fill="#3b82f6"
                  rx="5"
                  ry="5"
                />
                <rect
                  x="190"
                  y="185"
                  width="50"
                  height="20"
                  fill="#60a5fa"
                  rx="3"
                  ry="3"
                />
                <circle cx="195" cy="225" r="8" fill="#1e293b" />
                <circle cx="235" cy="225" r="8" fill="#1e293b" />

                {/* Diverse group of people */}
                {/* Adult */}
                <circle cx="290" cy="170" r="18" fill="#f8fafc" />
                <rect
                  x="280"
                  y="188"
                  width="20"
                  height="35"
                  fill="#3b82f6"
                  rx="2"
                  ry="2"
                />
                <line
                  x1="280"
                  y1="195"
                  x2="265"
                  y2="215"
                  stroke="#f8fafc"
                  strokeWidth="3"
                />
                <line
                  x1="300"
                  y1="195"
                  x2="315"
                  y2="215"
                  stroke="#f8fafc"
                  strokeWidth="3"
                />
                <line
                  x1="285"
                  y1="223"
                  x2="280"
                  y2="245"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />
                <line
                  x1="295"
                  y1="223"
                  x2="300"
                  y2="245"
                  stroke="#3b82f6"
                  strokeWidth="3"
                />

                {/* Young person */}
                <circle cx="330" cy="175" r="15" fill="#fdba74" />
                <rect
                  x="320"
                  y="190"
                  width="20"
                  height="30"
                  fill="#f97316"
                  rx="2"
                  ry="2"
                />
                <line
                  x1="320"
                  y1="195"
                  x2="310"
                  y2="210"
                  stroke="#fdba74"
                  strokeWidth="3"
                />
                <line
                  x1="340"
                  y1="195"
                  x2="350"
                  y2="210"
                  stroke="#fdba74"
                  strokeWidth="3"
                />
                <line
                  x1="325"
                  y1="220"
                  x2="320"
                  y2="240"
                  stroke="#f97316"
                  strokeWidth="3"
                />
                <line
                  x1="335"
                  y1="220"
                  x2="340"
                  y2="240"
                  stroke="#f97316"
                  strokeWidth="3"
                />

                {/* Older adult */}
                <circle cx="370" cy="173" r="16" fill="#d1d5db" />
                <rect
                  x="360"
                  y="189"
                  width="20"
                  height="32"
                  fill="#64748b"
                  rx="2"
                  ry="2"
                />
                <line
                  x1="360"
                  y1="195"
                  x2="350"
                  y2="210"
                  stroke="#d1d5db"
                  strokeWidth="3"
                />
                <line
                  x1="380"
                  y1="195"
                  x2="390"
                  y2="210"
                  stroke="#d1d5db"
                  strokeWidth="3"
                />
                <line
                  x1="365"
                  y1="221"
                  x2="360"
                  y2="243"
                  stroke="#64748b"
                  strokeWidth="3"
                />
                <line
                  x1="375"
                  y1="221"
                  x2="380"
                  y2="243"
                  stroke="#64748b"
                  strokeWidth="3"
                />

                {/* Road signs */}
                <polygon points="400,160 415,185 385,185" fill="#eab308" />
                <rect x="397" y="185" width="6" height="20" fill="#1e293b" />
                <text
                  x="400"
                  y="177"
                  fontSize="15"
                  textAnchor="middle"
                  fill="#1e293b"
                  fontWeight="bold"
                >
                  !
                </text>

                <circle cx="450" cy="160" r="15" fill="#ef4444" />
                <rect x="447" y="175" width="6" height="20" fill="#1e293b" />
                <text
                  x="450"
                  y="165"
                  fontSize="15"
                  textAnchor="middle"
                  fill="#fff"
                  fontWeight="bold"
                >
                  STOP
                </text>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
