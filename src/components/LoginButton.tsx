import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { isLoggedIn } from '@/utils/auth';

const LoginButton = () => {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    setAuthenticated(isLoggedIn());
  }, []);

  // If user is logged in, don't show any button
  if (authenticated) {
    return null;
  }

  // Only show login button if user is not logged in
  return (
    <div className='mx-auto px-6'>
      <div className='flex justify-end pt-5'>
        <Link
          to='/login'
          className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm transition-all transform hover:scale-105 inline-flex items-center justify-center'
        >
          <LogIn className='mr-2 h-4 w-4' /> Login
        </Link>
      </div>
    </div>
  );
};

export default LoginButton;
