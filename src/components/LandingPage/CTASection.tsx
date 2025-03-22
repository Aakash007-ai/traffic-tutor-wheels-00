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
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
