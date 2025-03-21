import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import oneWay from '../../assets/signs/oneWay.png';

const StepCard = ({
  number,
  title,
  description,
  icon,
  delay
}: {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    className='relative'
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    <div className='bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-all h-full'>
      <div
        className={`w-12 h-12 ${
          number === 1
            ? 'bg-[#ef4444]'
            : number === 2
            ? 'bg-[#eab308]'
            : 'bg-[#22c55e]'
        } text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold`}
      >
        {number}
      </div>
      <h3 className='font-bold text-xl mb-3 text-gray-700'>{title}</h3>
      <p className='text-gray-600'>{description}</p>
      {icon && (
        <div className='mt-4 rounded-lg w-full overflow-hidden'>{icon}</div>
      )}
    </div>
    {number < 3 && (
      <div className='hidden md:block absolute -right-8 top-1/2 transform -translate-y-1/2 z-10'>
        <ArrowRight className='h-8 w-8 text-[#eab308]' />
      </div>
    )}
  </motion.div>
);

const HowItWorksSection = () => {
  return (
    <section
      id='how-it-works'
      className='py-16 bg-gradient-to-b from-[#1e293b] to-[#0f172a]'
    >
      <div className='container mx-auto px-4'>
        <motion.div
          className='text-center mb-16'
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className='font-fredoka text-3xl md:text-5xl mb-4'>
            How It Works
          </h2>
          <p className='text-gray-300 max-w-2xl mx-auto text-xl'>
            Our game makes learning road safety rules simple and fun for
            children.
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
          <StepCard
            number={1}
            title='Drive the Car'
            description='Start your journey by driving a virtual car along roads with various traffic scenarios.'
            delay={0}
            icon={
              <svg
                width='100%'
                height='120'
                viewBox='0 0 200 120'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect width='200' height='80' fill='#4b5563' />
                <rect x='10' y='38' width='20' height='4' fill='white' />
                <rect x='50' y='38' width='20' height='4' fill='white' />
                <rect x='90' y='38' width='20' height='4' fill='white' />
                <rect x='130' y='38' width='20' height='4' fill='white' />
                <rect x='170' y='38' width='20' height='4' fill='white' />

                {/* Car */}
                <rect
                  x='80'
                  y='25'
                  width='40'
                  height='15'
                  rx='5'
                  ry='5'
                  fill='#3b82f6'
                />
                <rect
                  x='85'
                  y='15'
                  width='30'
                  height='12'
                  rx='3'
                  ry='3'
                  fill='#60a5fa'
                />
                <circle cx='90' cy='40' r='5' fill='#1e293b' />
                <circle cx='110' cy='40' r='5' fill='#1e293b' />

                {/* Child in car */}
                <circle cx='100' cy='23' r='5' fill='#fdba74' />
              </svg>
            }
          />
          <StepCard
            number={2}
            title='Encounter Signs'
            description="When you encounter traffic signs, the car stops and you're presented with questions about the sign."
            delay={0.2}
            icon={
              <svg
                width='100%'
                height='120'
                viewBox='0 0 200 120'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect width='200' height='80' fill='#4b5563' />
                <rect x='10' y='38' width='20' height='4' fill='white' />
                <rect x='50' y='38' width='20' height='4' fill='white' />
                <rect x='90' y='38' width='20' height='4' fill='white' />
                <rect x='130' y='38' width='20' height='4' fill='white' />
                <rect x='170' y='38' width='20' height='4' fill='white' />

                {/* Car */}
                <rect
                  x='50'
                  y='25'
                  width='40'
                  height='15'
                  rx='5'
                  ry='5'
                  fill='#3b82f6'
                />
                <rect
                  x='55'
                  y='15'
                  width='30'
                  height='12'
                  rx='3'
                  ry='3'
                  fill='#60a5fa'
                />
                <circle cx='60' cy='40' r='5' fill='#1e293b' />
                <circle cx='80' cy='40' r='5' fill='#1e293b' />

                {/* Signs */}
                <polygon
                  points='120,10 135,35 105,35'
                  fill='#eab308'
                  stroke='#1e293b'
                  strokeWidth='2'
                />
                <text
                  x='120'
                  y='28'
                  textAnchor='middle'
                  fill='#1e293b'
                  fontSize='15'
                  fontWeight='bold'
                >
                  !
                </text>

                <circle
                  cx='170'
                  cy='20'
                  r='14'
                  fill='#ef4444'
                  stroke='#1e293b'
                  strokeWidth='2'
                />
                <text
                  x='170'
                  y='25'
                  textAnchor='middle'
                  fill='white'
                  fontSize='12'
                  fontWeight='bold'
                >
                  STOP
                </text>
              </svg>
            }
          />
          <StepCard
            number={3}
            title='Answer & Progress'
            description='Answer correctly to continue your journey. You have three lives - use them wisely!'
            delay={0.4}
            icon={
              <svg
                width='100%'
                height='120'
                viewBox='0 0 200 120'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <rect
                  width='200'
                  height='80'
                  rx='5'
                  ry='5'
                  fill='white'
                  stroke='#e2e8f0'
                  strokeWidth='2'
                />

                <rect
                  x='20'
                  y='20'
                  width='70'
                  height='40'
                  rx='5'
                  ry='5'
                  fill='#f1f5f9'
                  stroke='#e2e8f0'
                  strokeWidth='2'
                />
                <text
                  x='55'
                  y='45'
                  textAnchor='middle'
                  fill='#1e293b'
                  fontSize='16'
                  fontWeight='bold'
                >
                  YES
                </text>

                <rect
                  x='110'
                  y='20'
                  width='70'
                  height='40'
                  rx='5'
                  ry='5'
                  fill='#22c55e'
                  stroke='#16a34a'
                  strokeWidth='2'
                />
                <text
                  x='145'
                  y='45'
                  textAnchor='middle'
                  fill='white'
                  fontSize='16'
                  fontWeight='bold'
                >
                  NO
                </text>
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
