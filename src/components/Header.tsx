import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Car, BookOpen, Gamepad, BarChart3, User } from "lucide-react";
import AnimatedTransition from "./AnimatedTransition";

export const Header: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const links = [
    { name: "Home", path: "/", icon: Car },
    { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
    { name: "Quiz", path: "/quiz", icon: BookOpen },
    { name: "Lessons", path: "/simulation", icon: Gamepad },
    { name: "Login", path: "/login", icon: User },
  ];

  return (
    <header className="fixed top-0 w-full z-50 px-4 py-2">
      <AnimatedTransition animation="slide-down" duration={800}>
        <nav className="glass-card w-full max-w-3xl mx-auto rounded-full px-4 py-1.5 flex items-center justify-between">
          <Link
            to="/"
            className="font-medium text-primary flex items-center gap-2"
          >
            <Car className="h-5 w-5" />
            <span className="hidden sm:inline">RoadRules</span>
          </Link>

          <div className="flex items-center">
            {links.map((link, index) => {
              const isActive = currentPath === link.path;
              const Icon = link.icon;

              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "relative px-3 py-2 rounded-full transition-all duration-300 flex items-center",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span
                    className={cn(
                      "absolute inset-0 bg-primary/5 rounded-full scale-0 transition-transform duration-300",
                      isActive && "scale-100"
                    )}
                  />
                  <Icon className="h-4 w-4" />
                  <span className="ml-2 hidden md:inline text-sm">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      </AnimatedTransition>
    </header>
  );
};

export default Header;
