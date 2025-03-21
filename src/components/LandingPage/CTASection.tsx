import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, School } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section id='play-now' className='py-16 bg-[#1e293b] text-white'>
      <div className='container mx-auto px-4'>
        <motion.div
          className='text-center max-w-3xl mx-auto'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='font-fredoka text-3xl md:text-4xl mb-6'>
            Ready to Make Road Safety Fun?
          </h2>
          <p className='text-lg mb-8 text-gray-300'>
            Join thousands of children who are learning essential road safety
            skills while having a blast!
          </p>

          <motion.div
            className='flex flex-col sm:flex-row justify-center gap-4 mb-12'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              to={'/quiz'}
              className='bg-[#22c55e] hover:bg-green-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 inline-flex items-center justify-center h-auto'
            >
              <Play className='mr-2 h-5 w-5' /> Start Playing
            </Link>
          </motion.div>

          <motion.div
            className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-8'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className='text-center'>
              <div className='text-4xl font-fredoka text-[#22c55e] mb-2'>
                5000+
              </div>
              <p>Children Learning</p>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-fredoka text-[#eab308] mb-2'>
                500+
              </div>
              <p>Schools Participating</p>
            </div>
            <div className='text-center'>
              <div className='text-4xl font-fredoka text-[#ef4444] mb-2'>
                100+
              </div>
              <p>Road Safety Lessons</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
