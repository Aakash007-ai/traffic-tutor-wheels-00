import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginButton = () => {
  return (
    <div className='w-full pr-6 pt-1'>
      <div className='flex pt-4 justify-end'>
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
