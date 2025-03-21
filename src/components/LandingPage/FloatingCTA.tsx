import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const FloatingCTA = () => {
  return (
    <motion.div
      className='fixed bottom-6 right-6 z-50 hidden md:block'
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.3, type: 'spring' }}
    >
      <Link
        to='/quiz'
        className='bg-[#22c55e] hover:bg-green-600 text-white px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 inline-flex items-center justify-center h-auto shadow-lg'
      >
        <Play className='mr-2 h-4 w-4' /> Play Now
      </Link>
    </motion.div>
  );
};

export default FloatingCTA;
