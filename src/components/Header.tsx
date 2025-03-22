import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Car, BookOpen, Gamepad, BarChart3, User, LogOut } from 'lucide-react';
import AnimatedTransition from './AnimatedTransition';
import { isLoggedIn, logout } from '@/utils/auth';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    setUserLoggedIn(isLoggedIn());
  }, [location]);

  // Handle logout
  const handleLogout = () => {
    logout();
    setUserLoggedIn(false);
    navigate('/login');
  };

  const links = [
    { name: 'Home', path: '/', icon: Car },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Quiz', path: '/quiz', icon: BookOpen },
    userLoggedIn
      ? { name: 'Logout', path: '#', icon: LogOut, onClick: handleLogout }
      : { name: 'Login', path: '/login', icon: User }
  ];

  return (
    <header className='fixed top-0 w-full z-50 px-4 py-2'>
      <AnimatedTransition animation='slide-down' duration={800}>
        <nav className='glass-card w-full max-w-3xl mx-auto rounded-full px-4 py-1.5 flex items-center justify-between backdrop-blur-lg bg-white/10 border border-white/20'>
          <Link
            to='/'
            className='font-fredoka text-white flex items-center gap-2'
          >
            <Car className='h-5 w-5 text-[#22c55e]' />
            <span className='hidden sm:inline text-2xl font-semibold'>
              <span className='text-white'>Safe</span>
              <span className='text-[#22c55e]'>way</span>
            </span>
          </Link>

          <div className='flex items-center'>
            {links.map((link, index) => {
              const isActive = currentPath === link.path;
              const Icon = link.icon;

              // For logout button
              if (link.onClick) {
                return (
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className={cn(
                      'relative px-3 py-2 rounded-full transition-all duration-300 flex items-center',
                      'text-white/70 hover:text-white'
                    )}
                  >
                    <Icon className='h-4 w-4' />
                    <span className='ml-2 hidden md:inline text-sm'>
                      {link.name}
                    </span>
                  </button>
                );
              }

              // For regular navigation links
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-3 py-2 rounded-full transition-all duration-300 flex items-center',
                    isActive
                      ? 'text-[#22c55e]'
                      : 'text-white/70 hover:text-white'
                  )}
                >
                  <span
                    className={cn(
                      'absolute inset-0 bg-[#22c55e]/10 rounded-full scale-0 transition-transform duration-300',
                      isActive && 'scale-100'
                    )}
                  />
                  <Icon className='h-4 w-4' />
                  <span className='ml-2 hidden md:inline text-sm'>
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
